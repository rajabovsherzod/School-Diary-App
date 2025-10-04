import $axios from "../axios";
import { ClassApiPayload } from "@/lib/validators/class-validator";
import { ClassResponse, CreateClassResponse } from "./class.types";

import { isAxiosError } from "axios";

export const getClasses = async (): Promise<ClassResponse[]> => {
  try {
    const { data } = await $axios.get<{ data: ClassResponse[] }>("/api/classes");
    return data.data;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      return [];
    }
    throw error;
  }
};

export const getClassBySlug = async (slug: string): Promise<CreateClassResponse> => {
    const { data } = await $axios.get<{ data: CreateClassResponse }>(`/api/classes/${slug}`);
  return data.data;
};

export const createClass = async (payload: ClassApiPayload): Promise<CreateClassResponse> => {
  const { data } = await $axios.post<{ data: CreateClassResponse }>("/api/classes", payload);
  return data.data;
};

export const updateClass = async (slug: string, payload: Partial<ClassApiPayload>): Promise<ClassResponse> => {
    const { data } = await $axios.put<{ data: ClassResponse }>(`/api/classes/${slug}`, payload);
  return data.data;
};

export const deleteClass = async (slug: string): Promise<void> => {
    await $axios.delete(`/api/classes/${slug}`);
};