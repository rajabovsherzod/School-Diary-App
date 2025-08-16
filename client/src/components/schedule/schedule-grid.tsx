"use client";

import { useState, useMemo } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { IScheduleEntry } from "@/lib/api/schedule/schedule.types";
import { useMoveOrSwapEntry } from "@/hooks/mutations/use-schedule-mutations";
import { EntryCell } from "./schedule-entry-cell";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDroppable } from "@dnd-kit/core";
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
  const { mutate: moveOrSwap } = useMoveOrSwapEntry();
  const [activeEntry, setActiveEntry] = useState<IScheduleEntry | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const entriesByDayAndLesson = useMemo(() => {
    const grouped: Record<string, IScheduleEntry> = {};
    schedule.forEach((entry) => {
      grouped[`${entry.dayOfWeek}-${entry.lessonNumber}`] = entry;
    });
    return grouped;
  }, [schedule]);

  const handleDragStart = (event: DragStartEvent) => {
    if (deletionMode) return; // O'chirish rejimida sudrashni o'chiramiz
    if (event.active.data.current?.type === "entry") {
      setActiveEntry(event.active.data.current.entry as IScheduleEntry);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveEntry(null);
    const { active, over } = event;

    if (!over || !active.data.current?.entry || active.id === over.id) return;

    const sourceId = parseInt(active.id as string, 10);
    const overData = over.data.current;
    let targetDay: number, targetLesson: number;

    if (overData?.type === "entry") {
      targetDay = overData.entry.dayOfWeek;
      targetLesson = overData.entry.lessonNumber;
    } else if (overData?.type === "empty") {
      [targetDay, targetLesson] = (over.id as string).split("-").map(Number);
    } else {
      return;
    }

    moveOrSwap({
      classSlug: slug,
      source: { type: "scheduled", id: sourceId },
      targetDay,
      targetLesson,
    });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {days.map((dayName, dayIndex) => {
          const dayNumber = dayIndex + 1;
          const entriesForDay = schedule.filter(
            (e) => e.dayOfWeek === dayNumber
          );

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
      <DragOverlay dropAnimation={null}>
        {activeEntry ? (
          <div className="h-full w-full flex items-center justify-center p-1 text-center text-sm font-medium cursor-grabbing rounded-sm bg-white shadow-2xl ring-2 ring-primary">
            {activeEntry.subject.name}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
