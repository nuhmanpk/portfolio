import { ArrowUpRight } from "lucide-react";
import React from "react";

interface Props {
  meta: string;
  title: string;
  sub?: React.ReactNode;
  href?: string;
  children?: React.ReactNode;
}

/**
 * Editorial list row: meta | title | sub | arrow.
 * On hover a brand-colored fill sweeps in from the left.
 */
export function IndexRow({ meta, title, sub, href, children }: Props) {
  const Tag = href ? "a" : "div";

  return (
    <li className="list-none">
      <Tag
        {...(href ? { href, target: "_blank", rel: "noopener noreferrer" } : {})}
        className="group relative isolate grid grid-cols-1 gap-2 border-b border-border px-2 py-6 transition-colors duration-300 hover:text-brand-foreground md:grid-cols-12 md:items-center md:gap-6 md:px-4"
      >
        <span className="absolute inset-0 -z-10 origin-left scale-x-0 bg-brand transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />

        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors group-hover:text-brand-foreground/70 md:col-span-3">
          {meta}
        </span>
        <span className="font-display text-xl font-semibold tracking-tight transition-transform duration-300 group-hover:translate-x-2 md:col-span-6 md:text-2xl">
          {title}
        </span>
        <span className="text-sm text-muted-foreground transition-colors group-hover:text-brand-foreground/80 md:col-span-2">
          {sub}
        </span>
        {href && (
          <ArrowUpRight className="hidden h-6 w-6 justify-self-end transition-transform duration-300 group-hover:rotate-45 md:col-span-1 md:block" />
        )}
        {children && (
          <p className="text-sm leading-relaxed text-muted-foreground transition-colors group-hover:text-brand-foreground/80 md:col-span-8 md:col-start-4">
            {children}
          </p>
        )}
      </Tag>
    </li>
  );
}
