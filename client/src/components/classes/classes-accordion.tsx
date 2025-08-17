"use client";

import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Pencil, Settings, Trash2, CalendarDays, Users } from "lucide-react";
import Link from "next/link";
import { ClassResponse } from "@/lib/api/class/class.types";
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
import ClassFormModal from "./class-form-modal";

interface ClassesAccordionProps {
  data: ClassResponse[] | undefined;
  isLoading: boolean;
  isError: boolean;
}

const ClassesAccordion = ({
  data,
  isLoading,
  isError,
}: ClassesAccordionProps) => {
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
    return <AccordionSkeleton />;
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
      <Accordion type="single" collapsible className="w-full space-y-2">
        {classes.map((classItem) => (
          <AccordionItem
            key={classItem.id}
            value={classItem.id.toString()}
            className="rounded-md border bg-primary text-primary-foreground"
          >
            <AccordionTrigger className="px-4 py-4 text-lg font-medium hover:no-underline">
              {classItem.name}
            </AccordionTrigger>
            <AccordionContent className="rounded-b-md border-t border-t-primary bg-background p-4 text-foreground">
              <div className="space-y-4">
                <div className="flex items-center text-muted-foreground">
                  <Users className="mr-2 h-4 w-4" />
                  <span className="font-medium text-foreground mr-2">
                    Sinf rahbari:
                  </span>
                  {classItem.teacher}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Users className="mr-2 h-4 w-4" />
                  <span className="font-medium text-foreground mr-2">
                    O&apos;quvchilar soni:
                  </span>
                  {classItem.studentCount}
                </div>
                <div className="mt-4 flex flex-col space-y-2 pt-4 border-t">
                  <Button variant="outline" asChild className="justify-start">
                    <Link href={`/classes/${classItem.slug}/schedule`}>
                      <CalendarDays className="mr-2 h-4 w-4" />
                      <span>Dars jadvali</span>
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="justify-start">
                    <Link href={`/classes/${classItem.slug}/subjects`}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Fanlar</span>
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => handleEditClick(classItem)}
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    <span>Tahrirlash</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => handleDeleteClick(classItem)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>O&apos;chirish</span>
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
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

const AccordionSkeleton = () => (
  <div className="space-y-2">
    {[...Array(3)].map((_, i) => (
      <div
        key={i}
        className="flex h-[60px] items-center justify-between rounded-md border p-4"
      >
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-4 w-4" />
      </div>
    ))}
  </div>
);

export default ClassesAccordion;
