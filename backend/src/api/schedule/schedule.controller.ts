import { Request, Response } from "express";
// XATO TUZATILDI: Klassning turi (type) to'g'ri import qilinmoqda
import { ScheduleService } from "./schedule.service";
import ApiResponse from "@/utils/api.Response";
import ApiError from "@/utils/api.Error";
import { IMoveOrSwapPayload } from "./schedule.interface";

class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  getScheduleBySlug = async (req: Request, res: Response) => {
    try {
      // YECHIM: Parametrni to'g'ridan-to'g'ri va aniq nom bilan olamiz.
      // Bu routerdagi nomlanishdan mustaqil ishlaydi.
      const { slug } = req.params;
      const schedule = await this.scheduleService.getScheduleBySlug(slug);
      if (!schedule) {
        return res.status(404).json({ message: "Schedule not found" });
      }
      res.status(200).json(schedule);
    } catch (error) {
      res.status(500).json({ message: "Error getting schedule", error });
    }
  };

  // O'ZGARISH: ID o'rniga SLUG bilan ishlaydi
  generateScheduleForClassBySlug = async (req: Request, res: Response) => {
    const slug = req.params.slug;
    if (!slug) {
      throw new ApiError(400, "Class slug must be provided");
    }

    const result = await this.scheduleService.generateScheduleForClassBySlug(
      slug
    );
    res.status(201).json(new ApiResponse(result, result.message));
  };

  deleteScheduleEntry = async (req: Request, res: Response) => {
    try {
      const { slug, entryId } = req.params;
      const numericEntryId = parseInt(entryId, 10);

      if (isNaN(numericEntryId)) {
        return res.status(400).json({ message: "Invalid entry ID format" });
      }

      const result = await this.scheduleService.deleteScheduleEntry(
        slug,
        numericEntryId
      );
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof ApiError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      res.status(500).json({ message: "Error deleting schedule entry", error });
    }
  };

  moveOrSwapEntry = async (req: Request, res: Response) => {
    // YECHIM: `slug` manzil parametrlaridan, qolgan ma'lumotlar tanadan olinadi.
    const { slug } = req.params;
    const body = req.body;

    const payload: IMoveOrSwapPayload = {
      classSlug: slug,
      ...body,
    };

    try {
      const result = await this.scheduleService.moveOrSwapEntry(payload);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof ApiError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      res
        .status(500)
        .json({ message: "Error moving or swapping entry", error });
    }
  };
}

export default ScheduleController;
