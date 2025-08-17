import { Request, Response } from "express";
import SubjectService from "./subject.service";

class SubjectController {
  private readonly subjectService: SubjectService;

  constructor(subjectService: SubjectService) {
    this.subjectService = subjectService;
  }

  getAllSubjects = async (req: Request, res: Response) => {
    const subjects = await this.subjectService.getAllSubjects();
    res.status(200).json({ data: subjects });
  };

  getSubjectBySlug = async (req: Request, res: Response) => {
    const subject = await this.subjectService.getSubjectBySlug(req.params.slug);
    res.status(200).json({ data: subject });
  };

  createSubject = async (req: Request, res: Response) => {
    const newSubject = await this.subjectService.createSubject(req.body);
    res.status(201).json({ data: newSubject });
  };

  updateSubject = async (req: Request, res: Response) => {
    const updatedSubject = await this.subjectService.updateSubject(
      req.params.slug,
      req.body
    );
    res.status(200).json({ data: updatedSubject });
  };

  deleteSubject = async (req: Request, res: Response) => {
    const deletedSubject = await this.subjectService.deleteSubject(
      req.params.slug
    );
    res.status(200).json({ data: deletedSubject });
  };
}

export default SubjectController;
