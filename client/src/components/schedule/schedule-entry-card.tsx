"use client";

import { IScheduleEntry } from "@/lib/api/schedule/schedule.types";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface ScheduleEntryCardProps {
  entry: IScheduleEntry | null;
  isOverlay?: boolean;
}

export const ScheduleEntryCard: React.FC<ScheduleEntryCardProps> = ({
  entry,
  isOverlay,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: entry?.id || `empty-${entry?.dayOfWeek}-${entry?.lessonNumber}`,
    data: {
      type: "ScheduleEntry",
      entry,
    },
    disabled: !entry,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (!entry || !entry.subject) {
    // Bo'sh katak uchun ixcham dizayn
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="h-[44px] w-full bg-gray-100/50 border-2 border-dashed border-gray-200 rounded-md"
      ></div>
    );
  }

  const cardClasses = cn(
    "p-2 w-full flex items-center justify-center text-center text-sm rounded-md shadow-sm cursor-grab",
    "bg-white border border-gray-200 hover:border-indigo-400 transition-all duration-200",
    isDragging && "opacity-60 z-50 shadow-md ring-2 ring-indigo-400",
    isOverlay && "shadow-lg scale-105"
  );

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cardClasses}
    >
      <span className="font-medium text-gray-700 select-none truncate">
        {entry.subject.name}
      </span>
    </Card>
  );
};