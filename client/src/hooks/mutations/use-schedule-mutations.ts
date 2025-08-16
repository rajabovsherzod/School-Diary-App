import {
  generateScheduleForClassBySlug,
  moveOrSwapEntry,
} from "@/lib/api/schedule/schedule";
import {
  IGenericSuccessMessage,
  IMoveOrSwapPayload,
  IScheduleEntry,
  ISubjectDebt,
  TMoveSource,
} from "@/lib/api/schedule/schedule.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { TApiError } from "@/types/api-error";

// Keshdagi ma'lumotlar uchun to'g'ri tip
interface TScheduleQueryData {
  scheduleEntries: IScheduleEntry[];
  subjectDebts: ISubjectDebt[];
  class: { id: number; name: string };
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
        if (
          !oldData?.scheduleEntries ||
          !oldData.subjectDebts ||
          !oldData.class
        ) {
          return oldData;
        }

        let newEntries: IScheduleEntry[] = [...oldData.scheduleEntries];
        let newSubjectDebts: ISubjectDebt[] = [...oldData.subjectDebts];
        const { source, targetDay, targetLesson } = newEntryData;

        if (source.type === "scheduled") {
          const sourceEntry = newEntries.find((e) => e.id === source.id);
          const targetEntry = newEntries.find(
            (e) => e.dayOfWeek === targetDay && e.lessonNumber === targetLesson
          );

          if (!sourceEntry) return oldData;

          if (targetEntry) {
            // SWAP
            const sourceSubject = sourceEntry.subject;
            const targetSubject = targetEntry.subject;
            newEntries = newEntries.map((entry) => {
              if (entry.id === sourceEntry.id)
                return { ...entry, subject: targetSubject };
              if (entry.id === targetEntry.id)
                return { ...entry, subject: sourceSubject };
              return entry;
            });
          } else {
            // MOVE
            newEntries = newEntries.map((entry) => {
              if (entry.id === sourceEntry.id) {
                return {
                  ...entry,
                  dayOfWeek: targetDay,
                  lessonNumber: targetLesson,
                };
              }
              return entry;
            });
          }
        } else if (source.type === "unscheduled") {
          const targetEntry = newEntries.find(
            (e) => e.dayOfWeek === targetDay && e.lessonNumber === targetLesson
          );

          const newLessonEntry: IScheduleEntry = {
            id: Date.now(), // Vaqtinchalik unikal ID
            classId: oldData.class.id,
            subjectId: source.subject.id,
            subject: {
              id: source.subject.id,
              name: source.subject.name,
              slug: "", // Vaqtinchalik qiymat
              createdAt: new Date().toISOString(), // Vaqtinchalik qiymat
            },
            dayOfWeek: targetDay,
            lessonNumber: targetLesson,
          };

          if (targetEntry) {
            // PUSH & ADD
            const occupiedSlots = new Set(
              newEntries.map((e) => `${e.dayOfWeek}-${e.lessonNumber}`)
            );
            let firstEmptySlot: {
              dayOfWeek: number;
              lessonNumber: number;
            } | null = null;
            const maxLessons = Math.max(
              ...newEntries.map((e) => e.lessonNumber),
              7
            );

            for (let day = 1; day <= 6; day++) {
              for (let lesson = 1; lesson <= maxLessons + 2; lesson++) {
                // +2 ehtimoliy to'qnashuvlar uchun
                if (!occupiedSlots.has(`${day}-${lesson}`)) {
                  firstEmptySlot = { dayOfWeek: day, lessonNumber: lesson };
                  break;
                }
              }
              if (firstEmptySlot) break;
            }

            if (firstEmptySlot) {
              newEntries = newEntries.map((entry) =>
                entry.id === targetEntry.id
                  ? {
                      ...entry,
                      dayOfWeek: firstEmptySlot.dayOfWeek,
                      lessonNumber: firstEmptySlot.lessonNumber,
                    }
                  : entry
              );
              newEntries.push(newLessonEntry);
            } else {
              return oldData; // Bo'sh joy topilmasa, o'zgartirishni bekor qilamiz
            }
          } else {
            // ADD to empty slot
            newEntries.push(newLessonEntry);
          }

          // Faqat 'unscheduled' holatida qarzni yangilaymiz
          newSubjectDebts = newSubjectDebts.map((debt) => {
            if (debt.subjectId === source.subject.id) {
              return { ...debt, scheduleDiff: debt.scheduleDiff - 1 };
            }
            return debt;
          });
        }

        return {
          ...oldData,
          scheduleEntries: newEntries,
          subjectDebts: newSubjectDebts,
        };
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
