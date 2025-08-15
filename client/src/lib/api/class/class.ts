import $axios from "../axios";
import { ClassApiPayload } from "@/lib/validators/class-validator";
import { ClassResponse, CreateClassResponse, GetClassesResponse } from "./class.types";

export const getClasses = async (): Promise<ClassResponse[]> => {
  const response = await $axios.get<GetClassesResponse>("/classes");
  return response.data.data;
};

export const getClassBySlug = async (slug: string): Promise<CreateClassResponse> => {
  const response = await $axios.get<{ data: CreateClassResponse }>(`/classes/${slug}`);
  return response.data.data;
};

export const createClass = async (payload: ClassApiPayload): Promise<CreateClassResponse> => {
  const response = await $axios.post<{ data: CreateClassResponse }>("/classes",payload);
  return response.data.data;
};
