import { Class } from "@/generated/prisma";

export class ClassDto {
  id: number;
  name: string;
  slug: string;
  teacher: string;
  studentCount: number;

  constructor(data: Class) {
    this.id = data.id;
    this.name = data.name;
    this.slug = data.slug;
    this.teacher = data.teacher;
    this.studentCount = data.studentCount;
  }
}
