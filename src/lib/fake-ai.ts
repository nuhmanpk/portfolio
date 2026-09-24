// "PK-1": a completely local, deterministic-ish answer engine that *feels* like an LLM.
// Keyword intents + tiny keyword retrieval over RESUME_DATA, plus a scripted
// reasoning trace. No network, no model, no tokens harmed.
import { RESUME_DATA } from "@/data/resume-data";
import { formatDuration, getStatus } from "@/lib/status";

export const AI_NAME = "Orbit";
export const MODEL_NAME = "pk-1-turbo";

export type SectionKey =
  | "about"
  | "work"
  | "skills"
  | "projects"
  | "publications"
  | "certifications"
  | "holopins";

export interface Card {
  title: string;
  meta?: string;
  desc?: string;
  href?: string;
}

export type Action =
  | { kind: "mail"; label: string }
  | { kind: "scroll"; label: string; target: string }
  | { kind: "link"; label: string; href: string }
  | { kind: "ask"; label: string; prompt: string };

export interface Reply {
  thoughts: string[];
  text: string;
  cards?: Card[];
  actions?: Action[];
}

export const SUGGESTIONS = [
  "What is he best at?",
  "Show me his top projects",
  "Has he worked with LLMs?",
  "How can I contact him?",
  "What is he doing right now?",
  "Roast his code",
  "Are you a real AI?",
];

const { projects, work, education, certifications, publications, holopins, skills, social } = {
  ...RESUME_DATA,
  social: RESUME_DATA.contact.social,
};

const YEARS = new Date().getFullYear() - 2019;
const DOC_COUNT =
  projects.length + work.length + certifications.length + publications.length + holopins.length + skills.length;

const rand = (min: number, max: number) => Math.floor(min + Math.random() * (max - min + 1));
const pick = <T,>(arr: readonly T[], n: number) => [...arr].sort(() => Math.random() - 0.5).slice(0, n);
const one = <T,>(arr: readonly T[]) => arr[Math.floor(Math.random() * arr.length)];

const STOPWORDS = new Set(
  "a an the is are was were be he his him has have had do does did with and or of to in on for at by it its this that what which who whom how any some me my i you your can could would should about tell show give list from as".split(
    " "
  )
);

const tokenize = (q: string) =>
  q
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, " ")
    .split(/\s+/)
    .map((t) => t.replace(/^[.-]+|[.-]+$/g, ""))
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));

const projectCard = (p: (typeof projects)[number]): Card => ({
  title: p.title,
  meta: p.techStack.filter((t) => !["Side Project", "Open Source"].includes(t)).slice(0, 3).join(" · "),
  desc: p.description,
  href: p.link.href,
});

function searchProjects(tokens: string[]) {
  return projects
    .map((p) => {
      const hay = `${p.title} ${p.techStack.join(" ")} ${p.description}`.toLowerCase();
      const score = tokens.reduce((s, t) => s + (hay.includes(t) ? (p.title.toLowerCase().includes(t) ? 3 : 1) : 0), 0);
      return { p, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || Number(b.p.featured) - Number(a.p.featured))
    .map((r) => r.p);
}

const trace = (intent: string, extra: string[] = []) => [
  `Classifying intent → ${intent}`,
  `Embedding query (${one([384, 768, 1024])} dims)`,
  `Searching ${DOC_COUNT} documents in résumé index`,
  ...extra,
  `Grounding answer in verified sources`,
];

// ---------- Section summaries (the sparkle buttons) ----------

const SECTION_LABEL: Record<SectionKey, string> = {
  about: "About",
  work: "Experience",
  skills: "Toolbox",
  projects: "Projects",
  publications: "Writing",
  certifications: "Certifications",
  holopins: "Badges",
};

const ABOUT_SUMMARY = [
  { title: "The Developer", aiSummary: "A self-proclaimed Python whisperer who somehow also befriended JavaScript. Builds things that work, occasionally breaks things that worked, and absolutely fears CSS. 💀" },
  { title: "The Open Source Enthusiast", aiSummary: "Contributes code to the void and hopes the void contributes back. 80k+ developers have downloaded his packages, which is either impressive or terrifying. 📦" },
  { title: "The AI Explorer", aiSummary: "Chasing the LLM hype train while actually understanding what's happening under the hood. 🤖" },
  { title: "The Goal", aiSummary: "Keep learning, keep building, and leave the internet a little cooler. Also, secretly hoping someone reads this and sends a job offer. Wink wink. 😎" },
];

const SKILLS_SUMMARY = [
  { title: "Frontend", aiSummary: "React, TypeScript, Angular - basically making buttons look pretty and actually do things. CSS is still scary but we survive. 🎨" },
  { title: "Backend", aiSummary: "Node.js, Express, FastAPI, Python - the stuff that actually runs the show while frontend gets all the credit. 🔧" },
  { title: "AI/ML", aiSummary: "PyTorch, LangChain, RAG, Agents - teaching computers to think. Sometimes they listen. Sometimes they hallucinate. It's a journey. 🧠" },
  { title: "DevOps & Tools", aiSummary: "Docker, AWS, MongoDB, SQL - the 'it works on my machine' prevention toolkit. Deploy with confidence, debug with panic. 🚀" },
  { title: "Automation", aiSummary: "Puppeteer, Selenium, Web Scraping - making robots do boring stuff so humans can do... less boring stuff? 🤖" },
];

function sectionItems(section: SectionKey): { title: string; aiSummary?: string }[] {
  switch (section) {
    case "about": return ABOUT_SUMMARY;
    case "skills": return SKILLS_SUMMARY;
    case "work": return work.map((w) => ({ title: `${w.title} at ${w.company}`, aiSummary: w.aiSummary }));
    case "projects": return projects;
    case "publications": return publications;
    case "certifications": return certifications.map((c) => ({ ...c, title: c.title.trim() }));
    case "holopins": return holopins;
  }
}

export function summarize(section: SectionKey): Reply {
  const items = sectionItems(section).filter((i) => i.aiSummary);
  const label = SECTION_LABEL[section];
  return {
    thoughts: [
      `Loading section "${label}"`,
      `Compressing ${items.length} items → TL;DR`,
      `Injecting personality (temperature ${one(["0.9", "1.1", "1.3"])})`,
      `Fact-checking the jokes`,
    ],
    text:
      `Here's the no-fluff TL;DR of **${label}**:\n\n` +
      items.map((it, i) => `${i + 1}. **${it.title}**: ${it.aiSummary}`).join("\n") +
      `\n\nThat's the vibe. Ask me a follow-up. I don't bite, I just autocomplete.`,
    actions: [
      { kind: "scroll", label: `Jump to ${label}`, target: section === "publications" ? "writing" : section === "holopins" ? "badges" : section },
      { kind: "ask", label: "Show me his top projects", prompt: "Show me his top projects" },
    ],
  };
}

// ---------- Intents ----------

type Intent = { name: string; test: RegExp; run: (q: string, tokens: string[]) => Reply };

const SKILL_GROUPS: [string, RegExp][] = [
  ["Frontend", /javascript|typescript|react|angular/i],
  ["Backend & data", /node|express|python|fastapi|mongo|sql/i],
  ["AI / ML", /machine|vision|genai|pytorch|langchain|rag|agents/i],
  ["Automation", /telegram|scraping|automation|puppeteer|selenium/i],
  ["Cloud & DevOps", /docker|aws/i],
];

export function groupedSkills() {
  const groups = new Map<string, string[]>();
  for (const s of skills) {
    const g = SKILL_GROUPS.find(([, re]) => re.test(s))?.[0] ?? "Also";
    groups.set(g, [...(groups.get(g) ?? []), s]);
  }
  return Array.from(groups.entries());
}

const INTENTS: Intent[] = [
  {
    name: "meta",
    test: /\b(are you|r u)\b.*\b(real|ai|human|bot|gpt|llm|sentient|alive)\b|what model|which model|who (made|built|trained) you|your (model|weights|parameters)/i,
    run: () => ({
      thoughts: ["Classifying intent → existential crisis", "Checking own weights", "Weights not found", "Deciding to be honest-ish"],
      text: one([
        `I'm **${AI_NAME}**, running **${MODEL_NAME}**, a highly specialised model fine-tuned on exactly one human: Nuhman. Parameter count is classified, but let's just say it fits comfortably in your browser tab. 🧠\n\nWhether I'm "real" AI is a philosophical question. Whether Nuhman builds real AI is not, so ask me about his LLM work.`,
        `Real enough to have read his entire résumé ${rand(300, 900)} times this morning. My context window is small, but it's all Nuhman. 🤖\n\nTry asking me something only a truly intelligent model could answer, like "what's his best project?"`,
      ]),
      actions: [{ kind: "ask", label: "Has he worked with LLMs?", prompt: "Has he worked with LLMs?" }],
    }),
  },
  {
    name: "greeting",
    test: /^\s*(hi|hey|hello|yo|sup|hola|namaste|good (morning|evening|afternoon))\b/i,
    run: () => ({
      thoughts: ["Classifying intent → greeting", "Warming up the charm module"],
      text: `Hey! 👋 I'm **${AI_NAME}**, Nuhman's AI. I know everything on this page, and I'm extremely biased in his favour.\n\nAsk me about his **projects**, **stack**, **experience**, or how to **reach him**.`,
      actions: pick(SUGGESTIONS, 3).map((s) => ({ kind: "ask" as const, label: s, prompt: s })),
    }),
  },
  {
    name: "status",
    test: /right now|at the moment|currently doing|doing now|up to|is he (awake|asleep|online|busy|free|around)|\b(awake|asleep)\b/i,
    run: () => {
      const st = getStatus();
      return {
        thoughts: ["Classifying intent → live status", "Checking Kerala time (IST)", "Consulting his extremely strict routine"],
        text: `Right now (Kerala time) he's **${st.title.toLowerCase()}**. ${st.detail}\n\nUp next: **${st.next.title.toLowerCase()}** in ${formatDuration(st.minutesUntilNext)}.`,
        actions: [{ kind: "scroll", label: "See live status", target: "contact" }],
      };
    },
  },
  {
    name: "contact",
    test: /hire|hiring|contact|e-?mail|reach|available|availability|freelance|opportunit|recruit|interview|talk to|get in touch/i,
    run: () => ({
      thoughts: trace("contact", ["Checking current status", "Drafting a polite reply"]),
      text: `Heads up: he's **not taking on new work** right now. He's a **${work[0].title}** at **${work[0].company}** and fully committed there.\n\nThat said, he's always happy to chat about **open source**, **AI tooling**, or anything he's built. Email is the best way to reach him.`,
      actions: [
        { kind: "mail", label: "Email Nuhman" },
        ...social.filter((s) => s.name === "LinkedIn").map((s) => ({ kind: "link" as const, label: "LinkedIn", href: s.url })),
      ],
    }),
  },
  {
    name: "resume",
    test: /r[ée]sum[ée]|\bcv\b|pdf/i,
    run: () => ({
      thoughts: ["Classifying intent → résumé", "Looking for a PDF", "Realising this whole page is the résumé"],
      text: `No PDFs here: **this page is the résumé**, and I'm the interactive version of it. 📄\n\nFor the formal stuff, LinkedIn has the full history, or just email him directly.`,
      actions: [
        { kind: "mail", label: "Email Nuhman" },
        ...social.filter((s) => s.name === "LinkedIn").map((s) => ({ kind: "link" as const, label: "LinkedIn", href: s.url })),
      ],
    }),
  },
  {
    name: "roast",
    test: /roast|joke|funny|make me laugh|fun fact|humou?r/i,
    run: () => {
      const burns = pick(
        [...projects, ...certifications, ...publications].filter((i) => i.aiSummary),
        3
      );
      return {
        thoughts: ["Classifying intent → roast", "Disabling politeness filter", "Re-enabling it slightly (he might read this)"],
        text:
          `Alright, gloves off. 🔥\n\n` +
          burns.map((b) => `- **${b.title.trim()}**: ${b.aiSummary}`).join("\n") +
          `\n\nIn fairness, his code runs in production for tens of thousands of people. Mine runs in a browser tab. Respect.`,
        actions: [{ kind: "ask", label: "Roast him again", prompt: "Roast his code" }],
      };
    },
  },
  {
    name: "experience",
    test: /experience|work(ed|s|ing)? (at|for)|\bjob|career|bititude|compan|years|senior|role|position/i,
    run: () => ({
      thoughts: trace("experience", [`Computing tenure since 2019 → ${YEARS} years`]),
      text: `**${YEARS}+ years** of building in public and in production.\n\nCurrently **${work[0].title}** at **${work[0].company}** (${work[0].start} to ${work[0].end}), after being promoted from Full Stack Developer. On the side, he's been an open-source contributor since 2019, shipping PyPI packages, VS Code extensions and Telegram bots used by **80,000+ developers**.`,
      cards: work.map((w) => ({ title: w.title, meta: `${w.company} · ${w.start} to ${w.end}`, href: w.link })),
      actions: [{ kind: "scroll", label: "Jump to Experience", target: "work" }],
    }),
  },
  {
    name: "education",
    test: /educat|degree|college|universit|stud(y|ied)|graduat|school/i,
    run: () => ({
      thoughts: trace("education"),
      text: education.map((e) => `He holds a **${e.degree}** from **${e.school}** (${e.start} to ${e.end}).`).join("\n") +
        `\n\nBut honestly most of his education is on the **${certifications.length} certifications** he's stacked since: LangChain, LangGraph, MCP, PyTorch and more.`,
      actions: [{ kind: "ask", label: "Show certifications", prompt: "What certifications does he have?" }],
    }),
  },
  {
    name: "certifications",
    test: /certif|course|credential|learn(ing|ed)?|academy|udemy|kaggle/i,
    run: () => {
      const featured = certifications.filter((c) => c.featured);
      return {
        thoughts: trace("certifications", [`Verifying ${certifications.length} credentials`]),
        text: `**${certifications.length} certifications** and counting, heavily skewed toward modern AI tooling. The highlights:`,
        cards: featured.map((c) => ({ title: c.title.trim(), meta: `${c.techStack[0]} · ${c.techStack[1]}`, href: c.link.href })),
        actions: [{ kind: "scroll", label: "See all certifications", target: "certifications" }],
      };
    },
  },
  {
    name: "writing",
    test: /writ(e|ing|es)|article|blog|medium|publication|post|read/i,
    run: () => ({
      thoughts: trace("writing", ["Fetching Medium index"]),
      text: `He writes practical, hands-on guides on **Medium**, mostly about the tools he builds and the AI stack he uses. ${publications.length} articles so far. Start with these:`,
      cards: publications.filter((p) => p.featured).map((p) => ({ title: p.title, meta: `Medium · ${p.techStack[0]}`, href: p.link.href })),
      actions: [{ kind: "scroll", label: "Jump to Writing", target: "writing" }],
    }),
  },
  {
    name: "badges",
    test: /badge|holopin|hacktoberfest|community|contribut/i,
    run: () => ({
      thoughts: trace("community"),
      text: `Hacktoberfest regular. 🌲 His 2025 run earned **Supercontributor** (6+ merged PRs) and he's in the **5 Badge Club**. ${holopins.length} Holopin badges in total, plus a few trees planted in his name.`,
      cards: holopins.filter((h) => h.featured).slice(0, 3).map((h) => ({ title: h.title, href: h.link })),
      actions: [{ kind: "scroll", label: "Jump to Badges", target: "badges" }],
    }),
  },
  {
    name: "llm",
    test: /\b(llm|llms|gen ?ai|genai|langchain|langgraph|rag|agents?|ollama|gemini|mcp|machine learning|ml|ai)\b/i,
    run: () => {
      const hits = projects.filter((p) => /llm|ollama|gemini|ml|anpr/i.test(`${p.techStack.join(" ")} ${p.description}`));
      return {
        thoughts: trace("ai-experience", ["Cross-referencing projects × certifications", `Found ${hits.length} relevant projects`]),
        text: `**Yes, a lot.** AI/ML is where he spends most of his curiosity.\n\n- Ships LLM-powered tools like **Quick Llama** (an Ollama wrapper) and **SnapNutriBot** (built on Gemini for a Google competition)\n- Certified in **LangChain, LangGraph, Ambient Agents and MCP**\n- Works with **PyTorch, RAG and agent** architectures\n\nFunnily enough, he did *not* use any of that to build me. I'm artisanal.`,
        cards: hits.slice(0, 4).map(projectCard),
      };
    },
  },
  {
    name: "skills",
    test: /skill|stack|tech|language|framework|tool(s|box|kit)|good at|best at|strength|expert|know/i,
    run: (_q, tokens) => {
      const named = skills.filter((s) => tokens.some((t) => s.toLowerCase().includes(t) && t.length > 2));
      const groups = groupedSkills();
      if (named.length) {
        const related = searchProjects(named.map((s) => s.toLowerCase()));
        return {
          thoughts: trace("skill-lookup", [`Matched skill: ${named.join(", ")}`, `Finding projects that prove it`]),
          text: `**${named.join(", ")}**? Yes, that's part of his core toolbox.${related.length ? ` Receipts:` : ""}`,
          cards: related.slice(0, 4).map(projectCard),
        };
      }
      return {
        thoughts: trace("skills", ["Clustering 24 skills into domains"]),
        text:
          `He's a **full-stack engineer with an AI/ML bias**: the kind who can design the API, build the UI, and wire an LLM into it.\n\n` +
          groups.map(([g, list]) => `- **${g}:** ${list.join(", ")}`).join("\n") +
          `\n\nIf I had to pick one superpower: turning a rough idea into a **published, used-in-production tool**, fast.`,
        actions: [{ kind: "ask", label: "Show me his top projects", prompt: "Show me his top projects" }],
      };
    },
  },
  {
    name: "projects",
    test: /project|built|build|made|creat|open.?source|package|pypi|npm|extension|vs ?code|bot|tool|github|portfolio|best|top|favou?rite/i,
    run: (_q, tokens) => {
      const hits = searchProjects(tokens.filter((t) => !/project|built|build|made|best|top|open|source|tool/.test(t)));
      const list = hits.length ? hits : projects.filter((p) => p.featured);
      return {
        thoughts: trace("projects", [`Reranking ${list.length} candidates by impact`]),
        text: hits.length
          ? `Found **${hits.length} project${hits.length > 1 ? "s" : ""}** that match. Top pick is **${hits[0].title}**: ${hits[0].description.split(". ")[0].toLowerCase()}.`
          : `He's shipped **${projects.length} open-source tools**: PyPI packages, VS Code extensions, npm CLIs and bots. The flagship is **YoutubeTags** with **100k+ downloads**. Here's the shortlist:`,
        cards: list.slice(0, 4).map(projectCard),
        actions: [{ kind: "scroll", label: "Browse all projects", target: "projects" }],
      };
    },
  },
];

export function answer(query: string): Reply {
  const tokens = tokenize(query);

  // Direct hit on a project name wins
  const named = projects.find((p) => query.toLowerCase().includes(p.title.toLowerCase()));
  if (named) {
    return {
      thoughts: trace(`project-lookup`, [`Exact match: "${named.title}"`]),
      text: `**${named.title}**: ${named.description}\n\n${named.aiSummary}`,
      cards: [projectCard(named)],
      actions: [{ kind: "ask", label: "What else has he built?", prompt: "Show me his top projects" }],
    };
  }

  const intent = INTENTS.find((i) => i.test.test(query));
  if (intent) return intent.run(query, tokens);

  // Last resort: keyword retrieval
  const hits = searchProjects(tokens);
  if (hits.length) {
    return {
      thoughts: trace("open-search", [`Top-k retrieval → ${hits.length} hits`]),
      text: `Not 100% sure what you're after, but these look relevant:`,
      cards: hits.slice(0, 3).map(projectCard),
    };
  }

  return {
    thoughts: ["Classifying intent → ¯\\_(ツ)_/¯", `Searching ${DOC_COUNT} documents`, "0 results. Considering hallucinating.", "Decided against it"],
    text: one([
      `Hmm, that's outside my training data (which is, admittedly, one person). I only know about Nuhman, and I refuse to hallucinate about him. Try one of these:`,
      `I could make something up, but I'm a *responsible* AI. Ask me about his work instead:`,
    ]),
    actions: pick(SUGGESTIONS, 3).map((s) => ({ kind: "ask" as const, label: s, prompt: s })),
  };
}
