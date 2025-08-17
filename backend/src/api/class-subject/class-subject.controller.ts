import { Request, Response } from "express";
import ClassSubjectService from "./class-subject.service";
import ApiResponse from "@/utils/api.Response";
import ApiError from "@/utils/api.Error";

class ClassSubjectController {
  constructor(private readonly classSubjectService: ClassSubjectService) {}

  getByClassSlug = async (req: Request, res: Response) => {
    const { slug } = req.params;
    const classSubjects = await this.classSubjectService.getAllByClassSlug(slug);
    res
      .status(200)
      .json(
        new ApiResponse(
          classSubjects,
          `'${slug}' sinfi uchun fanlar muvaffaqiyatli olindi.`
        )
      );
  };

  bulkCreate = async (req: Request, res: Response) => {
    const { classId } = req.params;
    const { subjects } = req.body;

    if (!Array.isArray(subjects) || subjects.length === 0) {
      throw new ApiError(400, "'subjects' maydoni bo'sh bo'lmagan massiv bo'lishi kerak");
    }

    const result = await this.classSubjectService.bulkCreateForClass(
      parseInt(classId, 10),
      subjects
    );
    res
      .status(201)
      .json(new ApiResponse(result, "Fanlar sinfga muvaffaqiyatli biriktirildi."));
  };

  reconcileHours = async (req: Request, res: Response) => {
    const { classId, subjectId } = req.params;
    const { hours } = req.body;

    if (typeof hours !== "number") {
      throw new ApiError(400, "'hours' maydoni raqam bo'lishi kerak");
    }

    const updatedClassSubject = await this.classSubjectService.reconcileHours(
      parseInt(classId, 10),
      parseInt(subjectId, 10),
      hours
    );
    res
      .status(200)
      .json(
        new ApiResponse(
          updatedClassSubject,
          "Fanning soatlari muvaffaqiyatli yangilandi."
        )
      );
  };

  getUnassignedSubjects = async (req: Request, res: Response) => {
    const { classId } = req.params;
    const subjects = await this.classSubjectService.getUnassignedSubjectsForClass(parseInt(classId, 10));
    res
      .status(200)
      .json(
        new ApiResponse(
          subjects,
          "Sinfga biriktirilmagan fanlar ro'yxati olindi."
        )
      );
  };

  deleteClassSubject = async (req: Request, res: Response) => {
    const { id } = req.params;
    const deletedEntry = await this.classSubjectService.deleteClassSubject(parseInt(id, 10));
    res
      .status(200)
      .json(
        new ApiResponse(deletedEntry, "Sinfdan fan muvaffaqiyatli o'chirildi.")
      );
  };
}

export default ClassSubjectController;