import { SubjectResponse as Subject } from "../subject/subject.types";
import {
  ClassSubject,
  GetClassSubjectsResponse,
  GetUnassignedSubjectsResponse,
  BulkCreateSubjectsPayload,
} from "./class-subject.types";
import $axios from "../axios";

import { isAxiosError } from "axios";

export const getClassSubjects = async (slug: string): Promise<ClassSubject[]> => {
  try {
    const { data } = await $axios.get<GetClassSubjectsResponse>(`/api/class-subjects/class/slug/${slug}`);
    return data.data;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      return [];
    }
    throw error;
  }
};

export const getUnassignedSubjects = async (classId: number): Promise<Subject[]> => {
  try {
    const { data } = await $axios.get<GetUnassignedSubjectsResponse>(`/api/class-subjects/class/${classId}/unassigned-subjects`);
    return data.data;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      return [];
    }
    throw error;
  }
};

export const bulkCreateClassSubjects = async (classId: number, payload: BulkCreateSubjectsPayload): Promise<ClassSubject[]> => {
    const { data } = await $axios.post<{ data: ClassSubject[] }>(`/api/class-subjects/class/${classId}`, payload);
  return data.data;
};

export const updateClassSubjectHours = async (classId: number, subjectId: number, hours: number): Promise<{ message: string }> => {
    const { data } = await $axios.put<{ message: string }>(`/api/class-subjects/class/${classId}/subject/${subjectId}`, { hours });
  return data;
};

export const deleteClassSubject = async (id: number): Promise<{ message: string }> => {
    const { data } = await $axios.delete<{ message: string }>(`/api/class-subjects/${id}`);
  return data;
};