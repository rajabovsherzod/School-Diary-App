import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteScheduleEntries } from "@/lib/api/schedule/schedule";
import {
  IGenericSuccessMessage,
  TScheduleQueryData,
} from "@/lib/api/schedule/schedule.types";
import { TApiError } from "@/types/api-error";

interface IDeletePayload {
  classSlug: string;
  entryIds: number[];
  subjectId: number;
}

export const useDeleteScheduleEntries = () => {
  const queryClient = useQueryClient();

  return useMutation<
    IGenericSuccessMessage,
    TApiError,
    IDeletePayload,
    { previousSchedule?: TScheduleQueryData; queryKey: string[] }
  >({
    mutationFn: deleteScheduleEntries,
    onMutate: async (payload) => {
      const { classSlug, entryIds, subjectId } = payload;
      const queryKey = ["schedule", classSlug];

      await queryClient.cancelQueries({ queryKey });

      const previousSchedule =
        queryClient.getQueryData<TScheduleQueryData>(queryKey);

      queryClient.setQueryData<TScheduleQueryData>(queryKey, (oldData) => {
        if (!oldData) return oldData;

        // Optimistik ravishda darslarni o'chirish
        const updatedEntries = oldData.scheduleEntries.filter(
          (entry) => !entryIds.includes(entry.id)
        );

        // Optimistik ravishda fan qarzini yangilash
        const updatedDebts = oldData.subjectDebts.map((debt) => {
          if (debt.subjectId === subjectId) {
            return {
              ...debt,
              scheduleDiff: debt.scheduleDiff + entryIds.length,
            };
          }
          return debt;
        });

        return {
          ...oldData,
          scheduleEntries: updatedEntries,
          subjectDebts: updatedDebts,
        };
      });

      return { previousSchedule, queryKey };
    },
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (err, newTodo, context) => {
      if (context?.previousSchedule) {
        queryClient.setQueryData(context.queryKey, context.previousSchedule);
      }
      toast.error(err.message || "Darslarni o'chirishda xatolik yuz berdi");
    },
    onSettled: (data, error, variables, context) => {
      if (context?.queryKey) {
        queryClient.invalidateQueries({ queryKey: context.queryKey });
      }
    },
  });
};
