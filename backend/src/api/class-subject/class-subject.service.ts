import prisma from "@/lib/prisma";
import ApiError from "@/utils/api.Error";
import { ClassSubjectDto } from "./class-subject.dto";

class ClassSubjectService {
  async getAllByClassSlug(slug: string): Promise<ClassSubjectDto[]> {
    const classWithSubjects = await prisma.class.findUnique({
      where: { slug },
      include: {
        subjects: {
          orderBy: {
            subject: {
              name: "asc",
            },
          },
          include: {
            subject: true, // Fan nomini ham olamiz
          },
        },
      },
    });

    if (!classWithSubjects) {
      // Agar bu slug'li sinf topilmasa, bo'sh massiv qaytaramiz.
      return [];
    }

    return classWithSubjects.subjects.map((cs) => new ClassSubjectDto(cs));
  }

  /**
   * Belgilangan sinf uchun ommaviy ravishda yangi fanlarni biriktiradi.
   */
  async bulkCreateForClass(
    classId: number,
    subjectsData: { subjectId: number; hoursPerWeek: number }[]
  ): Promise<ClassSubjectDto[]> {
    return prisma.$transaction(async (tx) => {
      // 1. Sinf uchun dars jadvali yaratilganmi yoki yo'qligini tekshirish
      const scheduleExists = await tx.scheduleEntry.findFirst({
        where: { classId },
      });

      // 2. Jadval mavjudligiga qarab scheduleDiff'ni belgilash
      const dataToCreate = subjectsData.map((s) => ({
        classId,
        subjectId: s.subjectId,
        hoursPerWeek: s.hoursPerWeek,
        // Agar jadval bo'lsa, soatni qarz deb yozamiz, bo'lmasa - 0
        scheduleDiff: scheduleExists ? s.hoursPerWeek : 0,
      }));

      const createdSubjects = await tx.classSubject.createMany({
        data: dataToCreate,
      });

      // Yaratilgan yozuvlarni to'liq (subject bilan) qayta o'qish
      const newClassSubjects = await tx.classSubject.findMany({
        where: {
          classId: classId,
          subjectId: {
            in: subjectsData.map((s) => s.subjectId),
          },
        },
        include: { subject: true },
      });

      return newClassSubjects.map((cs) => new ClassSubjectDto(cs));
    });
  }

  /**
   * Belgilangan sinfga hali biriktirilmagan barcha fanlarni qaytaradi.
   */
  async getUnassignedSubjectsForClass(classId: number) {
    const assignedSubjectIds = (
      await prisma.classSubject.findMany({
        where: { classId },
        select: { subjectId: true },
      })
    ).map((cs) => cs.subjectId);

    const unassignedSubjects = await prisma.subject.findMany({
      where: {
        id: {
          notIn: assignedSubjectIds,
        },
      },
    });

    return unassignedSubjects;
  }

  /**
   * Fanning soatini yangilaydi va eski soat bilan farqini hisoblab, qaytaradi.
   * Bu frontendga dars jadvalini qanday o'zgartirish kerakligini aytadi.
   * @returns {Promise<ClassSubjectDto>}
   */
  async reconcileHours(
    classId: number,
    subjectId: number,
    newHours: number
  ): Promise<ClassSubjectDto> {
    // Endi faqat yangilangan DTO qaytaradi
    return prisma.$transaction(async (tx) => {
      const existingEntry = await tx.classSubject.findUnique({
        where: { classId_subjectId: { classId, subjectId } },
      });

      if (!existingEntry) {
        throw new ApiError(404, "Class-subject association not found");
      }

      // Jadval mavjudligini tekshiramiz
      const scheduleExists = await tx.scheduleEntry.findFirst({
        where: { classId },
      });

      const oldHours = existingEntry.hoursPerWeek;
      const diff = newHours - oldHours;

      const updatedEntry = await tx.classSubject.update({
        where: {
          classId_subjectId: { classId, subjectId },
        },
        data: {
          hoursPerWeek: newHours,
          // Faqat jadval mavjud bo'lsa, diffni hisoblaymiz
          ...(scheduleExists && {
            scheduleDiff: {
              increment: diff,
            },
          }),
        },
        include: { subject: true },
      });

      return new ClassSubjectDto(updatedEntry);
    });
  }

  async deleteClassSubject(id: number) {
    try {
      return await prisma.$transaction(async (tx) => {
        // 1. O'chiriladigan ClassSubject yozuvini topamiz
        const classSubjectToDelete = await tx.classSubject.findUnique({
          where: { id },
        });

        if (!classSubjectToDelete) {
          throw new ApiError(404, "Class-subject assignment not found");
        }

        const { classId, subjectId } = classSubjectToDelete;

        // 2. Shu sinf va fanga oid barcha dars jadvali yozuvlarini o'chiramiz
        await tx.scheduleEntry.deleteMany({
          where: {
            classId,
            subjectId,
          },
        });

        // 3. Asosiy ClassSubject yozuvini o'chiramiz
        await tx.classSubject.delete({ where: { id } });

        return classSubjectToDelete;
      });
    } catch (error) {
      console.error(
        `[Service Error] Failed to delete class-subject with id '${id}':`,
        error
      );
      throw error; // Re-throw to be caught by global error handler
    }
  }
}

export default ClassSubjectService;
