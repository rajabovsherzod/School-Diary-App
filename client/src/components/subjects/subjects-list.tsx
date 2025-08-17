"use client";

import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetSubjects } from "@/hooks/queries/use-subject-queries";
import { useDeleteSubjectMutation } from "@/hooks/mutations/use-subject-mutations";
import { UpdateSubjectForm } from "./update-subject";
import { SubjectResponse } from "@/lib/api/subject/subject.types";
import { CustomModal } from "@/components/ui/custom-modal";

const SubjectsList = () => {
  const { data: subjects, isPending, isError } = useGetSubjects();
  const deleteMutation = useDeleteSubjectMutation();
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [subjectForUpdate, setSubjectForUpdate] =
    useState<SubjectResponse | null>(null);
  const [subjectForDelete, setSubjectForDelete] =
    useState<SubjectResponse | null>(null);

  const handleEditClick = (subject: SubjectResponse) => {
    setSubjectForUpdate(subject);
    setUpdateModalOpen(true);
  };

  const handleDeleteClick = (subject: SubjectResponse) => {
    setSubjectForDelete(subject);
  };

  const handleConfirmDelete = () => {
    if (!subjectForDelete) return;
    deleteMutation.mutate(subjectForDelete.slug, {
      onSuccess: () => {
        setSubjectForDelete(null);
      },
    });
  };

  if (isPending) {
    return <TableSkeleton />;
  }

  if (isError) {
    return (
      <div className="py-16 text-center text-red-500">
        Ma&apos;lumotlarni yuklashda xatolik yuz berdi.
      </div>
    );
  }

  if (!subjects || subjects.length === 0) {
    return (
      <div className="py-16 text-center">
        <h3 className="text-xl font-semibold">Hozircha fanlar mavjud emas</h3>
        <p className="mt-2 text-muted-foreground">
          Birinchi fanni qo&apos;shish uchun yuqoridagi tugmani bosing.
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
                <th className="h-10 w-[100px] px-2 text-center align-middle font-medium text-primary-foreground">
                  Amallar
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {subjects.map((subject, index) => (
                <tr
                  key={subject.id}
                  className="border-b transition-colors hover:bg-muted/50"
                >
                  <td className="w-[50px] border-r p-2 text-center align-middle font-medium">
                    {index + 1}
                  </td>
                  <td className="whitespace-nowrap border-r p-2 align-middle">
                    {subject.name}
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
                          <DropdownMenuLabel>Amallar</DropdownMenuLabel>
                          <DropdownMenuItem
                            onSelect={() => handleEditClick(subject)}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            <span>Tahrirlash</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-500 focus:text-red-500"
                            onSelect={() => handleDeleteClick(subject)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>O&apos;chirish</span>
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

      {subjectForUpdate && (
        <CustomModal
          isOpen={isUpdateModalOpen}
          onClose={() => setUpdateModalOpen(false)}
          title="Fan Nomini Tahrirlash"
          description="Fan nomini o'zgartiring. O'zgarishlar saqlangandan so'ng darhol ko'rinadi."
        >
          <UpdateSubjectForm
            subject={subjectForUpdate}
            onClose={() => setUpdateModalOpen(false)}
          />
        </CustomModal>
      )}

      {subjectForDelete && (
        <CustomModal
          isOpen={!!subjectForDelete}
          onClose={() => setSubjectForDelete(null)}
          title="O'chirishni tasdiqlang"
          description={`Rostdan ham "${subjectForDelete.name}" fanini o'chirmoqchimisiz? Bu fanga oid barcha dars jadvallari ham o'chiriladi va bu amalni orqaga qaytarib bo'lmaydi.`}
          onConfirm={handleConfirmDelete}
          confirmText="Ha, o'chirish"
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

export default SubjectsList;
