"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useGetScheduleBySlug } from "@/hooks/queries/use-schedule-queries";
import { useGenerateScheduleBySlug } from "@/hooks/mutations/use-schedule-mutations";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ResponsiveSchedule } from "@/components/schedule/responsive-schedule";
import { ConfirmationDialog } from "@/components/schedule/confirmation-dialog";
import { TApiError } from "@/types/api-error";
import { PageHeader } from "@/components/ui/page-header";
import { CalendarPlus } from "lucide-react";

const SchedulePage = () => {
  const params = useParams();
  const slug = params.slug as string;

  const { data: scheduleData, isLoading } = useGetScheduleBySlug(slug);
  const { mutate: generateSchedule, isPending: isGenerating } =
    useGenerateScheduleBySlug();

  const [isConfirmOpen, setConfirmOpen] = useState(false);

  const handleConfirmGenerate = () => {
    generateSchedule(slug, {
      onSuccess: () => {
        toast.success(`'${slug}' sinfi uchun jadval muvaffaqiyatli yaratildi!`);
        setConfirmOpen(false);
      },
      onError: (error: TApiError) => {
        toast.error(
          error.response?.data?.message ||
            `'${slug}' uchun jadval yaratishda xatolik`
        );
        setConfirmOpen(false);
      },
    });
  };

  if (isLoading) {
    return <p className="text-center mt-8">Yuklanmoqda...</p>;
  }

  return (
    <>
      <div className="mb-4">
        <PageHeader
          title={`${scheduleData?.class?.name || slug} uchun dars jadvali`}
        >
          <Button
            onClick={() => setConfirmOpen(true)}
            disabled={isGenerating}
            size="icon"
            className="sm:hidden"
          >
            <CalendarPlus className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => setConfirmOpen(true)}
            disabled={isGenerating}
            className="hidden sm:flex"
          >
            <CalendarPlus className="h-4 w-4 mr-2" />
            {isGenerating ? "Yaratilmoqda..." : "Jadvalni yaratish"}
          </Button>
        </PageHeader>
      </div>

      <ConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmGenerate}
        title="Jadvalni yaratishni tasdiqlang"
        description={`Siz haqiqatdan ham "${slug}" sinfi uchun jadvalni qayta yaratmoqchimisiz? Mavjud jadval o'chiriladi.`}
        isLoading={isGenerating}
      />

      {scheduleData && scheduleData.scheduleEntries.length > 0 ? (
        <ResponsiveSchedule
          entries={scheduleData.scheduleEntries}
          slug={slug}
        />
      ) : (
        <div className="text-center py-10 border-2 border-dashed rounded-lg">
          <p className="text-gray-500">
            Bu sinf uchun hali jadval yaratilmagan.
          </p>
        </div>
      )}
    </>
  );
};

export default SchedulePage;
