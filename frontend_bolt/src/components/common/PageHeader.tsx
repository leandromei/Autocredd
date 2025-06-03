import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description: ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({ 
  title, 
  description, 
  children,
  className
}: PageHeaderProps) {
  return (
    <div className={cn(
      "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6",
      className
    )}>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <div className="text-muted-foreground">{description}</div>
      </div>
      {children && (
        <div className="flex items-center gap-2 ml-auto">
          {children}
        </div>
      )}
    </div>
  );
}