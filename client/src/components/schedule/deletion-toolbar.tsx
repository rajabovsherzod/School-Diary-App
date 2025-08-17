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
    <div className="my-4 p-4 bg-background border border-primary/40 rounded-lg shadow-lg w-full animate-in fade-in-50">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-semibold text-lg">O&apos;chirish Rejimi</h4>
          <p className="text-sm text-muted-foreground">
            <span className="font-bold text-destructive">{subjectName}</span>{" "}
            fanidan <span className="font-bold text-destructive">{count}</span>{" "}
            ta darsni tanlang.
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onCancel}
        >
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
