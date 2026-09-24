"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowUpRight, ChevronDown, ChevronUp, Sparkles, Copy, Check } from "lucide-react";
import { RESUME_DATA } from "@/data/resume-data";
import { ProjectCard } from "@/components/project-card";
import { HolopinCard } from "@/components/holopin-card";
import { IndexRow } from "@/components/index-row";
import { Marquee } from "@/components/marquee";
import { AskAI, AskBar, AskPill, type AIRequest } from "@/components/ask-ai";
import { MilestoneToast } from "@/components/milestone-toast";
import { ViewAllCard, ViewAllRow } from "@/components/view-all";
import { StatusCard } from "@/components/status-card";
import { groupedSkills, type SectionKey } from "@/lib/fake-ai";
import { EXTRA_PROFILES } from "@/lib/seo";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import { ThemeSwitcher } from "@/components/theme-switcher";
import md5 from "md5";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { AuraButton } from "@/components/AuraBox";

const EASE = [0.22, 1, 0.36, 1] as const;

// Scroll-reveal for each section. Slide only (no opacity) so content is never
// stuck invisible in the static HTML if the in-view trigger doesn't fire.
const reveal = {
  initial: { y: 48 },
  whileInView: { y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: EASE },
};

const NAV: { id: string; label: string }[] = [
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "projects", label: "Projects" },
  { id: "writing", label: "Writing" },
  { id: "certifications", label: "Certs" },
  { id: "contact", label: "Contact" },
];

// Hand-maintained numbers. Update occasionally.
// Last checked Sep 2026 via PyPI, VS Code Marketplace, npm and GitHub APIs.
const STATS = [
  { value: "100k+", label: "PyPI downloads" },
  { value: "8", label: "PyPI packages" },
  { value: "5.3k+", label: "VS Code installs" },
  { value: "3", label: "VS Code extensions" },
  { value: "1.3k+", label: "npm downloads" },
  { value: "5", label: "npm packages" },
  { value: "900+", label: "GitHub stars" },
  { value: "100+", label: "Public repos" },
  { value: "16", label: "Certifications" },
  { value: `${new Date().getFullYear() - 2019}+`, label: "Years shipping" },
];

const SERVICES = [
  { title: "Full-stack web apps", tech: "React, Next.js, Node.js" },
  { title: "AI & LLM integrations", tech: "RAG, agents, MCP" },
  { title: "APIs & backend systems", tech: "FastAPI, Express" },
  { title: "Automation, scraping & data pipelines", tech: "Python, Puppeteer, Selenium" },
  { title: "Telegram & chat bots at scale", tech: "Pyrogram, Node.js" },
  { title: "Developer tooling", tech: "CLIs, VS Code extensions, SDKs" },
];

const OPEN_SOURCE_LINKS = [
  ...EXTRA_PROFILES.map((p) => ({ label: p.name === "VS Code Marketplace" ? "VS Code" : p.name, href: p.url })),
  { label: "GitHub", href: "https://github.com/nuhmanpk" },
];

const COLOPHON = ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "GitHub Pages"];

function SectionHeader({
  index,
  kicker,
  title,
  onSummarize,
  action,
}: {
  index: string;
  kicker: string;
  title: string;
  onSummarize: () => void;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <span className="text-brand-ink">{index}</span> / {kicker}
        </span>
        <div className="mt-3 flex items-center gap-3">
          <h2 className="font-display text-5xl font-bold tracking-[-0.03em] md:text-7xl">
            {title}
          </h2>
          <AuraButton label={`Ask AI to summarize ${title}`} onClick={onSummarize}>
            <Sparkles className="h-5 w-5" />
          </AuraButton>
        </div>
      </div>
      {action}
    </div>
  );
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors ${active
        ? "border-brand bg-brand text-brand-foreground"
        : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
        }`}
    >
      {children}
    </button>
  );
}

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
      {children}
    </p>
  );
}

export default function Page() {
  const gravatarUrl = `https://www.gravatar.com/avatar/${md5(
    RESUME_DATA.contact.email
  )}?s=200`;

  const [visitorCount, setVisitorCount] = useState<string | null>(null);
  const [milestone, setMilestone] = useState<number | null>(null);
  const counted = useRef(false);
  const [showUp, setShowUp] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [rollingCount, setRollingCount] = useState(0);
  const [hasRolled, setHasRolled] = useState(false);
  const [localVisits, setLocalVisits] = useState<number>(0);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const [currentSection, setCurrentSection] = useState(0);

  // Show All state for each section
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showAllPublications, setShowAllPublications] = useState(false);
  const [showAllCerts, setShowAllCerts] = useState(false);
  const [showAllHolopins, setShowAllHolopins] = useState(false);

  // AI panel state
  const [aiOpen, setAiOpen] = useState(false);
  const [aiRequest, setAiRequest] = useState<AIRequest | null>(null);

  // Tech filter state
  const [activeTechFilter, setActiveTechFilter] = useState<string | null>(null);

  // The address is only attached after mount so it never appears in the static HTML
  const [mailto, setMailto] = useState<string | undefined>();
  const [emailCopied, setEmailCopied] = useState(false);

  // Hero copy is derived from data: "Role | Headline"
  const [roleLine, headline] = RESUME_DATA.about.split("|").map((s) => s.trim());
  const nameWords = RESUME_DATA.name.split(" ");

  // Get all unique tech stacks for filter
  const allTechStacks = Array.from(
    new Set(RESUME_DATA.projects.flatMap((p: { techStack: readonly string[]; }) => p.techStack))
  ).slice(0, 10); // Limit to top 10

  // Filter data based on featured flag and tech filter
  const featuredProjects = RESUME_DATA.projects.filter((p: { featured?: boolean; }) => p.featured);
  const filteredProjects = activeTechFilter
    ? RESUME_DATA.projects.filter((p: { techStack: readonly string[]; }) =>
      p.techStack.includes(activeTechFilter)
    )
    : showAllProjects
      ? RESUME_DATA.projects
      : featuredProjects;

  const featuredPublications = RESUME_DATA.publications.filter((p: { featured?: boolean; }) => p.featured);
  const featuredCerts = RESUME_DATA.certifications.filter((c: { featured?: boolean; }) => c.featured);
  const featuredHolopins = RESUME_DATA.holopins.filter((h: { featured?: boolean; }) => h.featured);

  const displayedPublications = showAllPublications ? RESUME_DATA.publications : featuredPublications;
  const displayedCerts = showAllCerts ? RESUME_DATA.certifications : featuredCerts;
  const displayedHolopins = showAllHolopins ? RESUME_DATA.holopins : featuredHolopins;

  const askAI = useCallback((prompt?: string, section?: SectionKey) => {
    setAiOpen(true);
    if (prompt) setAiRequest({ prompt, section, nonce: Date.now() });
  }, []);

  const summarize = (section: SectionKey, title: string) => () =>
    askAI(`TL;DR the ${title} section`, section);

  const closeMilestone = useCallback(() => setMilestone(null), []);

  // After collapsing a long list, bring its section back into view if we've scrolled past its top
  const collapseTo = (i: number) => {
    const el = sectionRefs.current[i];
    if (el && el.getBoundingClientRect().top < 0) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const projectsExpanded = showAllProjects || !!activeTechFilter;

  const openMail = () => {
    window.location.href = `mailto:${RESUME_DATA.contact.email}`;
  };

  const copyEmail = async () => {
    await navigator.clipboard.writeText(RESUME_DATA.contact.email);
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2000);
  };

  useEffect(() => {
    setMailto(`mailto:${RESUME_DATA.contact.email}`);

    // Guard against React dev double-invoking effects (each fetch counts a visit)
    if (!counted.current) {
      counted.current = true;

      // visitorbadge.io rejects localhost referers, so don't send one
      fetch(
        "https://api.visitorbadge.io/api/visitors?path=https://github.com/nuhmanpk/portfolio",
        { referrerPolicy: "no-referrer" }
      )
        .then((res) => res.text())
        .then((data) => {
          const match = data.match(/<title>VISITORS: ([\d.,]+)<\/title>/);
          if (match && match[1]) {
            const clean = match[1].replace(/[.,]/g, "");
            setVisitorCount(clean);
            // The badge increments on fetch, so this is *this* visitor's number.
            // Celebrate every multiple of 10 (append ?celebrate to preview it).
            const n = Number(clean);
            const preview = new URLSearchParams(window.location.search).has("celebrate");
            if (n > 0 && (n % 10 === 0 || preview)) setMilestone(preview ? Math.ceil(n / 10) * 10 : n);
          }
        })
        .catch(() => setVisitorCount(null));

      const visits = localStorage.getItem("visit-count");
      const updated = visits ? parseInt(visits) + 1 : 1;
      localStorage.setItem("visit-count", updated.toString());
      setLocalVisits(updated);
    }

  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const bodyHeight = document.body.scrollHeight;
      const nearBottom = scrollTop + windowHeight >= bodyHeight - 100;
      setShowUp(nearBottom);
      setScrolled(scrollTop > 40);
      setPastHero(scrollTop > windowHeight * 0.9);

      if (nearBottom && visitorCount && !hasRolled) {
        setHasRolled(true);
        let count = 0;
        const target = Number(visitorCount);
        const step = Math.ceil(target / 100);
        const interval = setInterval(() => {
          count += step;
          if (count >= target) {
            count = target;
            clearInterval(interval);
          }
          setRollingCount(count);
        }, 15);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [visitorCount, hasRolled]);

  // ⌘K / Ctrl+K toggles the AI panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setAiOpen((open) => !open);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleScrollNext = () => {
    if (!sectionRefs.current.length) return;
    const nextIndex = (currentSection + 1) % sectionRefs.current.length;
    setCurrentSection(nextIndex);
    sectionRefs.current[nextIndex]?.scrollIntoView({ behavior: "smooth" });
  };

  const setSectionRef = (i: number) => (el: HTMLElement | null) => {
    sectionRefs.current[i] = el;
  };

  const viewEmoji = (() => {
    if (rollingCount % 1000 === 0) return "🎉";
    if (rollingCount % 500 === 0) return "🚀";
    if (rollingCount % 100 === 0) return "🌟";
    if (rollingCount % 10 === 0) return "🦄";
    if ([1, 3, 7].includes(rollingCount % 10)) return "🔥";
    return "👀";
  })();

  const socials = (
    <div className="flex flex-wrap gap-2 print:hidden">
      {RESUME_DATA.contact.social.map((social) => (
        <a
          key={social.name}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.name}
          title={social.name}
          className="grid h-10 w-10 place-items-center rounded-full border border-border text-muted-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-brand hover:bg-brand hover:text-brand-foreground"
        >
          <social.icon className="h-4 w-4" />
        </a>
      ))}
    </div>
  );

  const copyButton = (
    <button
      onClick={copyEmail}
      aria-label="Copy email address"
      title={emailCopied ? "Copied!" : "Copy email address"}
      className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-border transition-colors hover:border-foreground"
    >
      {emailCopied ? <Check className="h-4 w-4 text-brand-ink" /> : <Copy className="h-4 w-4" />}
    </button>
  );

  return (
    <MotionConfig reducedMotion="user">

      <MilestoneToast count={milestone} onClose={closeMilestone} />

      {/* AI panel */}
      <AskAI open={aiOpen} onOpenChange={setAiOpen} request={aiRequest} onMail={openMail} />

      {/* Top Nav */}
      <nav
        className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 print:hidden ${scrolled ? "border-b border-border bg-background/75 backdrop-blur-lg" : "border-b border-transparent"
          }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-1.5 md:px-10">
          <a href="#top" className="group flex items-center gap-2 font-display text-xl font-bold tracking-tight">
            <span className="relative block h-[60px] w-[60px] shrink-0">
              {/* Rotating text ring around a still photo */}
              <svg
                viewBox="0 0 100 100"
                className="absolute inset-0 h-full w-full animate-spin-slow group-hover:[animation-play-state:paused]"
                aria-hidden
              >
                <defs>
                  <path id="logo-ring" d="M50,50 m-42,0 a42,42 0 1,1 84,0 a42,42 0 1,1 -84,0" />
                </defs>
                <text className="fill-current font-mono text-[10.5px] font-semibold uppercase tracking-[0.08em]">
                  <textPath href="#logo-ring">Open source · AI / ML · Full stack ·</textPath>
                </text>
              </svg>
              <Avatar className="absolute inset-[23%] h-auto w-auto rounded-full ring-2 ring-brand ring-offset-1 ring-offset-background">
                <AvatarImage alt={`${RESUME_DATA.name} profile photo`} src={gravatarUrl} />
                <AvatarFallback className="text-[10px]">{RESUME_DATA.initials}</AvatarFallback>
              </Avatar>
            </span>
            <span>
              {RESUME_DATA.initials.toUpperCase()}
              <span className="text-brand-ink">.</span>
            </span>
          </a>
          <div className="hidden items-center gap-1 lg:flex">
            {NAV.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                className="rounded-full px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {n.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <AskPill onClick={() => askAI()} />
            <ThemeSwitcher />
          </div>
        </div>
      </nav>

      <main id="top" className="relative mx-auto max-w-6xl px-5 print:p-12 md:px-10">
        {/* Hero */}
        <header className="pb-16 pt-28 md:pt-36">
          <h1 className="font-display text-[clamp(4.5rem,18vw,14rem)] font-bold uppercase leading-[0.82] tracking-[-0.05em]">
            {nameWords.map((word, i) => {
              const isLast = i === nameWords.length - 1;
              return (
                <span key={word} className="block overflow-hidden">
                  <motion.span
                    className="block"
                    initial={{ y: "105%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.9, delay: 0.1 + i * 0.12, ease: EASE }}
                  >
                    {word}
                    {isLast && <span className="text-brand-ink">.</span>}
                  </motion.span>
                </span>
              );
            })}
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
            className="mt-12 grid gap-10 md:grid-cols-12 md:items-end"
          >
            <div className="md:col-span-7">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {roleLine}
              </p>
              <p className="mt-4 font-serif text-3xl leading-[1.1] md:text-5xl">
                <span className="italic">{headline}</span>
                <span className="text-brand-ink">.</span>
              </p>
            </div>
            <div className="flex flex-col gap-4 md:col-span-5 md:items-end">
              <div className="flex items-center gap-2 self-start md:self-end">
                <a
                  href={mailto}
                  className="group inline-flex items-center gap-3 rounded-full bg-foreground py-2 pl-5 pr-2 font-medium text-background transition-transform hover:scale-[1.02]"
                >
                  Get in touch
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-brand text-brand-foreground transition-transform group-hover:rotate-45">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </a>
                {copyButton}
              </div>
              {socials}
            </div>
          </motion.div>

          {/* Ask AI */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.65, ease: EASE }}
            className="mt-12"
          >
            <AskBar onAsk={(q) => askAI(q)} />
          </motion.div>

          {/* Stats */}
          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-5"
          >
            {STATS.map((stat) => (
              <div key={stat.label} className="bg-background p-5 md:p-6">
                <dt className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                  {stat.label}
                </dt>
                <dd className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">
                  {stat.value}
                </dd>
              </div>
            ))}
          </motion.dl>
        </header>

        <div className="space-y-32 py-16 md:space-y-40">
          {/* About */}
          <motion.section id="about" ref={setSectionRef(0)} className="scroll-mt-24" {...reveal}>
            <SectionHeader index="01" kicker="Intro" title="About" onSummarize={summarize("about", "About")} />
            <p className="font-display text-2xl font-medium leading-snug tracking-tight md:text-4xl">
              {RESUME_DATA.aboutLead}
            </p>
            <div className="mt-14 grid gap-x-10 gap-y-12 md:grid-cols-2">
              {RESUME_DATA.aboutSections.map((section, i) => (
                <div
                  key={section.label}
                  className="border-t border-border pt-5 md:[&:last-child:nth-child(odd)]:col-span-2"
                >
                  <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    <span className="text-brand-ink">{String(i + 1).padStart(2, "0")}</span> / {section.label}
                  </h3>
                  <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{section.text}</p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Work + Education */}
          <motion.section id="work" ref={setSectionRef(1)} className="scroll-mt-24" {...reveal}>
            <SectionHeader index="02" kicker="Career" title="Experience" onSummarize={summarize("work", "Experience")} />
            <ul className="border-t border-border">
              {RESUME_DATA.work.map((work) => (
                <IndexRow
                  key={work.title + work.start}
                  meta={`${work.start} to ${work.end}`}
                  title={work.title}
                  sub={`${work.company} · ${work.badges.join(", ")}`}
                  href={work.link}
                >
                  {work.description || undefined}
                </IndexRow>
              ))}
            </ul>

            <p className="mb-4 mt-16 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Education
            </p>
            <ul className="border-t border-border">
              {RESUME_DATA.education.map((education) => (
                <IndexRow
                  key={education.school}
                  meta={`${education.start} to ${education.end}`}
                  title={education.degree}
                  sub={education.school}
                />
              ))}
            </ul>
          </motion.section>

          {/* Skills */}
          <motion.section id="skills" ref={setSectionRef(2)} className="scroll-mt-24" {...reveal}>
            <SectionHeader index="03" kicker="Stack" title="Toolbox" onSummarize={summarize("skills", "Toolbox")} />
            <div className="flex flex-wrap gap-2 md:gap-3">
              {RESUME_DATA.skills.map((skill, i) => (
                <span
                  key={skill}
                  className="group inline-flex items-baseline gap-2 rounded-full border border-border px-4 py-2 text-base transition-colors duration-300 hover:border-foreground hover:bg-foreground hover:text-background md:px-5 md:py-2.5 md:text-lg"
                >
                  <span className="font-mono text-[10px] text-muted-foreground group-hover:text-background/60">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {skill}
                </span>
              ))}
            </div>
          </motion.section>

          {/* Projects */}
          <motion.section id="projects" ref={setSectionRef(3)} className="scroll-mt-24" {...reveal}>
            <SectionHeader
              index="04"
              kicker="Selected work"
              title="Projects"
              onSummarize={summarize("projects", "Projects")}
            />

            {/* Tech Filter Pills */}
            <div className="mb-8 flex flex-wrap gap-2">
              <Pill active={!activeTechFilter} onClick={() => setActiveTechFilter(null)}>
                All
              </Pill>
              {allTechStacks.map((tech) => (
                <Pill
                  key={tech}
                  active={activeTechFilter === tech}
                  onClick={() => {
                    setActiveTechFilter(tech === activeTechFilter ? null : tech);
                    setShowAllProjects(true);
                  }}
                >
                  {tech}
                </Pill>
              ))}
            </div>

            <motion.div layout className="grid grid-flow-dense grid-cols-1 gap-4 md:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project, i) => (
                  <motion.div
                    key={project.title}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.35, ease: EASE }}
                    className={i === 0 ? "md:col-span-2" : ""}
                  >
                    <ProjectCard
                      index={i}
                      highlight={i === 0}
                      title={project.title}
                      description={project.description}
                      tags={project.techStack}
                      link={"link" in project ? project.link.href : undefined}
                    />
                  </motion.div>
                ))}
                {RESUME_DATA.projects.length > featuredProjects.length && (
                  <motion.div
                    key="view-all"
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.35, ease: EASE }}
                  >
                    <ViewAllCard
                      expanded={projectsExpanded}
                      remaining={RESUME_DATA.projects.length - featuredProjects.length}
                      total={RESUME_DATA.projects.length}
                      noun="projects"
                      expandedLabel={activeTechFilter ? "Clear filter" : undefined}
                      onClick={() => {
                        if (projectsExpanded) {
                          setShowAllProjects(false);
                          setActiveTechFilter(null);
                          collapseTo(3);
                        } else {
                          setShowAllProjects(true);
                        }
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.section>

          {/* Publications */}
          <motion.section id="writing" ref={setSectionRef(4)} className="scroll-mt-24" {...reveal}>
            <SectionHeader
              index="05"
              kicker="Publications"
              title="Writing"
              onSummarize={summarize("publications", "Writing")}
            />
            <ul className="border-t border-border">
              {displayedPublications.map((pub) => (
                <IndexRow
                  key={pub.title}
                  meta={pub.techStack[0]}
                  title={pub.title}
                  sub="Medium"
                  href={pub.link.href}
                />
              ))}
              {RESUME_DATA.publications.length > featuredPublications.length && (
                <ViewAllRow
                  expanded={showAllPublications}
                  remaining={RESUME_DATA.publications.length - featuredPublications.length}
                  total={RESUME_DATA.publications.length}
                  noun="articles"
                  onClick={() => {
                    setShowAllPublications(!showAllPublications);
                    if (showAllPublications) collapseTo(4);
                  }}
                />
              )}
            </ul>
          </motion.section>

          {/* Certifications */}
          <motion.section id="certifications" ref={setSectionRef(5)} className="scroll-mt-24" {...reveal}>
            <SectionHeader
              index="06"
              kicker="Always learning"
              title="Certifications"
              onSummarize={summarize("certifications", "Certifications")}
            />
            <ul className="border-t border-border">
              {displayedCerts.map((cert) => (
                <IndexRow
                  key={cert.title}
                  meta={cert.techStack[1]}
                  title={cert.title.trim()}
                  sub={cert.techStack[0]}
                  href={cert.link.href}
                />
              ))}
              {RESUME_DATA.certifications.length > featuredCerts.length && (
                <ViewAllRow
                  expanded={showAllCerts}
                  remaining={RESUME_DATA.certifications.length - featuredCerts.length}
                  total={RESUME_DATA.certifications.length}
                  noun="certifications"
                  onClick={() => {
                    setShowAllCerts(!showAllCerts);
                    if (showAllCerts) collapseTo(5);
                  }}
                />
              )}
            </ul>
          </motion.section>

          {/* Holopin Badges */}
          <motion.section id="badges" ref={setSectionRef(6)} className="scroll-mt-24" {...reveal}>
            <SectionHeader
              index="07"
              kicker="Community"
              title="Badges"
              onSummarize={summarize("holopins", "Badges")}
            />
            <motion.div layout className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {displayedHolopins.map((holopin) => (
                  <motion.div
                    key={holopin.title}
                    layout
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.94 }}
                    transition={{ duration: 0.3, ease: EASE }}
                  >
                    <HolopinCard
                      title={holopin.title}
                      description={holopin.description}
                      link={holopin.link}
                    />
                  </motion.div>
                ))}
                {RESUME_DATA.holopins.length > featuredHolopins.length && (
                  <motion.div
                    key="view-all"
                    layout
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.94 }}
                    transition={{ duration: 0.3, ease: EASE }}
                  >
                    <ViewAllCard
                      compact
                      expanded={showAllHolopins}
                      remaining={RESUME_DATA.holopins.length - featuredHolopins.length}
                      total={RESUME_DATA.holopins.length}
                      noun="badges"
                      onClick={() => {
                        setShowAllHolopins(!showAllHolopins);
                        if (showAllHolopins) collapseTo(6);
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.section>
        </div>

        {/* Footer / Contact */}
        <footer id="contact" className="mt-24 scroll-mt-24 border-t border-border pt-16">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <span className="text-brand-ink">08</span> / Contact
          </span>
          <h2 className="mt-6 font-display text-[clamp(3.25rem,11vw,9.5rem)] font-bold uppercase leading-[0.85] tracking-[-0.05em]">
            Don&apos;t be a
            <br />
            <span className="font-serif font-normal normal-case italic tracking-[-0.02em] text-brand-ink">
              stranger
            </span>
            .
          </h2>

          <div className="mt-12 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="flex items-center gap-4">
              <a
                href={mailto}
                className="group inline-flex items-center gap-3 font-display text-3xl font-medium tracking-tight underline decoration-brand decoration-[3px] underline-offset-[10px] transition-colors hover:text-brand-ink md:text-5xl"
              >
                Say hello
                <ArrowUpRight className="h-7 w-7 shrink-0 transition-transform duration-300 group-hover:rotate-45 md:h-9 md:w-9" />
              </a>
              {copyButton}
            </div>
            {socials}
          </div>

          {/* Directory */}
          <div className="mt-20 grid gap-12 border-t border-border pt-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
            {/* Live status */}
            <div className="lg:col-span-4">
              <FooterHeading>Right now</FooterHeading>
              <StatusCard />
            </div>

            {/* Services */}
            <div className="lg:col-span-3">
              <FooterHeading>What I do</FooterHeading>
              <ul className="space-y-2.5 text-sm">
                {SERVICES.map((s) => (
                  <li key={s.title} className="flex gap-2.5">
                    <span className="text-brand-ink">▸</span>
                    <span>
                      {s.title}
                      <span className="block text-xs text-muted-foreground">{s.tech}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Stack */}
            <div className="lg:col-span-3">
              <FooterHeading>Stack</FooterHeading>
              <dl className="space-y-3 text-sm">
                {groupedSkills().map(([group, list]) => (
                  <div key={group}>
                    <dt className="font-medium">{group}</dt>
                    <dd className="text-muted-foreground">{list.join(", ")}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Explore / Open source */}
            <div className="grid grid-cols-2 gap-8 sm:col-span-2 lg:col-span-2 lg:grid-cols-1">
              <div>
                <FooterHeading>Explore</FooterHeading>
                <ul className="space-y-2 text-sm">
                  {[...NAV.slice(0, -1), { id: "skills", label: "Toolbox" }, { id: "badges", label: "Badges" }].map((n) => (
                    <li key={n.id}>
                      <a href={`#${n.id}`} className="text-muted-foreground transition-colors hover:text-foreground">
                        {n.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <FooterHeading>Open source</FooterHeading>
                <ul className="space-y-2 text-sm">
                  {OPEN_SOURCE_LINKS.map((l) => (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {l.label} ↗
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Full project index: every project as a crawlable link */}
          <div className="mt-12 border-t border-border pt-8">
            <FooterHeading>All projects</FooterHeading>
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
              {RESUME_DATA.projects.map((p) => (
                <li key={p.title}>
                  <a
                    href={p.link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={p.description}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {p.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Elsewhere + colophon */}
          <div className="mt-12 grid gap-8 border-t border-border pt-8 md:grid-cols-2">
            <div>
              <FooterHeading>Elsewhere</FooterHeading>
              <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
                {RESUME_DATA.contact.social.map((s) => (
                  <a
                    key={s.name}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {s.name} ↗
                  </a>
                ))}
              </div>
            </div>
            <div>
              <FooterHeading>Colophon</FooterHeading>
              <p className="text-sm text-muted-foreground">
                Built with {COLOPHON.join(", ")}. Set in Space Grotesk, Instrument Serif & JetBrains Mono.
                Orbit, the AI, runs entirely in your browser.
              </p>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-3 border-t border-border py-6 font-mono text-[11px] uppercase tracking-widest text-muted-foreground md:flex-row md:items-center md:justify-between">
            <span>
              🌍 Your visits: {localVisits}
              {visitorCount && (
                <>
                  {" · "}
                  {viewEmoji} Total views #{hasRolled ? rollingCount : Number(visitorCount).toLocaleString()}
                </>
              )}
            </span>
            <a
              href="https://github.com/nuhmanpk/portfolio"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground"
            >
              Open source · Improve this page ↗
            </a>
            <span>© {new Date().getFullYear()} {RESUME_DATA.name}</span>
          </div>
        </footer>
      </main>

      {/* Crossing skill bands, the last thing on the page */}
      <div className="relative h-44 overflow-hidden md:h-56" aria-hidden>
        <div className="absolute left-1/2 top-1/2 w-[130vw] -translate-x-1/2 -translate-y-1/2 rotate-[3deg] border-y border-border bg-card py-3">
          <Marquee items={RESUME_DATA.skills} reverse className="text-muted-foreground" />
        </div>
        <div className="absolute left-1/2 top-1/2 w-[130vw] -translate-x-1/2 -translate-y-1/2 -rotate-[2deg] bg-brand py-4 text-brand-foreground shadow-2xl">
          <Marquee items={RESUME_DATA.skills} />
        </div>
      </div>

      {/* Floating AI dock (after the hero) */}
      <AnimatePresence>
        {pastHero && !aiOpen && (
          <motion.div
            key="ai-dock"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="pointer-events-none fixed inset-x-0 bottom-6 z-40 flex justify-center print:hidden"
          >
            <AskPill
              onClick={() => askAI()}
              className="pointer-events-auto shadow-[0_10px_40px_-10px_hsl(var(--brand)/0.6)]"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating scroll control */}
      <AnimatePresence mode="wait">
        {showUp ? (
          <motion.button
            key="up"
            aria-label="Back to top"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 right-6 z-40 grid h-12 w-12 place-items-center rounded-full bg-brand text-brand-foreground shadow-lg transition-transform hover:scale-110 print:hidden"
          >
            <ChevronUp className="h-5 w-5" />
          </motion.button>
        ) : (
          <motion.button
            key="down"
            aria-label="Next section"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={handleScrollNext}
            className="fixed bottom-6 right-6 z-40 grid h-12 w-12 place-items-center rounded-full border border-border bg-background/70 text-foreground shadow-md backdrop-blur-md transition-transform hover:scale-110 print:hidden"
          >
            <ChevronDown className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
