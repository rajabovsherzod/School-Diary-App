import React from "react";
import SubjectsList from "@/components/subjects/subjects-list";
import AddSubjectModal from "@/components/subjects/add-subject-modal";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const SubjectsPage = () => {
  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fanlar</h1>
          <p className="text-muted-foreground mt-1">
            Mavjud fanlarni boshqarish va ko&apos;rish.
          </p>
        </div>
        <AddSubjectModal>
          <Button className="mt-4 sm:mt-0">
            <PlusCircle className="mr-2 h-4 w-4" />
            Fan qo&apos;shish
          </Button>
        </AddSubjectModal>
      </div>
      <SubjectsList />
    </div>
  );
};

export default SubjectsPage;
