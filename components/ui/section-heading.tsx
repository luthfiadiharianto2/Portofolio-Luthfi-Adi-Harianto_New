import { Fragment } from "react";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  id: string;
  label: string;
  title: string;
  subtitle?: string;
  /** Efek glitch sekali saat judul masuk layar (heading About Me). */
  glitch?: boolean;
  className?: string;
};

// Judul dipecah per kata (bertopeng) untuk animasi "judul terbelah". Teks lengkap
// tetap terbaca utuh oleh pembaca layar lewat aria-label.
export const SectionHeading = ({
  id,
  label,
  title,
  subtitle,
  glitch = false,
  className,
}: SectionHeadingProps) => {
  const words = title.split(" ");
  return (
    <header
      className={cn("mx-auto mb-10 max-w-2xl text-center md:mb-14", className)}
    >
      <p
        data-reveal
        className="mb-3 text-sm font-semibold tracking-[0.2em] text-accent-3 uppercase"
      >
        {label}
      </p>
      <h2
        id={id}
        aria-label={title}
        data-split
        className="text-title font-bold tracking-tight"
      >
        <span
          aria-hidden="true"
          data-glitch={glitch ? "" : undefined}
          data-text={glitch ? title : undefined}
          className={cn(glitch && "glitch")}
        >
          {words.map((word, index) => (
            <Fragment key={`${word}-${index}`}>
              <span className="split-mask">
                <span className="split-word">{word}</span>
              </span>
              {index < words.length - 1 ? " " : null}
            </Fragment>
          ))}
        </span>
      </h2>
      {subtitle ? (
        <p data-reveal className="mt-4 text-lead text-muted">
          {subtitle}
        </p>
      ) : null}
    </header>
  );
};
