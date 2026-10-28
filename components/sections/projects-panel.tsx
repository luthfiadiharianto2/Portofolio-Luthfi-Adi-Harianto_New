"use client";

import { Eye } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { TechIcon } from "@/components/icons/tech-icon";
import { buttonStyles } from "@/components/ui/button-styles";
import { Link } from "@/i18n/navigation";
import type { ProjectCategory } from "@/lib/data/content";
import { cn } from "@/lib/utils";

export type ProjectCardData = {
  slug: string;
  title: string;
  category: ProjectCategory;
  label: string;
  tagline: string;
  thumbnail: string;
  technologies: string[];
};

type ProjectsPanelProps = {
  projects: ProjectCardData[];
  labels: {
    filter: string;
    empty: string;
    details: string;
    thumbnailAlt: Record<string, string>;
    categories: { value: ProjectCategory | "all"; label: string }[];
  };
};

export const ProjectsPanel = ({ projects, labels }: ProjectsPanelProps) => {
  const [filter, setFilter] = useState<ProjectCategory | "all">("all");
  const visible =
    filter === "all" ? projects : projects.filter((p) => p.category === filter);

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
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((project) => (
            <li key={project.slug}>
              <article className="group flex h-full flex-col overflow-hidden rounded-card glass">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={project.thumbnail}
                    alt={labels.thumbnailAlt[project.slug] ?? project.title}
                    fill
                    sizes="(min-width: 1024px) 22rem, (min-width: 640px) 45vw, 92vw"
                    className="object-cover transition-transform duration-500 ease-(--ease-standard) group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-xs font-semibold tracking-wider text-accent-3 uppercase">
                    {project.label}
                  </p>
                  <h3 className="mt-2 font-heading text-xl font-semibold">
                    {project.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted">{project.tagline}</p>
                  <ul className="mt-4 mb-5 flex flex-wrap gap-2">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <li
                        key={tech}
                        className="inline-flex items-center gap-1.5 rounded-full border border-glass-border px-2.5 py-1 text-xs text-muted"
                      >
                        <TechIcon name={tech} className="size-3.5" />
                        {tech}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/projects/${project.slug}`}
                    className={cn(buttonStyles.secondary, "mt-auto self-start")}
                  >
                    <Eye aria-hidden="true" className="size-4" />
                    {labels.details}
                    <span className="sr-only"> {project.title}</span>
                  </Link>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
