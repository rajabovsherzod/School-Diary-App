import { ClassApiPayload } from "@/lib/validators/class-validator";

export interface ClassResponse {
  id: number;
  name: string;
  studentCount: number;
  teacher: string;
  slug: string;
}

export interface CreateClassResponse {
  id: number;
  name: string;
  studentCount: number;
  teacher: string;
  slug: string;
}

export interface UpdateClassParams {
  slug: string;
  payload: Partial<ClassApiPayload>;
}
