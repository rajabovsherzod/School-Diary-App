"use client";

import { useGetScheduleBySlug } from "@/hooks/queries/use-schedule-queries";
import { Skeleton } from "@/components/ui/skeleton";
import { IScheduleEntry } from "@/lib/api/schedule/schedule.types";

interface ScheduleViewProps {
  classSlug: string;
}

const ScheduleView = ({ classSlug }: ScheduleViewProps) => {
  const { data, isLoading, isError } = useGetScheduleBySlug(classSlug);

  if (isLoading) {
    return <ScheduleSkeleton />;
  }

  if (isError) {
    return (
      <div className="mt-4 rounded-lg border bg-card p-6 text-center text-red-500">
        Jadvalni yuklashda xatolik yuz berdi.
      </div>
    );
  }

  if (!data || data.scheduleEntries.length === 0) {
    return (
      <div className="mt-4 rounded-lg border bg-card p-6 text-center">
        <h3 className="text-xl font-semibold">
          {data?.class.name} uchun dars jadvali hali yaratilmagan.
        </h3>
      </div>
    );
  }

  const days = [
    "Dushanba",
    "Seshanba",
    "Chorshanba",
    "Payshanba",
    "Juma",
    "Shanba",
  ];

  const scheduleMap: { [day: number]: { [lesson: number]: IScheduleEntry } } =
    {};
  let maxLessonsOverall = 0;

  data.scheduleEntries.forEach((entry) => {
    if (!scheduleMap[entry.dayOfWeek]) {
      scheduleMap[entry.dayOfWeek] = {};
    }
    scheduleMap[entry.dayOfWeek][entry.lessonNumber] = entry;
    if (entry.lessonNumber > maxLessonsOverall) {
      maxLessonsOverall = entry.lessonNumber;
    }
  });

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {days.map((dayName, index) => {
        const dayIndex = index + 1;
        const lessonsForDay = scheduleMap[dayIndex] || {};

        return (
          <div
            key={dayIndex}
            className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden flex flex-col"
          >
            <h4 className="p-3 text-lg font-bold text-center bg-primary text-primary-foreground">
              {dayName}
            </h4>
            <div className="divide-y flex-grow">
              {maxLessonsOverall > 0 ? (
                Array.from({ length: maxLessonsOverall }, (_, i) => i + 1).map(
                  (lessonNumber) => {
                    const lesson = lessonsForDay[lessonNumber];
                    return (
                      <div
                        key={lessonNumber}
                        className="grid grid-cols-[40px_1fr] items-center min-h-[52px]"
                      >
                        <span className="flex h-full items-center justify-center font-mono text-lg font-semibold bg-muted/40 border-r">
                          {lessonNumber}
                        </span>
                        {lesson ? (
                          <span className="p-3 truncate">
                            {lesson.subject.name}
                          </span>
                        ) : (
                          <span className="p-3 truncate text-muted-foreground italic">
                            Dars belgilanmagan
                          </span>
                        )}
                      </div>
                    );
                  }
                )
              ) : (
                <div className="flex items-center justify-center h-full p-8">
                  <p className="text-center text-muted-foreground">
                    Darslar yo&apos;q
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const ScheduleSkeleton = () => (
  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="rounded-lg border bg-card overflow-hidden">
        <Skeleton className="h-14 w-full" />
        <div className="p-4 space-y-3">
          {[...Array(5)].map((_, j) => (
            <Skeleton key={j} className="h-8 w-full" />
          ))}
        </div>
      </div>
    ))}
  </div>
);

export default ScheduleView;
