"use client";

import { useMemo } from "react";
import { useDroppable } from "@dnd-kit/core";
import { IScheduleEntry } from "@/lib/api/schedule/schedule.types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { EntryCell } from "./schedule-entry-cell";
import { Checkbox } from "@/components/ui/checkbox";

interface ScheduleTableProps {
  schedule: IScheduleEntry[];
  slug: string;
  deletionMode: {
    subjectId: number;
    count: number;
    subjectName: string;
  } | null;
  selectedForDeletion: Set<number>;
  onToggleSelection: (entryId: number) => void;
}

const days = [
  "Dushanba",
  "Seshanba",
  "Chorshanba",
  "Payshanba",
  "Juma",
  "Shanba",
];
const dayChunks = [days.slice(0, 3), days.slice(3, 6)];

const EmptyCell = ({ id }: { id: string }) => {
  const { setNodeRef, isOver } = useDroppable({ id, data: { type: "empty" } });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "h-12 w-full rounded-sm transition-colors duration-200",
        isOver ? "bg-indigo-100" : "bg-gray-50/80"
      )}
    />
  );
};

export const ScheduleTable = ({
  schedule,
  deletionMode,
  selectedForDeletion,
  onToggleSelection,
}: ScheduleTableProps) => {
  const entriesByDayAndLesson = useMemo(() => {
    const grouped: Record<string, IScheduleEntry> = {};
    schedule.forEach((entry) => {
      grouped[`${entry.dayOfWeek}-${entry.lessonNumber}`] = entry;
    });
    return grouped;
  }, [schedule]);

  return (
    <div className="space-y-6">
      {dayChunks.map((chunk, chunkIndex) => {
        const dayNumbersInChunk = chunk.map((day) => days.indexOf(day) + 1);

        const maxLessonsForChunk = (() => {
          const entriesInChunk = schedule.filter((entry) =>
            dayNumbersInChunk.includes(entry.dayOfWeek)
          );
          if (entriesInChunk.length === 0) return 1;
          const max = Math.max(...entriesInChunk.map((e) => e.lessonNumber));
          return max + 1;
        })();

        return (
          <div
            key={chunkIndex}
            className="overflow-hidden rounded-lg border shadow-sm"
          >
            <Table className="w-full table-fixed border-collapse bg-white">
              <TableHeader>
                <TableRow className="hover:bg-primary/90">
                  <TableHead className="w-28 border-b border-r bg-primary text-center font-semibold text-primary-foreground">
                    Dars vaqti
                  </TableHead>
                  {chunk.map((day, dayIdx) => (
                    <TableHead
                      key={day}
                      className={cn(
                        "text-center bg-primary text-primary-foreground font-semibold border-b",
                        dayIdx < chunk.length - 1 && "border-r"
                      )}
                    >
                      {day}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: maxLessonsForChunk }).map(
                  (_, lessonIndex) => {
                    const lessonNumber = lessonIndex + 1;
                    return (
                      <TableRow
                        key={lessonNumber}
                        className="border-b last:border-b-0"
                      >
                        <TableCell className="text-center font-medium text-gray-600 border-r">
                          {lessonNumber}-dars
                        </TableCell>
                        {chunk.map((_, dayIndexInChunk) => {
                          const dayIndex = chunkIndex * 3 + dayIndexInChunk;
                          const dayNumber = dayIndex + 1;
                          const cellId = `${dayNumber}-${lessonNumber}`;
                          const entry = entriesByDayAndLesson[cellId];

                          const isDeletionCandidate =
                            deletionMode &&
                            entry &&
                            entry.subject.id === deletionMode.subjectId;
                          const isSelected =
                            entry && selectedForDeletion.has(entry.id);

                          const isSelectionDisabled = !!(
                            !isSelected &&
                            deletionMode &&
                            selectedForDeletion.size >= deletionMode.count
                          );

                          return (
                            <TableCell
                              key={cellId}
                              className={cn(
                                "p-0 h-12",
                                dayIndexInChunk < chunk.length - 1 &&
                                  "border-r",
                                isDeletionCandidate &&
                                  "ring-2 ring-destructive/50 ring-inset",
                                isSelected &&
                                  "ring-destructive bg-destructive/10"
                              )}
                              onClick={() =>
                                isDeletionCandidate &&
                                onToggleSelection(entry.id)
                              }
                            >
                              {entry ? (
                                isDeletionCandidate ? (
                                  <div className="h-full w-full flex items-center justify-start gap-x-2 px-3 cursor-pointer">
                                    <Checkbox
                                      checked={isSelected}
                                      disabled={isSelectionDisabled}
                                      onClick={(e) => e.stopPropagation()}
                                      className="h-5 w-5 rounded-sm data-[state=checked]:bg-destructive data-[state=checked]:text-white data-[state=checked]:border-destructive"
                                    />
                                    <span className="flex-grow text-center text-sm font-medium">
                                      {entry.subject.name}
                                    </span>
                                  </div>
                                ) : (
                                  <EntryCell entry={entry} />
                                )
                              ) : (
                                !deletionMode && <EmptyCell id={cellId} />
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  }
                )}
              </TableBody>
            </Table>
          </div>
        );
      })}
    </div>
  );
};