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
import {
  Class,
  ClassSubject,
  ScheduleEntry,
  Subject,
} from "@/generated/prisma";

class ScheduleService {
  getClassBySlug(slug: string): Promise<Class | null> {
    return prisma.class.findUnique({
      where: { slug },
    });
  }
  /**
   * Sinf uchun dars jadvalini uning SLUG'i orqali to'liq olib beradi.
   */
  public async getScheduleBySlug(
    slug: string
  ): Promise<IFullSchedulePayload | null> {
    // DIAGNOSTIKA: Kirib kelgan slug'ni tekshiramiz
    console.log(`[ScheduleService] Received slug: ${slug}`);

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

    // Ma'lumotlarni DTO orqali to'g'ri formatga o'tkazish
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

  /**
   * Sinf uchun dars jadvalini SLUG orqali generatsiya qiladi.
   */
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

  /**
   * Darsni ko'chiradi, almashtiradi yoki jadvalga joylashtiradi.
   */
  public async moveOrSwapEntry(
    payload: IMoveOrSwapPayload
  ): Promise<IGenericSuccessMessage> {
    console.log(
      "Backend Service -> Received payload:",
      JSON.stringify(payload, null, 2)
    ); // Batafsil log
    return prisma.$transaction(async (tx) => {
      const { classSlug, targetDay, targetLesson, source } = payload;

      const classInfo = await tx.class.findUnique({
        where: { slug: classSlug },
      });
      if (!classInfo) {
        throw new ApiError(404, `Class with slug '${classSlug}' not found`);
      }
      const classId = classInfo.id;
      console.log(`Backend Service -> Found classId: ${classId}`); // Log

      // 1-holat: Jadvaldagi darsni ko'chirish yoki almashtirish
      if (source.type === "scheduled") {
        const sourceEntry = await tx.scheduleEntry.findUnique({
          where: { id: source.id },
        });
        console.log(
          "Backend Service -> Found sourceEntry:",
          JSON.stringify(sourceEntry, null, 2)
        ); // Log

        if (!sourceEntry || sourceEntry.classId !== classId) {
          throw new ApiError(
            404,
            "Source schedule entry not found or mismatch"
          );
        }

        console.log(
          `Backend Service -> Searching for target at day: ${targetDay}, lesson: ${targetLesson}`
        ); // Log
        const targetEntry = await tx.scheduleEntry.findFirst({
          where: { classId, dayOfWeek: targetDay, lessonNumber: targetLesson },
        });
        console.log(
          "Backend Service -> Found targetEntry:",
          JSON.stringify(targetEntry, null, 2)
        ); // ENG MUHIM LOG

        // Agar boriladigan joy bo'sh bo'lsa, shunchaki ko'chiramiz
        if (!targetEntry) {
          console.log(
            "Backend Service -> Target not found. Attempting to MOVE entry."
          ); // Log
          await tx.scheduleEntry.update({
            where: { id: source.id },
            data: { dayOfWeek: targetDay, lessonNumber: targetLesson },
          });
          return { message: "Lesson moved successfully." };
        }

        // Agar boriladigan joyda boshqa dars bo'lsa, o'rin almashtiramiz
        // YAKUNIY YECHIM: Ikkala yozuvning fan ID'larini bitta tranzaksiyada almashtiramiz.
        // Bu har qanday "Unique Constraint" xatosining oldini oladi.
        const sourceSubjectId = sourceEntry.subjectId;
        const targetSubjectId = targetEntry.subjectId;

        console.log(
          `Backend Service -> Target found. Attempting to SWAP subjects: ${sourceSubjectId} <-> ${targetSubjectId}`
        ); // Log
        // Tranzaksiya ichida ikkita mustaqil yangilanish
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

      // 2-holat: Akkordeondan yangi darsni jadvalga joylashtirish
      if (source.type === "unscheduled") {
        const subjectId = source.id;
        const targetEntry = await tx.scheduleEntry.findFirst({
          where: { classId, dayOfWeek: targetDay, lessonNumber: targetLesson },
        });

        // Agar boriladigan joy band bo'lsa, eski darsni suramiz
        if (targetEntry) {
          // Jadvaldagi barcha darslarni olamiz va bo'sh joy qidiramiz
          const allEntries = await tx.scheduleEntry.findMany({
            where: { classId },
            orderBy: [{ dayOfWeek: "asc" }, { lessonNumber: "asc" }],
          });

          const occupiedSlots = new Set(
            allEntries.map((e) => `${e.dayOfWeek}-${e.lessonNumber}`)
          );

          let firstEmptySlot: {
            dayOfWeek: number;
            lessonNumber: number;
          } | null = null;
          const maxLessons = Math.max(
            ...allEntries.map((e) => e.lessonNumber),
            7
          );

          // Birinchi bo'sh katakchani topish
          for (let day = 1; day <= 6; day++) {
            for (let lesson = 1; lesson <= maxLessons + 1; lesson++) {
              if (!occupiedSlots.has(`${day}-${lesson}`)) {
                firstEmptySlot = { dayOfWeek: day, lessonNumber: lesson };
                break;
              }
            }
            if (firstEmptySlot) break;
          }

          if (!firstEmptySlot) {
            throw new ApiError(400, "Jadvalda bo'sh joy topilmadi.");
          }

          // Eski darsni topilgan bo'sh joyga ko'chiramiz
          await tx.scheduleEntry.update({
            where: { id: targetEntry.id },
            data: {
              dayOfWeek: firstEmptySlot.dayOfWeek,
              lessonNumber: firstEmptySlot.lessonNumber,
            },
          });
        }

        // Yangi darsni kerakli joyga yaratamiz
        await tx.scheduleEntry.create({
          data: {
            classId,
            subjectId,
            dayOfWeek: targetDay,
            lessonNumber: targetLesson,
          },
        });

        // Fan qarzdorligini (scheduleDiff) kamaytiramiz
        await tx.classSubject.update({
          where: { classId_subjectId: { classId, subjectId } },
          data: { scheduleDiff: { decrement: 1 } },
        });

        return { message: "Dars muvaffaqiyatli joylashtirildi." };
      }

      throw new ApiError(400, "Invalid source type specified");
    });
  }

  /**
   * Jadvaldagi bitta yozuvni uning IDsi orqali o'chiradi.
   */
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

      // YECHIM: To'g'ri formatdagi xabarni qaytaramiz
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

      // scheduleDiff'ni to'g'rilash
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

  /**
   * Dars jadvalidagi yozuvni o'chirganda fanning qarzdorligini yangilaydi.
   */
  private async updateSubjectDebtOnDelete(
    tx: Prisma.TransactionClient,
    classSlug: string, // ID o'rniga SLUG qabul qilamiz
    subjectId: number
  ): Promise<void> {
    const classSubject = await tx.classSubject.findFirst({
      where: {
        class: { slug: classSlug }, // ID o'rniga SLUG bo'yicha qidiramiz
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
