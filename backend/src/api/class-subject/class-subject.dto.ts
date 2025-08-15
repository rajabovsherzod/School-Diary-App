import { ClassSubject, Subject } from "@/generated/prisma";

// Bu DTO endi bog'langan Subject modelini ham o'z ichiga oladi
type ClassSubjectWithSubject = ClassSubject & { subject: Subject };

export class ClassSubjectDto {
  id: number;
  classId: number;
  subjectId: number;
  hoursPerWeek: number;
  subject: { id: number; name: string }; // Frontend uchun faqat kerakli maydonlar

  constructor(model: ClassSubjectWithSubject) {
    this.id = model.id;
    this.classId = model.classId;
    this.subjectId = model.subjectId;
    this.hoursPerWeek = model.hoursPerWeek;
    this.subject = {
      id: model.subject.id,
      name: model.subject.name,
    };
  }
}
