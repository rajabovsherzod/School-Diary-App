import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import ApiError from "@/utils/api.Error";
import { shuffle } from "@/utils/array.utils";
import { ScheduleEntryDto } from "./schedule.dto";
import {
  IGenericSuccessMessage,
  IMoveOrSwapPayload,
  IFullSchedulePayload,
  ISubjectDebt,
  TFullScheduleEntry,
} from "./schedule.interface";
import { Class, ScheduleEntry } from "@/generated/prisma";

class ScheduleService {
  getClassBySlug(slug: string): Promise<Class | null> {
    return prisma.class.findUnique({
      where: { slug },
    });
  }

  public async getScheduleBySlug(
    slug: string
  ): Promise<IFullSchedulePayload | null> {
    const classData = await prisma.class.findUnique({
      where: { slug },
      include: {
        schedule: {
          include: { subject: true },
          orderBy: [{ dayOfWeek: "asc" }, { lessonNumber: "asc" }],
        },
        subjects: { include: { subject: true } },
      },
    });

    if (!classData) {
      return null;
    }

    const scheduleEntries = classData.schedule.map(
      (entry) => new ScheduleEntryDto(entry as TFullScheduleEntry)
    );

    const subjectDebts: ISubjectDebt[] = classData.subjects.map((cs) => ({
      subjectId: cs.subjectId,
      subjectName: cs.subject.name,
      scheduleDiff: cs.scheduleDiff,
    }));

    return {
      scheduleEntries: scheduleEntries as unknown as TFullScheduleEntry[],
      subjectDebts,
      class: { id: classData.id, name: classData.name },
    };
  }

  public async generateScheduleForClassBySlug(
    slug: string
  ): Promise<IGenericSuccessMessage> {
    return prisma.$transaction(async (tx) => {
      const classInfo = await tx.class.findUnique({ where: { slug } });
      if (!classInfo) {
        throw new ApiError(404, `Class with slug '${slug}' not found`);
      }

      const assignedSubjects = await tx.classSubject.findMany({
        where: { classId: classInfo.id },
      });
      if (assignedSubjects.length === 0) {
        throw new ApiError(
          400,
          `No subjects assigned to class ${classInfo.name}.`
        );
      }

      await tx.scheduleEntry.deleteMany({ where: { classId: classInfo.id } });

      const lessonPool: number[] = [];
      assignedSubjects.forEach((cs) => {
        for (let i = 0; i < cs.hoursPerWeek; i++) {
          lessonPool.push(cs.subjectId);
        }
      });

      shuffle(lessonPool);

      const daysPerWeek = 6;
      const totalLessons = lessonPool.length;
      const baseLessonsPerDay = Math.floor(totalLessons / daysPerWeek);
      let extraLessons = totalLessons % daysPerWeek;

      const lessonsDistribution = Array(daysPerWeek).fill(baseLessonsPerDay);
      for (let i = 0; i < extraLessons; i++) {
        lessonsDistribution[i]++;
      }

      const newScheduleEntries: Omit<ScheduleEntry, "id">[] = [];
      let lessonIndex = 0;
      for (let day = 1; day <= daysPerWeek; day++) {
        const lessonsForToday = lessonsDistribution[day - 1];
        for (let lesson = 1; lesson <= lessonsForToday; lesson++) {
          if (lessonIndex < lessonPool.length) {
            newScheduleEntries.push({
              classId: classInfo.id,
              subjectId: lessonPool[lessonIndex],
              dayOfWeek: day,
              lessonNumber: lesson,
            });
            lessonIndex++;
          }
        }
      }

      await tx.scheduleEntry.createMany({ data: newScheduleEntries });
      await tx.classSubject.updateMany({
        where: { classId: classInfo.id },
        data: { scheduleDiff: 0 },
      });

      return {
        message: `Schedule generated successfully for ${classInfo.name}.`,
      };
    });
  }

  public async moveOrSwapEntry(
    payload: IMoveOrSwapPayload
  ): Promise<IGenericSuccessMessage> {
    return prisma.$transaction(async (tx) => {
      const {
        classSlug,
        targetDay,
        targetLesson,
        source,
        displacedEntryOriginalDay,
      } = payload;

      const classInfo = await tx.class.findUnique({
        where: { slug: classSlug },
      });
      if (!classInfo) {
        throw new ApiError(404, `Class with slug '${classSlug}' not found`);
      }
      const classId = classInfo.id;

      if (source.type === "scheduled") {
        const sourceEntry = await tx.scheduleEntry.findUnique({
          where: { id: source.id },
        });
        if (!sourceEntry) {
          throw new ApiError(404, "Source schedule entry not found");
        }

        const targetEntry = await tx.scheduleEntry.findFirst({
          where: { classId, dayOfWeek: targetDay, lessonNumber: targetLesson },
        });

        if (!targetEntry) {
          await tx.scheduleEntry.update({
            where: { id: source.id },
            data: { dayOfWeek: targetDay, lessonNumber: targetLesson },
          });
          return { message: "Lesson moved successfully." };
        }

        const sourceSubjectId = sourceEntry.subjectId;
        const targetSubjectId = targetEntry.subjectId;

        await tx.scheduleEntry.update({
          where: { id: source.id },
          data: { subjectId: targetSubjectId },
        });
        await tx.scheduleEntry.update({
          where: { id: targetEntry.id },
          data: { subjectId: sourceSubjectId },
        });

        return { message: "Lessons swapped successfully." };
      }

      if (source.type === "unscheduled") {
        const subjectId = source.id;
        const targetEntry = await tx.scheduleEntry.findFirst({
          where: { classId, dayOfWeek: targetDay, lessonNumber: targetLesson },
        });

        if (!targetEntry) {
          await tx.scheduleEntry.create({
            data: { classId, subjectId, dayOfWeek: targetDay, lessonNumber: targetLesson },
          });
        } else {
          if (!displacedEntryOriginalDay) {
            throw new ApiError(400, "'displacedEntryOriginalDay' must be provided to displace a lesson.");
          }

          const lessonsOnOriginalDay = await tx.scheduleEntry.findMany({
            where: { classId, dayOfWeek: displacedEntryOriginalDay },
            orderBy: { lessonNumber: "desc" },
          });
          
          const lastLessonNumber = lessonsOnOriginalDay.length > 0 ? lessonsOnOriginalDay[0].lessonNumber : 0;
          const newLessonNumberForDisplaced = lastLessonNumber + 1;

          const displacedSubjectId = targetEntry.subjectId;
          await tx.scheduleEntry.delete({ where: { id: targetEntry.id } });

          await tx.scheduleEntry.create({
            data: {
              classId,
              subjectId: displacedSubjectId,
              dayOfWeek: displacedEntryOriginalDay,
              lessonNumber: newLessonNumberForDisplaced,
            },
          });

          await tx.scheduleEntry.create({
            data: { classId, subjectId, dayOfWeek: targetDay, lessonNumber: targetLesson },
          });
        }

        await tx.classSubject.update({
          where: { classId_subjectId: { classId, subjectId } },
          data: { scheduleDiff: { decrement: 1 } },
        });

        return { message: "Lesson placed successfully." };
      }

      throw new ApiError(400, "Invalid source type specified");
    });
  }

  public async deleteScheduleEntry(
    classSlug: string,
    entryId: number
  ): Promise<IGenericSuccessMessage> {
    return prisma.$transaction(async (tx) => {
      const classInfo = await tx.class.findUnique({
        where: { slug: classSlug },
      });
      if (!classInfo) {
        throw new ApiError(404, `Class with slug '${classSlug}' not found`);
      }

      const entryToDelete = await tx.scheduleEntry.findUnique({
        where: { id: entryId, classId: classInfo.id },
      });

      if (!entryToDelete) {
        throw new ApiError(
          404,
          `Schedule entry with ID ${entryId} not found in this class`
        );
      }

      await this.updateSubjectDebtOnDelete(
        tx,
        classInfo.slug,
        entryToDelete.subjectId
      );

      await tx.scheduleEntry.delete({ where: { id: entryId } });

      return { message: "Schedule entry deleted successfully." };
    });
  }

  public async deleteEntries(payload: {
    entryIds: number[];
    classId: number;
    subjectId: number;
  }): Promise<IGenericSuccessMessage> {
    const { entryIds, classId, subjectId } = payload;

    if (!entryIds || entryIds.length === 0) {
      throw new ApiError(400, "O'chirish uchun darslar tanlanmagan");
    }

    return prisma.$transaction(async (tx) => {
      const deleteCount = await tx.scheduleEntry.deleteMany({
        where: {
          id: { in: entryIds },
          classId: classId,
          subjectId: subjectId,
        },
      });

      if (deleteCount.count !== entryIds.length) {
        throw new ApiError(
          404,
          `Ba'zi darslar topilmadi yoki o'chirib bo'lmadi.`
        );
      }

      await tx.classSubject.update({
        where: {
          classId_subjectId: {
            classId: classId,
            subjectId: subjectId,
          },
        },
        data: {
          scheduleDiff: {
            increment: entryIds.length,
          },
        },
      });

      return {
        message: `${entryIds.length} ta dars muvaffaqiyatli o'chirildi`,
      };
    });
  }

  private async updateSubjectDebtOnDelete(
    tx: Prisma.TransactionClient,
    classSlug: string,
    subjectId: number
  ): Promise<void> {
    const classSubject = await tx.classSubject.findFirst({
      where: {
        class: { slug: classSlug },
        subjectId,
      },
    });

    if (classSubject) {
      await tx.classSubject.update({
        where: { id: classSubject.id },
        data: { scheduleDiff: { increment: 1 } },
      });
    }
  }
}

export { ScheduleService };
export default new ScheduleService();