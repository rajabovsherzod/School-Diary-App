"use client";

import ClassesList from "@/components/classes/classes-list";
import AddClassModal from "@/components/classes/add-class-modal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import PageHeader from "@/components/layout/page-header";

const ClassesPage = () => {
  const isDesktop = useMediaQuery("(min-width: 640px)"); // sm breakpoint

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="Sinflar"
        description="Mavjud sinflarni boshqarish va ko'rish."
      >
        <AddClassModal>
          {isDesktop ? (
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Sinf qo&apos;shish
            </Button>
          ) : (
            <Button size="icon">
              <Plus className="h-5 w-5" />
              <span className="sr-only">Sinf qo&apos;shish</span>
            </Button>
          )}
        </AddClassModal>
      </PageHeader>

      <div className="flex-1 overflow-y-auto pt-6">
        <div className="container h-full">
          <div className="px-4">
            <ClassesList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassesPage;
