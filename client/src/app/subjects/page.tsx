"use client";

import React from "react";
import SubjectsList from "@/components/subjects/subjects-list";
import AddSubjectModal from "@/components/subjects/add-subject-modal";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import PageHeader from "@/components/layout/page-header";
import { useMediaQuery } from "@/hooks/use-media-query";

const SubjectsPage = () => {
  const isDesktop = useMediaQuery("(min-width: 640px)"); // sm breakpoint

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="Fanlar"
        description="Mavjud fanlarni boshqarish va ko'rish."
      >
        <AddSubjectModal>
          {isDesktop ? (
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Fan qo'shish
            </Button>
          ) : (
            <Button size="icon">
              <PlusCircle className="h-5 w-5" />
              <span className="sr-only">Fan qo'shish</span>
            </Button>
          )}
        </AddSubjectModal>
      </PageHeader>

      <div className="flex-1 overflow-y-auto pt-4">
        <div className="px-4">
          <SubjectsList />
        </div>
      </div>
    </div>
  );
};

export default SubjectsPage;
