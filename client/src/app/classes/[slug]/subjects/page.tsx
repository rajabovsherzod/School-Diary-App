"use client";

import { useParams } from "next/navigation";
import { useGetClassBySlug } from "@/hooks/queries/use-class-queries";
import ClassSubjectsList from "@/components/class-subjects/class-subjects-list";
import { Skeleton } from "@/components/ui/skeleton";
import { AddSubjectsModal } from "@/components/class-subjects/add-subjects-modal";

const AssignSubjectsPage = () => {
  const params = useParams();
  const slug = params.slug as string;

  const { data: classData, isLoading, isError } = useGetClassBySlug(slug);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">
            <Skeleton className="h-9 w-64" />
          </h1>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto py-8 text-center text-red-500">
        Sinf ma&apos;lumotlarini yuklashda xatolik yuz berdi.
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="container mx-auto py-8 text-center">
        Bunday sinf topilmadi.
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          <span className="text-muted-foreground">{classData.name}</span> /
          Fanlarni sozlash
        </h1>
        <div>
          <AddSubjectsModal
            classId={classData.id}
            className={classData.name}
            slug={slug}
          />
        </div>
      </div>

      <ClassSubjectsList slug={slug} />
    </div>
  );
};

export default AssignSubjectsPage;
