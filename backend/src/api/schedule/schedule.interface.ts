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

// Darslarni ko'chirish, almashtirish yoki joylashtirish uchun yagona, kuchli interfeys
export interface IMoveOrSwapPayload {
  classSlug: string; // Doimo SLUG ishlatiladi
  targetDay: number;
  targetLesson: number;
  source:
    | { type: "scheduled"; id: number } // Jadvaldagi mavjud darsni ko'chirish
    | { type: "unscheduled"; id: number }; // Yon paneldan yangi darsni joylashtirish (bu yerda ID - subjectId)
  displacedEntryOriginalDay?: number; // Frontend'dan keladigan qo'shimcha ma'lumot
}

export interface IGenericSuccessMessage {
  message: string;
}
