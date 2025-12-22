"use client";
import Head from "next/head";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Section } from "@/components/ui/section";
import { ChevronDown, ChevronUp, GlobeIcon, Sparkles, Eye, EyeOff, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RESUME_DATA } from "@/data/resume-data";
import { ProjectCard } from "@/components/project-card";
import { HolopinCard } from "@/components/holopin-card";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeSwitcher } from "@/components/theme-switcher";
import md5 from "md5";
import { useEffect, useRef, useState } from "react";
import { AuraButton } from "@/components/AuraBox";
import { AISummaryModal } from "@/components/AISummaryModal";

import { CustomCursor } from "@/components/CustomCursor";

import { generateResumePDF } from "@/lib/generateResume";

type SectionType = "about" | "work" | "skills" | "projects" | "publications" | "certifications" | "holopins";

// Animation variants for scroll animations
const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Page() {
  const gravatarUrl = `https://www.gravatar.com/avatar/${md5(
    RESUME_DATA.contact.email
  )}?s=200`;

  const [visitorCount, setVisitorCount] = useState<string | null>(null);
  const [showUp, setShowUp] = useState(false);
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

  // AI Summary modal state
  const [summaryModal, setSummaryModal] = useState<{
    open: boolean;
    section: SectionType | null;
  }>({ open: false, section: null });

  // Tech filter state
  const [activeTechFilter, setActiveTechFilter] = useState<string | null>(null);

  // Copy email state
  const [emailCopied, setEmailCopied] = useState(false);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Nuhman PK",
    "url": "https://nuhmanpk.github.io/portfolio",
    "jobTitle": "Software Engineer",
    "image": "https://media.licdn.com/dms/image/v2/D5603AQHsj5-yhlVfdQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1719462659919?e=1762992000&v=beta&t=2x4zUevN0KkfBRv6gDJBcsrrRFV9EjsVZwVGVxq7fpc",
    "sameAs": [
      "https://github.com/nuhmanpk",
      "https://www.linkedin.com/in/nuhmanpk/"
    ]
  };



  // Get all unique tech stacks for filter
  const allTechStacks = Array.from(
    new Set(RESUME_DATA.projects.flatMap((p: { techStack: readonly string[] }) => p.techStack))
  ).slice(0, 10); // Limit to top 10

  // Filter data based on featured flag and tech filter
  const featuredProjects = RESUME_DATA.projects.filter((p: { featured?: boolean }) => p.featured);
  const filteredProjects = activeTechFilter
    ? RESUME_DATA.projects.filter((p: { techStack: readonly string[] }) =>
      p.techStack.includes(activeTechFilter)
    )
    : showAllProjects
      ? RESUME_DATA.projects
      : featuredProjects;

  const featuredPublications = RESUME_DATA.publications.filter((p: { featured?: boolean }) => p.featured);
  const featuredCerts = RESUME_DATA.certifications.filter((c: { featured?: boolean }) => c.featured);
  const featuredHolopins = RESUME_DATA.holopins.filter((h: { featured?: boolean }) => h.featured);

  const displayedPublications = showAllPublications ? RESUME_DATA.publications : featuredPublications;
  const displayedCerts = showAllCerts ? RESUME_DATA.certifications : featuredCerts;
  const displayedHolopins = showAllHolopins ? RESUME_DATA.holopins : featuredHolopins;

  // AI Summary content for special sections
  const aboutSummary = [
    {
      title: "The Developer",
      aiSummary: "A self-proclaimed Python whisperer who somehow also befriended JavaScript. Builds things that work, occasionally breaks things that worked, and absolutely fears CSS. 💀"
    },
    {
      title: "The Open Source Enthusiast",
      aiSummary: "Contributes code to the void and hopes the void contributes back. 80k+ developers have downloaded his packages, which is either impressive or terrifying. 📦"
    },
    {
      title: "The AI Explorer",
      aiSummary: "Chasing the LLM hype train while actually understanding what's happening under the hood. Uses free GPT versions because premium is for people with better offers. 🤖"
    },
    {
      title: "The Goal",
      aiSummary: "Keep learning, keep building, and leave the internet a little cooler. Also, secretly hoping someone reads this and sends a job offer. Wink wink. 😎"
    }
  ];

  const workSummary = RESUME_DATA.work.map((w: { company: string; title: string; aiSummary?: string }) => ({
    title: `${w.company} - ${w.title}`,
    aiSummary: w.aiSummary
  }));

  const skillsSummary = [
    {
      title: "Frontend",
      aiSummary: "React, TypeScript, Angular - basically making buttons look pretty and actually do things. CSS is still scary but we survive. 🎨"
    },
    {
      title: "Backend",
      aiSummary: "Node.js, Express, FastAPI, Python - the stuff that actually runs the show while frontend gets all the credit. 🔧"
    },
    {
      title: "AI/ML",
      aiSummary: "PyTorch, LangChain, RAG, Agents - teaching computers to think. Sometimes they listen. Sometimes they hallucinate. It's a journey. 🧠"
    },
    {
      title: "DevOps & Tools",
      aiSummary: "Docker, AWS, MongoDB, SQL - the 'it works on my machine' prevention toolkit. Deploy with confidence, debug with panic. 🚀"
    },
    {
      title: "Automation",
      aiSummary: "Puppeteer, Selenium, Web Scraping - making robots do boring stuff so humans can do... less boring stuff? 🤖"
    }
  ];

  // Get items for AI summary based on section
  const getSummaryItems = (section: SectionType) => {
    switch (section) {
      case "about":
        return aboutSummary;
      case "work":
        return workSummary;
      case "skills":
        return skillsSummary;
      case "projects":
        return RESUME_DATA.projects.map((p: { title: string; aiSummary?: string }) => ({
          title: p.title,
          aiSummary: p.aiSummary
        }));
      case "publications":
        return RESUME_DATA.publications.map((p: { title: string; aiSummary?: string }) => ({
          title: p.title,
          aiSummary: p.aiSummary
        }));
      case "certifications":
        return RESUME_DATA.certifications.map((c: { title: string; aiSummary?: string }) => ({
          title: c.title,
          aiSummary: c.aiSummary
        }));
      case "holopins":
        return RESUME_DATA.holopins.map((h: { title: string; aiSummary?: string }) => ({
          title: h.title,
          aiSummary: h.aiSummary
        }));
      default:
        return [];
    }
  };

  const getSectionTitle = (section: SectionType) => {
    switch (section) {
      case "about": return "About Me";
      case "work": return "Work Experience";
      case "skills": return "Skills";
      case "projects": return "Projects";
      case "publications": return "Publications";
      case "certifications": return "Certifications";
      case "holopins": return "Holopin Badges";
      default: return "";
    }
  };

  const copyEmail = async () => {
    await navigator.clipboard.writeText(RESUME_DATA.contact.email);
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2000);
  };

  useEffect(() => {
    fetch(
      "https://api.visitorbadge.io/api/visitors?path=https://github.com/nuhmanpk/portfolio"
    )
      .then((res) => res.text())
      .then((data) => {
        const match = data.match(/<title>VISITORS: (\d+)<\/title>/);
        if (match && match[1]) setVisitorCount(match[1]);
      })
      .catch(() => setVisitorCount(null));

    const visits = localStorage.getItem("visit-count");
    const updated = visits ? parseInt(visits) + 1 : 1;
    localStorage.setItem("visit-count", updated.toString());
    setLocalVisits(updated);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const bodyHeight = document.body.scrollHeight;
      const nearBottom = scrollTop + windowHeight >= bodyHeight - 100;
      setShowUp(nearBottom);

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

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [visitorCount, hasRolled]);

  // Keyboard shortcut for resume download
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Keyboard shortcut for resume download: Ctrl+Shift+R or Cmd+Shift+R
      const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "r") {
          e.preventDefault();
          generateResumePDF();
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, []);

  const handleScrollNext = () => {
    if (!sectionRefs.current.length) return;
    const nextIndex = (currentSection + 1) % sectionRefs.current.length;
    setCurrentSection(nextIndex);
    sectionRefs.current[nextIndex]?.scrollIntoView({ behavior: "smooth" });
  };

  // Simple section header with just summarize icon
  const SimpleSectionHeader = ({
    title,
    section,
  }: {
    title: string;
    section: SectionType;
  }) => (
    <motion.div
      className="flex items-center gap-3 mb-4"
    >
      <h2 className="text-2xl font-bold tracking-tight text-primary">
        {title}
      </h2>
      <AuraButton
        onClick={() => setSummaryModal({ open: true, section })}
      >
        <Sparkles className="h-4 w-4" />
      </AuraButton>
    </motion.div>
  );

  // Section header component with controls (for grid sections)
  const SectionHeader = ({
    title,
    section,
    showAll,
    setShowAll,
    totalCount,
    featuredCount,
  }: {
    title: string;
    section: SectionType;
    showAll: boolean;
    setShowAll: (value: boolean) => void;
    totalCount: number;
    featuredCount: number;
  }) => (
    <motion.div
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
    >
      <div className="flex items-center gap-3">
        <h2 className="text-2xl font-bold tracking-tight text-primary">
          {title}
        </h2>
        <AuraButton
          onClick={() => setSummaryModal({ open: true, section })}
        >
          <Sparkles className="h-4 w-4" />
        </AuraButton>
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowAll(!showAll)}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
      >
        {showAll ? (
          <>
            <EyeOff className="h-4 w-4" />
            <span className="hidden sm:inline">Featured ({featuredCount})</span>
            <span className="sm:hidden">Less</span>
          </>
        ) : (
          <>
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">Show All ({totalCount})</span>
            <span className="sm:hidden">All ({totalCount})</span>
          </>
        )}
      </motion.button>
    </motion.div>
  );

  return (
    <>
      <Head>
        <title>Nuhman PK | Software Engineer</title>
        <meta
          name="description"
          content="Portfolio of Nuhman PK — software engineer specialized in building high-performance web applications with React, Next.js, and Node.js."
        />
        <link rel="canonical" href="https://nuhmanpk.github.io/portfolio" />

        <meta property="og:title" content="Nuhman PK | Software Engineer" />
        <meta
          property="og:description"
          content="Explore Nuhman PK's work, projects, and professional experience."
        />
        <meta
          property="og:image"
          content="https://media.licdn.com/dms/image/D4D03AQGxxxxxxxx/profile-displayphoto-shrink_800_800/0/xxxxx"
        />
        <meta property="og:url" content="https://nuhmanpk.github.io/portfolio" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:site_name" content="Nuhman PK Portfolio" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Nuhman PK | Software Engineer" />
        <meta
          name="twitter:description"
          content="Full-stack engineer portfolio — Next.js, React, and Node.js."
        />
        <meta
          name="twitter:image"
          content="https://media.licdn.com/dms/image/D4D03AQGxxxxxxxx/profile-displayphoto-shrink_800_800/0/xxxxx"
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>

      {/* Custom Cursor */}
      <CustomCursor />



      {/* AI Summary Modal */}
      <AISummaryModal
        isOpen={summaryModal.open}
        onClose={() => setSummaryModal({ open: false, section: null })}
        items={summaryModal.section ? getSummaryItems(summaryModal.section) : []}
        sectionTitle={summaryModal.section ? getSectionTitle(summaryModal.section) : ""}
      />

      <main className="container relative mx-auto scroll-my-12 p-4 pb-8 print:p-12 md:p-16 md:pb-8">
        <motion.section
          className="mx-auto w-full max-w-4xl space-y-12"
        >
          {/* Header Controls */}
          <div className="absolute top-4 right-4 flex items-center gap-x-2">
            <ThemeSwitcher />
          </div>

          {/* Hero Section */}
          <motion.div
            className="flex items-center justify-between"
          >
            <div className="flex-1 space-y-4">
              <h1 className="text-5xl font-bold tracking-tight text-primary">
                {RESUME_DATA.name}
              </h1>
              <p className="max-w-xl text-lg text-muted-foreground">
                {RESUME_DATA.about}
              </p>
              <div className="flex items-center gap-x-4">
                <motion.a
                  className="inline-flex items-center gap-x-2 text-sm text-muted-foreground hover:text-primary hover:drop-shadow-lg transition-all cursor-pointer"
                  href={RESUME_DATA.locationLink}
                  target="_blank"
                >
                  <GlobeIcon className="h-4 w-4" />
                  {RESUME_DATA.location}
                </motion.a>
                <motion.button
                  onClick={copyEmail}
                  className="inline-flex items-center gap-x-2 text-sm text-muted-foreground hover:text-primary hover:drop-shadow-lg transition-all cursor-pointer"
                >
                  {emailCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  {emailCopied ? "Copied!" : RESUME_DATA.contact.email}
                </motion.button>
              </div>

              <div className="flex gap-x-2 pt-1 font-mono text-sm text-muted-foreground print:hidden">
                {RESUME_DATA.contact.social.map((social) => (
                  <motion.div
                    key={social.name}
                    whileHover={{ scale: 1.1 }}
                    className="transition-all hover:drop-shadow-lg"
                  >
                    <Button
                      className="h-8 w-8 cursor-pointer"
                      variant="outline"
                      size="icon"
                      asChild
                    >
                      <a href={social.url}>
                        <social.icon className="h-4 w-4" />
                      </a>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="hidden md:block">
              <Avatar className="h-32 w-32 hover:drop-shadow-xl transition-all duration-300">
                <AvatarImage
                  alt={`${RESUME_DATA.name} profile photo`}
                  src={gravatarUrl}
                />
                <AvatarFallback>{RESUME_DATA.initials}</AvatarFallback>
              </Avatar>
            </div>
          </motion.div>

          {/* About Section */}
          <Section ref={(el) => (sectionRefs.current[0] = el)}>
            <SimpleSectionHeader title="About" section="about" />
            <motion.p
              className="text-lg text-muted-foreground"
            >
              {RESUME_DATA.summary}
            </motion.p>
          </Section>

          {/* Work Experience Section */}
          <Section ref={(el) => (sectionRefs.current[1] = el)}>
            <SimpleSectionHeader title="Work Experience" section="work" />
            <motion.div
              className="mt-2 space-y-4"
            >
              {RESUME_DATA.work.map((work, index) => (
                <motion.div
                  key={work.title}
                  variants={fadeInUp}
                  custom={index}
                  className="rounded-lg border p-4 transition-all hover:drop-shadow-lg hover:border-primary/30"
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-primary">
                      <a href={work.link} className="hover:underline cursor-pointer">
                        {work.company}
                      </a>
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {work.start} - {work.end}
                    </p>
                  </div>
                  <h4 className="mt-1 text-base font-semibold text-muted-foreground">
                    {work.title}
                  </h4>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {work.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </Section>

          {/* Education Section */}
          <Section ref={(el) => (sectionRefs.current[2] = el)}>
            <motion.h2
              className="text-2xl font-bold tracking-tight text-primary"
            >
              Education
            </motion.h2>
            <motion.div
              className="mt-4 space-y-4"
            >
              {RESUME_DATA.education.map((education, index) => (
                <motion.div
                  key={education.school}
                  variants={fadeInUp}
                  custom={index}
                  className="rounded-lg border p-4 transition-all hover:drop-shadow-lg hover:border-primary/30"
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-primary">
                      {education.school}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {education.start} - {education.end}
                    </p>
                  </div>
                  <h4 className="mt-1 text-base font-semibold text-muted-foreground">
                    {education.degree}
                  </h4>
                </motion.div>
              ))}
            </motion.div>
          </Section>

          {/* Skills Section */}
          <Section ref={(el) => (sectionRefs.current[3] = el)}>
            <SimpleSectionHeader title="Skills" section="skills" />
            <motion.div
              className="flex flex-wrap gap-2"
            >
              {RESUME_DATA.skills.map((skill, index) => (
                <motion.div
                  key={skill}
                  custom={index}
                  className="rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground transition-all hover:drop-shadow-lg cursor-default"
                >
                  {skill}
                </motion.div>
              ))}
            </motion.div>
          </Section>

          {/* Projects Section with Tech Filter */}
          <Section ref={(el) => (sectionRefs.current[4] = el)}>
            <SectionHeader
              title="Projects"
              section="projects"
              showAll={showAllProjects}
              setShowAll={(val) => {
                setShowAllProjects(val);
                setActiveTechFilter(null);
              }}
              totalCount={RESUME_DATA.projects.length}
              featuredCount={featuredProjects.length}
            />

            {/* Tech Filter Pills */}
            <motion.div
              className="flex flex-wrap gap-2 mb-6"
            >
              <motion.button
                onClick={() => setActiveTechFilter(null)}
                className={`px-3 py-1 text-xs rounded-full transition-all ${!activeTechFilter
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
              >
                All
              </motion.button>
              {allTechStacks.map((tech) => (
                <motion.button
                  key={tech}
                  onClick={() => {
                    setActiveTechFilter(tech === activeTechFilter ? null : tech);
                    setShowAllProjects(true);
                  }}
                  className={`px-3 py-1 text-xs rounded-full transition-all ${activeTechFilter === tech
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                >
                  {tech}
                </motion.button>
              ))}
            </motion.div>

            <motion.div
              className="grid grid-cols-1 gap-6 md:grid-cols-3"
            >
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project) => (
                  <motion.div
                    key={project.title}
                  >
                    <ProjectCard
                      title={project.title}
                      description={project.description}
                      tags={project.techStack}
                      link={"link" in project ? project.link.href : undefined}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </Section>

          {/* Publications Section */}
          <Section ref={(el) => (sectionRefs.current[5] = el)}>
            <SectionHeader
              title="Publications"
              section="publications"
              showAll={showAllPublications}
              setShowAll={setShowAllPublications}
              totalCount={RESUME_DATA.publications.length}
              featuredCount={featuredPublications.length}
            />
            <motion.div
              className="grid grid-cols-1 gap-6 md:grid-cols-3"
            >
              <AnimatePresence mode="popLayout">
                {displayedPublications.map((project) => (
                  <motion.div
                    key={project.title}
                  >
                    <ProjectCard
                      title={project.title}
                      description={project.description}
                      tags={project.techStack}
                      link={"link" in project ? project.link.href : undefined}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </Section>

          {/* Certifications Section */}
          <Section ref={(el) => (sectionRefs.current[6] = el)}>
            <SectionHeader
              title="Certifications"
              section="certifications"
              showAll={showAllCerts}
              setShowAll={setShowAllCerts}
              totalCount={RESUME_DATA.certifications.length}
              featuredCount={featuredCerts.length}
            />
            <motion.div
              className="grid grid-cols-1 gap-6 md:grid-cols-3"
            >
              <AnimatePresence mode="popLayout">
                {displayedCerts.map((project) => (
                  <motion.div
                    key={project.title}
                  >
                    <ProjectCard
                      title={project.title}
                      description={project.description}
                      tags={project.techStack}
                      link={"link" in project ? project.link.href : undefined}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </Section>

          {/* Holopin Badges Section */}
          <Section ref={(el) => (sectionRefs.current[7] = el)}>
            <SectionHeader
              title="Holopin Badges"
              section="holopins"
              showAll={showAllHolopins}
              setShowAll={setShowAllHolopins}
              totalCount={RESUME_DATA.holopins.length}
              featuredCount={featuredHolopins.length}
            />
            <motion.div
              className="grid grid-cols-1 gap-6 md:grid-cols-3"
            >
              <AnimatePresence mode="popLayout">
                {displayedHolopins.map((holopin) => (
                  <motion.div
                    key={holopin.title}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <HolopinCard
                      title={holopin.title}
                      description={holopin.description}
                      link={holopin.link}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </Section>

          {/* Footer */}
          <footer className="mt-24 text-center text-sm text-muted-foreground relative">
            <span>
              🌍 Your visits: {localVisits}
              {visitorCount && (
                <>
                  <br />
                  {(() => {
                    let emoji = "👀";
                    if (rollingCount % 1000 === 0) emoji = "🎉";
                    else if (rollingCount % 500 === 0) emoji = "🚀";
                    else if (rollingCount % 100 === 0) emoji = "🌟";
                    else if (rollingCount % 10 === 0) emoji = "🦄";
                    else if ([1, 3, 7].includes(rollingCount % 10)) emoji = "🔥";
                    return `\n ${emoji} Total Portfolio Views #${rollingCount}!`;
                  })()}
                </>
              )}
            </span>
            <br />
            <span>
              This site is open source{" "}
              <a
                href="https://github.com/nuhmanpk/portfolio"
                target="_blank"
                className="underline hover:text-primary hover:drop-shadow-md transition-all cursor-pointer"
              >
                Improve this page
              </a>
            </span>


            <AnimatePresence>
              {showUp && (
                <motion.button
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                  className="fixed bottom-6 right-6 p-3 rounded-full bg-primary text-background shadow-lg hover:scale-110 transition-transform cursor-pointer"
                >
                  <ChevronUp className="h-5 w-5" />
                </motion.button>
              )}
              {!showUp && (
                <motion.button
                  onClick={handleScrollNext}
                  className="fixed bottom-6 right-6 p-3 rounded-full bg-secondary text-primary shadow-md hover:scale-110 transition-transform cursor-pointer"
                >
                  <ChevronDown className="h-5 w-5" />
                </motion.button>
              )}
            </AnimatePresence>
          </footer>
        </motion.section>
      </main>
    </>
  );
}
