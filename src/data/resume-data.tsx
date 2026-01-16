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
  about: `Senior Software Engineer (Full Stack & AI/ML) | ${getDynamicAge()} | Building open-source tools and scalable systems used in production`,
  summary: `I’m Nuhman, a Senior Software Engineer and open-source builder focused on creating practical, scalable software. My work spans full-stack web development, automation, and AI/ML systems, with a strong emphasis on tools that solve real problems and are actually used by people.
I’ve built and maintained open-source projects with tens of thousands of users, designed APIs and automation pipelines in production environments, and worked extensively with Python, JavaScript, React, Next.js, and modern AI tooling. I enjoy turning complex problems into simple, reliable systems and shipping fast without sacrificing quality.
I thrive in fast-moving environments, take ownership of end-to-end systems, and consistently push ideas from prototype to production. Outside of work, I experiment with LLMs, agents, and developer tooling, contribute to open source, and share learnings with the developer community.
My focus is building software that scales, tools that empower developers, and systems that make technology more accessible and efficient.`,
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
