"use client";

import { useGetClassSubjects } from "@/hooks/queries/use-class-subject-queries";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { EditHoursModal } from "./edit-hours-modal";
import { ClassSubject } from "@/lib/api/class-subject/class-subject.types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CustomModal } from "@/components/ui/custom-modal";
import { useDeleteClassSubjectMutation } from "@/hooks/mutations/use-class-subject-mutations";

interface ClassSubjectsListProps {
  slug: string;
}

const ClassSubjectsList = ({ slug }: ClassSubjectsListProps) => {
  const { data, isLoading, isError } = useGetClassSubjects(slug);
  const [editingSubject, setEditingSubject] = useState<ClassSubject | null>(
    null
  );
  const [subjectToDelete, setSubjectToDelete] = useState<ClassSubject | null>(
    null
  );

  const deleteMutation = useDeleteClassSubjectMutation(slug);

  const subjects = Array.isArray(data) ? data : [];

  const handleConfirmDelete = () => {
    if (!subjectToDelete) return;
    deleteMutation.mutate(subjectToDelete.id, {
      onSuccess: () => {
        setSubjectToDelete(null);
      },
    });
  };

  if (isLoading) {
    return <TableSkeleton />;
  }

  if (isError) {
    return (
      <div className="text-center py-16 text-red-500">
        Ma&apos;lumotlarni yuklashda xatolik yuz berdi.
      </div>
    );
  }

  if (!subjects || subjects.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="text-xl font-semibold">
          Hozircha fanlar biriktirilmagan
        </h3>
        <p className="text-muted-foreground mt-2">
          Yangi fan qo&apos;shish uchun yuqoridagi tugmani bosing.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border overflow-y-auto max-h-[calc(100vh-250px)]">
        <div className="relative w-full">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b sticky top-0 bg-primary z-10">
              <tr className="border-b-0 transition-colors hover:bg-primary">
                <th className="h-10 w-[50px] border-r px-2 text-center align-middle font-medium text-primary-foreground">
                  T/r
                </th>
                <th className="h-10 border-r px-2 text-left align-middle font-medium text-primary-foreground">
                  Fan nomi
                </th>
                <th className="h-10 w-[150px] border-r px-2 text-center align-middle font-medium text-primary-foreground">
                  Haftalik soat
                </th>
                <th className="h-10 w-[100px] px-2 text-center align-middle font-medium text-primary-foreground">
                  Amallar
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {subjects.map((subject: ClassSubject, index: number) => (
                <tr
                  key={subject.id}
                  className="border-b transition-colors hover:bg-muted/50"
                >
                  <td className="w-[50px] border-r p-2 text-center align-middle font-medium">
                    {index + 1}
                  </td>
                  <td className="whitespace-nowrap border-r p-2 align-middle">
                    {subject.subject?.name}
                  </td>
                  <td className="w-[150px] border-r p-2 text-center align-middle">
                    {subject.hoursPerWeek}
                  </td>
                  <td className="w-[100px] p-2 align-middle">
                    <div className="flex justify-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Menyuni ochish</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => setEditingSubject(subject)}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Tahrirlash
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-600"
                            onClick={() => setSubjectToDelete(subject)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            O&apos;chirish
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {editingSubject && (
        <EditHoursModal
          open={!!editingSubject}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setEditingSubject(null);
            }
          }}
          classSubject={editingSubject}
          classId={editingSubject.classId}
          slug={slug}
        />
      )}
      {subjectToDelete && (
        <CustomModal
          isOpen={!!subjectToDelete}
          onClose={() => setSubjectToDelete(null)}
          title="Fanni sinfdan o'chirish"
          description={`Haqiqatan ham "${subjectToDelete.subject?.name}" fanini ushbu sinfdan o'chirmoqchimisiz? Bu amalni orqaga qaytarib bo'lmaydi. Bu fanga oid barcha dars jadvallari ham o'chiriladi.`}
          onConfirm={handleConfirmDelete}
          confirmText="O'chirish"
          isPending={deleteMutation.isPending}
        />
      )}
    </>
  );
};

const TableSkeleton = () => (
  <div className="rounded-md border">
    <table className="w-full caption-bottom text-sm">
      <thead className="[&_tr]:border-b">
        <tr className="border-b-0 bg-primary transition-colors hover:bg-primary">
          <th className="h-10 w-[50px] border-r px-2 text-center align-middle font-medium text-primary-foreground">
            T/r
          </th>
          <th className="h-10 border-r px-2 text-left align-middle font-medium text-primary-foreground">
            Fan nomi
          </th>
          <th className="h-10 w-[150px] border-r px-2 text-center align-middle font-medium text-primary-foreground">
            Haftalik soat
          </th>
          <th className="h-10 w-[100px] px-2 text-center align-middle font-medium text-primary-foreground">
            Amallar
          </th>
        </tr>
      </thead>
      <tbody className="[&_tr:last-child]:border-0">
        {[...Array(5)].map((_, i) => (
          <tr key={i} className="border-b transition-colors hover:bg-muted/50">
            <td className="border-r p-2 text-center align-middle">
              <Skeleton className="mx-auto h-5 w-8" />
            </td>
            <td className="border-r p-2 align-middle">
              <Skeleton className="h-5 w-48" />
            </td>
            <td className="border-r p-2 text-center align-middle">
              <Skeleton className="mx-auto h-5 w-12" />
            </td>
            <td className="p-2 align-middle">
              <div className="flex justify-center">
                <Skeleton className="h-8 w-8" />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default ClassSubjectsList;
