import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  id: string;
  label: string;
  title: ReactNode;
  subtitle?: string;
  className?: string;
};

export const SectionHeading = ({
  id,
  label,
  title,
  subtitle,
  className,
}: SectionHeadingProps) => (
  <header
    className={cn("mx-auto mb-10 max-w-2xl text-center md:mb-14", className)}
  >
    <p className="mb-3 text-sm font-semibold tracking-[0.2em] text-accent-3 uppercase">
      {label}
    </p>
    <h2 id={id} className="text-title font-bold tracking-tight">
      {title}
    </h2>
    {subtitle ? <p className="mt-4 text-lead text-muted">{subtitle}</p> : null}
  </header>
);
