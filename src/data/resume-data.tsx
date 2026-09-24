import { social } from "./socials";
import { education } from "./education";
import { work } from "./work";
import { skills } from "./skills";
import { projects } from "./projects";
import { publications } from "./publications";
import { certifications } from "./certifications";
import { holopins } from "./holopin";
import { aboutLead, aboutSections } from "./about";

export const RESUME_DATA = {
  name: "Nuhman PK",
  initials: "Pk",
  location: "Malappuram, Kerala",
  locationLink: "https://www.google.com/maps/place/Malappuram",
  about: `Senior Software Engineer (Full Stack & AI/ML) | Building open-source tools and scalable systems used in production`,
  summary: [aboutLead, ...aboutSections.map((s) => s.text)].join("\n"),
  aboutLead,
  aboutSections,
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
