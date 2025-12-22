import { cn } from "@/lib/utils";
import React, { forwardRef } from "react";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {}

export const Section = forwardRef<HTMLElement, SectionProps>(
  ({ className, ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={cn("flex min-h-0 flex-col gap-y-3", className)}
        {...props}
      />
    );
  }
);

Section.displayName = "Section";
