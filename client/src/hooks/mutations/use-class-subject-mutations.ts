import {
  bulkCreateClassSubjects,
  deleteClassSubject,
  updateClassSubjectHours,
} from "@/lib/api/class-subject/class-subject";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { BulkCreateSubjectsPayload } from "@/lib/api/class-subject/class-subject.types";
import { AxiosError } from "axios";

export const useBulkCreateClassSubjectsMutation = (
  classId: number,
  slug: string
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: BulkCreateSubjectsPayload) =>
      bulkCreateClassSubjects(classId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["classSubjects", slug],
      });
      queryClient.invalidateQueries({
        queryKey: ["subjects", "unassigned", classId],
      });
      toast.success("Fanlar muvaffaqiyatli qo'shildi");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Fanlarni qo'shishda noma'lum xatolik yuz berdi");
      }
    },
  });
};

export const useUpdateClassSubjectHoursMutation = (
  classId: number,
  slug: string
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ subjectId, hours }: { subjectId: number; hours: number }) =>
      updateClassSubjectHours(classId, subjectId, hours),
    onSuccess: () => {
      toast.success("Haftalik soat muvaffaqiyatli yangilandi");
      queryClient.invalidateQueries({
        queryKey: ["classSubjects", slug],
      });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Soatni yangilashda xatolik yuz berdi");
      }
    },
  });
};

export const useDeleteClassSubjectMutation = (slug: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteClassSubject,
    onSuccess: () => {
      toast.success("Fan sinfdan muvaffaqiyatli o'chirildi!");
      queryClient.invalidateQueries({
        queryKey: ["classSubjects", slug],
      });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const errorMessage =
        error.response?.data?.message ||
        "Fanni sinfdan o'chirishda noma'lum xatolik yuz berdi";
      toast.error(errorMessage);
      console.error("Delete class-subject error:", error);
    },
  });
};
