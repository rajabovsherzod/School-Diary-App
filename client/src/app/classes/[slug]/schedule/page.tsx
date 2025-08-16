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
import { ScheduleHeader } from "@/components/schedule/schedule-header";
import { CalendarPlus } from "lucide-react";

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
      <div className="mb-4">
        <ScheduleHeader
          title={`${scheduleData?.class?.name || slug} uchun dars jadvali`}
        >
          {/* Mobil uchun faqat ikonka ko'rsatadigan tugma */}
          <Button
            onClick={() => setConfirmOpen(true)}
            disabled={isGenerating}
            size="icon"
            className="sm:hidden"
          >
            <CalendarPlus className="h-4 w-4" />
          </Button>
          {/* Katta ekranlar uchun matn va ikonka ko'rsatadigan tugma */}
          <Button
            onClick={() => setConfirmOpen(true)}
            disabled={isGenerating}
            className="hidden sm:flex"
          >
            <CalendarPlus className="h-4 w-4 mr-2" />
            {isGenerating ? "Yaratilmoqda..." : "Jadvalni yaratish"}
          </Button>
        </ScheduleHeader>
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
    </div>
  );
};

export default SchedulePage;
