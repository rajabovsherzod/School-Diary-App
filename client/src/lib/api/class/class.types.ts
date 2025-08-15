export interface ClassResponse {
  id: number;
  name: string;
  studentCount: number;
  teacher: string;
  slug: string;
}

export interface GetClassesResponse {
  success: boolean;
  message: string;
  data: ClassResponse[];
}

export interface CreateClassResponse {
  id: number;
  name: string;
  slug: string;
  studentCount: number;
  teacher: string;
}
