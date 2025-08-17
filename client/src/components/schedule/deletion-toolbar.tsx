"use client";

import { Button } from "@/components/ui/button";
import { Trash2, X } from "lucide-react";

interface DeletionToolbarProps {
  deletionModeData: {
    subjectId: number;
    count: number;
    subjectName: string;
  };
  selectedCount: number;
  onConfirm: () => void;
  onCancel: () => void;
  isPending: boolean;
}

export const DeletionToolbar = ({
  deletionModeData,
  selectedCount,
  onConfirm,
  onCancel,
  isPending,
}: DeletionToolbarProps) => {
  const { count, subjectName } = deletionModeData;
  const isReadyToDelete = selectedCount === count;

  return (
    <div className="fixed bottom-4 right-4 z-50 p-4 bg-background border rounded-lg shadow-xl w-full max-w-sm animate-in fade-in-90 slide-in-from-bottom-10 duration-300">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-semibold text-lg">O'chirish Rejimi</h4>
          <p className="text-sm text-muted-foreground">
            <span className="font-bold text-destructive">{subjectName}</span> fanidan{" "}
            <span className="font-bold text-destructive">{count}</span> ta darsni tanlang.
          </p>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onCancel}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">
          Tanlangan:{" "}
          <span
            className={`font-bold ${
              isReadyToDelete ? "text-green-600" : "text-primary"
            }`}
          >
            {selectedCount} / {count}
          </span>
        </div>
        <Button
          onClick={onConfirm}
          disabled={!isReadyToDelete || isPending}
          variant="destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          {isPending ? "O'chirilmoqda..." : `O'chirish (${selectedCount})`}
        </Button>
      </div>
    </div>
  );
};