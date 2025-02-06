import { social } from "./socials";
import { education } from "./education";
import { work } from "./work";
import { skills } from "./skills";
import { projects } from "./projects";
import { publications } from "./publications";
import { certifications } from "./certifications";

export const RESUME_DATA = {
  name: "Nuhman PK",
  initials: "Pk",
  location: "Malappuram, Kerala",
  locationLink: "https://www.google.com/maps/place/Malappuram",
  about:
    "24-Year-Old Senior Full Stack Engineer | Building Scalable Solutions with Passion (Yes, I'm 24. No, it's not a typo.)",
  summary:
    "I'm a Senior Software Engineer and Full Stack MEARN Developer who loves open-source development, working with Python, and geeking out over AI & machine learning. I also have a soft spot for JavaScript (yes, I voluntarily chose this life). \n You’ll usually find me building cool stuff on GitHub and helping the developer community build things faster, and pretending I have everything under control in fast-paced environments. \n Oh, and I can do almost anything... until there exists a free version of  GPT",
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
  certifications: certifications
} as const;
