import React from "react";
import PageHeader from "@/components/layout/page-header";
import ClassSchedulesTabs from "@/components/schedules/ClassSchedulesTabs";

const SchedulesPage = () => {
  return (
    <>
      <PageHeader
        title="Dars Jadvallari"
        description="Bu yerda barcha sinflarning dars jadvallarini ko'rishingiz mumkin."
      >
        <></>
      </PageHeader>

      <div className="mt-8">
        <ClassSchedulesTabs />
      </div>
    </>
  );
};

export default SchedulesPage;
