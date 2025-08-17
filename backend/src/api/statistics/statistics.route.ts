import { Router } from "express";
import StatisticsController from "./statistics.controller";
import { StatisticsService } from "./statistics.service";

const router = Router();

// Dependency Injection: Servis va Kontrollerni yaratish va bog'lash
const statisticsService = new StatisticsService();
const statisticsController = new StatisticsController(statisticsService);

router.get("/", statisticsController.getDashboardStats);
router.get(
  "/classes-without-schedule",
  statisticsController.getClassesWithoutSchedule
);

export default router;
