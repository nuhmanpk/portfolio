'use client';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Section } from "@/components/ui/section";
import { GlobeIcon, MailIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RESUME_DATA } from "@/data/resume-data";
import { ProjectCard } from "@/components/project-card";
import { HolopinCard } from "@/components/holopin-card";
import { motion } from "framer-motion";
import { ThemeSwitcher } from "@/components/theme-switcher";
import md5 from "md5";
import { useEffect, useState } from "react";

export default function Page() {
  const gravatarUrl = `https://www.gravatar.com/avatar/${md5(RESUME_DATA.contact.email)}?s=200`;
  const [visitorCount, setVisitorCount] = useState<string | null>(null);

  useEffect(() => {
    fetch("https://api.visitorbadge.io/api/visitors?path=https://github.com/nuhmanpk/portfolio")
      .then((response) => response.text())
      .then((data) => {
        const match = data.match(/<title>VISITORS: (\d+)<\/title>/);
        if (match && match[1]) {
          setVisitorCount(match[1]);
        }
      })
      .catch(() => setVisitorCount(null));
  }, []);

  return (
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
                className="inline-flex items-center gap-x-2 text-sm text-muted-foreground hover:text-primary"
                href={RESUME_DATA.locationLink}
                target="_blank"
              >
                <GlobeIcon className="h-4 w-4" />
                {RESUME_DATA.location}
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-x-2 text-sm text-muted-foreground hover:text-primary"
                href={`mailto:${RESUME_DATA.contact.email}`}
              >
                <MailIcon className="h-4 w-4" />
                {RESUME_DATA.contact.email}
              </motion.a>
            </div>
            <div className="flex gap-x-2 pt-1 font-mono text-sm text-muted-foreground print:hidden">
              {RESUME_DATA.contact.social.map((social) => (
                <motion.div key={social.name} whileHover={{ scale: 1.1 }}>
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
          <Avatar className="h-32 w-32">
            <AvatarImage alt={RESUME_DATA.name} src={gravatarUrl} />
            <AvatarFallback>{RESUME_DATA.initials}</AvatarFallback>
          </Avatar>
        </div>

        <Section>
          <h2 className="text-2xl font-bold tracking-tight text-primary">About</h2>
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
              <div key={work.company} className="rounded-lg border p-4">
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
              </div>
            ))}
          </div>
        </Section>

        <Section>
          <h2 className="text-2xl font-bold tracking-tight text-primary">Education</h2>
          <div className="mt-4 space-y-4">
            {RESUME_DATA.education.map((education) => (
              <div key={education.school} className="rounded-lg border p-4">
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
              </div>
            ))}
          </div>
        </Section>

        <Section>
          <h2 className="text-2xl font-bold tracking-tight text-primary">Skills</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {RESUME_DATA.skills.map((skill) => (
              <div key={skill} className="rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground">
                {skill}
              </div>
            ))}
          </div>
        </Section>

        <Section>
          <h2 className="text-2xl font-bold tracking-tight text-primary">Projects</h2>
          <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-3">
            {RESUME_DATA.projects.map((project) => (
              <ProjectCard
                key={project.title}
                title={project.title}
                description={project.description}
                tags={project.techStack}
                link={"link" in project ? project.link.href : undefined}
              />
            ))}
          </div>
        </Section>

        <Section>
          <h2 className="text-2xl font-bold tracking-tight text-primary">Publications</h2>
          <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-3">
            {RESUME_DATA.publications.map((project) => (
              <ProjectCard
                key={project.title}
                title={project.title}
                description={project.description}
                tags={project.techStack}
                link={"link" in project ? project.link.href : undefined}
              />
            ))}
          </div>
        </Section>

        <Section>
          <h2 className="text-2xl font-bold tracking-tight text-primary">Certifications</h2>
          <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-3">
            {RESUME_DATA.certifications.map((project) => (
              <ProjectCard
                key={project.title}
                title={project.title}
                description={project.description}
                tags={project.techStack}
                link={"link" in project ? project.link.href : undefined}
              />
            ))}
          </div>
        </Section>

        <Section>
          <h2 className="text-2xl font-bold tracking-tight text-primary">Holopin Badges</h2>
          <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-3">
            {RESUME_DATA.holopins.map((holopin) => (
              <HolopinCard
                key={holopin.title}
                title={holopin.title}
                description={holopin.description}
                link={holopin.link}
              />
            ))}
          </div>
        </Section>
        <footer className="mt-24 text-center text-sm text-muted-foreground">
          <p>
            The code is available on{" "}
            <a
              href="https://github.com/nuhmanpk/portfolio"
              target="_blank"
              className="underline hover:text-primary"
            >
              GitHub
            </a>
            .
          </p>
          {visitorCount && <p className="mt-4">Visitors: {visitorCount}</p>}
        </footer>
      </motion.section>
    </main>
  );
}
