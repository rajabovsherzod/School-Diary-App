"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as api from "@/lib/api/class/class";
import { ClassResponse, UpdateClassParams } from "@/lib/api/class/class.types";
import { getErrorMessage } from "@/lib/utils";

const CLASS_QUERY_KEY = ["classes"];

export const useCreateClassMutation = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.createClass,
    onSuccess: (data: ClassResponse) => {
      toast.success(`"${data.name}" sinfi muvaffaqiyatli yaratildi!`);
      queryClient.invalidateQueries({ queryKey: CLASS_QUERY_KEY });
      onSuccessCallback?.();
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    },
  });
};

export const useUpdateClassMutation = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slug, payload }: UpdateClassParams) =>
      api.updateClass(slug, payload),
    onSuccess: (data: ClassResponse) => {
      toast.success(`"${data.name}" sinfi muvaffaqiyatli yangilandi!`);
      queryClient.invalidateQueries({ queryKey: CLASS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["class", data.slug] });
      onSuccessCallback?.();
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    },
  });
};

export const useDeleteClassMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (slug: string) => api.deleteClass(slug),
    onSuccess: () => {
      toast.success("Sinf muvaffaqiyatli o'chirildi!");
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    },
  });
};
