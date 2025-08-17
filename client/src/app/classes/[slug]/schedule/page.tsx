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
import { IScheduleEntry, TMoveSource } from "@/lib/api/schedule/schedule.types";
import { DeletionToolbar } from "@/components/schedule/deletion-toolbar";

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
  const { mutate: deleteEntries, isPending: isDeleting } =
    useDeleteScheduleEntries();

  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [isAccordionOpen, setAccordionOpen] = useState(true);
  const [activeItem, setActiveItem] = useState<TActiveItem | null>(null);
  const [deletionMode, setDeletionMode] = useState<{
    subjectId: number;
    count: number;
    subjectName: string;
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
    if (deletionMode) return;

    const { active } = event;
    if (!active.data.current) return;

    const type = active.data.current.type;

    if (type === "entry") {
      setActiveItem({ type: "entry", data: active.data.current.entry });
    } else if (type === "unscheduled") {
      setActiveItem({
        type: "unscheduled",
        data: active.data.current.subject,
      });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveItem(null);
    const { active, over } = event;

    if (!over || !active || !active.data.current) return;

    const [targetDay, targetLesson] = String(over.id).split("-").map(Number);
    if (isNaN(targetDay) || isNaN(targetLesson)) return;

    const sourceType = active.data.current.type as "entry" | "unscheduled";
    if (!sourceType) return;

    let sourceId: number;
    if (sourceType === "unscheduled") {
      sourceId = parseInt(String(active.id).split("-")[0], 10);
    } else {
      sourceId = Number(active.id);
    }

    if (isNaN(sourceId)) return;

    if (sourceType === "entry") {
      const sourceEntry = active.data.current.entry as IScheduleEntry;
      if (
        sourceEntry.dayOfWeek === targetDay &&
        sourceEntry.lessonNumber === targetLesson
      ) {
        return;
      }
    }

    let source: TMoveSource;
    if (sourceType === "unscheduled") {
      const subject = active.data.current.subject;
      if (!subject) return;
      source = { type: "unscheduled", id: sourceId, subject };
    } else {
      source = { type: "scheduled", id: sourceId };
    }

    const overEntry = over.data.current?.entry as IScheduleEntry | undefined;
    const displacedEntryOriginalDay = overEntry?.dayOfWeek;

    const payload = {
      classSlug: slug,
      source,
      targetDay,
      targetLesson,
      displacedEntryOriginalDay,
    };

    moveOrSwap(payload);
  };

  const handleToggleSelection = (entryId: number) => {
    if (!deletionMode) return;

    setSelectedForDeletion((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(entryId)) {
        newSet.delete(entryId);
      } else {
        if (newSet.size < deletionMode.count) {
          newSet.add(entryId);
        }
      }
      return newSet;
    });
  };

  const handleStartDeletion = (
    subjectId: number,
    count: number,
    subjectName: string
  ) => {
    setDeletionMode({ subjectId, count, subjectName });
    setSelectedForDeletion(new Set());
    setAccordionOpen(false);
  };

  const handleCancelDeletion = () => {
    setDeletionMode(null);
    setSelectedForDeletion(new Set());
  };

  const handleConfirmDeletion = () => {
    if (!deletionMode || selectedForDeletion.size === 0) return;

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
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      collisionDetection={pointerWithin}
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
        <DeletionToolbar
          deletionModeData={deletionMode}
          selectedCount={selectedForDeletion.size}
          onConfirm={handleConfirmDeletion}
          onCancel={handleCancelDeletion}
          isPending={isDeleting}
        />
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