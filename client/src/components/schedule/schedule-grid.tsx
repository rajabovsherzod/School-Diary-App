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
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { IScheduleEntry } from "@/lib/api/schedule/schedule.types";
import { useMoveOrSwapEntry } from "@/hooks/mutations/use-schedule-mutations";
import { ScheduleEntryCard } from "./schedule-entry-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ScheduleGridProps {
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
const maxLessons = 7;

export const ScheduleGrid = ({ entries, slug }: ScheduleGridProps) => {
  const { mutate: moveOrSwap } = useMoveOrSwapEntry();
  const [activeEntry, setActiveEntry] = useState<IScheduleEntry | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const entriesByDay = useMemo(() => {
    const grouped: (IScheduleEntry | null)[][] = Array.from({ length: 6 }, () =>
      Array(maxLessons).fill(null)
    );
    entries.forEach((entry) => {
      if (entry.dayOfWeek >= 1 && entry.dayOfWeek <= 6) {
        grouped[entry.dayOfWeek - 1][entry.lessonNumber - 1] = entry;
      }
    });
    return grouped;
  }, [entries]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const entry = active.data.current?.entry;
    if (entry) {
      setActiveEntry(entry);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveEntry(null);
    const { active, over } = event;

    if (!over || !active.data.current?.entry) return;
    if (active.id === over.id) return;

    const sourceEntry = active.data.current.entry as IScheduleEntry;
    const targetData = over.data.current?.entry;

    let targetDay: number, targetLesson: number;

    if (targetData) {
      targetDay = targetData.dayOfWeek;
      targetLesson = targetData.lessonNumber;
    } else {
      const [dayStr, lessonStr] = (over.id as string).split("-").slice(1);
      targetDay = parseInt(dayStr, 10);
      targetLesson = parseInt(lessonStr, 10);
    }

    moveOrSwap({
      classSlug: slug,
      source: { type: "scheduled", id: sourceEntry.id },
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {days.map((dayName, dayIndex) => {
          const dayNumber = dayIndex + 1;
          const dayEntries = entriesByDay[dayIndex];
          const entryIds = dayEntries.map(
            (e, i) => e?.id || `empty-${dayNumber}-${i + 1}`
          );

          return (
            <Card
              key={dayNumber}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200/80"
            >
              <CardHeader className="bg-primary text-primary-foreground px-3 py-1.5">
                <CardTitle className="text-sm font-semibold tracking-tight">
                  {dayName}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 space-y-2">
                <SortableContext
                  items={entryIds}
                  strategy={verticalListSortingStrategy}
                >
                  {dayEntries.map((entry, lessonIndex) => (
                    <ScheduleEntryCard
                      key={entry?.id || `empty-${dayNumber}-${lessonIndex + 1}`}
                      entry={entry}
                    />
                  ))}
                </SortableContext>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <DragOverlay>
        {activeEntry ? (
          <ScheduleEntryCard entry={activeEntry} isOverlay />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
