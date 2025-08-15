// Fayl: src/components/schedule/schedule-table.tsx
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
  useDroppable,
  useDraggable,
} from "@dnd-kit/core";
import { IScheduleEntry } from "@/lib/api/schedule/schedule.types";
import { useMoveOrSwapEntry } from "@/hooks/mutations/use-schedule-mutations";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface ScheduleTableProps {
  entries: IScheduleEntry[];
  slug: string;
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

// Dars yacheykasi uchun komponent
const EntryCell = ({ entry }: { entry: IScheduleEntry }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: entry.id.toString(),
    data: { entry, type: "entry" },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={cn(
        "h-full w-full flex items-center justify-center p-1 text-center text-sm font-medium cursor-grab select-none",
        "bg-white hover:bg-gray-50 transition-colors duration-150 rounded-sm",
        isDragging && "opacity-0" // Sudralayotganda asl elementni yashirish
      )}
    >
      {entry.subject.name}
    </div>
  );
};

// Bo'sh yacheyka uchun komponent
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

export const ScheduleTable = ({ entries, slug }: ScheduleTableProps) => {
  const { mutate: moveOrSwap } = useMoveOrSwapEntry();
  const [activeEntry, setActiveEntry] = useState<IScheduleEntry | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const entriesByDayAndLesson = useMemo(() => {
    const grouped: Record<string, IScheduleEntry> = {};
    entries.forEach((entry) => {
      grouped[`${entry.dayOfWeek}-${entry.lessonNumber}`] = entry;
    });
    return grouped;
  }, [entries]);

  const handleDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === "entry") {
      const entry = event.active.data.current?.entry as IScheduleEntry;
      if (entry) setActiveEntry(entry);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveEntry(null);
    const { active, over } = event;

    if (over && over.data.current?.type === "empty" && active.id !== over.id) {
      const sourceId = parseInt(active.id as string, 10);
      const [targetDay, targetLesson] = (over.id as string)
        .split("-")
        .map(Number);

      if (!isNaN(sourceId) && !isNaN(targetDay) && !isNaN(targetLesson)) {
        moveOrSwap({
          classSlug: slug,
          source: { type: "scheduled", id: sourceId },
          targetDay,
          targetLesson,
          currentEntries: entries, // Optimistik yangilanish uchun
        });
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-6">
        {dayChunks.map((chunk, chunkIndex) => {
          const dayNumbersInChunk = chunk.map((day) => days.indexOf(day) + 1);

          const maxLessonsForChunk = (() => {
            const entriesInChunk = entries.filter((entry) =>
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
              <Table className="bg-white border-collapse">
                <TableHeader>
                  <TableRow className="hover:bg-primary/90">
                    <TableHead className="w-28 text-center bg-primary text-primary-foreground font-semibold border-b border-r">
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

                            return (
                              <TableCell
                                key={cellId}
                                className={cn(
                                  "p-0 h-12",
                                  dayIndexInChunk < chunk.length - 1 &&
                                    "border-r"
                                )}
                              >
                                {entry ? (
                                  <EntryCell entry={entry} />
                                ) : (
                                  <EmptyCell id={cellId} />
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
