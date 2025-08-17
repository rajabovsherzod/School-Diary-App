"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createSubject as apiCreateSubject,
  updateSubject as apiUpdateSubject,
  deleteSubject as apiDeleteSubject,
} from "@/lib/api/subject/subject";
import { SubjectResponse } from "@/lib/api/subject/subject.types";
import { handleAxiosError } from "@/lib/utils";

export const useCreateSubjectMutation = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: apiCreateSubject,
    onSuccess: (data: SubjectResponse) => {
      toast.success(`"${data.name}" fani muvaffaqiyatli yaratildi!`);
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      onSuccessCallback?.();
    },
    onError: (error) => {
      toast.error("Fan yaratishda xatolik yuz berdi.");
      console.error(error);
    },
  });
};

export const useUpdateSubjectMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: apiUpdateSubject,
    onMutate: async (newSubjectData) => {
      await queryClient.cancelQueries({ queryKey: ["subjects"] });
      const previousSubjects = queryClient.getQueryData<SubjectResponse[]>([
        "subjects",
      ]);
      queryClient.setQueryData<SubjectResponse[]>(["subjects"], (old) =>
        old
          ? old.map((subject) =>
              subject.slug === newSubjectData.slug
                ? { ...subject, name: newSubjectData.payload.name }
                : subject
            )
          : []
      );
      return { previousSubjects };
    },
    onError: (err, newSubjectData, context) => {
      if (context?.previousSubjects) {
        queryClient.setQueryData(["subjects"], context.previousSubjects);
      }
      toast.error("Fan nomini o'zgartirishda xatolik yuz berdi.");
      console.error(err);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
    onSuccess: (data) => {
      toast.success(`Fan nomi "${data.name}" ga muvaffaqiyatli o'zgartirildi!`);
    },
  });
};

export const useDeleteSubjectMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slug: string) => apiDeleteSubject(slug),
    onSuccess: () => {
      toast.success("Fan muvaffaqiyatli o'chirildi!");
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
    onError: (error) => {
      handleAxiosError(error, "Fanni o'chirishda xatolik yuz berdi");
    },
  });
};
