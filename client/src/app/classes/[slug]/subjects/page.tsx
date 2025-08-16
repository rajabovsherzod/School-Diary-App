"use client";

import { useParams } from "next/navigation";
import { useGetClassBySlug } from "@/hooks/queries/use-class-queries";
import ClassSubjectsList from "@/components/class-subjects/class-subjects-list";
import { Skeleton } from "@/components/ui/skeleton";
import { AddSubjectsModal } from "@/components/class-subjects/add-subjects-modal";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const AssignSubjectsPage = () => {
  const params = useParams();
  const slug = params.slug as string;

  const { data: classData, isLoading, isError } = useGetClassBySlug(slug);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500">
        Sinf ma&apos;lumotlarini yuklashda xatolik yuz berdi.
      </div>
    );
  }

  if (!classData) {
    return <div className="text-center">Bunday sinf topilmadi.</div>;
  }

  return (
    <>
      <div className="mb-6">
        <PageHeader title={`${classData.name} / Fanlarni sozlash`}>
          <AddSubjectsModal
            classId={classData.id}
            className={classData.name}
            slug={slug}
          >
            <span>
              <Button size="icon" className="sm:hidden">
                <PlusCircle className="h-4 w-4" />
              </Button>
              <Button className="hidden sm:flex">
                <PlusCircle className="mr-2 h-4 w-4" />
                Yangi fanlar qo&apos;shish
              </Button>
            </span>
          </AddSubjectsModal>
        </PageHeader>
      </div>

      <ClassSubjectsList slug={slug} />
    </>
  );
};

export default AssignSubjectsPage;
