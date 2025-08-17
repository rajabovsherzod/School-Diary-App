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
                      entry.subject.id === deletionMode.subjectId;
                    const isSelected =
                      entry && selectedForDeletion.has(entry.id);

                    // YECHIM: Natijani har doim boolean bo'lishini ta'minlash (!!)
                    const isSelectionDisabled = !!(
                      !isSelected &&
                      deletionMode &&
                      selectedForDeletion.size >= deletionMode.count
                    );

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
                            // O'chirish uchun nomzod yacheykalarni ajratib ko'rsatish
                            isDeletionCandidate &&
                              "ring-2 ring-destructive/50 ring-inset",
                            // Tanlangan yacheykalarni boshqacha rangda ko'rsatish
                            isSelected && "ring-destructive bg-destructive/10"
                          )}
                          // Nomzod yacheyka bosilganda tanlash funksiyasini chaqirish
                          onClick={() =>
                            isDeletionCandidate && onToggleSelection(entry.id)
                          }
                        >
                          {entry ? (
                            isDeletionCandidate ? (
                              // DIZAYN YANGILANDI: Checkbox chapda, qizil rangda
                              <div className="h-full w-full flex items-center justify-start gap-x-2 px-3 cursor-pointer">
                                <Checkbox
                                  checked={isSelected}
                                  disabled={isSelectionDisabled}
                                  onClick={(e) => e.stopPropagation()} // Parent'ning onClick'ini bloklash
                                  className="h-5 w-5 rounded-sm data-[state=checked]:bg-destructive data-[state=checked]:text-white data-[state=checked]:border-destructive"
                                />
                                <span className="flex-grow text-center text-sm font-medium">
                                  {entry.subject.name}
                                </span>
                              </div>
                            ) : (
                              // Oddiy yacheyka
                              <EntryCell entry={entry} />
                            )
                          ) : (
                            // O'chirish rejimida bo'sh yacheykalarga dars qo'yishni bloklaymiz
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
