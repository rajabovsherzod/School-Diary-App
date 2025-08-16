"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useGetScheduleBySlug } from "@/hooks/queries/use-schedule-queries";
import {
  useGenerateScheduleBySlug,
  useMoveOrSwapEntry,
} from "@/hooks/mutations/use-schedule-mutations";
import { useDeleteScheduleEntries } from "@/hooks/mutations/use-delete-schedule-entries";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ResponsiveSchedule } from "@/components/schedule/responsive-schedule";
import { ConfirmationDialog } from "@/components/schedule/confirmation-dialog";
import { TApiError } from "@/types/api-error";
import { PageHeader } from "@/components/ui/page-header";
import { CalendarPlus } from "lucide-react";
import { UnscheduledLessonsAccordion } from "@/components/schedule/unscheduled-lessons-accordion";
import { DndContext, DragEndEvent, DragStartEvent } from "@dnd-kit/core";

const SchedulePage = () => {
  const params = useParams();
  const slug = params.slug as string;

  const { data: scheduleData, isLoading } = useGetScheduleBySlug(slug);
  const { mutate: generateSchedule, isPending: isGenerating } =
    useGenerateScheduleBySlug();
  const { mutate: moveOrSwap } = useMoveOrSwapEntry();
  const { mutate: deleteEntries } = useDeleteScheduleEntries();

  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [isAccordionOpen, setAccordionOpen] = useState(true);
  const [deletionMode, setDeletionMode] = useState<{
    subjectId: number;
    count: number;
  } | null>(null);
  const [selectedForDeletion, setSelectedForDeletion] = useState<Set<number>>(
    new Set()
  );

  const handleDragStart = (event: DragStartEvent) => {
    // Sudrash boshlanganda akkordeonni yopamiz
    setAccordionOpen(false);
    console.log("Drag started:", event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const overId = event.over?.id;
    const activeId = event.active.id;
    const activeData = event.active.data.current;

    if (!overId || !activeData) return;

    // Faqat akkordeondan jadvalga tashlansa ishlaydi
    if (
      activeData.type === "unscheduled" &&
      String(overId).startsWith("cell-")
    ) {
      const [, day, lesson] = String(overId).split("-");
      moveOrSwap({
        classSlug: slug,
        source: {
          type: "unscheduled",
          id: activeData.subject.id,
          subject: activeData.subject,
        },
        targetDay: parseInt(day, 10),
        targetLesson: parseInt(lesson, 10),
      });
    }
    // Kelajakda jadval ichidagi almashtirish uchun 'scheduled' tipi ham shu yerda boshqariladi
  };

  const handleStartDeletion = (subjectId: number, count: number) => {
    setDeletionMode({ subjectId, count });
    setSelectedForDeletion(new Set()); // Oldingi tanlovlarni tozalash
    toast.info(`Iltimos, jadvaldan ${count} ta darsni tanlab o'chiring.`);
  };

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

  const handleDeleteEntries = () => {
    if (!deletionMode || selectedForDeletion.size !== deletionMode.count)
      return;

    deleteEntries(
      {
        classSlug: slug,
        entryIds: Array.from(selectedForDeletion),
        subjectId: deletionMode.subjectId,
      },
      {
        onSuccess: () => {
          setDeletionMode(null);
          setSelectedForDeletion(new Set());
        },
      }
    );
  };

  const handleCancelDeletion = () => {
    setDeletionMode(null);
    setSelectedForDeletion(new Set());
  };

  const handleToggleSelection = (entryId: number) => {
    if (selectedForDeletion.has(entryId)) {
      selectedForDeletion.delete(entryId);
    } else {
      selectedForDeletion.add(entryId);
    }
    setSelectedForDeletion(new Set(selectedForDeletion));
  };

  if (isLoading) {
    return <p className="text-center mt-8">Yuklanmoqda...</p>;
  }

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
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

      {scheduleData && scheduleData.subjectDebts && (
        <UnscheduledLessonsAccordion
          subjectDebts={scheduleData.subjectDebts}
          isOpen={isAccordionOpen}
          onValueChange={(value) => setAccordionOpen(value === "item-1")}
          onStartDeletion={handleStartDeletion}
        />
      )}

      {deletionMode && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-lg bg-background p-4 shadow-lg border">
          <p className="text-sm font-medium">
            Tanlangan: {selectedForDeletion.size} / {deletionMode.count}
          </p>
          <Button variant="outline" size="sm" onClick={handleCancelDeletion}>
            Bekor qilish
          </Button>
          <Button
            variant="destructive"
            size="sm"
            disabled={selectedForDeletion.size !== deletionMode.count}
            onClick={handleDeleteEntries}
          >
            O&apos;chirish
          </Button>
        </div>
      )}

      {scheduleData && scheduleData.scheduleEntries.length > 0 ? (
        <ResponsiveSchedule
          schedule={scheduleData.scheduleEntries}
          slug={slug}
          deletionMode={deletionMode}
          selectedForDeletion={selectedForDeletion}
          onToggleSelection={handleToggleSelection}
        />
      ) : (
        <div className="text-center py-10 border-2 border-dashed rounded-lg">
          <p className="text-gray-500">
            Bu sinf uchun hali jadval yaratilmagan.
          </p>
        </div>
      )}
    </DndContext>
  );
};

export default SchedulePage;
