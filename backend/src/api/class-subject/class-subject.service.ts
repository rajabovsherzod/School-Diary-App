import prisma from "@/lib/prisma";
import ApiError from "@/utils/api.Error";
import { ClassSubjectDto } from "./class-subject.dto";

class ClassSubjectService {
  async getAllByClassSlug(slug: string): Promise<ClassSubjectDto[]> {
    const classWithSubjects = await prisma.class.findUnique({
      where: { slug },
      include: {
        subjects: {
          orderBy: { subject: { name: "asc" } },
          include: { subject: true },
        },
      },
    });

    if (!classWithSubjects) {
      return [];
    }

    return classWithSubjects.subjects.map((cs) => new ClassSubjectDto(cs));
  }

  async bulkCreateForClass(
    classId: number,
    subjectsData: { subjectId: number; hoursPerWeek: number }[]
  ): Promise<ClassSubjectDto[]> {
    return prisma.$transaction(async (tx) => {
      const scheduleExists = await tx.scheduleEntry.findFirst({
        where: { classId },
      });

      const dataToCreate = subjectsData.map((s) => ({
        classId,
        subjectId: s.subjectId,
        hoursPerWeek: s.hoursPerWeek,
        scheduleDiff: scheduleExists ? s.hoursPerWeek : 0,
      }));

      await tx.classSubject.createMany({
        data: dataToCreate,
      });

      const newClassSubjects = await tx.classSubject.findMany({
        where: {
          classId: classId,
          subjectId: { in: subjectsData.map((s) => s.subjectId) },
        },
        include: { subject: true },
      });

      return newClassSubjects.map((cs) => new ClassSubjectDto(cs));
    });
  }

  async getUnassignedSubjectsForClass(classId: number) {
    const assignedSubjectIds = (
      await prisma.classSubject.findMany({
        where: { classId },
        select: { subjectId: true },
      })
    ).map((cs) => cs.subjectId);

    return prisma.subject.findMany({
      where: {
        id: { notIn: assignedSubjectIds },
      },
      orderBy: { name: "asc" },
    });
  }

  async reconcileHours(
    classId: number,
    subjectId: number,
    newHours: number
  ): Promise<ClassSubjectDto> {
    return prisma.$transaction(async (tx) => {
      const existingEntry = await tx.classSubject.findUnique({
        where: { classId_subjectId: { classId, subjectId } },
      });

      if (!existingEntry) {
        throw new ApiError(404, "Sinf va fan bog'lanishi topilmadi");
      }

      const scheduleExists = await tx.scheduleEntry.findFirst({
        where: { classId },
      });

      const diff = newHours - existingEntry.hoursPerWeek;

      const updatedEntry = await tx.classSubject.update({
        where: { classId_subjectId: { classId, subjectId } },
        data: {
          hoursPerWeek: newHours,
          ...(scheduleExists && {
            scheduleDiff: { increment: diff },
          }),
        },
        include: { subject: true },
      });

      return new ClassSubjectDto(updatedEntry);
    });
  }

  async deleteClassSubject(id: number) {
    return prisma.$transaction(async (tx) => {
      const classSubjectToDelete = await tx.classSubject.findUnique({
        where: { id },
      });

      if (!classSubjectToDelete) {
        throw new ApiError(404, "Sinfga fan biriktirilmagan");
      }

      const { classId, subjectId } = classSubjectToDelete;

      await tx.scheduleEntry.deleteMany({
        where: { classId, subjectId },
      });

      await tx.classSubject.delete({ where: { id } });

      return classSubjectToDelete;
    });
  }
}

export default ClassSubjectService;