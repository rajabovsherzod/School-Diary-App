"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useGetScheduleBySlug } from "@/hooks/queries/use-schedule-queries";
import { useGenerateScheduleBySlug } from "@/hooks/mutations/use-schedule-mutations";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ScheduleTable } from "@/components/schedule/schedule-table";
import { ConfirmationDialog } from "@/components/schedule/confirmation-dialog";
import { TApiError } from "@/types/api-error";

// YECHIM: Komponent endi props qabul qilmaydi
const SchedulePage = () => {
  // YECHIM: Parametrlar hook orqali olinadi
  const params = useParams();
  const slug = params.slug as string; // Tipni aniqlashtirish

  const { data: scheduleData, isLoading } = useGetScheduleBySlug(slug);
  // XATO TUZATILDI: `isLoading` o'rniga `isPending` ishlatilmoqda
  const { mutate: generateSchedule, isPending: isGenerating } =
    useGenerateScheduleBySlug();

  const [isConfirmOpen, setConfirmOpen] = useState(false);

  // Funksiya har doim joriy 'slug' bilan ishlaydi
  const handleConfirmGenerate = () => {
    // YECHIM: Mutatsiya endi to'g'ridan-to'g'ri slug bilan chaqiriladi
    // va onSuccess/onError callback'lari mutation hook'ining o'zida
    // markazlashtirilgan holda boshqariladi.
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
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">
          {scheduleData?.class?.name || slug} uchun dars jadvali
        </h1>
        <Button onClick={() => setConfirmOpen(true)} disabled={isGenerating}>
          {isGenerating ? "Yaratilmoqda..." : "Jadvalni yaratish"}
        </Button>
      </div>

      <ConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmGenerate} // To'g'ridan-to'g'ri funksiyani uzatish
        title="Jadvalni yaratishni tasdiqlang"
        description={`Siz haqiqatdan ham "${slug}" sinfi uchun jadvalni qayta yaratmoqchimisiz? Mavjud jadval o'chiriladi.`}
        isLoading={isGenerating}
      />

      {/* XATO TUZATILDI: `schedule` o'rniga `scheduleEntries` ishlatilmoqda */}
      {scheduleData && scheduleData.scheduleEntries.length > 0 ? (
        <ScheduleTable entries={scheduleData.scheduleEntries} slug={slug} />
      ) : (
        <div className="text-center py-10 border-2 border-dashed rounded-lg">
          <p className="text-gray-500">
            Bu sinf uchun hali jadval yaratilmagan.
          </p>
        </div>
      )}
    </div>
  );
};

export default SchedulePage;
