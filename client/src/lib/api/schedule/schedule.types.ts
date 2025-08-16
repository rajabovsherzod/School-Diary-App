// Based on API data structure

export interface IFullSchedule {
  id: number;
  name: string;
  scheduleEntries: IScheduleEntry[];
}

export interface ISubject {
  id: number;
  name: string;
  slug: string;
  createdAt: string;
}

export interface IScheduleEntry {
  id: number;
  dayOfWeek: number;
  lessonNumber: number;
  classId: number;
  subjectId: number;
  subject: ISubject;
}

export type TMoveSource =
  | { type: "scheduled"; id: number }
  | { type: "unscheduled"; id: number; subject: { id: number; name: string } };

export interface IMoveOrSwapPayload {
  classSlug: string;
  source: TMoveSource;
  targetDay: number;
  targetLesson: number;
}

export interface IGenericSuccessMessage {
  message: string;
}

export interface IFullSchedulePayload {
  scheduleEntries: IScheduleEntry[];
  subjectDebts: ISubjectDebt[];
  class: { id: number; name: string };
}

export interface ISubjectDebt {
  subjectId: number;
  subjectName: string;
  scheduleDiff: number;
}

// Bu tip react-query tomonidan keshlanadigan ma'lumotlar strukturasini ifodalaydi
export type TScheduleQueryData = IFullSchedulePayload;
