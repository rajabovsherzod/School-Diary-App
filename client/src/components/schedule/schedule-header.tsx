"use client";

import React from "react";

// Props'larni ancha sodda va universal qilamiz
interface ScheduleHeaderProps {
  title: string; // Sarlavha uchun
  children?: React.ReactNode; // Tugmalar yoki boshqa elementlar uchun
}

export const ScheduleHeader = ({ title, children }: ScheduleHeaderProps) => {
  return (
    // Layoutni soddalashtiramiz: endi u har doim gorizontal.
    <div className="flex items-center justify-between gap-4">
      {/* Sarlavha: mobil uchun shriftni kichikroq qilamiz va uzun bo'lsa qisqartiramiz */}
      <h1 className="text-xl sm:text-2xl font-bold truncate" title={title}>
        {title}
      </h1>
      {/* Tugmalar uchun konteyner */}
      {children && <div>{children}</div>}
    </div>
  );
};
