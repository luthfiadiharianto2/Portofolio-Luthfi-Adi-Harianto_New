"use client";

import {
  FolderKanban,
  LayoutDashboard,
  Mail,
  MessagesSquare,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Dasbor", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Proyek", icon: FolderKanban },
  { href: "/admin/guestbook", label: "Buku tamu", icon: MessagesSquare },
  { href: "/admin/messages", label: "Pesan", icon: Mail },
] as const;

export const NavLinks = () => {
  const pathname = usePathname();
  return (
    <ul className="flex flex-wrap gap-1">
      {LINKS.map(({ href, label, icon: Icon }) => {
        const active =
          href === "/admin" ? pathname === href : pathname.startsWith(href);
        return (
          <li key={href}>
            <Link
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "inline-flex min-h-(--spacing-touch) items-center gap-2 rounded-control px-3 text-sm font-medium transition-colors duration-200",
                active ? "bg-glass-border text-fg" : "text-muted hover:text-fg",
              )}
            >
              <Icon aria-hidden="true" className="size-4" />
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};
