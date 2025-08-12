import { Subject } from "@/generated/prisma";

class SubjectDto {
  id: number;
  name: string;
  slug: string;

  constructor(subject: Subject) {
    this.id = subject.id;
    this.name = subject.name;
    this.slug = subject.slug;
  }
}

export default SubjectDto;
