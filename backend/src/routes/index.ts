import { Router } from "express";
import classRouter from "@/api/class/class.route";
import subjectRouter from "@/api/subject/subject.route";
import classSubjectRouter from "@/api/class-subject/class-subject.route";
import scheduleRouter from "@/api/schedule/schedule.route";

const mainRouter = Router();

mainRouter.use("/classes", classRouter);

mainRouter.use("/subjects", subjectRouter);
mainRouter.use("/class-subjects", classSubjectRouter);
mainRouter.use("/schedules", scheduleRouter);

export default mainRouter;
