import { SubjectResponse as Subject } from "../subject/subject.types";
import {
  ClassSubject,
  GetClassSubjectsResponse,
  GetUnassignedSubjectsResponse,
  BulkCreateSubjectsPayload,
} from "./class-subject.types";
import $axios from "../axios";

export const getClassSubjects = async (slug: string): Promise<ClassSubject[]> => {
  const { data } = await $axios.get<GetClassSubjectsResponse>(`/class-subjects/class/slug/${slug}`);
  return data.data;
};

export const getUnassignedSubjects = async (classId: number): Promise<Subject[]> => {
  const { data } = await $axios.get<GetUnassignedSubjectsResponse>(`/class-subjects/class/${classId}/unassigned-subjects`);
  return data.data;
};

export const bulkCreateClassSubjects = async (classId: number, payload: BulkCreateSubjectsPayload): Promise<ClassSubject[]> => {
  const { data } = await $axios.post<{ data: ClassSubject[] }>(`/class-subjects/class/${classId}`, payload);
  return data.data;
};

export const updateClassSubjectHours = async (classId: number, subjectId: number, hours: number): Promise<{ message: string }> => {
  const { data } = await $axios.put<{ message: string }>(`/class-subjects/class/${classId}/subject/${subjectId}`, { hours });
  return data;
};

export const deleteClassSubject = async (id: number): Promise<{ message: string }> => {
  const { data } = await $axios.delete<{ message: string }>(`/class-subjects/${id}`);
  return data;
};