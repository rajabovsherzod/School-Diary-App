import { Class, ScheduleEntry, Subject } from "@/generated/prisma";

// Backenddan frontendga yuboriladigan har bir dars jadvali yozuvi uchun to'liq tip
export type TFullScheduleEntry = ScheduleEntry & {
  subject: Subject;
};

// Asosiy GET so'rovi uchun to'liq ma'lumotlar paketi
export interface IFullSchedulePayload {
  scheduleEntries: TFullScheduleEntry[];
  subjectDebts: ISubjectDebt[];
  class: { id: number; name: string };
}

// Qaysi fandan nechta soat "qarzdorlik" borligini ko'rsatuvchi interfeys
export interface ISubjectDebt {
  subjectId: number;
  subjectName: string;
  scheduleDiff: number;
}

// Umumiy muvaffaqiyatli javob uchun
export interface IGenericSuccessMessage {
  message: string;
}

export interface IMoveOrSwapPayload {
  classSlug: string; // Doimo SLUG ishlatiladi
  targetDay: number;
  targetLesson: number;
  source:
    | { type: "scheduled"; id: number } 
    | { type: "unscheduled"; id: number }; 
  displacedEntryOriginalDay?: number; 
}

export interface IGenericSuccessMessage {
  message: string;
}
