import {
  bulkCreateClassSubjects,
  updateClassSubjectHours,
} from "@/lib/api/class-subject/class-subject";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { BulkCreateSubjectsPayload } from "@/lib/api/class-subject/class-subject.types";
import { AxiosError } from "axios";

interface ApiError {
  message: string;
}

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
    onError: (error: AxiosError<ApiError>) => {
      toast.error(
        error.response?.data?.message ||
          "Fanlarni biriktirishda xatolik yuz berdi"
      );
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
    onError: (error: AxiosError<ApiError>) => {
      const errorMessage =
        error.response?.data?.message || "Failed to update hours";
      toast.error(errorMessage);
    },
  });
};
