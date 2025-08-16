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
import { EntryCell } from "./schedule-entry-cell";

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

// Bo'sh yacheyka uchun komponent shu yerda qoladi
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

    // Agar sudrash bekor qilinsa yoki element o'z joyiga qaytarilsa, hech narsa qilmaymiz
    if (!over || active.id === over.id) {
      return;
    }

    const sourceType = active.data.current?.type;
    const overType = over.data.current?.type;

    // Faqat jadvaldagi darsni sudraganda ishlaydi
    if (sourceType !== "entry") {
      return;
    }

    const sourceId = parseInt(active.id as string, 10);
    let targetDay: number;
    let targetLesson: number;

    // Holat 1: Darsni boshqa dars ustiga tashlash (SWAP)
    if (overType === "entry") {
      const targetEntry = over.data.current?.entry as IScheduleEntry;
      targetDay = targetEntry.dayOfWeek;
      targetLesson = targetEntry.lessonNumber;
    }
    // Holat 2: Darsni bo'sh katakka tashlash (MOVE)
    else if (overType === "empty") {
      [targetDay, targetLesson] = (over.id as string).split("-").map(Number);
    }
    // Boshqa holatlar uchun chiqib ketamiz
    else {
      return;
    }

    if (!isNaN(sourceId) && !isNaN(targetDay) && !isNaN(targetLesson)) {
      moveOrSwap({
        classSlug: slug,
        source: { type: "scheduled", id: sourceId },
        targetDay,
        targetLesson,
      });
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
