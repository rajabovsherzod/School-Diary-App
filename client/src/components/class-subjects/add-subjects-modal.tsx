"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGetUnassignedSubjects } from "@/hooks/queries/use-class-subject-queries";
import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useBulkCreateClassSubjectsMutation } from "@/hooks/mutations/use-class-subject-mutations";
import { Loader2, PlusCircle } from "lucide-react";
import {
  addSubjectsFormSchema,
  AddSubjectsFormValues,
} from "@/lib/validators/class-subject-validators";

interface AddSubjectsModalProps {
  classId: number;
  className: string;
  slug: string;
  children?: React.ReactNode;
}

export const AddSubjectsModal = ({
  classId,
  className,
  slug,
  children,
}: AddSubjectsModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    data: unassignedSubjects,
    isLoading,
    isError,
  } = useGetUnassignedSubjects(classId);
  const { mutate, isPending } = useBulkCreateClassSubjectsMutation(
    classId,
    slug
  );

  const defaultValues: AddSubjectsFormValues = {
    subjects: [],
  };

  const form = useForm<AddSubjectsFormValues>({
    resolver: zodResolver(addSubjectsFormSchema),
    defaultValues,
  });

  const { fields, replace, update } = useFieldArray({
    control: form.control,
    name: "subjects",
  });

  useEffect(() => {
    if (Array.isArray(unassignedSubjects)) {
      const subjectsData = unassignedSubjects.map((subject) => ({
        subjectId: subject.id,
        subjectName: subject.name ?? "",
        isSelected: false,
        hoursPerWeek: "1",
      }));
      replace(subjectsData);
    }
  }, [unassignedSubjects, replace]);

  const onSubmit = form.handleSubmit((data: AddSubjectsFormValues) => {
    const processSubmit = (data: AddSubjectsFormValues) => {
      const selectedSubjects = data.subjects
        .filter((s) => s.isSelected)
        .map(({ subjectId, hoursPerWeek }) => ({
          subjectId,
          hoursPerWeek: parseInt(hoursPerWeek, 10),
        }));

      mutate(
        { subjects: selectedSubjects },
        {
          onSuccess: () => {
            setIsOpen(false);
            form.reset();
          },
        }
      );
    };

    processSubmit(data);
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{className} sinfiga fan qo&apos;shish</DialogTitle>
          <DialogDescription>
            Qo&apos;shmoqchi bo&apos;lgan fanlaringizni belgilang va haftalik
            soatini kiriting.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <ScrollArea className="h-72 pr-6">
            <div className="space-y-4">
              {isLoading ? (
                <p>Yuklanmoqda...</p>
              ) : isError ? (
                <p className="text-red-500">Xatolik yuz berdi.</p>
              ) : fields.length > 0 ? (
                fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex items-center justify-between rounded-md border p-3"
                  >
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id={`subjects.${index}.isSelected`}
                        checked={field.isSelected}
                        onCheckedChange={(checked) => {
                          update(index, { ...field, isSelected: !!checked });
                        }}
                      />
                      <Label
                        htmlFor={`subjects.${index}.isSelected`}
                        className="font-medium"
                      >
                        {field.subjectName}
                      </Label>
                    </div>
                    <Input
                      type="number"
                      className="w-20 h-8"
                      {...form.register(`subjects.${index}.hoursPerWeek`)}
                    />
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground pt-10">
                  Barcha fanlar bu sinfga biriktirilgan.
                </p>
              )}
            </div>
          </ScrollArea>
          {form.formState.errors.subjects && (
            <p className="text-sm font-medium text-destructive">
              {form.formState.errors.subjects.message}
            </p>
          )}
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Saqlash
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
