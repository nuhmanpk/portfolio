import { social } from "./socials";
import { education } from "./education";
import { work } from "./work";
import { skills } from "./skills";
import { projects } from "./projects";
import { publications } from "./publications";
import { certifications } from "./certifications";
import { holopins } from "./holopin";
import { getDynamicAge } from "../utils/getAge";

export const RESUME_DATA = {
  name: "Nuhman PK",
  initials: "Pk",
  location: "Malappuram, Kerala",
  locationLink: "https://www.google.com/maps/place/Malappuram",
  about: `Senior Software Engineer (Full Stack & AI/ML) | Building open-source tools and scalable systems used in production`,
  summary: `I’m Nuhman, a Senior Software Engineer and open-source builder with years of hands-on experience starting early in my career. I focus on creating practical, scalable software across full-stack development, automation, and AI/ML, with an emphasis on tools that solve real problems and are used in production.
I’ve built and maintained open-source projects with tens of thousands of users, designed and shipped APIs and automation pipelines in real-world environments, and worked extensively with Python, JavaScript, React, Next.js, and modern AI tooling. I enjoy turning complex problems into simple, reliable systems and pushing ideas from prototype to production efficiently.
I thrive in fast-moving environments, take ownership of end-to-end systems, and consistently ship high-impact work. Outside of professional work, I experiment with LLMs, agents, and developer tooling, contribute to open source, and share learnings with the developer community.
My focus is on building software that scales, tools that empower developers, and systems that make technology more accessible and efficient.`,
  personalWebsiteUrl: "https://nuhmanpk.github.io/portfolio",
  contact: {
    email: "nuhmanpk7@gmail.com",
    social: social
  },
  education: education,
  work: work,
  skills: skills,
  projects: projects,
  publications: publications,
  certifications: certifications,
  holopins: holopins
} as const;
