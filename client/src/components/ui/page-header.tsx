import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  children?: React.ReactNode;
  className?: string;
}

export const PageHeader = ({ title, children, className }: PageHeaderProps) => {
  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      <h1 className="text-2xl font-bold truncate" title={title}>
        {title}
      </h1>
      {children && <div>{children}</div>}
    </div>
  );
};
