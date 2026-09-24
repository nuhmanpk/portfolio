// "What is Nuhman doing right now?": a tongue-in-cheek schedule in Kerala time (IST),
// so every visitor sees the same status regardless of their own timezone.

export type StatusId = "work" | "coffee" | "gym" | "scroll" | "sleep" | "oss";

export interface StatusInfo {
  id: StatusId;
  title: string;
  detail: string;
}

export const STATUSES: Record<StatusId, StatusInfo> = {
  work: { id: "work", title: "Working", detail: "Heads-down coding at Bititude. Replies may be slow." },
  coffee: { id: "coffee", title: "Away for coffee", detail: "Brewing something strong. Back soon." },
  gym: { id: "gym", title: "At the gym", detail: "Lifting things that aren't laptops." },
  scroll: { id: "scroll", title: "Probably doom scrolling", detail: "Hacker News, X, repeat. Send help." },
  sleep: { id: "sleep", title: "Sleeping", detail: "Recharging. Probably dreaming in TypeScript." },
  oss: { id: "oss", title: "Fixing open-source issues", detail: "…that he created himself. It's the weekend." },
};

type Block = { from: number; to: number; id: StatusId };

// Hours are 0 to 24 in IST
const WEEKDAY: Block[] = [
  { from: 0, to: 9, id: "sleep" },
  { from: 9, to: 18, id: "work" },
  { from: 18, to: 19, id: "coffee" },
  { from: 19, to: 21, id: "gym" },
  { from: 21, to: 24, id: "scroll" },
];

const WEEKEND: Block[] = [
  { from: 0, to: 9, id: "sleep" },
  { from: 9, to: 24, id: "oss" },
];

export const TIME_ZONE = "Asia/Kolkata";

function istParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return { weekday: get("weekday"), hours: Number(get("hour")) + Number(get("minute")) / 60 };
}

const isWeekend = (weekday: string) => weekday === "Sat" || weekday === "Sun";
const NEXT_DAY: Record<string, string> = { Mon: "Tue", Tue: "Wed", Wed: "Thu", Thu: "Fri", Fri: "Sat", Sat: "Sun", Sun: "Mon" };

export interface Status extends StatusInfo {
  /** Today's blocks, for drawing a timeline */
  blocks: Block[];
  /** 0 to 1 position through the IST day */
  progress: number;
  /** Next status and minutes until it starts */
  next: StatusInfo;
  minutesUntilNext: number;
  weekend: boolean;
}

export function getStatus(date = new Date()): Status {
  const { weekday, hours } = istParts(date);
  const weekend = isWeekend(weekday);
  const blocks = weekend ? WEEKEND : WEEKDAY;
  const i = blocks.findIndex((b) => hours >= b.from && hours < b.to);
  const current = blocks[i];

  // Next block may be tomorrow (e.g. Friday night -> Saturday)
  let next = blocks[i + 1];
  let nextStart = next?.from;
  if (!next) {
    const tomorrow = isWeekend(NEXT_DAY[weekday]) ? WEEKEND : WEEKDAY;
    // skip a block that continues the same status across midnight
    next = tomorrow.find((b) => b.id !== current.id) ?? tomorrow[0];
    nextStart = 24 + next.from;
  }

  return {
    ...STATUSES[current.id],
    blocks,
    progress: hours / 24,
    next: STATUSES[next.id],
    minutesUntilNext: Math.max(1, Math.round((nextStart! - hours) * 60)),
    weekend,
  };
}

export function formatDuration(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h ? `${h}h ${String(m).padStart(2, "0")}m` : `${m}m`;
}
