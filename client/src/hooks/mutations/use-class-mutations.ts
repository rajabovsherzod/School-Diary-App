"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createClass as apiCreateClass } from "@/lib/api/class/class";
import { CreateClassResponse } from "@/lib/api/class/class.types";

export const useCreateClassMutation = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: apiCreateClass,
    onSuccess: (data: CreateClassResponse) => {
      toast.success(`"${data.name}" sinfi muvaffaqiyatli yaratildi!`);
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      onSuccessCallback?.();
    },
    onError: (error) => {
      toast.error("Sinf yaratishda xatolik yuz berdi.");
      console.error(error);
    },
  });
};
