"use client";

import { IScheduleEntry } from "@/lib/api/schedule/schedule.types";
import { useMediaQuery } from "@/hooks/use-media-query";
import { ScheduleTable } from "./schedule-table";
import { ScheduleGrid } from "./schedule-grid";

interface ResponsiveScheduleProps {
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

export const ResponsiveSchedule = ({
  schedule,
  slug,
  deletionMode,
  selectedForDeletion,
  onToggleSelection,
}: ResponsiveScheduleProps) => {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  if (isDesktop) {
    return (
      <ScheduleTable
        schedule={schedule}
        slug={slug}
        deletionMode={deletionMode}
        selectedForDeletion={selectedForDeletion}
        onToggleSelection={onToggleSelection}
      />
    );
  }

  return (
    <ScheduleGrid
      schedule={schedule}
      slug={slug}
      deletionMode={deletionMode}
      selectedForDeletion={selectedForDeletion}
      onToggleSelection={onToggleSelection}
    />
  );
};
