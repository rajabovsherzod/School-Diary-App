import { TFullScheduleEntry } from "./schedule.interface";

// DTO (Data Transfer Object) - Faqat kerakli ma'lumotlarni to'g'ri shaklda qaytarish uchun
export class ScheduleEntryDto {
  public readonly id: number;
  public readonly dayOfWeek: number;
  public readonly lessonNumber: number;
  public readonly classId: number;
  public readonly subject: TFullScheduleEntry["subject"]; // YECHIM: To'liq subject obyekti qo'shildi

  constructor(model: TFullScheduleEntry) {
    this.id = model.id;
    this.dayOfWeek = model.dayOfWeek;
    this.lessonNumber = model.lessonNumber;
    this.classId = model.classId;
    this.subject = model.subject; // YECHIM: Subject obyekti to'g'ridan-to'g'ri o'zlashtiriladi
  }
}
