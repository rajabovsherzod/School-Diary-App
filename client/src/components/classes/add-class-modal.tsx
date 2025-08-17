"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  classFormSchema,
  ClassFormValues,
} from "@/lib/validators/class-validator";
import {
  useCreateClassMutation,
  useUpdateClassMutation,
} from "@/hooks/mutations/use-class-mutations";
import { ClassResponse } from "@/lib/api/class/class.types";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface ClassFormModalProps {
  children: React.ReactNode;
  initialData?: ClassResponse | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const ClassFormModal: React.FC<ClassFormModalProps> = ({
  children,
  initialData,
  isOpen,
  onOpenChange,
}) => {
  const isEditMode = !!initialData;

  const form = useForm<ClassFormValues>({
    resolver: zodResolver(classFormSchema),
    defaultValues: {
      name: "",
      studentCount: "",
      teacher: "",
    },
  });

  useEffect(() => {
    if (isEditMode) {
      form.reset({
        name: initialData.name,
        teacher: initialData.teacher,
        studentCount: initialData.studentCount.toString(),
      });
    } else {
      form.reset({
        name: "",
        studentCount: "",
        teacher: "",
      });
    }
  }, [initialData, form, isEditMode, isOpen]);

  const handleModalClose = () => onOpenChange(false);

  const { mutate: createClass, isPending: isCreating } =
    useCreateClassMutation(handleModalClose);
  const { mutate: updateClass, isPending: isUpdating } =
    useUpdateClassMutation(handleModalClose);

  const isPending = isCreating || isUpdating;

  const onSubmit = (values: ClassFormValues) => {
    const payload = {
      name: values.name,
      teacher: values.teacher,
      studentCount: parseInt(values.studentCount, 10),
    };
    if (isEditMode) {
      updateClass({ slug: initialData.slug, payload });
    } else {
      createClass(payload);
    }
  };

  const title = isEditMode ? "Sinfni tahrirlash" : "Yangi sinf qo'shish";
  const description = isEditMode
    ? "Sinf ma'lumotlarini o'zgartirishingiz mumkin."
    : "Yangi sinf uchun ma'lumotlarni to'ldiring.";
  const buttonText = isEditMode ? "Saqlash" : "Qo'shish";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 pt-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sinf nomi</FormLabel>
                    <FormControl>
                      <Input placeholder="Masalan, 9-A" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="studentCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>O&apos;quvchilar soni</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Masalan, 32"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="teacher"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sinf rahbari</FormLabel>
                  <FormControl>
                    <Input placeholder="Masalan, Aliyeva Nodira" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={handleModalClose}
                disabled={isPending}
              >
                Bekor qilish
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Yuklanmoqda..." : buttonText}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ClassFormModal;
