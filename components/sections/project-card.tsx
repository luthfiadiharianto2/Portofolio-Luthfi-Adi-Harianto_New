import { Eye } from "lucide-react";
import Image from "next/image";
import { TechIcon } from "@/components/icons/tech-icon";
import { buttonStyles } from "@/components/ui/button-styles";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type ProjectCardProps = {
  slug: string;
  title: string;
  label: string;
  tagline: string;
  thumbnail: string;
  thumbnailAlt: string;
  technologies: string[];
  detailsLabel: string;
};

export const ProjectCard = ({
  slug,
  title,
  label,
  tagline,
  thumbnail,
  thumbnailAlt,
  technologies,
  detailsLabel,
}: ProjectCardProps) => (
  <article
    data-tilt
    className="group flex h-full flex-col overflow-hidden rounded-card glass"
  >
    <div className="relative aspect-[16/10] overflow-hidden">
      <Image
        src={thumbnail}
        alt={thumbnailAlt}
        fill
        sizes="(min-width: 1024px) 22rem, (min-width: 640px) 45vw, 92vw"
        className="object-cover transition-transform duration-500 ease-(--ease-standard) group-hover:scale-105"
      />
    </div>
    <div className="flex flex-1 flex-col p-5">
      <p className="text-xs font-semibold tracking-wider text-accent-3 uppercase">
        {label}
      </p>
      <h3 className="mt-2 font-heading text-xl font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted">{tagline}</p>
      <ul className="mt-4 mb-5 flex flex-wrap gap-2">
        {technologies.slice(0, 3).map((tech) => (
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
        href={`/projects/${slug}`}
        className={cn(buttonStyles.secondary, "mt-auto self-start")}
      >
        <Eye aria-hidden="true" className="size-4" />
        {detailsLabel}
        <span className="sr-only"> {title}</span>
      </Link>
    </div>
  </article>
);
