"use client";

import { useState } from "react";
import { useGetClasses } from "@/hooks/queries/use-class-queries";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import ScheduleView from "@/components/schedules/ScheduleView";

const ClassSchedulesTabs = () => {
  const { data: classes, isLoading, isError } = useGetClasses();
  const [activeTab, setActiveTab] = useState<string | undefined>(
    classes?.[0]?.slug
  );

  if (isLoading) {
    return <TabsSkeleton />;
  }

  if (isError) {
    return (
      <div className="py-16 text-center text-red-500">
        Sinflarni yuklashda xatolik yuz berdi.
      </div>
    );
  }

  if (!classes || classes.length === 0) {
    return (
      <div className="py-16 text-center">
        <h3 className="text-xl font-semibold">Hozircha sinflar mavjud emas</h3>
      </div>
    );
  }

  // Set the first class as active tab if it's not set yet
  if (!activeTab && classes.length > 0) {
    setActiveTab(classes[0].slug);
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 bg-muted/60 p-1 h-auto rounded-lg">
        {classes.map((classItem) => (
          <TabsTrigger
            key={classItem.id}
            value={classItem.slug}
            className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-md py-2"
          >
            {classItem.name}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value={activeTab || ""} className="mt-6">
        {/* Render only the active tab's content for better performance */}
        {activeTab && <ScheduleView classSlug={activeTab} />}
      </TabsContent>
    </Tabs>
  );
};

const TabsSkeleton = () => (
  <div className="space-y-4">
    <div className="flex space-x-2">
      {[...Array(6)].map((_, i) => (
        <Skeleton key={i} className="h-10 w-24 rounded-md" />
      ))}
    </div>
    <Skeleton className="h-96 w-full rounded-md" />
  </div>
);

export default ClassSchedulesTabs;
