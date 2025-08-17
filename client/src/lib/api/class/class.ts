import $axios from "../axios";
import { ClassApiPayload } from "@/lib/validators/class-validator";
import { ClassResponse, CreateClassResponse } from "./class.types";

export const getClasses = async (): Promise<ClassResponse[]> => {
  const { data } = await $axios.get<{ data: ClassResponse[] }>("/classes");
  return data.data;
};

export const getClassBySlug = async (slug: string): Promise<CreateClassResponse> => {
  const { data } = await $axios.get<{ data: CreateClassResponse }>(`/classes/${slug}`);
  return data.data;
};

export const createClass = async (payload: ClassApiPayload): Promise<CreateClassResponse> => {
  const { data } = await $axios.post<{ data: CreateClassResponse }>("/classes", payload);
  return data.data;
};

export const updateClass = async (slug: string, payload: Partial<ClassApiPayload>): Promise<ClassResponse> => {
  const { data } = await $axios.put<{ data: ClassResponse }>(`/classes/${slug}`, payload);
  return data.data;
};

export const deleteClass = async (slug: string): Promise<void> => {
  await $axios.delete(`/classes/${slug}`);
};