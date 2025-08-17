"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateSubjectMutation } from "@/hooks/mutations/use-subject-mutations";
import {
  subjectFormSchema,
  SubjectFormValues,
} from "@/lib/validators/subject-validator";
import { SubjectResponse } from "@/lib/api/subject/subject.types";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

interface UpdateSubjectFormProps {
  subject: SubjectResponse;
  onClose: () => void;
}

export const UpdateSubjectForm = ({
  subject,
  onClose,
}: UpdateSubjectFormProps) => {
  const form = useForm<SubjectFormValues>({
    resolver: zodResolver(subjectFormSchema),
    defaultValues: {
      name: subject.name || "",
    },
  });

  useEffect(() => {
    form.reset({ name: subject.name });
  }, [subject, form]);

  const { mutate: updateSubject, isPending } = useUpdateSubjectMutation();

  const onSubmit = (values: SubjectFormValues) => {
    updateSubject(
      { slug: subject.slug, payload: values },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Yangi fan nomi</FormLabel>
              <FormControl>
                <Input placeholder="Masalan, Matematika" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={onClose}>
            Bekor qilish
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Saqlash
          </Button>
        </div>
      </form>
    </Form>
  );
};
