import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  expanded: boolean;
  /** How many items are hidden while collapsed */
  remaining: number;
  total: number;
  /** Plural noun, e.g. "projects" */
  noun: string;
  onClick: () => void;
  /** Title shown while expanded (defaults to "Show featured") */
  expandedLabel?: string;
}

const kicker = ({ expanded, remaining }: Props) => (expanded ? "Collapse" : `+${remaining} more`);
const heading = ({ expanded, total, noun, expandedLabel }: Props) =>
  expanded ? expandedLabel ?? "Show featured" : `View all ${total} ${noun}`;

/** "View all" as the last tile of a card grid. */
export function ViewAllCard(props: Props & { compact?: boolean }) {
  const Icon = props.expanded ? ArrowUp : ArrowDown;
  return (
    <button
      onClick={props.onClick}
      aria-expanded={props.expanded}
      className={cn(
        "group flex h-full w-full flex-col justify-between gap-8 rounded-2xl border border-dashed border-border p-6 text-left transition-colors duration-300 hover:border-brand hover:bg-brand hover:text-brand-foreground md:p-8",
        props.compact ? "min-h-[10rem]" : "min-h-[14rem]"
      )}
    >
      <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors group-hover:text-brand-foreground/70">
        {kicker(props)}
      </span>
      <span className="flex items-end justify-between gap-4">
        <span className="font-display text-2xl font-semibold leading-tight tracking-tight md:text-3xl">
          {heading(props)}
        </span>
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-border transition-all duration-300 group-hover:border-brand-foreground/30 group-hover:bg-brand-foreground group-hover:text-brand">
          <Icon className="h-5 w-5 transition-transform duration-300 group-hover:translate-y-0.5" />
        </span>
      </span>
    </button>
  );
}

/** "View all" as the last row of an IndexRow list (same hover sweep). */
export function ViewAllRow(props: Props) {
  const Icon = props.expanded ? ArrowUp : ArrowDown;
  return (
    <li className="list-none">
      <button
        onClick={props.onClick}
        aria-expanded={props.expanded}
        className="group relative isolate grid w-full grid-cols-1 gap-2 border-b border-border px-2 py-6 text-left transition-colors duration-300 hover:text-brand-foreground md:grid-cols-12 md:items-center md:gap-6 md:px-4"
      >
        <span className="absolute inset-0 -z-10 origin-left scale-x-0 bg-brand transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
        <span className="font-mono text-xs uppercase tracking-widest text-brand-ink transition-colors group-hover:text-brand-foreground/70 md:col-span-3">
          {kicker(props)}
        </span>
        <span className="font-display text-xl font-semibold tracking-tight transition-transform duration-300 group-hover:translate-x-2 md:col-span-8 md:text-2xl">
          {heading(props)}
        </span>
        <Icon className="hidden h-6 w-6 justify-self-end md:col-span-1 md:block" />
      </button>
    </li>
  );
}
