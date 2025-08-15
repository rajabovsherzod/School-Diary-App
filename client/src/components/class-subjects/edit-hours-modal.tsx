"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useUpdateClassSubjectHoursMutation } from "@/hooks/mutations/use-class-subject-mutations";
import { Loader2 } from "lucide-react";
import {
  updateHoursSchema,
  UpdateHoursFormValues,
} from "@/lib/validators/class-subject-validators";
import { ClassSubject } from "@/lib/api/class-subject/class-subject.types";

interface EditHoursModalProps {
  classSubject: ClassSubject;
  classId: number;
  slug: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditHoursModal = ({
  classSubject,
  classId,
  slug,
  open,
  onOpenChange,
}: EditHoursModalProps) => {
  const { mutate, isPending } = useUpdateClassSubjectHoursMutation(
    classId,
    slug
  );

  const form = useForm<UpdateHoursFormValues>({
    resolver: zodResolver(updateHoursSchema),
    defaultValues: {
      hoursPerWeek: String(classSubject.hoursPerWeek),
    },
  });

  const processSubmit = (data: UpdateHoursFormValues) => {
    mutate(
      {
        subjectId: classSubject.subjectId,
        hours: parseInt(data.hoursPerWeek, 10),
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        {/* Modal enini kattalashtiramiz */}
        <DialogHeader>
          <DialogTitle>
            &quot;{classSubject.subject.name}&quot; fanining haftalik soatini
            tahrirlash
          </DialogTitle>
          <DialogDescription>
            Fanning haftalik soatini o&apos;zgartiring. O&apos;zgarishlar
            jadvalda aks etadi.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(processSubmit)}
          className="space-y-4 pt-4"
        >
          <div className="grid gap-2">
            <Label htmlFor="hoursPerWeek">Haftalik soat</Label>
            <Input
              id="hoursPerWeek"
              type="number"
              {...form.register("hoursPerWeek")}
            />
            {form.formState.errors.hoursPerWeek && (
              <p className="text-sm font-medium text-destructive pt-1">
                {form.formState.errors.hoursPerWeek.message}
              </p>
            )}
          </div>
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
