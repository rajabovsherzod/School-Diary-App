import { Request, Response } from "express";
import SubjectService from "./subject.service";
import ApiResponse from "@/utils/api.Response";

class SubjectController {
    constructor(private readonly subjectService: SubjectService) {
        this.subjectService = subjectService;
    }

    getAllSubjects = async (req: Request, res: Response) => {
        const subjects = await this.subjectService.getAllSubjects();
        res
            .status(200)
            .json(new ApiResponse(subjects, "Subjects fetched successfully"));
    };

    getSubjectBySlug = async (req: Request, res: Response) => {
        const slug = req.params.slug;
        const subject = await this.subjectService.getSubjectBySlug(slug);
        res
            .status(200)
            .json(new ApiResponse(subject, "Subject fetched successfully"));
    };

    createSubject = async (req: Request, res: Response) => {
        const subjectData = req.body;
        const newSubject = await this.subjectService.createSubject(subjectData);
        res
            .status(201)
            .json(new ApiResponse(newSubject, "Subject created successfully"));
    };
}

export default SubjectController;
