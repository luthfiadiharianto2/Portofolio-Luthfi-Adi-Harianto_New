import type { SimpleIcon } from "simple-icons";
import { cn } from "@/lib/utils";

type IconProps = { className?: string };

// Ikon merek dari simple-icons, diwarnai currentColor agar mengikuti token teks.
export const BrandIcon = ({
  icon,
  className,
}: IconProps & { icon: SimpleIcon }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
    className={cn("size-5 fill-current", className)}
  >
    <path d={icon.path} />
  </svg>
);

// simple-icons tidak lagi memuat logo LinkedIn, jadi dipakai tanda "in" sederhana.
export const LinkedInIcon = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
    className={cn("size-5 fill-current", className)}
  >
    <rect
      x="2"
      y="2"
      width="20"
      height="20"
      rx="4"
      className="fill-none stroke-current"
      strokeWidth="2"
    />
    <rect x="6.5" y="10" width="2.5" height="7.5" />
    <circle cx="7.75" cy="7.25" r="1.5" />
    <path d="M11.5 10h2.4v1.1c.4-.7 1.3-1.3 2.6-1.3 2.2 0 2.9 1.4 2.9 3.4v4.3h-2.5v-3.8c0-1-.2-1.8-1.2-1.8s-1.7.7-1.7 1.9v3.7h-2.5z" />
  </svg>
);
