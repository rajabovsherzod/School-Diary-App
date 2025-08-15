"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  classFormSchema,
  ClassFormValues,
} from "@/lib/validators/class-validator";
import { useCreateClassMutation } from "@/hooks/mutations/use-class-mutations";

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

interface AddClassModalProps {
  children: React.ReactNode;
}

const AddClassModal: React.FC<AddClassModalProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<ClassFormValues>({
    resolver: zodResolver(classFormSchema),
    defaultValues: {
      name: "",
      studentCount: "",
      teacher: "",
    },
  });

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      form.reset();
    }
  };

  const { mutate: createClass, isPending } = useCreateClassMutation(() => {
    handleOpenChange(false);
  });

  const onSubmit = (values: ClassFormValues) => {
    createClass({
      name: values.name,
      teacher: values.teacher,
      studentCount: parseInt(values.studentCount, 10),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Yangi sinf qo&apos;shish</DialogTitle>
          <DialogDescription>
            Yangi sinf uchun ma&apos;lumotlarni to&apos;ldiring.
          </DialogDescription>
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
                onClick={() => setIsOpen(false)}
                disabled={isPending}
              >
                Bekor qilish
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saqlanmoqda..." : "Saqlash"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddClassModal;
