import { ClassDto } from "./class.dto";
import { ICreateClass } from "./class.interface";
import ApiError from "../../utils/api.Error";
import { sortClassesNaturally } from "../../utils/array.helpers";
import slugify from "../../utils/slugify";
import { Class } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { PrismaClient } from "@prisma/client";

class ClassService {
  async getAllClasses(): Promise<ClassDto[]> {
    const classes: Class[] = await prisma.class.findMany();
    const sortedClasses = sortClassesNaturally(classes);
    return sortedClasses.map((klass) => new ClassDto(klass));
  }

  async getClassBySlug(slug: string): Promise<ClassDto | null> {
    const singleClass = await prisma.class.findUnique({
      where: { slug },
    });

    if (!singleClass) {
      throw new ApiError(404, "Class not found");
    }

    return new ClassDto(singleClass);
  }

  async createClass(data: ICreateClass): Promise<ClassDto> {
    const { name, teacher, studentCount } = data;

    if (!name || name.trim() === "") {
      throw new ApiError(400, "Class name is required");
    }
    if (!teacher || teacher.trim() === "") {
      throw new ApiError(400, "Teacher name is required");
    }
    if (!studentCount || studentCount <= 0) {
      throw new ApiError(400, "Student count must be a positive number");
    }

    const slug = slugify(name);

    const existingClass = await prisma.class.findFirst({
      where: {
        OR: [
          { name: { equals: name, mode: "insensitive" } },
          { slug: { equals: slug, mode: "insensitive" } },
        ],
      },
    });

    if (existingClass) {
      if (existingClass.name.toLowerCase() === name.toLowerCase()) {
        throw new ApiError(409, `Class with name '${name}' already exists`);
      }
      throw new ApiError(409, `Class with slug '${slug}' already exists`);
    }

    const newClass = await prisma.class.create({
      data: { name, slug, teacher, studentCount },
    });
    return new ClassDto(newClass);
  }

  async updateClass(
    slug: string,
    data: Partial<ICreateClass>
  ): Promise<ClassDto> {
    const classToUpdate = await prisma.class.findUnique({
      where: { slug },
    });

    if (!classToUpdate) {
      throw new ApiError(404, "Class not found");
    }

    const { name, teacher, studentCount } = data;
    const updateData: { [key: string]: any } = {};

    if (name) {
      updateData.name = name;
      const newSlug = slugify(name);
      updateData.slug = newSlug;

      const existingClass = await prisma.class.findFirst({
        where: {
          NOT: { id: classToUpdate.id },
          OR: [
            { name: { equals: name, mode: "insensitive" } },
            { slug: { equals: newSlug, mode: "insensitive" } },
          ],
        },
      });

      if (existingClass) {
        throw new ApiError(
          409,
          `A class with this name or slug already exists`
        );
      }
    }

    if (teacher) {
      updateData.teacher = teacher;
    }

    if (studentCount) {
      updateData.studentCount = studentCount;
    }

    if (Object.keys(updateData).length === 0) {
      throw new ApiError(400, "No fields to update");
    }

    const updatedClass = await prisma.class.update({
      where: { slug },
      data: updateData,
    });

    return new ClassDto(updatedClass);
  }

  async deleteClass(slug: string): Promise<ClassDto> {
    const classToDelete = await prisma.class.findUnique({
      where: { slug },
    });

    if (!classToDelete) {
      throw new ApiError(404, "Class not found");
    }

    await prisma.$transaction(async (tx: PrismaClient) => {
      // Delete related schedules first
      await tx.schedule.deleteMany({
        where: {
          classId: classToDelete.id,
        },
      });

      // Delete related class-subject links
      await tx.classSubject.deleteMany({
        where: {
          classId: classToDelete.id,
        },
      });

      // Finally, delete the class itself
      await tx.class.delete({ where: { slug } });
    });

    return new ClassDto(classToDelete);
  }
}

export default ClassService;
