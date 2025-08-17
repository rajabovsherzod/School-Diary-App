import { Router } from "express";
import ScheduleController from "./schedule.controller";
import scheduleService from "./schedule.service";
import asyncHandler from "@/utils/asyncHandler";

const router = Router();
const scheduleController = new ScheduleController(scheduleService);

router
  .route("/class/:slug")
  .get(asyncHandler(scheduleController.getScheduleBySlug));

router
  .route("/generate/class/:slug")
  .post(asyncHandler(scheduleController.generateScheduleForClassBySlug));

router
  .route("/class/:slug/move")
  .put(asyncHandler(scheduleController.moveOrSwapEntry));

router
  .route("/class/:slug/entries")
  .delete(asyncHandler(scheduleController.deleteEntries));

router
  .route("/class/:slug/entry/:entryId")
  .delete(asyncHandler(scheduleController.deleteScheduleEntry));

export default router;