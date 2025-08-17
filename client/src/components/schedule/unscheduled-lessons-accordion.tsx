"use client";

import React from "react";
import { ISubjectDebt } from "@/lib/api/schedule/schedule.types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { GripVertical, Trash2 } from "lucide-react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

interface UnscheduledLessonsAccordionProps {
  subjectDebts: ISubjectDebt[];
  isOpen: boolean;
  onValueChange: (value: string) => void;
  onStartDeletion: (subjectId: number, count: number) => void;
}

// Kichik Draggable komponent
interface DraggableItemProps {
  lesson: {
    subjectName: string;
    subjectId: number;
  };
  index: number; // Noyob ID uchun index qo'shamiz
}

const DraggableItem = ({ lesson, index }: DraggableItemProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      // MUHIM O'ZGARISH: ID endi matn emas, to'g'ridan-to'g'ri fan IDsi (number)
      // Bu butun drag-n-drop zanjiri uchun to'g'ri ma'lumotni ta'minlaydi.
      id: lesson.subjectId,
      data: {
        type: "unscheduled",
        // ID'ni noyob qilish uchun index'ni dataga qo'shamiz, lekin asosiy ID o'zgarmaydi
        uniqueId: `${lesson.subjectId}-${index}`,
        subject: { id: lesson.subjectId, name: lesson.subjectName },
      },
    });

  const style = {
    // transform: CSS.Translate.toString(transform), // BU QATOR O'CHIRILADI
    opacity: isDragging ? 0.5 : 1, // Sudralayotganda yarim shaffof qilish
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="flex items-center p-2 border rounded-md cursor-grab bg-background hover:bg-muted/80 transition-colors touch-none"
    >
      <GripVertical className="h-5 w-5 mr-2 text-muted-foreground" />
      <span className="flex-1 text-sm font-medium truncate">
        {lesson.subjectName}
      </span>
    </div>
  );
};

// subjectDebts ma'lumotini tekis ro'yxatga aylantiramiz
const generateUnscheduledList = (debts: ISubjectDebt[]) => {
  const list: { subjectName: string; subjectId: number }[] = [];
  debts.forEach((debt) => {
    if (debt.scheduleDiff > 0) {
      for (let i = 0; i < debt.scheduleDiff; i++) {
        list.push({ subjectName: debt.subjectName, subjectId: debt.subjectId });
      }
    }
  });
  return list;
};

// Manfiy qarzlar ro'yxatini yaratish
const generateOverScheduledList = (debts: ISubjectDebt[]) => {
  return debts.filter((debt) => debt.scheduleDiff < 0);
};

export const UnscheduledLessonsAccordion = ({
  subjectDebts,
  isOpen,
  onValueChange,
  onStartDeletion,
}: UnscheduledLessonsAccordionProps) => {
  const unscheduledLessons = generateUnscheduledList(subjectDebts);
  const overScheduledLessons = generateOverScheduledList(subjectDebts);

  const hasUnscheduled = unscheduledLessons.length > 0;
  const hasOverScheduled = overScheduledLessons.length > 0;

  if (!hasUnscheduled && !hasOverScheduled) {
    return null;
  }

  return (
    <div className="mb-4">
      <Accordion
        type="single"
        collapsible
        className="w-full"
        value={isOpen ? "item-1" : ""}
        onValueChange={onValueChange}
      >
        <AccordionItem value="item-1">
          <AccordionTrigger className="px-4 bg-muted/50 rounded-t-md">
            Jadval balansi
          </AccordionTrigger>
          <AccordionContent className="p-4 border border-t-0 rounded-b-md">
            {hasUnscheduled && (
              <div className="mb-4">
                <h4 className="font-semibold mb-2 text-green-600">
                  Qo&apos;shilishi kerak ({unscheduledLessons.length})
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {unscheduledLessons.map((lesson, index) => (
                    <DraggableItem
                      key={`${lesson.subjectId}-${index}`}
                      lesson={{
                        subjectId: lesson.subjectId,
                        subjectName: lesson.subjectName,
                      }}
                      index={index}
                    />
                  ))}
                </div>
              </div>
            )}
            {hasOverScheduled && (
              <div>
                <h4 className="font-semibold mb-2 text-red-600">
                  O&apos;chirilishi kerak
                </h4>
                <div className="space-y-2">
                  {overScheduledLessons.map((debt) => (
                    <div
                      key={debt.subjectId}
                      className="flex items-center justify-between p-2 border rounded-md bg-background"
                    >
                      <span className="text-sm font-medium">
                        {debt.subjectName}:{" "}
                        <span className="text-red-500 font-bold">
                          {debt.scheduleDiff} soat
                        </span>
                      </span>
                      <button
                        onClick={() =>
                          onStartDeletion(
                            debt.subjectId,
                            Math.abs(debt.scheduleDiff)
                          )
                        }
                        className="p-1.5 hover:bg-destructive/20 rounded-md transition-colors"
                        title={`${debt.subjectName} darsini o'chirishni boshlash`}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
