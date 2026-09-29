export type StatusId =
  | "sleep"
  | "breakfast"
  | "work"
  | "coffee"
  | "lunch"
  | "gym"
  | "oss"
  | "wedding"
  | "friends"
  | "scroll"
  | "debugging"
  | "family"
  | "drive";

export interface StatusInfo {
  id: StatusId;
  title: string;
  detail: string;
}

type StatusDefinition = {
  id: StatusId;
  title: string;
  details: string[];
};

export const STATUSES: Record<StatusId, StatusDefinition> = {
  sleep: {
    id: "sleep",
    title: "Sleeping",
    details: [
      "Recharging. Probably dreaming in TypeScript.",
      "Offline. The bugs can wait until morning.",
      "Currently unavailable to both humans and APIs.",
      "Running background processes. Do not disturb.",
      "Saving energy for another questionable idea.",
      "Probably asleep. Unless there is a production incident.",
      "Brain has entered low-power mode.",
    ],
  },

  breakfast: {
    id: "breakfast",
    title: "Having breakfast",
    details: [
      "Important production deployment. Tea is the dependency.",
      "Loading breakfast.exe.",
      "Fueling the machine before the machine starts complaining.",
      "Tea, food, then questionable engineering decisions.",
      "Starting the day with the most important API: breakfast.",
    ],
  },

  work: {
    id: "work",
    title: "Working",
    details: [
      "Heads-down coding at Bititude. Replies may be slow.",
      "Turning caffeine into questionable software.",
      "Currently making computers do things they weren't asked to do.",
      "Somewhere between 'almost done' and 'one more refactor'.",
      "Writing code. Deleting code. Writing better code. Maybe.",
      "Deep in the rabbit hole. Send snacks.",
      "Probably staring at a terminal pretending everything is under control.",
      "Building things that didn't exist five minutes ago.",
      "Currently negotiating with a stubborn bug.",
      "Making the compiler regret its career choices.",
      "One tab became twelve. This is fine.",
    ],
  },

  coffee: {
    id: "coffee",
    title: "Coffee break",
    details: [
      "Compiling caffeine. Please wait.",
      "Restarting human.exe.",
      "Coffee is currently handling the production workload.",
      "Refueling before the next debugging session.",
      "Taking a short break from pretending semicolons are important.",
      "Coffee acquired. Productivity pending.",
    ],
  },

  lunch: {
    id: "lunch",
    title: "Having lunch",
    details: [
      "Temporarily unavailable. Food has priority.",
      "The keyboard has been replaced by a plate.",
      "Currently handling a much more important deployment.",
      "Lunch.exe is running. Please try again later.",
      "Away from the terminal. Closer to biryani.",
    ],
  },

  gym: {
    id: "gym",
    title: "At the gym",
    details: [
      "Lifting things that aren't laptops.",
      "Debugging the body for a change.",
      "Currently pushing code and weights.",
      "Trying to convince muscles that TypeScript isn't enough.",
      "Physical maintenance window in progress.",
      "Making sure the only thing running on low CPU isn't me.",
    ],
  },

  oss: {
    id: "oss",
    title: "Fixing open-source issues",
    details: [
      "Fixing bugs he may or may not have created himself.",
      "Maintaining software nobody asked him to maintain.",
      "Somewhere on GitHub arguing with a dependency.",
      "Turning free time into pull requests.",
      "Making the internet slightly less broken.",
      "Open source doesn't pay the bills. It does create more tabs.",
      "Probably saying 'I'll just fix one thing' for the third hour.",
      "Shipping fixes into the void.",
    ],
  },

  wedding: {
    id: "wedding",
    title: "At someone's wedding",
    details: [
      "Dressed up. Eating everything. Asking who the next victim is.",
      "Currently attending a wedding instead of attending to GitHub.",
      "Social mode enabled. Developer mode temporarily suspended.",
      "Here for the food. Staying because leaving would be rude.",
      "Trying to remember everyone's names.",
      "Networking, but nobody is talking about APIs.",
      "Probably overdressed. Definitely overfed.",
      "A rare sighting outside the terminal.",
    ],
  },

  friends: {
    id: "friends",
    title: "Out with friends",
    details: [
      "Currently debugging life over food and questionable decisions.",
      "Touching grass. Finally.",
      "Social battery currently being stress-tested.",
      "Out with the people who knew me before the AI hype.",
      "Probably discussing a startup idea nobody will build.",
      "No commits. Just vibes.",
      "The group chat escaped into real life.",
      "Currently accepting snacks instead of pull requests.",
    ],
  },

  scroll: {
    id: "scroll",
    title: "Probably doom scrolling",
    details: [
      "Instagram, YouTube, X, GitHub, repeat.",
      "Just one more video. This has been going on for two hours.",
      "Researching something that definitely wasn't on the roadmap.",
      "Scrolling for inspiration. Accidentally found 47 memes.",
      "Currently consuming the entire internet.",
      "Productivity has left the chat.",
      "Falling down another completely unnecessary rabbit hole.",
      "The algorithm won.",
    ],
  },

  debugging: {
    id: "debugging",
    title: "Debugging something stupid",
    details: [
      "It worked five minutes ago. Nobody knows why.",
      "The bug is somewhere between line 1 and line 847.",
      "Currently blaming the framework.",
      "One tiny bug. Famous last words.",
      "Trying random things until the tests turn green.",
      "The code is innocent. Probably.",
      "Have you tried turning it off and questioning your life choices?",
      "Currently losing an argument with a stack trace.",
    ],
  },

  family: {
    id: "family",
    title: "Family time",
    details: [
      "Offline mode enabled. The Wi-Fi is irrelevant.",
      "Currently being asked what exactly I do for a living.",
      "Explaining AI to someone who just wanted to know if I eat properly.",
      "Family time. Laptop privileges revoked.",
      "Away from the terminal. Under parental supervision.",
      "Currently answering questions that definitely weren't in the API docs.",
    ],
  },

  drive: {
    id: "drive",
    title: "Out for a drive",
    details: [
      "Music on. Brain somewhere else.",
      "Currently debugging thoughts instead of code.",
      "Taking the scenic route to absolutely nowhere.",
      "Four wheels, good music, zero meetings.",
      "Clearing cache.",
      "Sometimes the best solution is to go for a drive.",
      "Away from the screen. Letting the brain compile.",
    ],
  },
};

type Block = {
  from: number;
  to: number;
  id: StatusId;
};

const WEEKDAY: Block[] = [
  { from: 0, to: 8, id: "sleep" },
  { from: 8, to: 9, id: "breakfast" },
  { from: 9, to: 13, id: "work" },
  { from: 13, to: 14, id: "lunch" },
  { from: 14, to: 18, id: "work" },
  { from: 18, to: 19, id: "coffee" },
  { from: 19, to: 21, id: "gym" },
  { from: 21, to: 23, id: "debugging" },
  { from: 23, to: 24, id: "scroll" },
];

const SATURDAY: Block[] = [
  { from: 0, to: 2, id: "scroll" },
  { from: 2, to: 8, id: "sleep" },
  { from: 8, to: 9, id: "breakfast" },
  { from: 9, to: 12, id: "oss" },
  { from: 12, to: 24, id: "wedding" },
];

const SUNDAY: Block[] = [
  { from: 0, to: 2, id: "wedding" },
  { from: 2, to: 8, id: "sleep" },
  { from: 8, to: 9, id: "breakfast" },
  { from: 9, to: 12, id: "family" },
  { from: 12, to: 14, id: "wedding" },
  { from: 14, to: 17, id: "drive" },
  { from: 17, to: 19, id: "coffee" },
  { from: 19, to: 24, id: "friends" },
];

export const TIME_ZONE = "Asia/Kolkata";

const RANDOM_DETAILS: Record<StatusId, string> = Object.fromEntries(
  Object.entries(STATUSES).map(([id, status]) => {
    const details = [...status.details];
    const selected = details[Math.floor(Math.random() * details.length)];
    return [id, selected];
  }),
) as Record<StatusId, string>;

function getStatusInfo(id: StatusId): StatusInfo {
  const status = STATUSES[id];

  return {
    id: status.id,
    title: status.title,
    detail: RANDOM_DETAILS[id],
  };
}

function istParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  const get = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return {
    weekday: get("weekday"),
    hours: Number(get("hour")) + Number(get("minute")) / 60,
  };
}

const NEXT_DAY: Record<string, string> = {
  Mon: "Tue",
  Tue: "Wed",
  Wed: "Thu",
  Thu: "Fri",
  Fri: "Sat",
  Sat: "Sun",
  Sun: "Mon",
};

const getBlocks = (weekday: string): Block[] => {
  if (weekday === "Sat") return SATURDAY;
  if (weekday === "Sun") return SUNDAY;
  return WEEKDAY;
};

export interface Status extends StatusInfo {
  blocks: Block[];
  progress: number;
  next: StatusInfo;
  minutesUntilNext: number;
  weekend: boolean;
}

export function getStatus(date = new Date()): Status {
  const { weekday, hours } = istParts(date);
  const blocks = getBlocks(weekday);
  const weekend = weekday === "Sat" || weekday === "Sun";

  const index = blocks.findIndex(
    (block) => hours >= block.from && hours < block.to,
  );

  const currentIndex = index >= 0 ? index : 0;
  const current = blocks[currentIndex];

  let next = blocks[currentIndex + 1];
  let nextStart = next?.from;

  if (!next) {
    const nextWeekday = NEXT_DAY[weekday];
    const tomorrowBlocks = getBlocks(nextWeekday);

    next = tomorrowBlocks[0];
    nextStart = 24 + next.from;
  }

  return {
    ...getStatusInfo(current.id),
    blocks,
    progress: hours / 24,
    next: getStatusInfo(next.id),
    minutesUntilNext: Math.max(
      1,
      Math.round((nextStart! - hours) * 60),
    ),
    weekend,
  };
}

export function formatDuration(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;

  return h
    ? `${h}h ${String(m).padStart(2, "0")}m`
    : `${m}m`;
}