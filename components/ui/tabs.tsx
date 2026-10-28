"use client";

import {
  type KeyboardEvent,
  type ReactNode,
  useId,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

type Tab = { id: string; label: string; panel: ReactNode };

// Tab sesuai pola WAI-ARIA: panah kiri/kanan, Home, End, dan roving tabindex.
// Semua panel tetap dirender agar isinya ada di HTML; yang tidak aktif disembunyikan.
export const Tabs = ({ label, tabs }: { label: string; tabs: Tab[] }) => {
  const baseId = useId();
  const [active, setActive] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  const focusTab = (index: number) => {
    const next = (index + tabs.length) % tabs.length;
    setActive(next);
    buttons.current[next]?.focus();
  };

  const onKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    const moves: Record<string, number> = {
      ArrowRight: index + 1,
      ArrowLeft: index - 1,
      Home: 0,
      End: tabs.length - 1,
    };
    const target = moves[event.key];
    if (target === undefined) return;
    event.preventDefault();
    focusTab(target);
  };

  return (
    <div>
      <div
        role="tablist"
        aria-label={label}
        className="mx-auto mb-10 flex w-full max-w-full snap-x gap-1 overflow-x-auto rounded-full glass p-1 sm:w-fit"
      >
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={(element) => {
              buttons.current[index] = element;
            }}
            type="button"
            role="tab"
            id={`${baseId}-tab-${tab.id}`}
            aria-selected={active === index}
            aria-controls={`${baseId}-panel-${tab.id}`}
            tabIndex={active === index ? 0 : -1}
            onClick={() => setActive(index)}
            onKeyDown={(event) => onKeyDown(event, index)}
            className={cn(
              "min-h-(--spacing-touch) flex-1 shrink-0 snap-start rounded-full px-4 text-sm font-medium whitespace-nowrap transition-colors duration-200 sm:flex-none sm:px-5",
              active === index
                ? "bg-gradient-button text-fg"
                : "text-muted hover:text-fg",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {tabs.map((tab, index) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`${baseId}-panel-${tab.id}`}
          aria-labelledby={`${baseId}-tab-${tab.id}`}
          hidden={active !== index}
          tabIndex={0}
          className="rounded-card focus-visible:outline-offset-8"
        >
          {tab.panel}
        </div>
      ))}
    </div>
  );
};
