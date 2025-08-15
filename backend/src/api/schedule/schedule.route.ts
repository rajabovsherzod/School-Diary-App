import { Router } from "express";
import ScheduleController from "./schedule.controller";
// XATO TUZATILDI: Servisning tayyor nusxasi (singleton) import qilinmoqda
import scheduleService from "./schedule.service";
import asyncHandler from "@/utils/asyncHandler";

const router = Router();
// XATO TUZATILDI: Yangi nusxa yaratish o'rniga tayyor nusxa ishlatilmoqda
const scheduleController = new ScheduleController(scheduleService);

// --- Main Data-Fetching Route ---

// Get the full schedule and subject debt for a class
router
  .route("/class/:slug")
  .get(asyncHandler(scheduleController.getScheduleBySlug));

// --- Action-Specific Routes ---

// O'ZGARISH: :classId -> :slug va controller metodi o'zgardi
router
  .route("/generate/class/:slug")
  .post(asyncHandler(scheduleController.generateScheduleForClassBySlug));

// Intelligently move, swap, or insert a schedule entry
router.put("/move", asyncHandler(scheduleController.moveOrSwapEntry));

// --- Resource-Specific Routes ---

// Delete a schedule entry by its ID
router
  .route("/class/:slug/entry/:entryId")
  .delete(asyncHandler(scheduleController.deleteScheduleEntry));

export default router;
