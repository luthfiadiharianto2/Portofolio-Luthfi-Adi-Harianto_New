import { cn } from "@/lib/utils";

const base =
  "inline-flex min-h-(--spacing-touch) items-center justify-center gap-2 rounded-control px-6 font-medium transition-transform duration-200 ease-(--ease-standard) active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60";

export const buttonStyles = {
  primary: cn(base, "bg-gradient-button text-fg glow"),
  secondary: cn(base, "glass text-fg hover:bg-glass-border"),
  ghost: cn(base, "text-muted hover:text-fg px-3"),
};

export const iconButtonStyles =
  "inline-flex size-(--spacing-touch) shrink-0 items-center justify-center rounded-full text-muted transition-colors duration-200 hover:text-fg";
