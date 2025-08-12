import { Router } from "express";
import classRouter from "@/api/class/class.route";
import subjectRouter from "@/api/subject/subject.route";

const router = Router();

router.use("/classes", classRouter);
router.use("/subjects", subjectRouter);

export default router;
