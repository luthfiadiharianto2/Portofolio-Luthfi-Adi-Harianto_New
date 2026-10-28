"use client";

import { type ReactNode, useState } from "react";
import type { ProjectCategory } from "@/lib/data/content";
import { cn } from "@/lib/utils";

// Kartu dirender di server (gambar, ikon teknologi, tautan); di browser hanya
// status filter yang dikelola, agar ikon dan markup kartu tidak ikut bundel JS.
type ProjectsPanelProps = {
  cards: { slug: string; category: ProjectCategory; card: ReactNode }[];
  labels: {
    filter: string;
    empty: string;
    categories: { value: ProjectCategory | "all"; label: string }[];
  };
};

export const ProjectsPanel = ({ cards, labels }: ProjectsPanelProps) => {
  const [filter, setFilter] = useState<ProjectCategory | "all">("all");
  const visible =
    filter === "all" ? cards : cards.filter((card) => card.category === filter);

  return (
    <div>
      <div
        role="group"
        aria-label={labels.filter}
        className="mb-8 flex flex-wrap justify-center gap-2"
      >
        {labels.categories.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            aria-pressed={filter === value}
            onClick={() => setFilter(value)}
            className={cn(
              "min-h-(--spacing-touch) rounded-full border px-4 text-sm font-medium transition-colors duration-200",
              filter === value
                ? "border-accent-3 bg-glass-border text-fg"
                : "border-glass-border text-muted hover:text-fg",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="text-center text-muted">{labels.empty}</p>
      ) : (
        <ul
          data-reveal
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {visible.map(({ slug, card }) => (
            <li key={slug}>{card}</li>
          ))}
        </ul>
      )}
    </div>
  );
};
