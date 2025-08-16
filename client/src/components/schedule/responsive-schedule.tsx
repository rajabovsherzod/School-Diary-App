"use client";

import { IScheduleEntry } from "@/lib/api/schedule/schedule.types";
import { useMediaQuery } from "@/hooks/use-media-query";
import { ScheduleTable } from "./schedule-table";
import { ScheduleGrid } from "./schedule-grid";

interface ResponsiveScheduleProps {
  entries: IScheduleEntry[];
  slug: string;
}

export const ResponsiveSchedule = ({
  entries,
  slug,
}: ResponsiveScheduleProps) => {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  if (isDesktop) {
    return <ScheduleTable entries={entries} slug={slug} />;
  }

  return <ScheduleGrid entries={entries} slug={slug} />;
};
