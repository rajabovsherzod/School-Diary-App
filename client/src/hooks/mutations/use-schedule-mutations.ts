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

// YECHIM: Keshdagi ma'lumotlar uchun to'g'ri tipni aniqlaymiz
interface TScheduleQueryData {
  scheduleEntries: IScheduleEntry[];
  classSubjects: unknown[];
}

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

export const useMoveOrSwapEntry = () => {
  const queryClient = useQueryClient();

  return useMutation<
    IGenericSuccessMessage,
    TApiError,
    IMoveOrSwapPayload,
    { previousSchedule?: TScheduleQueryData; queryKey: string[] }
  >({
    mutationFn: (payload: IMoveOrSwapPayload) => {
      return moveOrSwapEntry(payload);
    },
    onMutate: async (newEntryData: IMoveOrSwapPayload) => {
      const queryKey = ["schedule", newEntryData.classSlug];
      await queryClient.cancelQueries({ queryKey });

      const previousSchedule =
        queryClient.getQueryData<TScheduleQueryData>(queryKey);

      queryClient.setQueryData<TScheduleQueryData>(queryKey, (oldData) => {
        // Tipni to'g'rilaymiz
        if (!oldData?.scheduleEntries) {
          return oldData;
        }

        const oldEntries = oldData.scheduleEntries;

        const sourceEntry = oldEntries.find(
          (e: IScheduleEntry) => e.id === newEntryData.source.id
        );
        if (!sourceEntry) return oldData;

        const targetEntry = oldEntries.find(
          (e: IScheduleEntry) =>
            e.dayOfWeek === newEntryData.targetDay &&
            e.lessonNumber === newEntryData.targetLesson
        );

        let newEntries;

        if (targetEntry) {
          // ALMASHTIRISH: Fanlarni almashtiramiz
          const sourceSubject = sourceEntry.subject;
          const targetSubject = targetEntry.subject;
          newEntries = oldEntries.map((entry: IScheduleEntry) => {
            if (entry.id === sourceEntry.id) {
              return { ...entry, subject: targetSubject };
            }
            if (entry.id === targetEntry.id) {
              return { ...entry, subject: sourceSubject };
            }
            return entry;
          });
        } else {
          // KO'CHIRISH: Bo'sh katakka o'tkazamiz
          newEntries = oldEntries.map((entry: IScheduleEntry) => {
            if (entry.id === sourceEntry.id) {
              return {
                ...entry,
                dayOfWeek: newEntryData.targetDay,
                lessonNumber: newEntryData.targetLesson,
              };
            }
            return entry;
          });
        }

        return { ...oldData, scheduleEntries: newEntries };
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
