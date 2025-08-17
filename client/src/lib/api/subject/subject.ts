import $axios from "../axios";
import { SubjectApiPayload } from "@/lib/validators/subject-validator";
import { SubjectResponse } from "./subject.types";

export const getSubjects = async (): Promise<SubjectResponse[]> => {
  const response = await $axios.get<{ data: SubjectResponse[] }>("/subjects");
  return response.data.data;
};

export const createSubject = async (
  payload: SubjectApiPayload
): Promise<SubjectResponse> => {
  const response = await $axios.post<{ data: SubjectResponse }>(
    "/subjects",
    payload
  );
  return response.data.data;
};

export const updateSubject = async ({
  slug,
  payload,
}: {
  slug: string;
  payload: SubjectApiPayload;
}): Promise<SubjectResponse> => {
  const response = await $axios.put<{ data: SubjectResponse }>(
    `/subjects/${slug}`,
    payload
  );
  return response.data.data;
};

export const deleteSubject = async (slug: string): Promise<SubjectResponse> => {
  const response = await $axios.delete<{ data: SubjectResponse }>(
    `/subjects/${slug}`
  );
  return response.data.data;
};
