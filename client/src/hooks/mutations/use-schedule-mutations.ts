import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { TApiError } from "@/types/api-error";
import {
  generateScheduleForClassBySlug,
  moveOrSwapEntry,
} from "@/lib/api/schedule/schedule";
import {
  IGenericSuccessMessage,
  IMoveOrSwapPayload,
} from "@/lib/api/schedule/schedule.types";

export const useGenerateScheduleBySlug = () => {
  const queryClient = useQueryClient();

  return useMutation<IGenericSuccessMessage, TApiError, string>({
    mutationFn: (slug: string) => generateScheduleForClassBySlug(slug),
    onSuccess: (_, slug) => {
      toast.success(`'${slug}' sinfi uchun jadval muvaffaqiyatli yaratildi!`);
      queryClient.invalidateQueries({ queryKey: ["schedule", slug] });
    },
    onError: (error: TApiError, slug) => {
      toast.error(
        error.response?.data?.message ||
          `'${slug}' uchun jadval yaratishda xatolik`
      );
    },
  });
};

export const useMoveOrSwapEntry = () => {
  const queryClient = useQueryClient();

  return useMutation<IGenericSuccessMessage, TApiError, IMoveOrSwapPayload>({
    mutationFn: (payload: IMoveOrSwapPayload) => moveOrSwapEntry(payload),

    // `onMutate` olib tashlandi. Optimistik yangilanish o'rniga,
    // serverdan javob kelgandan so'ng keshni yangilaymiz.
    // Bu usul xatoliklarning oldini oladi va ishonchliroq.

    onSuccess: () => {
      toast.success("Jadval muvaffaqiyatli yangilandi!");
    },

    onError: (error: TApiError) => {
      console.error("MOVE/SWAP ERROR:", error.response?.data);
      toast.error(
        error.response?.data?.message || "Darsni ko'chirishda xatolik yuz berdi"
      );
    },

    // Muaffaqiyatli yoki xatolik bilan tugasa ham, keshni yangilaymiz.
    // Bu UI har doim backend'dagi ma'lumot bilan bir xil bo'lishini ta'minlaydi.
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["schedule", variables.classSlug],
      });
    },
  });
};
