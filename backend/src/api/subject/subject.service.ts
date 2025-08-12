import { Subject } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import ApiError from "@/utils/api.Error";
import SubjectDto from "./subject.dto";
import { ICreateSubject } from "./subject.interface";
import slugify from "@/utils/slugify";

class SubjectService {
  async getAllSubjects(): Promise<SubjectDto[]> {
    const subjects = await prisma.subject.findMany();
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
}

export default SubjectService;
