import { ArrowUpRight } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  description: string;
  tags: readonly string[];
  link?: string;
  index?: number;
  highlight?: boolean;
}

export function ProjectCard({ title, description, tags, link, index = 0, highlight }: Props) {
  // Cursor-following spotlight
  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - rect.top}px`);
  };

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      onMouseMove={handleMouseMove}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 transition-colors duration-300 hover:border-brand md:p-8",
        highlight && "md:min-h-[22rem]"
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(420px circle at var(--x, 50%) var(--y, 50%), hsl(var(--brand) / 0.14), transparent 45%)",
        }}
      />

      <div className="relative flex items-start justify-between">
        <span className="font-mono text-xs text-muted-foreground">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="grid h-10 w-10 place-items-center rounded-full border border-border transition-all duration-300 group-hover:rotate-45 group-hover:border-brand group-hover:bg-brand group-hover:text-brand-foreground">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>

      <h3
        className={cn(
          "relative mt-8 font-display font-semibold tracking-tight",
          highlight ? "text-4xl md:text-6xl" : "text-2xl"
        )}
      >
        {title}
      </h3>
      {description && (
        <p
          className={cn(
            "relative mt-3 leading-relaxed text-muted-foreground",
            highlight ? "max-w-xl text-base" : "line-clamp-4 text-sm"
          )}
        >
          {description}
        </p>
      )}

      <div className="relative mt-auto flex flex-wrap gap-1.5 pt-6">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>
    </a>
  );
}
