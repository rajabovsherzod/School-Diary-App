"use client";

import { useGetClassSubjects } from "@/hooks/queries/use-class-subject-queries";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
    return (
      <div className="rounded-md border">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="border-b-0 bg-primary hover:bg-primary">
              <TableHead className="border-r text-center text-primary-foreground">
                T/r
              </TableHead>
              <TableHead className="border-r text-primary-foreground">
                Fan nomi
              </TableHead>
              <TableHead className="border-r text-center text-primary-foreground">
                Haftalik soat
              </TableHead>
              <TableHead className="text-center text-primary-foreground">
                Amallar
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(3)].map((_, i) => (
              <TableRow key={i} className="border-b">
                <TableCell className="border-r text-center">
                  <Skeleton className="h-5 w-8 mx-auto" />
                </TableCell>
                <TableCell className="border-r">
                  <Skeleton className="h-5 w-48" />
                </TableCell>
                <TableCell className="border-r text-center">
                  <Skeleton className="h-5 w-12 mx-auto" />
                </TableCell>
                <TableCell className="text-center">
                  <Skeleton className="h-8 w-8 mx-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
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
    <div className="rounded-md border">
      <Table className="w-full">
        <TableHeader>
          <TableRow className="border-b-0 bg-primary hover:bg-primary">
            <TableHead className="border-r text-center text-primary-foreground">
              T/r
            </TableHead>
            <TableHead className="border-r text-primary-foreground">
              Fan nomi
            </TableHead>
            <TableHead className="border-r text-center text-primary-foreground">
              Haftalik soat
            </TableHead>
            <TableHead className="text-center text-primary-foreground">
              Amallar
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subjects.map((subject: ClassSubject, index: number) => (
            <TableRow key={subject.id} className="border-b">
              <TableCell className="font-medium border-r text-center">
                {index + 1}
              </TableCell>
              <TableCell className="border-r">
                {subject.subject?.name}
              </TableCell>
              <TableCell className="border-r text-center">
                {subject.hoursPerWeek}
              </TableCell>
              <TableCell className="text-center">
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
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
    </div>
  );
};

export default ClassSubjectsList;
