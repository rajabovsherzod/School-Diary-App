import { Request, Response } from "express";
import { StatisticsService } from "./statistics.service";

class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  getDashboardStats = async (req: Request, res: Response) => {
    try {
      const stats = await this.statisticsService.getDashboardStats();
      res
        .status(200)
        .json({ data: stats, message: "Statistics fetched successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error fetching statistics", error });
    }
  };

  getClassesWithoutSchedule = async (req: Request, res: Response) => {
    try {
      const classes = await this.statisticsService.getClassesWithoutSchedule();
      res.status(200).json({
        data: classes,
        message: "Classes without schedule fetched successfully",
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching classes without schedule", error });
    }
  };
}

export default StatisticsController;
