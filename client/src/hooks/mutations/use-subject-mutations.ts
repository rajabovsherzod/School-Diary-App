"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createSubject as apiCreateSubject } from "@/lib/api/subject/subject";
import { SubjectResponse } from "@/lib/api/subject/subject.types";

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
