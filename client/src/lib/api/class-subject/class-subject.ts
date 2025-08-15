import { SubjectResponse as Subject } from "../subject/subject.types";
import { ClassSubject, GetClassSubjectsResponse, GetUnassignedSubjectsResponse, BulkCreateSubjectsPayload } from "./class-subject.types";
import $axios from "../axios";

export const getClassSubjects = async (slug: string): Promise<ClassSubject[]> => {
  const response = await $axios.get<GetClassSubjectsResponse>(`/class-subjects/class/slug/${slug}`);
  return response.data.data;
};

export const getUnassignedSubjects = async (classId: number): Promise<Subject[]> => {
  const response = await $axios.get<GetUnassignedSubjectsResponse>(`/class-subjects/class/${classId}/unassigned-subjects`);
  return response.data.data;
};

export const bulkCreateClassSubjects = async (classId: number, payload: BulkCreateSubjectsPayload): Promise<ClassSubject[]> => {
  return $axios.post<ClassSubject[]>(`/class-subjects/class/${classId}`, payload).then((res) => res.data);
};

export const updateClassSubjectHours = async (classId: number, subjectId: number, hours: number): Promise<{ message: string }> => {
  return $axios.put<{ message: string }>(`/class-subjects/class/${classId}/subject/${subjectId}`, { hours: hours }).then((res) => res.data);
};

export const deleteClassSubject = async (classSubjectId: number): Promise<{ message: string }> => {
  return $axios.delete<{ message: string }>(`/class-subjects/${classSubjectId}`).then((res) => res.data);
};
