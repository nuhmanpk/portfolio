"use client";
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

  // Fetch visitor count
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

    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Scroll listener for up button and rolling count
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

  return (
    <>
      {/* Loader Overlay */}
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

      {/* Main Content */}
      {!loading && (
        <main className="container relative mx-auto scroll-my-12 p-4 print:p-12 md:p-16">
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
                <AvatarImage alt={RESUME_DATA.name} src={gravatarUrl} />
                <AvatarFallback>{RESUME_DATA.initials}</AvatarFallback>
              </Avatar>
            </div>

            {/* About Section */}
            <Section>
              <h2 className="text-2xl font-bold tracking-tight text-primary">
                About
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                {RESUME_DATA.summary}
              </p>
            </Section>

            {/* Work Experience */}
            <Section>
              <h2 className="text-2xl font-bold tracking-tight text-primary">
                Work Experience
              </h2>
              <div className="mt-4 space-y-4">
                {RESUME_DATA.work.map((work) => (
                  <motion.div
                    key={work.company}
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

            {/* Education */}
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

            {/* Skills */}
            <Section>
              <h2 className="text-2xl font-bold tracking-tight text-primary">Skills</h2>
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

            {/* Projects */}
            <Section>
              <h2 className="text-2xl font-bold tracking-tight text-primary">Projects</h2>
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

            {/* Publications */}
            <Section>
              <h2 className="text-2xl font-bold tracking-tight text-primary">Publications</h2>
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

            {/* Certifications */}
            <Section>
              <h2 className="text-2xl font-bold tracking-tight text-primary">Certifications</h2>
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

            {/* Holopin Badges */}
            <Section>
              <h2 className="text-2xl font-bold tracking-tight text-primary">Holopin Badges</h2>
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

            {/* Footer */}
            <footer className="mt-24 text-center text-sm text-muted-foreground relative">
            <span>
              This site is open source {" "}
              <a
                href="https://github.com/nuhmanpk/portfolio"
                target="_blank"
                className="underline hover:text-primary hover:drop-shadow-md transition-all"
              >
                Improve this page
              </a>
              {visitorCount && (
                <>
                  {" • "}
                  {(() => {
                    let emoji = "👀"; // default
                    if (rollingCount % 1000 === 0) emoji = "🎉"; // every 1000th visitor
                    else if (rollingCount % 500 === 0) emoji = "🚀"; // every 500th visitor
                    else if (rollingCount % 100 === 0) emoji = "🌟"; // every 100th visitor
                    else if (rollingCount % 10 === 0) emoji = "🦄"; // every 10th visitor
                    else if ([1, 3, 7].includes(rollingCount % 10)) emoji = "🔥"; // special single digits

                    return `\n ${emoji} You are visitor #${rollingCount}!`;
                  })()}
                </>
              )}
            </span>


              {/* Scroll-to-top button */}
              <AnimatePresence>
                {showUp && (
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
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
