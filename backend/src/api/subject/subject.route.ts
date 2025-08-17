import { Router } from "express";
import asyncHandler from "@/utils/asyncHandler";
import SubjectController from "./subject.controller";
import SubjectService from "./subject.service";

const router = Router();

const subjectService = new SubjectService();
const subjectController = new SubjectController(subjectService);

router
  .route("/")
  .get(asyncHandler(subjectController.getAllSubjects))
  .post(asyncHandler(subjectController.createSubject));

router
  .route("/:slug")
  .get(asyncHandler(subjectController.getSubjectBySlug))
  .put(asyncHandler(subjectController.updateSubject))
  .delete(asyncHandler(subjectController.deleteSubject));

export default router;
