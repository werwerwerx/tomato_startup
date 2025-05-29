import * as React from 'react';
import { cn } from '@/shared/lib/utils';

export interface IContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export function Container ({ children, className, ...props }: IContainerProps) {
  return (
    <div className={cn('w-full flex flex-col gap-4 container mx-auto px-4', className)} {...props}>
      {children}
    </div>
  );
}
