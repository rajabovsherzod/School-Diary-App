import { Request, Response } from "express";
import ClassSubjectService from "./class-subject.service";
import ApiResponse from "@/utils/api.Response";
import ApiError from "@/utils/api.Error";

class ClassSubjectController {
  constructor(private readonly classSubjectService: ClassSubjectService) {}

  getByClassSlug = async (req: Request, res: Response) => {
    const slug = req.params.slug;
    const classSubjects = await this.classSubjectService.getAllByClassSlug(
      slug
    );
    res
      .status(200)
      .json(
        new ApiResponse(
          classSubjects,
          `Class subjects for class ${slug} fetched successfully.`
        )
      );
  };

  bulkCreate = async (req: Request, res: Response) => {
    try {
      const classId = parseInt(req.params.classId, 10);
      const { subjects } = req.body;

      if (!Array.isArray(subjects) || subjects.length === 0) {
        throw new ApiError(400, "'subjects' field must be a non-empty array");
      }

      const result = await this.classSubjectService.bulkCreateForClass(
        classId,
        req.body.subjects
      );
      res.json({ success: true, data: result });
    } catch (error) {
      throw error;
    }
  };

  reconcileHours = async (req: Request, res: Response) => {
    const classId = parseInt(req.params.classId, 10);
    const subjectId = parseInt(req.params.subjectId, 10);
    const { hours: newHours } = req.body; // Frontend 'hours' nomi bilan yuboradi

    if (typeof newHours !== "number") {
      throw new ApiError(400, "'hours' must be a number");
    }

    const updatedClassSubject = await this.classSubjectService.reconcileHours(
      classId,
      subjectId,
      newHours
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          updatedClassSubject,
          "Subject hours reconciled successfully"
        )
      );
  };

  getUnassignedSubjects = async (req: Request, res: Response) => {
    const classId = parseInt(req.params.classId, 10);
    const subjects =
      await this.classSubjectService.getUnassignedSubjectsForClass(classId);
    res
      .status(200)
      .json(
        new ApiResponse(
          subjects,
          `Unassigned subjects for class ${classId} fetched successfully.`
        )
      );
  };
}

export default ClassSubjectController;
