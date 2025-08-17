import { Request, Response } from "express";
import { ScheduleService } from "./schedule.service";
import ApiResponse from "@/utils/api.Response";
import ApiError from "@/utils/api.Error";
import { IMoveOrSwapPayload } from "./schedule.interface";

class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  getScheduleBySlug = async (req: Request, res: Response) => {
    const { slug } = req.params;
    const schedule = await this.scheduleService.getScheduleBySlug(slug);
    res
      .status(200)
      .json(new ApiResponse(schedule, "Jadval muvaffaqiyatli olindi."));
  };

  generateScheduleForClassBySlug = async (req: Request, res: Response) => {
    const { slug } = req.params;
    const result = await this.scheduleService.generateScheduleForClassBySlug(
      slug
    );
    res.status(201).json(new ApiResponse(result, result.message));
  };

  deleteScheduleEntry = async (req: Request, res: Response) => {
    const { slug, entryId } = req.params;
    const numericEntryId = parseInt(entryId, 10);

    if (isNaN(numericEntryId)) {
      throw new ApiError(400, "Yozuv ID'si noto'g'ri formatda.");
    }

    const result = await this.scheduleService.deleteScheduleEntry(
      slug,
      numericEntryId
    );
    res
      .status(200)
      .json(new ApiResponse(result, "Jadval yozuvi muvaffaqiyatli o'chirildi."));
  };

  moveOrSwapEntry = async (req: Request, res: Response) => {
    const { slug } = req.params;
    const payload: IMoveOrSwapPayload = {
      classSlug: slug,
      ...req.body,
    };

    const result = await this.scheduleService.moveOrSwapEntry(payload);
    res
      .status(200)
      .json(
        new ApiResponse(
          result,
          "Jadval yozuvi muvaffaqiyatli ko'chirildi yoki almashtirildi."
        )
      );
  };

  deleteEntries = async (req: Request, res: Response) => {
    const { slug } = req.params;
    const { entryIds, subjectId } = req.body;

    if (!Array.isArray(entryIds) || entryIds.length === 0 || !subjectId) {
      throw new ApiError(
        400,
        "So'rovda xatolik: 'entryIds' (massiv) va 'subjectId' talab qilinadi."
      );
    }

    const classData = await this.scheduleService.getClassBySlug(slug);
    if (!classData) {
      throw new ApiError(404, "Sinf topilmadi.");
    }

    const result = await this.scheduleService.deleteEntries({
      entryIds,
      classId: classData.id,
      subjectId,
    });

    res
      .status(200)
      .json(new ApiResponse(result, "Jadval yozuvlari muvaffaqiyatli o'chirildi."));
  };
}

export default ScheduleController;