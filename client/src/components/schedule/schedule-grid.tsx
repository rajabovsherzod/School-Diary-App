import { useMemo } from "react";
import { useDroppable } from "@dnd-kit/core";
import { IScheduleEntry } from "@/lib/api/schedule/schedule.types";
import { EntryCell } from "./schedule-entry-cell";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

interface ScheduleGridProps {
  schedule: IScheduleEntry[];
  slug: string;
  deletionMode: { subjectId: number; count: number } | null;
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

export const ScheduleGrid = ({
  schedule,
  slug,
  deletionMode,
  selectedForDeletion,
  onToggleSelection,
}: ScheduleGridProps) => {
  const entriesByDayAndLesson = useMemo(() => {
    const grouped: Record<string, IScheduleEntry> = {};
    schedule.forEach((entry) => {
      grouped[`${entry.dayOfWeek}-${entry.lessonNumber}`] = entry;
    });
    return grouped;
  }, [schedule]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {days.map((dayName, dayIndex) => {
        const dayNumber = dayIndex + 1;
        const entriesForDay = schedule.filter((e) => e.dayOfWeek === dayNumber);

        const maxLessonsForDay = Math.max(
          7,
          ...entriesForDay.map((e) => e.lessonNumber)
        );

        return (
          <div
            key={dayNumber}
            className="overflow-hidden rounded-lg border shadow-sm"
          >
            <Table className="w-full bg-white">
              <TableHeader>
                <TableRow className="bg-primary/90 hover:bg-primary/90">
                  <TableHead className="w-16 border-r text-center font-semibold text-primary-foreground">
                    №
                  </TableHead>
                  <TableHead className="text-center font-semibold text-primary-foreground">
                    {dayName}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: maxLessonsForDay }).map(
                  (_, lessonIndex) => {
                    const lessonNumber = lessonIndex + 1;
                    const cellId = `${dayNumber}-${lessonNumber}`;
                    const entry = entriesByDayAndLesson[cellId];

                    const isDeletionCandidate =
                      deletionMode &&
                      entry &&
                      entry.subjectId === deletionMode.subjectId;
                    const isSelected =
                      entry && selectedForDeletion.has(entry.id);

                    return (
                      <TableRow
                        key={lessonNumber}
                        className="border-b last:border-b-0"
                      >
                        <TableCell className="w-16 text-center font-medium text-gray-600 border-r">
                          {lessonNumber}
                        </TableCell>
                        <TableCell
                          className={cn(
                            "p-0 h-12",
                            isDeletionCandidate &&
                              "ring-2 ring-destructive/50 ring-inset",
                            isSelected && "ring-destructive bg-destructive/10"
                          )}
                          onClick={() =>
                            isDeletionCandidate && onToggleSelection(entry.id)
                          }
                        >
                          {entry ? (
                            isDeletionCandidate ? (
                              <div className="relative h-full w-full flex items-center justify-center p-1 text-center text-sm font-medium cursor-pointer">
                                <Checkbox
                                  checked={isSelected}
                                  className="absolute top-1 right-1 h-4 w-4"
                                />
                                {entry.subject.name}
                              </div>
                            ) : (
                              <EntryCell entry={entry} />
                            )
                          ) : (
                            !deletionMode && <EmptyCell id={cellId} />
                          )}
                        </TableCell>
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
