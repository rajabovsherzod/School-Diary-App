import { TFullScheduleEntry } from "./schedule.interface";

export class ScheduleEntryDto {
  public readonly id: number;
  public readonly dayOfWeek: number;
  public readonly lessonNumber: number;
  public readonly classId: number;
  public readonly subject: TFullScheduleEntry["subject"]; 

  constructor(model: TFullScheduleEntry) {
    this.id = model.id;
    this.dayOfWeek = model.dayOfWeek;
    this.lessonNumber = model.lessonNumber;
    this.classId = model.classId;
    this.subject = model.subject;
  }
}
