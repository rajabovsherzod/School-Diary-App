import { Subject } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import ApiError from "@/utils/api.Error";
import SubjectDto from "./subject.dto";
import { ICreateSubject } from "./subject.interface";
import slugify from "@/utils/slugify";

class SubjectService {
  async getAllSubjects(): Promise<SubjectDto[]> {
    const subjects = await prisma.subject.findMany({
      orderBy: {
        name: "asc",
      },
    });
    return subjects.map((subject) => new SubjectDto(subject));
  }

  async getSubjectBySlug(slug: string): Promise<SubjectDto | null> {
    const subject = await prisma.subject.findUnique({
      where: { slug },
    });

    if (!subject) {
      throw new ApiError(404, "Subject not found");
    }

    return new SubjectDto(subject);
  }

  async createSubject(subject: ICreateSubject): Promise<SubjectDto> {
    const { name } = subject;
    if (!name || name.trim() === "") {
      throw new ApiError(400, "Subject name is required");
    }

    const slug = slugify(name);

    const existingSubject = await prisma.subject.findFirst({
      where: {
        OR: [
          { name: { equals: name, mode: "insensitive" } },
          { slug: { equals: slug, mode: "insensitive" } },
        ],
      },
    });

    if (existingSubject) {
      if (existingSubject.name.toLowerCase() === name.toLowerCase()) {
        throw new ApiError(409, `Subject with name '${name}' already exists`);
      }
      throw new ApiError(409, `Subject with slug '${slug}' already exists`);
    }

    const newSubject = await prisma.subject.create({ data: { name, slug } });
    return new SubjectDto(newSubject);
  }

  async updateSubject(slug: string, data: ICreateSubject): Promise<SubjectDto> {
    const { name } = data;

    const subjectToUpdate = await prisma.subject.findUnique({
      where: { slug },
    });

    if (!subjectToUpdate) {
      throw new ApiError(404, "Subject not found");
    }

    if (!name || name.trim() === "") {
      throw new ApiError(400, "New subject name is required");
    }

    const newSlug = slugify(name);

    const existingSubject = await prisma.subject.findFirst({
      where: {
        NOT: {
          id: subjectToUpdate.id,
        },
        OR: [
          { name: { equals: name, mode: "insensitive" } },
          { slug: { equals: newSlug, mode: "insensitive" } },
        ],
      },
    });

    if (existingSubject) {
      throw new ApiError(
        409,
        `A subject with this name or slug already exists`
      );
    }

    const updatedSubject = await prisma.subject.update({
      where: { slug },
      data: { name, slug: newSlug },
    });

    return new SubjectDto(updatedSubject);
  }

  async deleteSubject(slug: string): Promise<SubjectDto> {
    try {
      return await prisma.$transaction(async (tx) => {
        const subjectToDelete = await tx.subject.findUnique({
          where: { slug },
        });

        if (!subjectToDelete) {
          throw new ApiError(404, "Subject not found");
        }

        const subjectId = subjectToDelete.id;

        // 1. Fanning sinflarga biriktirilgan barcha yozuvlarini o'chiramiz.
        await tx.classSubject.deleteMany({
          where: { subjectId },
        });

        // 2. Fanga bog'liq barcha dars jadvali yozuvlarini o'chiramiz.
        await tx.scheduleEntry.deleteMany({
          where: { subjectId },
        });

        // 3. Fanning o'zini o'chiramiz.
        await tx.subject.delete({ where: { slug } });

        return new SubjectDto(subjectToDelete);
      });
    } catch (error) {
      console.error(
        `[Service Error] Failed to delete subject with slug '${slug}':`,
        error
      );
      // Re-throw the error to be caught by the global error handler
      throw error;
    }
  }
}

export default SubjectService;
