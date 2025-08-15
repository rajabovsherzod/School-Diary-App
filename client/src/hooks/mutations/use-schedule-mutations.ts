import {
  generateScheduleForClassBySlug,
  moveOrSwapEntry,
} from "@/lib/api/schedule/schedule";
import {
  IGenericSuccessMessage,
  IMoveOrSwapPayload,
  IScheduleEntry,
} from "@/lib/api/schedule/schedule.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { TApiError } from "@/types/api-error";

// Keshdagi ma'lumot turini aniqlash uchun
type TScheduleQueryData = IScheduleEntry[] | { entries: IScheduleEntry[] };

export const useGenerateScheduleBySlug = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slug: string) => generateScheduleForClassBySlug(slug),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["schedule", variables],
      });
    },
    onError: (error: TApiError) => {
      toast.error(
        error.response?.data?.message || "Jadval yaratishda xatolik yuz berdi"
      );
    },
  });
};

interface IMoveOrSwapOptimistic extends IMoveOrSwapPayload {
  currentEntries: IScheduleEntry[];
}

export const useMoveOrSwapEntry = () => {
  const queryClient = useQueryClient();

  return useMutation<
    IGenericSuccessMessage,
    TApiError,
    IMoveOrSwapOptimistic,
    { previousSchedule?: TScheduleQueryData; queryKey: string[] }
  >({
    mutationFn: (payload) => {
      const { currentEntries, ...apiPayload } = payload;
      return moveOrSwapEntry(apiPayload);
    },
    onMutate: async (newEntryData) => {
      const queryKey = ["schedule", newEntryData.classSlug];
      await queryClient.cancelQueries({ queryKey });

      const previousSchedule =
        queryClient.getQueryData<TScheduleQueryData>(queryKey);

      queryClient.setQueryData<TScheduleQueryData>(queryKey, (oldData) => {
        const oldSchedule = Array.isArray(oldData) ? oldData : oldData?.entries;

        if (!oldSchedule) {
          return oldData; // Agar keshda ma'lumot bo'lmasa, o'zgartirmaymiz
        }

        const sourceEntry = oldSchedule.find(
          (e) => e.id === newEntryData.source.id
        );
        if (!sourceEntry) return oldData;

        const targetEntry = oldSchedule.find(
          (e) =>
            e.dayOfWeek === newEntryData.targetDay &&
            e.lessonNumber === newEntryData.targetLesson
        );

        const newSchedule = oldSchedule.map((entry) => {
          if (entry.id === sourceEntry.id) {
            return {
              ...entry,
              dayOfWeek: newEntryData.targetDay,
              lessonNumber: newEntryData.targetLesson,
            };
          }
          if (targetEntry && entry.id === targetEntry.id) {
            return {
              ...entry,
              dayOfWeek: sourceEntry.dayOfWeek,
              lessonNumber: sourceEntry.lessonNumber,
            };
          }
          return entry;
        });

        // Keshdagi ma'lumot strukturasini saqlab qolish
        if (Array.isArray(oldData)) {
          return newSchedule;
        } else if (oldData) {
          return { ...oldData, entries: newSchedule };
        }
        return oldData;
      });

      return { previousSchedule, queryKey };
    },
    onError: (err, variables, context) => {
      if (context?.previousSchedule) {
        queryClient.setQueryData(context.queryKey, context.previousSchedule);
      }
      toast.error(
        err.response?.data?.message || "Amalni bajarishda xatolik yuz berdi"
      );
    },
    onSettled: (data, error, variables, context) => {
      if (context?.queryKey) {
        queryClient.invalidateQueries({ queryKey: context.queryKey });
      }
    },
    onSuccess: () => {
      toast.success("Dars jadvali muvaffaqiyatli yangilandi!");
    },
  });
};
