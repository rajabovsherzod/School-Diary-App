"use client";

import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Pencil,
  Settings,
  Trash2,
  CalendarDays,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { ClassResponse } from "@/lib/api/class/class.types";
import ClassFormModal from "./class-form-modal";
import { useDeleteClassMutation } from "@/hooks/mutations/use-class-mutations";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ScrollableClassesTableProps {
  data: ClassResponse[] | undefined;
  isLoading: boolean;
  isError: boolean;
}

const ScrollableClassesTable = ({
  data,
  isLoading,
  isError,
}: ScrollableClassesTableProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassResponse | null>(
    null
  );
  const [classToDelete, setClassToDelete] = useState<ClassResponse | null>(
    null
  );

  const { mutate: deleteClass, isPending: isDeleting } =
    useDeleteClassMutation();

  const handleEditClick = (classItem: ClassResponse) => {
    setSelectedClass(classItem);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (classItem: ClassResponse) => {
    setClassToDelete(classItem);
  };

  const handleConfirmDelete = () => {
    if (classToDelete) {
      deleteClass(classToDelete.slug, {
        onSuccess: () => {
          setClassToDelete(null);
        },
      });
    }
  };

  const classes = Array.isArray(data) ? data : [];

  if (isLoading) {
    return <TableSkeleton />;
  }

  if (isError) {
    return (
      <div className="py-16 text-center text-red-500">
        Ma&apos;lumotlarni yuklashda xatolik yuz berdi.
      </div>
    );
  }

  if (!classes || classes.length === 0) {
    return (
      <div className="py-16 text-center">
        <h3 className="text-xl font-semibold">Hozircha sinflar mavjud emas</h3>
        <p className="mt-2 text-muted-foreground">
          Birinchi sinfni qo&apos;shish uchun yuqoridagi tugmani bosing.
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
                  Sinf nomi
                </th>
                <th className="h-10 border-r px-2 text-left align-middle font-medium text-primary-foreground">
                  Sinf rahbari
                </th>
                <th className="h-10 w-[150px] border-r px-2 text-center align-middle font-medium text-primary-foreground">
                  O&apos;quvchilar soni
                </th>
                <th className="h-10 w-[100px] px-2 text-center align-middle font-medium text-primary-foreground">
                  Amallar
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {classes.map((classItem, index) => (
                <tr
                  key={classItem.id}
                  className="border-b transition-colors hover:bg-muted/50"
                >
                  <td className="border-r p-2 text-center align-middle font-medium">
                    {index + 1}
                  </td>
                  <td className="whitespace-nowrap border-r p-2 align-middle">
                    {classItem.name}
                  </td>
                  <td className="whitespace-nowrap border-r p-2 align-middle">
                    {classItem.teacher}
                  </td>
                  <td className="border-r p-2 text-center align-middle">
                    {classItem.studentCount}
                  </td>
                  <td className="p-2 align-middle">
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
                            onClick={() => handleEditClick(classItem)}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            <span>Tahrirlash</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/classes/${classItem.slug}/schedule`}>
                              <CalendarDays className="mr-2 h-4 w-4" />
                              <span>Dars jadvali</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/classes/${classItem.slug}/subjects`}>
                              <Settings className="mr-2 h-4 w-4" />
                              <span>Fanlar</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-500 focus:text-red-500"
                            onClick={() => handleDeleteClick(classItem)}
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
      {isModalOpen && (
        <ClassFormModal
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          initialData={selectedClass}
        />
      )}
      <AlertDialog
        open={!!classToDelete}
        onOpenChange={(isOpen) => !isOpen && setClassToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Haqiqatan ham o&apos;chirmoqchimisiz?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Bu amalni qaytarib bo&apos;lmaydi. Bu{" "}
              <span className="font-bold text-foreground">
                {classToDelete?.name}
              </span>{" "}
              sinfini va u bilan bog&apos;liq barcha ma&apos;lumotlarni (fanlar,
              dars jadvali va h.k.) butunlay o&apos;chirib tashlaydi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Bekor qilish
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {isDeleting ? "O'chirilmoqda..." : "O'chirish"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

const TableSkeleton = () => (
  <div className="w-full rounded-md border">
    <table className="w-full caption-bottom text-sm">
      <thead className="[&_tr]:border-b">
        <tr className="border-b-0 bg-primary transition-colors hover:bg-primary">
          <th className="h-10 w-[50px] border-r px-2 text-center align-middle font-medium text-primary-foreground">
            T/r
          </th>
          <th className="h-10 border-r px-2 text-left align-middle font-medium text-primary-foreground">
            Sinf nomi
          </th>
          <th className="h-10 border-r px-2 text-left align-middle font-medium text-primary-foreground">
            Sinf rahbari
          </th>
          <th className="h-10 w-[150px] border-r px-2 text-center align-middle font-medium text-primary-foreground">
            O&apos;quvchilar soni
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

export default ScrollableClassesTable;
