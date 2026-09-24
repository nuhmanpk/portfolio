"use client";
import { AnimatePresence, motion } from "framer-motion";
import { Coffee, Dumbbell, GitPullRequest, Laptop, Moon, Smartphone, type LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { formatDuration, getStatus, TIME_ZONE, type StatusId } from "@/lib/status";

// Full class strings so Tailwind can see them
const TONE: Record<StatusId, { icon: LucideIcon; bar: string; chip: string; dot: string; label: string }> = {
  work: { icon: Laptop, bar: "bg-brand", chip: "bg-brand/15 text-brand-ink", dot: "bg-brand", label: "Work" },
  coffee: { icon: Coffee, bar: "bg-amber-400", chip: "bg-amber-400/15 text-amber-500", dot: "bg-amber-400", label: "Coffee" },
  gym: { icon: Dumbbell, bar: "bg-cyan-400", chip: "bg-cyan-400/15 text-cyan-500", dot: "bg-cyan-400", label: "Gym" },
  scroll: { icon: Smartphone, bar: "bg-violet-400", chip: "bg-violet-400/15 text-violet-400", dot: "bg-violet-400", label: "Scrolling" },
  sleep: { icon: Moon, bar: "bg-muted-foreground/40", chip: "bg-muted text-muted-foreground", dot: "bg-muted-foreground", label: "Sleep" },
  oss: { icon: GitPullRequest, bar: "bg-emerald-400", chip: "bg-emerald-400/15 text-emerald-500", dot: "bg-emerald-400", label: "Open source" },
};

const clock = new Intl.DateTimeFormat("en-IN", {
  timeZone: TIME_ZONE,
  weekday: "short",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

/** Live, tongue-in-cheek "what is he doing right now" card (Kerala time). */
export function StatusCard({ action }: { action?: React.ReactNode }) {
  // Time-dependent, so render only on the client (avoids a stale status baked into static HTML)
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  const s = now ? getStatus(now) : null;
  const tone = s ? TONE[s.id] : null;
  const Icon = tone?.icon;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        <span className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className={cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-75", tone?.dot ?? "bg-muted")} />
            <span className={cn("relative inline-flex h-2 w-2 rounded-full", tone?.dot ?? "bg-muted")} />
          </span>
          Live status
        </span>
        <span className="tabular-nums">{now ? `${clock.format(now)} IST` : "--:--"}</span>
      </div>

      <div className="mt-5 min-h-[4.5rem]">
        <AnimatePresence mode="wait">
          {s && tone && Icon ? (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex items-start gap-3"
            >
              <motion.span
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                className={cn("grid h-12 w-12 shrink-0 place-items-center rounded-2xl", tone.chip)}
              >
                <Icon className="h-5 w-5" />
              </motion.span>
              <div className="min-w-0">
                <p className="font-display text-2xl font-semibold leading-tight tracking-tight">{s.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.detail}</p>
              </div>
            </motion.div>
          ) : (
            <p className="text-sm text-muted-foreground">Checking the schedule…</p>
          )}
        </AnimatePresence>
      </div>

      {/* 24h timeline with a "now" marker */}
      {s && (
        <div className="mt-6">
          <div className="relative">
            <div className="flex h-2 gap-0.5 overflow-hidden rounded-full">
              {s.blocks.map((b) => (
                <span
                  key={b.from}
                  title={`${TONE[b.id].label}: ${b.from}:00 to ${b.to}:00`}
                  style={{ width: `${((b.to - b.from) / 24) * 100}%` }}
                  className={cn(TONE[b.id].bar, b.id !== s.id && "opacity-35")}
                />
              ))}
            </div>
            <span
              style={{ left: `${s.progress * 100}%` }}
              className="absolute top-1/2 h-4 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground ring-2 ring-card"
              aria-hidden
            />
          </div>
          <div className="mt-2 flex justify-between font-mono text-[9px] uppercase text-muted-foreground">
            <span>12a</span>
            <span>6a</span>
            <span>12p</span>
            <span>6p</span>
            <span>12a</span>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Up next: <span className="text-foreground">{s.next.title}</span> in{" "}
            <span className="font-mono tabular-nums">{formatDuration(s.minutesUntilNext)}</span>
          </p>
        </div>
      )}

      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
