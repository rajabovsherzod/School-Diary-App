"use client";

import { IScheduleEntry } from "@/lib/api/schedule/schedule.types";
import { useMediaQuery } from "@/hooks/use-media-query";
import { ScheduleTable } from "./schedule-table";
import { ScheduleGrid } from "./schedule-grid";

interface ResponsiveScheduleProps {
  schedule: IScheduleEntry[];
  deletionMode: { subjectId: number; count: number } | null;
  selectedForDeletion: Set<number>;
  onToggleSelection: (entryId: number) => void;
  slug: string;
}

export const ResponsiveSchedule = ({
  schedule,
  deletionMode,
  selectedForDeletion,
  onToggleSelection,
  slug,
}: ResponsiveScheduleProps) => {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  if (isDesktop) {
    return (
      <ScheduleTable
        schedule={schedule}
        deletionMode={deletionMode}
        selectedForDeletion={selectedForDeletion}
        onToggleSelection={onToggleSelection}
        slug={slug}
      />
    );
  }

  return (
    <ScheduleGrid
      schedule={schedule}
      deletionMode={deletionMode}
      selectedForDeletion={selectedForDeletion}
      onToggleSelection={onToggleSelection}
      slug={slug}
    />
  );
};
