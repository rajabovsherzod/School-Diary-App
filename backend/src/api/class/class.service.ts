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
}

export default ClassService;
