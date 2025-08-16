import React from "react";
import PageHeader from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import ClassesList from "@/components/classes/classes-list";

const SchedulesPage = () => {
  return (
    <>
      <PageHeader
        title="Test Sahifasi"
        description="Bu PageHeader va ClassesList komponentlarini test qilish uchun."
      >
        <Button>Test Tugmasi</Button>
      </PageHeader>

      <div className="mt-8">
        <ClassesList />
      </div>
    </>
  );
};

export default SchedulesPage;
