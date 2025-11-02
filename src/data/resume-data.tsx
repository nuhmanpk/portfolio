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
  about: `Senior Software Engineer – Full Stack & ML, apparently at ${getDynamicAge()} | Building scalable solutions`,
  summary: `I'm Nuhman, a passionate open-source developer who loves building with Python and exploring the world of AI and machine learning. I also enjoy crafting web applications with JavaScript, React, and Next.js, yes, I chose this life willingly. Most of my time goes into creating useful tools, contributing to open source, and helping other developers build faster and smarter.
I thrive in fast-paced environments, love solving complex problems, and never stop learning new technologies. Outside of coding, you’ll probably find me experimenting with new AI models, tweaking side projects, or looking for the next big thing to build ideally with a free version of GPT by my side. I’m genuinely afraid of CSS. 
When I’m not deep in code, I’m usually sharing ideas with the developer community, automating something that probably didn’t need automating, or exploring how open-source can make tech more accessible. My goal is simple, keep learning, keep building, and leave the internet a little cooler than I found it.`,
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
