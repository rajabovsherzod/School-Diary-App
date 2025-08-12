import { Class } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import ApiError from "@/utils/api.Error";
import slugify from "@/utils/slugify";
import { ICreateClass } from "./class.interface";
import { ClassDto } from "./class.dto";

class ClassService {
  async getAllClasses(): Promise<ClassDto[]> {
    const classes = await prisma.class.findMany();
    return classes.map((klass) => new ClassDto(klass));
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
    const { name } = data;

    if (!name || name.trim() === "") {
      throw new ApiError(400, "Class name is required");
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

    const newClass = await prisma.class.create({ data: { name, slug } });
    return new ClassDto(newClass);
  }

  async updateClass(slug: string, data: ICreateClass): Promise<ClassDto> {
    const { name } = data;

    const classToUpdate = await prisma.class.findUnique({
      where: { slug },
    });

    if (!classToUpdate) {
      throw new ApiError(404, "Class not found");
    }

    if (!name || name.trim() === "") {
      throw new ApiError(400, "New class name is required");
    }

    const newSlug = slugify(name);

    // Check if the new name or slug already exists in another record
    const existingClass = await prisma.class.findFirst({
      where: {
        NOT: {
          id: classToUpdate.id, // Exclude the current class from the search
        },
        OR: [
          { name: { equals: name, mode: "insensitive" } },
          { slug: { equals: newSlug, mode: "insensitive" } },
        ],
      },
    });

    if (existingClass) {
      throw new ApiError(409, `A class with this name or slug already exists`);
    }

    const updatedClass = await prisma.class.update({
      where: { slug },
      data: { name, slug: newSlug },
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

    await prisma.class.delete({ where: { slug } });

    return new ClassDto(classToDelete);
  }
}

export default ClassService;
