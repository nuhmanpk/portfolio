"use client";
import Head from "next/head";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Section } from "@/components/ui/section";
import { GlobeIcon, MailIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RESUME_DATA } from "@/data/resume-data";
import { ProjectCard } from "@/components/project-card";
import { HolopinCard } from "@/components/holopin-card";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeSwitcher } from "@/components/theme-switcher";
import md5 from "md5";
import HeroAnimation from "@/components/loader";
import { useEffect, useState } from "react";

export default function Page() {
  const gravatarUrl = `https://www.gravatar.com/avatar/${md5(
    RESUME_DATA.contact.email
  )}?s=200`;

  const [visitorCount, setVisitorCount] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showUp, setShowUp] = useState(false);
  const [rollingCount, setRollingCount] = useState(0);
  const [hasRolled, setHasRolled] = useState(false);
  const [localVisits, setLocalVisits] = useState<number>(0);

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
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
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

  useEffect(() => {
  if (typeof window !== "undefined") {
    // console.clear();
    const styleTitle = `
      color: #00bfa5;
      font-size: 20px;
      font-weight: bold;
      font-family: monospace;
    `;
    const styleSub = `
      color: #ffffff;
      background: #00bfa5;
      padding: 2px 6px;
      border-radius: 4px;
      font-family: monospace;
    `;
    const styleLink = `
      color: #0077ff;
      text-decoration: underline;
      font-family: monospace;
    `;

  console.log("%c💼 HIRE ME for your next big project!", styleTitle);
  console.log("%c✨ Crafted with ❤️ by NUHMAN using Next.js 🚀", styleSub);
  console.log("%c🌐 Portfolio: https://nuhmanpk.github.io/portfolio", styleLink);
  console.log("%c🐙 GitHub: https://github.com/nuhmanpk", styleLink);
  console.log("%c🔗 LinkedIn: https://www.linkedin.com/in/nuhmanpk/", styleLink);
  console.log("%c🤓 Oh, look at you — the DevTools detective! Not everyone ends up here, you’re clearly built different.", styleSub);
  console.log("%c🔥 And hey, if you find any error (other than a Vercel one 😅), be kind — fix it or hit me up on LinkedIn. Great minds debug alike!", styleLink);
  console.log("%c💰 Oh, and if you happen to be someone with a *better offer*, stop reading console logs and DM me ASAP. 😎", styleTitle);

  }
}, []);


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
          content="Explore Nuhman PK’s work, projects, and professional experience."
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

      <AnimatePresence>
        {loading && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background"
          >
            <HeroAnimation />
          </motion.div>
        )}
      </AnimatePresence>

      {!loading && (
        // <main className="container relative mx-auto scroll-my-12 p-4 print:p-12 md:p-16">
        <main className="container relative mx-auto scroll-my-12 p-4 pb-8 print:p-12 md:p-16 md:pb-8">

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto w-full max-w-4xl space-y-12"
          >
            <div className="absolute top-4 right-4 flex items-center gap-x-2">
              <ThemeSwitcher />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1 space-y-4">
                <h1 className="text-5xl font-bold tracking-tight text-primary">
                  {RESUME_DATA.name}
                </h1>
                <p className="max-w-xl text-lg text-muted-foreground">
                  {RESUME_DATA.about}
                </p>
                <div className="flex items-center gap-x-4">
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    className="inline-flex items-center gap-x-2 text-sm text-muted-foreground hover:text-primary hover:drop-shadow-lg transition-all"
                    href={RESUME_DATA.locationLink}
                    target="_blank"
                  >
                    <GlobeIcon className="h-4 w-4" />
                    {RESUME_DATA.location}
                  </motion.a>
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    className="inline-flex items-center gap-x-2 text-sm text-muted-foreground hover:text-primary hover:drop-shadow-lg transition-all"
                    href={`mailto:${RESUME_DATA.contact.email}`}
                  >
                    <MailIcon className="h-4 w-4" />
                    {RESUME_DATA.contact.email}
                  </motion.a>
                </div>

                <div className="flex gap-x-2 pt-1 font-mono text-sm text-muted-foreground print:hidden">
                  {RESUME_DATA.contact.social.map((social) => (
                    <motion.div
                      key={social.name}
                      whileHover={{ scale: 1.1 }}
                      className="transition-all hover:drop-shadow-lg"
                    >
                      <Button
                        className="h-8 w-8"
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

              <Avatar className="hidden md:block h-32 w-32 hover:drop-shadow-xl transition-all duration-300">
                <AvatarImage
                  alt={`${RESUME_DATA.name} profile photo`}
                  src={gravatarUrl}
                />
                <AvatarFallback>{RESUME_DATA.initials}</AvatarFallback>
              </Avatar>
            </div>

            <Section>
              <h2 className="text-2xl font-bold tracking-tight text-primary">
                About
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                {RESUME_DATA.summary}
              </p>
            </Section>

            <Section>
              <h2 className="text-2xl font-bold tracking-tight text-primary">
                Work Experience
              </h2>
              <div className="mt-4 space-y-4">
                {RESUME_DATA.work.map((work) => (
                  <motion.div
                    key={work.title}
                    className="rounded-lg border p-4 transition-all hover:drop-shadow-lg hover:border-primary/30"
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-primary">
                        <a href={work.link} className="hover:underline">
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
              </div>
            </Section>

            <Section>
              <h2 className="text-2xl font-bold tracking-tight text-primary">
                Education
              </h2>
              <div className="mt-4 space-y-4">
                {RESUME_DATA.education.map((education) => (
                  <motion.div
                    key={education.school}
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
              </div>
            </Section>

            <Section>
              <h2 className="text-2xl font-bold tracking-tight text-primary">
                Skills
              </h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {RESUME_DATA.skills.map((skill) => (
                  <div
                    key={skill}
                    className="rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground transition-all hover:drop-shadow-lg"
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </Section>

            <Section>
              <h2 className="text-2xl font-bold tracking-tight text-primary">
                Projects
              </h2>
              <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-3">
                {RESUME_DATA.projects.map((project) => (
                  <motion.div
                    key={project.title}
                    whileHover={{ scale: 1.02 }}
                    className="transition-all hover:drop-shadow-xl"
                  >
                    <ProjectCard
                      title={project.title}
                      description={project.description}
                      tags={project.techStack}
                      link={"link" in project ? project.link.href : undefined}
                    />
                  </motion.div>
                ))}
              </div>
            </Section>

            <Section>
              <h2 className="text-2xl font-bold tracking-tight text-primary">
                Publications
              </h2>
              <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-3">
                {RESUME_DATA.publications.map((project) => (
                  <motion.div
                    key={project.title}
                    whileHover={{ scale: 1.02 }}
                    className="transition-all hover:drop-shadow-xl"
                  >
                    <ProjectCard
                      title={project.title}
                      description={project.description}
                      tags={project.techStack}
                      link={"link" in project ? project.link.href : undefined}
                    />
                  </motion.div>
                ))}
              </div>
            </Section>

            <Section>
              <h2 className="text-2xl font-bold tracking-tight text-primary">
                Certifications
              </h2>
              <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-3">
                {RESUME_DATA.certifications.map((project) => (
                  <motion.div
                    key={project.title}
                    whileHover={{ scale: 1.02 }}
                    className="transition-all hover:drop-shadow-xl"
                  >
                    <ProjectCard
                      title={project.title}
                      description={project.description}
                      tags={project.techStack}
                      link={"link" in project ? project.link.href : undefined}
                    />
                  </motion.div>
                ))}
              </div>
            </Section>

            <Section>
              <h2 className="text-2xl font-bold tracking-tight text-primary">
                Holopin Badges
              </h2>
              <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-3">
                {RESUME_DATA.holopins.map((holopin) => (
                  <motion.div
                    key={holopin.title}
                    whileHover={{ scale: 1.02 }}
                    className="transition-all hover:drop-shadow-xl"
                  >
                    <HolopinCard
                      title={holopin.title}
                      description={holopin.description}
                      link={holopin.link}
                    />
                  </motion.div>
                ))}
              </div>
            </Section>

            <footer className="mt-24 text-center text-sm text-muted-foreground relative">
              <span>
                    🌍 Your visits: {localVisits}
                {visitorCount && (
                  <>
                    <br/>
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
              <br/>
              <span>
                This site is open source{" "}
                <a
                  href="https://github.com/nuhmanpk/portfolio"
                  target="_blank"
                  className="underline hover:text-primary hover:drop-shadow-md transition-all"
                >
                  Improve this page
                </a>
                
              </span>

              <AnimatePresence>
                {showUp && (
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                    className="fixed bottom-6 right-6 p-3 rounded-full bg-primary text-background shadow-lg hover:scale-110 transition-transform"
                  >
                    ↑
                  </motion.button>
                )}
              </AnimatePresence>
            </footer>
          </motion.section>
        </main>
      )}
    </>
  );
}
