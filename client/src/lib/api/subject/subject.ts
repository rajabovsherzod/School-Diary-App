import $axios from "../axios";
import { SubjectApiPayload } from "@/lib/validators/subject-validator";
import { SubjectResponse } from "./subject.types";

import { isAxiosError } from "axios";

export const getSubjects = async (): Promise<SubjectResponse[]> => {
  try {
    const { data } = await $axios.get<{ data: SubjectResponse[] }>("/api/subjects");
    return data.data;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      return [];
    }
    throw error;
  }
};

export const createSubject = async (payload: SubjectApiPayload): Promise<SubjectResponse> => {
    const { data } = await $axios.post<{ data: SubjectResponse }>("/api/subjects", payload);
  return data.data;
};

export const updateSubject = async ({ slug, payload }: { slug: string; payload: SubjectApiPayload; }): Promise<SubjectResponse> => {
    const { data } = await $axios.put<{ data: SubjectResponse }>(`/api/subjects/${slug}`, payload);
  return data.data;
};

export const deleteSubject = async (slug: string): Promise<SubjectResponse> => {
    const { data } = await $axios.delete<{ data: SubjectResponse }>(`/api/subjects/${slug}`);
  return data.data;
};