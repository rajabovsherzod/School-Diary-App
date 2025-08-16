import React from "react";

interface PageHeaderProps {
  title: string;
  description: string;
  children: React.ReactNode; // Bu tugma (button) uchun
}

const PageHeader = ({ title, description, children }: PageHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground mt-1">{description}</p>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default PageHeader;
