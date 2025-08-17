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
import { CalendarPlus, GripVertical } from "lucide-react";
import { UnscheduledLessonsAccordion } from "@/components/schedule/unscheduled-lessons-accordion";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  pointerWithin,
} from "@dnd-kit/core";
import { IScheduleEntry, ISubject } from "@/lib/api/schedule/schedule.types";

// Sudralayotgan element uchun tip
type TActiveItem =
  | { type: "entry"; data: IScheduleEntry }
  | { type: "unscheduled"; data: { id: number; name: string } };

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
  const [activeItem, setActiveItem] = useState<TActiveItem | null>(null);
  const [deletionMode, setDeletionMode] = useState<{
    subjectId: number;
    count: number;
  } | null>(null);
  const [selectedForDeletion, setSelectedForDeletion] = useState<Set<number>>(
    new Set()
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (event: DragStartEvent) => {
    if (deletionMode) return; // O'chirish rejimida DND ishlamaydi

    const { active } = event;
    const type = active.data.current?.type;

    if (type === "entry") {
      setActiveItem({ type: "entry", data: active.data.current.entry });
    } else if (type === "unscheduled") {
      setActiveItem({ type: "unscheduled", data: active.data.current.subject });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveItem(null);
    const { active, over } = event;

    if (!over || !active) return;

    // 1. Maqsad (target) katak ma'lumotlarini olamiz
    const [targetDay, targetLesson] = String(over.id).split("-").map(Number);
    if (isNaN(targetDay) || isNaN(targetLesson)) return;

    // 2. Manba (source) ma'lumotlarini olamiz
    const sourceType = active.data.current?.type as "entry" | "unscheduled";
    if (!sourceType) return;

    // YECHIM: ID formatini tekshirib, to'g'ri raqamni ajratib olamiz.
    let sourceId: number;
    if (sourceType === "unscheduled") {
      // Akkordeondan kelgan ID "subjectId-index" formatida (masalan, "25-0").
      // Bizga faqat birinchi qismi, ya'ni subjectId kerak.
      sourceId = parseInt(String(active.id).split("-")[0], 10);
    } else {
      // Jadvaldan kelgan ID o'zi to'g'ridan-to'g'ri raqam.
      sourceId = Number(active.id);
    }

    if (isNaN(sourceId)) return; // Agar ID ni ajratib bo'lmasa, chiqib ketamiz.

    // 3. O'z joyiga qaytarilsa, hech narsa qilmaymiz
    if (sourceType === "entry") {
      const sourceEntry = active.data.current?.entry as IScheduleEntry;
      if (
        sourceEntry.dayOfWeek === targetDay &&
        sourceEntry.lessonNumber === targetLesson
      ) {
        return;
      }
    }

    // 4. Backend uchun 'source' qismini tayyorlaymiz
    const sourcePayload = {
      type: sourceType === "entry" ? "scheduled" : "unscheduled",
      id: sourceId,
      ...(sourceType === "unscheduled" && {
        subject: active.data.current?.subject,
      }),
    };

    // 5. Agar biror darsning o'rniga qo'yilsa, o'sha darsning asl kunini olamiz
    const overEntry = over.data.current?.entry as IScheduleEntry | undefined;
    const displacedEntryOriginalDay = overEntry?.dayOfWeek;

    // 6. Yakuniy payloadni yig'amiz
    const payload = {
      classSlug: slug,
      source: sourcePayload,
      targetDay,
      targetLesson,
      displacedEntryOriginalDay, // Agar bo'sh joyga qo'yilsa, bu 'undefined' bo'ladi
    };

    console.log("FRONTEND PAYLOAD:", JSON.stringify(payload, null, 2));
    moveOrSwap(payload);
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
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      collisionDetection={pointerWithin} // Strategiyani o'zgartirdik
    >
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

        <ConfirmationDialog
          isOpen={isConfirmOpen}
          onClose={() => setConfirmOpen(false)}
          onConfirm={handleConfirmGenerate}
          title="Jadvalni yaratishni tasdiqlang"
          description="Bu amal mavjud jadvalni o'chirib, fanlarga ajratilgan soatlar asosida yangisini yaratadi. Davom etishni xohlaysizmi?"
        />
      </div>

      {scheduleData && (
        <UnscheduledLessonsAccordion
          subjectDebts={scheduleData.subjectDebts}
          isOpen={isAccordionOpen}
          onValueChange={(value) => setAccordionOpen(!!value)}
          onStartDeletion={handleStartDeletion}
        />
      )}

      {deletionMode && (
        <div className="flex items-center justify-center gap-4 mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm font-medium text-destructive">
            Tanlanganlar: {selectedForDeletion.size} / {deletionMode.count}
          </p>
          <Button onClick={handleCancelDeletion} variant="outline" size="sm">
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

      <DragOverlay dropAnimation={null}>
        {activeItem ? (
          activeItem.type === "entry" ? (
            <div className="h-full w-full flex items-center justify-center p-1 text-center text-sm font-medium cursor-grabbing rounded-sm bg-white shadow-2xl ring-2 ring-primary">
              {activeItem.data.subject.name}
            </div>
          ) : (
            <div className="flex items-center p-2 border rounded-md cursor-grabbing bg-white shadow-2xl ring-2 ring-primary touch-none">
              <GripVertical className="h-5 w-5 mr-2 text-muted-foreground" />
              <span className="flex-1 text-sm font-medium truncate">
                {activeItem.data.name}
              </span>
            </div>
          )
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default SchedulePage;
