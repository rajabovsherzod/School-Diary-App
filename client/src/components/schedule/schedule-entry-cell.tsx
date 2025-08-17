"use client";

import { IScheduleEntry } from "@/lib/api/schedule/schedule.types";
import { cn } from "@/lib/utils";
import { useDraggable, useDroppable } from "@dnd-kit/core";

interface EntryCellProps {
  entry: IScheduleEntry;
}

// 1. Sudraladigan (Draggable) qism uchun alohida komponent
const DraggableEntry = ({ entry }: EntryCellProps) => {
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
        isDragging && "opacity-50"
      )}
    >
      {entry.subject.name}
    </div>
  );
};

// 2. Tashlanadigan (Droppable) konteyner va asosiy komponent
export const EntryCell = ({ entry }: EntryCellProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `${entry.dayOfWeek}-${entry.lessonNumber}`,
    data: { entry, type: "cell" },
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "h-full w-full rounded-sm",
        isOver && "ring-2 ring-primary ring-inset"
      )}
    >
      <DraggableEntry entry={entry} />
    </div>
  );
};
