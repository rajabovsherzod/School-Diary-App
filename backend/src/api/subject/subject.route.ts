import { Router } from "express";
import SubjectController from "./subject.controller";
import SubjectService from "./subject.service";
import asyncHandler from "@/utils/asyncHandler";

const router = Router();

const subjectService = new SubjectService();
const subjectController = new SubjectController(subjectService);

router
  .route("/")
  .get(asyncHandler(subjectController.getAllSubjects))
  .post(asyncHandler(subjectController.createSubject));

router.route("/:slug").get(asyncHandler(subjectController.getSubjectBySlug));

export default router;
