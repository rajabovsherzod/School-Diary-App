import { Request, Response } from "express";
import ClassService from "./class.service";
import ApiResponse from "@/utils/api.Response";

export class ClassController {
  constructor(private readonly classService: ClassService) {
    this.classService = classService;
  }

  getAllClasses = async (req: Request, res: Response) => {
    const classes = await this.classService.getAllClasses();
    res
      .status(200)
      .json(new ApiResponse(classes, "Classes fetched successfully"));
  };

  getClassBySlug = async (req: Request, res: Response) => {
    const { slug } = req.params;
    const singleClass = await this.classService.getClassBySlug(slug);
    res
      .status(200)
      .json(new ApiResponse(singleClass, "Class fetched successfully"));
  };

  createClass = async (req: Request, res: Response) => {
    const classData = req.body;
    const newClass = await this.classService.createClass(classData);
    res
      .status(201)
      .json(new ApiResponse(newClass, "Class created successfully"));
  };
}

export default ClassController;
