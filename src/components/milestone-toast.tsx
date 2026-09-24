"use client";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";

const DURATION = 8000;

function ordinal(n: number) {
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${n.toLocaleString()}th`;
  const suffix = { 1: "st", 2: "nd", 3: "rd" }[n % 10] ?? "th";
  return `${n.toLocaleString()}${suffix}`;
}

/** "You're the Nth visitor" celebration, auto-dismissed after 8 seconds. */
export function MilestoneToast({ count, onClose }: { count: number | null; onClose: () => void }) {
  useEffect(() => {
    if (count === null) return;
    const t = setTimeout(onClose, DURATION);
    return () => clearTimeout(t);
  }, [count, onClose]);

  return (
    <AnimatePresence>
      {count !== null && (
        <motion.div
          key={count}
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: -24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.97 }}
          transition={{ type: "spring", damping: 22, stiffness: 300 }}
          className="fixed inset-x-4 top-20 z-[90] mx-auto max-w-sm overflow-hidden rounded-2xl bg-brand text-brand-foreground shadow-2xl sm:inset-x-0"
        >
          <div className="flex items-start gap-3 p-4 pl-5 pr-3">
            <div className="min-w-0 flex-1">
              <p className="font-display text-lg font-bold leading-tight tracking-tight">
                You&apos;re the {ordinal(count)} visitor!
              </p>
              <p className="mt-1 text-sm opacity-80">
                Thanks for stopping by, it genuinely means a lot.
              </p>
            </div>
            <button
              onClick={onClose}
              aria-label="Dismiss"
              className="grid h-7 w-7 shrink-0 place-items-center rounded-full transition-colors hover:bg-black/10"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <motion.div
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: DURATION / 1000, ease: "linear" }}
            className="h-1 origin-left bg-brand-foreground/30"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
