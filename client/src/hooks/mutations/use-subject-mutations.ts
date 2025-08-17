import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createSubject as apiCreateSubject,
  updateSubject as apiUpdateSubject,
  deleteSubject as apiDeleteSubject,
} from "@/lib/api/subject/subject";
import { SubjectApiPayload } from "@/lib/validators/subject-validator";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";
import { AxiosError } from "axios";
import { ApiError } from "@/lib/utils";

export const useCreateSubjectMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SubjectApiPayload) => apiCreateSubject(payload),
    onSuccess: (data) => {
      toast.success(`"${data.name}" fani muvaffaqiyatli qo'shildi!`);
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(getErrorMessage(error));
    },
  });
};

export const useUpdateSubjectMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      slug,
      payload,
    }: {
      slug: string;
      payload: SubjectApiPayload;
    }) => apiUpdateSubject({ slug, payload }),
    onSuccess: (data) => {
      toast.success(`"${data.name}" fani muvaffaqiyatli yangilandi!`);
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      queryClient.invalidateQueries({ queryKey: ["subject", data.slug] });
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(getErrorMessage(error));
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
      toast.error(getErrorMessage(error));
    },
  });
};