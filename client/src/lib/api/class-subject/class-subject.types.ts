import { SubjectResponse as Subject } from "../subject/subject.types";

export interface GetUnassignedSubjectsResponse {
  success: boolean;
  message: string;
  data: Subject[];
}

export interface GetClassSubjectsResponse {
  success: boolean;
  message: string;
  data: ClassSubject[];
}

export interface BulkCreateSubjectsPayload {
  subjects: {
    subjectId: number;
    hoursPerWeek: number;
  }[];
}

export interface ClassSubject {
  id: number;
  classId: number;
  subjectId: number;
  hoursPerWeek: number;
  subject: Subject;
}
