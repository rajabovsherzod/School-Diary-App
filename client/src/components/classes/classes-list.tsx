"use client";

import { useGetClasses } from "@/hooks/queries/use-class-queries";
import ScrollableClassesTable from "./scrollable-classes-table";
import ClassesAccordion from "./classes-accordion";
import { useMediaQuery } from "@/hooks/use-media-query";

const ClassesList = () => {
  const { data, isLoading, isError } = useGetClasses();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <ScrollableClassesTable
        data={data}
        isLoading={isLoading}
        isError={isError}
      />
    );
  }

  return (
    <ClassesAccordion data={data} isLoading={isLoading} isError={isError} />
  );
};

export default ClassesList;