import { Class } from "@/generated/prisma";

export class ClassDto {
  id: number;
  name: string;
  slug: string;

  constructor(klass: Class) {
    this.id = klass.id;
    this.name = klass.name;
    this.slug = klass.slug;
  }
}
