import { Router } from "express";
import ClassSubjectController from "./class-subject.controller";
import ClassSubjectService from "./class-subject.service";
import asyncHandler from "@/utils/asyncHandler";

const router = Router();
const classSubjectService = new ClassSubjectService();
const classSubjectController = new ClassSubjectController(classSubjectService);

// Sinfga biriktirilgan fanlarni slug bo'yicha olish
router
  .route("/class/slug/:slug")
  .get(asyncHandler(classSubjectController.getByClassSlug));

// Sinfga ommaviy yangilarini qo'shish (ID bo'yicha)
router
  .route("/class/:classId")
  .post(asyncHandler(classSubjectController.bulkCreate));

// Bitta bog'lanishning soatini tahrirlash va jadval bilan sinxronlash
router
  .route("/class/:classId/subject/:subjectId")
  .put(asyncHandler(classSubjectController.reconcileHours));

// Sinfga biriktirilmagan fanlarni olish uchun
router
  .route("/class/:classId/unassigned-subjects")
  .get(asyncHandler(classSubjectController.getUnassignedSubjects));

// ID bo'yicha o'chirish
router.delete("/:id", asyncHandler(classSubjectController.deleteClassSubject));

export default router;
