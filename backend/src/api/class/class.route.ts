import { Router } from "express";
import ClassController from "./class.controller";
import ClassService from "./class.service";
import asyncHandler from "@/utils/asyncHandler";

const router = Router();
const classService = new ClassService();
const classController = new ClassController(classService);

router
  .route("/")
  .get(asyncHandler(classController.getAllClasses))
  .post(asyncHandler(classController.createClass));

router.route("/:slug").get(asyncHandler(classController.getClassBySlug));

export default router;
