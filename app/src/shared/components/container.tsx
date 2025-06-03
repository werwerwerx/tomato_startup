import * as React from 'react';
import { cn } from '@/shared/lib/utils';
import { HTMLAttributes } from 'react';

export interface IContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export function Container ({ children, className, ...props }: IContainerProps) {
  return (
    <div className={cn('w-full flex flex-col gap-10 container mx-auto px-4', className)} {...props}>
      {children}
    </div>
  );
}

export const FlexRowSection = ({ children, className, ...props }: IContainerProps & HTMLAttributes<HTMLElement>) => {
  return (
    <section className={cn('w-full flex flex-row gap-5 items-center justify-center', className)} {...props}>
      {children}
    </section>
  );
};
export const FlexColSection = ({ children, className, ...props }: IContainerProps & HTMLAttributes<HTMLElement>) => {
  return (
    <section className={cn('w-full flex flex-col gap-5 items-center justify-center', className)} {...props}>
      {children}
    </section>
  );
};