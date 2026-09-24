import { cn } from "@/lib/utils";

interface Props {
  items: readonly string[];
  reverse?: boolean;
  className?: string;
}

export function Marquee({ items, reverse, className }: Props) {
  const row = (hidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden}>
      {items.map((item) => (
        <span key={item} className="flex items-center gap-8 whitespace-nowrap pr-8">
          {item}
          <span className="text-[0.6em] opacity-60">✦</span>
        </span>
      ))}
    </div>
  );

  return (
    <div
      className={cn(
        "flex overflow-hidden font-display text-2xl font-semibold uppercase tracking-tight md:text-4xl",
        className
      )}
    >
      <div
        className={cn(
          "flex w-max animate-marquee",
          reverse && "[animation-direction:reverse]"
        )}
      >
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
