"use client";

import SubjectsList from "@/components/subjects/subjects-list";
import { AddSubjectModal } from "@/components/subjects/add-subject-modal";
import PageHeader from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const SubjectsPage = () => {
  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="Fanlar"
        description="Mavjud fanlarni boshqaring yoki yangi fan qo'shing."
      >
        <AddSubjectModal>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Fan qo&apos;shish
          </Button>
        </AddSubjectModal>
      </PageHeader>
      <div className="flex-1 overflow-y-auto pt-6">
        <SubjectsList />
      </div>
    </div>
  );
};

export default SubjectsPage;
