import { ClassSubject, Subject } from "@/generated/prisma";

type ClassSubjectWithSubject = ClassSubject & { subject: Subject };

export class ClassSubjectDto {
  id: number;
  classId: number;
  subjectId: number;
  hoursPerWeek: number;
  subject: { id: number; name: string }; 

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
