"use client";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUp,
  ArrowUpRight,
  Check,
  ChevronDown,
  Loader2,
  Mail,
  RotateCcw,
  Sparkles,
  Square,
  ThumbsDown,
  ThumbsUp,
  X,
} from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  answer,
  summarize,
  AI_NAME,
  MODEL_NAME,
  SUGGESTIONS,
  type Action,
  type Reply,
  type SectionKey,
} from "@/lib/fake-ai";

export type AIRequest = { prompt: string; section?: SectionKey; nonce: number };

type UserMsg = { id: number; role: "user"; text: string };
type AIMsg = {
  id: number;
  role: "ai";
  reply: Reply;
  phase: "thinking" | "streaming" | "done";
  step: number;
  shown: number;
  thinkMs: number;
  ms: number;
  stopped?: boolean;
  feedback?: "up" | "down";
};
type Msg = UserMsg | AIMsg;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ---------- Visual bits ----------

export function Orb({ size = 28, className }: { size?: number; className?: string }) {
  // One steady animation, regardless of whether the assistant is "thinking"
  return (
    <span aria-hidden className={cn("relative inline-block shrink-0", className)} style={{ width: size, height: size }}>
      <span className="ai-orb absolute -inset-1 rounded-full opacity-40 blur-md" />
      <span className="ai-orb absolute inset-0 rounded-full blur-[1px]" />
      <span className="absolute inset-[12%] rounded-full bg-gradient-to-br from-white/70 via-white/0 to-transparent" />
    </span>
  );
}

function inline(text: string, key: string) {
  return text.split(/(\*\*[^*]+\*\*|\*[^*\s][^*]*\*)/g).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4)
      return (
        <strong key={`${key}-${i}`} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2)
      return <em key={`${key}-${i}`}>{part.slice(1, -1)}</em>;
    return part;
  });
}

const Caret = () => (
  <span className="ml-0.5 inline-block h-4 w-1.5 translate-y-0.5 animate-pulse rounded-sm bg-brand" />
);

function Markdown({ text, caret }: { text: string; caret?: boolean }) {
  const lines = text.split("\n");
  return (
    <div className="space-y-1.5">
      {lines.map((line, i) => {
        const last = caret && i === lines.length - 1;
        if (!line.trim()) return last ? <Caret key={i} /> : <div key={i} className="h-1" />;
        const bullet = line.match(/^(- |\d+\. )(.*)$/);
        if (bullet)
          return (
            <div key={i} className="flex gap-2.5">
              <span className="mt-[3px] shrink-0 font-mono text-[11px] text-brand-ink">
                {bullet[1].trim() === "-" ? "▸" : bullet[1].trim()}
              </span>
              <span>
                {inline(bullet[2], `l${i}`)}
                {last && <Caret />}
              </span>
            </div>
          );
        return (
          <p key={i}>
            {inline(line, `l${i}`)}
            {last && <Caret />}
          </p>
        );
      })}
    </div>
  );
}

function Thoughts({ m, open, onToggle }: { m: AIMsg; open: boolean; onToggle: () => void }) {
  if (m.phase === "thinking") {
    return (
      <div className="space-y-1.5 rounded-xl border border-dashed border-border px-3.5 py-3">
        <p className="ai-shimmer font-mono text-[10px] uppercase tracking-widest">Thinking…</p>
        {m.reply.thoughts.slice(0, m.step + 1).map((t, i) => (
          <motion.p
            key={t}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground"
          >
            {i < m.step ? (
              <Check className="h-3 w-3 shrink-0 text-brand-ink" />
            ) : (
              <Loader2 className="h-3 w-3 shrink-0 animate-spin" />
            )}
            {t}
          </motion.p>
        ))}
      </div>
    );
  }
  if (!m.thinkMs) return null;
  return (
    <div>
      <button
        onClick={onToggle}
        className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
      >
        <Sparkles className="h-3 w-3 text-brand-ink" />
        Thought for {(m.thinkMs / 1000).toFixed(1)}s
        <ChevronDown className={cn("h-3 w-3 transition-transform", open && "rotate-180")} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-2 space-y-1 overflow-hidden border-l border-border pl-3"
          >
            {m.reply.thoughts.map((t) => (
              <li key={t} className="font-mono text-[11px] text-muted-foreground">
                {t}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

const IconBtn = ({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    aria-label={label}
    title={label}
    className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
  >
    {children}
  </button>
);

// ---------- Panel ----------

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: AIRequest | null;
  onMail: () => void;
}

export function AskAI({ open, onOpenChange, request, onMail }: Props) {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [openThoughts, setOpenThoughts] = useState<Record<number, boolean>>({});
  const idRef = useRef(0);
  const runRef = useRef<{ cancelled: boolean } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const patch = (id: number, fn: (m: AIMsg) => Partial<AIMsg>) =>
    setMsgs((ms) => ms.map((m) => (m.id === id && m.role === "ai" ? { ...m, ...fn(m) } : m)));

  const stop = useCallback(() => {
    if (runRef.current) runRef.current.cancelled = true;
    setMsgs((ms) =>
      ms.map((m) => (m.role === "ai" && m.phase !== "done" ? { ...m, phase: "done", stopped: true } : m))
    );
    setBusy(false);
  }, []);

  const send = useCallback(
    async (prompt: string, section?: SectionKey) => {
      const text = prompt.trim();
      if (!text) return;
      stop();
      const run = { cancelled: false };
      runRef.current = run;

      const reply = section ? summarize(section) : answer(text);
      const uid = ++idRef.current;
      const aid = ++idRef.current;
      const started = performance.now();
      setMsgs((ms) => [
        ...ms,
        { id: uid, role: "user", text },
        { id: aid, role: "ai", reply, phase: "thinking", step: 0, shown: 0, thinkMs: 0, ms: 0 },
      ]);
      setInput("");
      setBusy(true);

      // Fake reasoning trace
      await sleep(250);
      for (let i = 0; i < reply.thoughts.length; i++) {
        if (run.cancelled) return;
        patch(aid, () => ({ step: i }));
        await sleep(260 + Math.random() * 420);
      }
      if (run.cancelled) return;
      patch(aid, () => ({ phase: "streaming", step: reply.thoughts.length, thinkMs: performance.now() - started }));

      // Fake token stream
      const total = reply.text.length;
      const chunk = Math.max(2, Math.ceil(total / 170));
      let shown = 0;
      while (shown < total) {
        if (run.cancelled) return;
        shown = Math.min(total, shown + chunk + Math.floor(Math.random() * chunk));
        const next = shown;
        patch(aid, () => ({ shown: next }));
        await sleep(14 + Math.random() * 24);
      }
      patch(aid, () => ({ phase: "done", ms: performance.now() - started }));
      setBusy(false);
    },
    [stop]
  );

  const reset = () => {
    stop();
    setMsgs([]);
    setOpenThoughts({});
    inputRef.current?.focus();
  };

  // External requests (hero bar, sparkle buttons, dock)
  useEffect(() => {
    if (request) send(request.prompt, request.section);
  }, [request, send]);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 250);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onOpenChange(false);
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onOpenChange]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [msgs]);

  const act = (a: Action) => {
    switch (a.kind) {
      case "mail":
        onMail();
        break;
      case "link":
        window.open(a.href, "_blank", "noopener,noreferrer");
        break;
      case "ask":
        send(a.prompt);
        break;
      case "scroll":
        onOpenChange(false);
        setTimeout(() => document.getElementById(a.target)?.scrollIntoView({ behavior: "smooth" }), 200);
        break;
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="ai-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 z-[70] bg-background/60 backdrop-blur-[3px]"
          />
          <motion.aside
            key="ai-panel"
            role="dialog"
            aria-label={`Ask ${AI_NAME}`}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="ai-ring fixed inset-2 z-[80] rounded-3xl shadow-2xl md:inset-y-4 md:left-auto md:right-4 md:w-[460px]"
          >
            <div className="ai-ring-inner flex h-full flex-col overflow-hidden">
              {/* Header */}
              <div className="flex items-center gap-3 border-b border-border px-5 py-4">
                <Orb size={34} />
                <div className="min-w-0 flex-1">
                  <p className="font-display text-base font-semibold leading-tight">{AI_NAME}</p>
                  <p className="mt-0.5 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    <span
                      className={cn("h-1.5 w-1.5 rounded-full", busy ? "animate-pulse bg-amber-400" : "bg-brand")}
                    />
                    {MODEL_NAME} · {busy ? "generating" : "online"}
                  </p>
                </div>
                {msgs.length > 0 && (
                  <IconBtn label="New chat" onClick={reset}>
                    <RotateCcw className="h-4 w-4" />
                  </IconBtn>
                )}
                <IconBtn label="Close" onClick={() => onOpenChange(false)}>
                  <X className="h-4 w-4" />
                </IconBtn>
              </div>

              {/* Conversation */}
              <div ref={scrollRef} className="modal-scroll flex-1 overflow-y-auto px-5 py-6">
                {msgs.length === 0 ? (
                  <div className="flex min-h-full flex-col justify-center">
                    <Orb size={64} className="mb-6" />
                    <h3 className="font-display text-3xl font-bold leading-tight tracking-tight">
                      Ask me anything
                      <br />
                      about <span className="font-serif font-normal italic text-brand-ink">Nuhman</span>.
                    </h3>
                    <p className="mt-3 text-sm text-muted-foreground">
                      Trained on his projects, experience, writing, and a few questionable jokes.
                    </p>
                    <div className="mt-8 grid gap-2">
                      {SUGGESTIONS.map((s) => (
                        <button
                          key={s}
                          onClick={() => send(s)}
                          className="group flex items-center justify-between rounded-xl border border-border px-4 py-3 text-left text-sm transition-colors hover:border-brand hover:bg-muted"
                        >
                          {s}
                          <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:rotate-45 group-hover:text-brand-ink" />
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {msgs.map((m) =>
                      m.role === "user" ? (
                        <motion.div
                          key={m.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex justify-end"
                        >
                          <p className="max-w-[85%] rounded-2xl rounded-br-md bg-foreground px-4 py-2.5 text-sm text-background">
                            {m.text}
                          </p>
                        </motion.div>
                      ) : (
                        <div key={m.id} className="flex gap-3">
                          <Orb size={24} className="mt-0.5" />
                          <div className="min-w-0 flex-1 space-y-3">
                            <Thoughts
                              m={m}
                              open={!!openThoughts[m.id]}
                              onToggle={() => setOpenThoughts((o) => ({ ...o, [m.id]: !o[m.id] }))}
                            />

                            {m.shown > 0 && (
                              <div className="text-[15px] leading-relaxed text-foreground/80">
                                <Markdown text={m.reply.text.slice(0, m.shown)} caret={m.phase === "streaming"} />
                              </div>
                            )}

                            {m.stopped && (
                              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                                ■ Stopped
                              </p>
                            )}

                            {m.phase === "done" && !m.stopped && !!m.reply.cards?.length && (
                              <div className="grid gap-2">
                                {m.reply.cards.map((c, i) => (
                                  <motion.a
                                    key={c.title}
                                    href={c.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.07 }}
                                    className="group block rounded-xl border border-border bg-background/50 p-3.5 transition-colors hover:border-brand"
                                  >
                                    <div className="flex items-start justify-between gap-3">
                                      <span className="font-display font-semibold leading-snug">{c.title}</span>
                                      <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:rotate-45 group-hover:text-brand-ink" />
                                    </div>
                                    {c.meta && (
                                      <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                                        {c.meta}
                                      </p>
                                    )}
                                    {c.desc && (
                                      <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                                        {c.desc}
                                      </p>
                                    )}
                                  </motion.a>
                                ))}
                              </div>
                            )}

                            {m.phase === "done" && !m.stopped && !!m.reply.actions?.length && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.15 }}
                                className="flex flex-wrap gap-2"
                              >
                                {m.reply.actions.map((a) => (
                                  <button
                                    key={a.label}
                                    onClick={() => act(a)}
                                    className={cn(
                                      "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors",
                                      a.kind === "mail"
                                        ? "border-brand bg-brand font-medium text-brand-foreground hover:opacity-90"
                                        : "border-border hover:border-foreground"
                                    )}
                                  >
                                    {a.kind === "mail" && <Mail className="h-3.5 w-3.5" />}
                                    {a.label}
                                    {(a.kind === "link" || a.kind === "scroll") && <ArrowUpRight className="h-3 w-3" />}
                                  </button>
                                ))}
                              </motion.div>
                            )}

                            {m.phase === "done" && !m.stopped && (
                              <div className="flex items-center gap-3 font-mono text-[10px] text-muted-foreground">
                                <span>
                                  {Math.round(m.reply.text.length / 3.8)} tokens · {(m.ms / 1000).toFixed(1)}s
                                </span>
                                <span className="ml-auto flex items-center gap-1">
                                  {m.feedback ? (
                                    <span>Thanks, noted. 🫡</span>
                                  ) : (
                                    <>
                                      <button
                                        aria-label="Good response"
                                        onClick={() => patch(m.id, () => ({ feedback: "up" }))}
                                        className="rounded p-1 hover:bg-muted hover:text-foreground"
                                      >
                                        <ThumbsUp className="h-3 w-3" />
                                      </button>
                                      <button
                                        aria-label="Bad response"
                                        onClick={() => patch(m.id, () => ({ feedback: "down" }))}
                                        className="rounded p-1 hover:bg-muted hover:text-foreground"
                                      >
                                        <ThumbsDown className="h-3 w-3" />
                                      </button>
                                    </>
                                  )}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>

              {/* Composer */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!busy) send(input);
                }}
                className="border-t border-border p-3"
              >
                <div className="flex items-end gap-2 rounded-2xl border border-border bg-background/60 p-1.5 transition-colors focus-within:border-brand">
                  <textarea
                    ref={inputRef}
                    rows={1}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        if (!busy) send(input);
                      }
                    }}
                    placeholder="Ask about projects, stack, writing…"
                    aria-label={`Message ${AI_NAME}`}
                    className="max-h-32 min-h-[40px] flex-1 resize-none bg-transparent px-2.5 py-2.5 text-sm outline-none placeholder:text-muted-foreground"
                  />
                  {busy ? (
                    <button
                      type="button"
                      onClick={stop}
                      aria-label="Stop generating"
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-foreground text-background"
                    >
                      <Square className="h-3.5 w-3.5 fill-current" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={!input.trim()}
                      aria-label="Send"
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand text-brand-foreground transition-opacity disabled:opacity-40"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <p className="mt-2 text-center font-mono text-[10px] text-muted-foreground">
                  {MODEL_NAME} can make mistakes. Mostly flattering ones.
                </p>
              </form>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

// ---------- Launchers ----------

/** Hero input with a typewriter placeholder cycling through suggestions. */
export function AskBar({ onAsk }: { onAsk: (prompt: string) => void }) {
  const [value, setValue] = useState("");
  const [hint, setHint] = useState("");
  const current = useRef(SUGGESTIONS[0]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      for (let i = 0; !cancelled; i++) {
        const q = SUGGESTIONS[i % SUGGESTIONS.length];
        current.current = q;
        for (let c = 1; c <= q.length && !cancelled; c++) {
          setHint(q.slice(0, c));
          await sleep(45);
        }
        await sleep(1800);
        for (let c = q.length; c >= 0 && !cancelled; c--) {
          setHint(q.slice(0, c));
          await sleep(16);
        }
        await sleep(300);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onAsk(value.trim() || current.current);
        setValue("");
      }}
      className="ai-ring relative rounded-full shadow-[0_0_60px_-15px_hsl(var(--brand)/0.6)]"
    >
      <div className="ai-ring-inner flex items-center gap-3 rounded-full py-1.5 pl-3 pr-1.5">
        <Orb size={30} />
        <div className="relative min-w-0 flex-1">
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            aria-label={`Ask ${AI_NAME} a question`}
            className="w-full bg-transparent py-2.5 text-base outline-none md:text-lg"
          />
          {!value && (
            <span className="pointer-events-none absolute inset-0 flex items-center overflow-hidden whitespace-nowrap text-base text-muted-foreground md:text-lg">
              {hint}
              <span className="ml-0.5 h-5 w-[2px] shrink-0 animate-pulse bg-brand-ink" />
            </span>
          )}
        </div>
        <kbd className="hidden rounded-md border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline">
          ⌘K
        </kbd>
        <button
          type="submit"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-brand px-4 py-3 font-mono text-[11px] font-semibold uppercase tracking-widest text-brand-foreground transition-transform hover:scale-[1.03]"
        >
          Ask AI <ArrowUp className="h-3.5 w-3.5" />
        </button>
      </div>
    </form>
  );
}

/** Small pill launcher (nav + floating dock). */
export function AskPill({ onClick, className }: { onClick: () => void; className?: string }) {
  return (
    <button onClick={onClick} className={cn("ai-ring group relative rounded-full", className)}>
      <span className="ai-ring-inner flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-3.5">
        <Orb size={22} />
        <span className="font-mono text-[11px] font-medium uppercase tracking-widest">Ask AI</span>
        <kbd className="hidden rounded border border-border px-1 font-mono text-[9px] text-muted-foreground sm:inline">
          ⌘K
        </kbd>
      </span>
    </button>
  );
}
