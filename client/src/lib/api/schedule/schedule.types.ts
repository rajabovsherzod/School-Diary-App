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

export interface IMoveOrSwapPayload {
  classSlug: string;
  source:
    | { type: "scheduled"; id: number }
    | { type: "unscheduled"; id: number };
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
