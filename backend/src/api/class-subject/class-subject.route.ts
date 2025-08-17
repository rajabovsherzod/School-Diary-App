import { Router } from "express";
import ClassSubjectController from "./class-subject.controller";
import ClassSubjectService from "./class-subject.service";
import asyncHandler from "@/utils/asyncHandler";

const router = Router();
const classSubjectService = new ClassSubjectService();
const classSubjectController = new ClassSubjectController(classSubjectService);

router
  .route("/class/slug/:slug")
  .get(asyncHandler(classSubjectController.getByClassSlug));

router
  .route("/class/:classId")
  .post(asyncHandler(classSubjectController.bulkCreate));

router
  .route("/class/:classId/subject/:subjectId")
  .put(asyncHandler(classSubjectController.reconcileHours));

router
  .route("/class/:classId/unassigned-subjects")
  .get(asyncHandler(classSubjectController.getUnassignedSubjects));

router
  .route("/:id")
  .delete(asyncHandler(classSubjectController.deleteClassSubject));

export default router;