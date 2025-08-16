"use client";

import { IScheduleEntry } from "@/lib/api/schedule/schedule.types";
import { cn } from "@/lib/utils";
import { useDraggable, useDroppable } from "@dnd-kit/core";

interface EntryCellProps {
  entry: IScheduleEntry;
}

export const EntryCell = ({ entry }: EntryCellProps) => {
  const {
    attributes,
    listeners,
    setNodeRef: setDraggableNodeRef,
    isDragging,
  } = useDraggable({
    id: entry.id.toString(),
    data: { entry, type: "entry" },
  });

  const { setNodeRef: setDroppableNodeRef, isOver } = useDroppable({
    id: entry.id.toString(),
    data: { entry, type: "entry" },
  });

  const setNodeRef = (node: HTMLElement | null) => {
    setDraggableNodeRef(node);
    setDroppableNodeRef(node);
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={cn(
        "h-full w-full flex items-center justify-center p-1 text-center text-sm font-medium cursor-grab select-none",
        "bg-white hover:bg-gray-50 transition-colors duration-150 rounded-sm",
        isDragging && "opacity-0",
        isOver && "ring-2 ring-primary ring-inset"
      )}
    >
      {entry.subject.name}
    </div>
  );
};
