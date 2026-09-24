// Single source for SEO / AI-search metadata, derived from RESUME_DATA so it
// never drifts from what the page shows.
import md5 from "md5";
import { RESUME_DATA } from "@/data/resume-data";

// Trailing slash matters: GitHub Pages redirects /portfolio -> /portfolio/
export const SITE_URL = "https://nuhmanpk.github.io/portfolio/";
export const url = (path = "") => new URL(path, SITE_URL).toString();

export const SITE_NAME = "Nuhman PK";
export const TITLE = `${RESUME_DATA.name} | Senior Software Engineer (Full Stack & AI/ML)`;
export const DESCRIPTION =
  "Nuhman PK is a Senior Software Engineer at Bititude from Kerala, India, building open-source developer tools, " +
  "LLM & AI/ML applications, automation and full-stack systems with Python, TypeScript, React, Next.js, Node.js and FastAPI. " +
  "Creator of YoutubeTags (100k+ PyPI downloads), Super Logger and Quick Llama.";

export const OG_IMAGE = { url: url("og.png"), width: 1200, height: 630, alt: `${RESUME_DATA.name}, Senior Software Engineer` };
export const AVATAR_URL = `https://www.gravatar.com/avatar/${md5(RESUME_DATA.contact.email)}?s=512`;

// Profiles beyond the social icons (used for sameAs + footer)
export const EXTRA_PROFILES = [
  { name: "PyPI", url: "https://pypi.org/user/nuhmanpk/" },
  { name: "VS Code Marketplace", url: "https://marketplace.visualstudio.com/publishers/nuhmanpk" },
  { name: "npm", url: "https://www.npmjs.com/~nuhmanpk" },
  { name: "Hugging Face", url: "https://huggingface.co/nuhmanpk" },
];

export const KEYWORDS = [
  "Nuhman PK",
  "Nuhman",
  "nuhmanpk",
  "PK Nuhman",
  "Nuhman PK portfolio",
  "Nuhman PK software engineer",
  "Senior Software Engineer Kerala",
  "Full stack developer Kerala",
  "AI ML engineer India",
  "LLM engineer",
  "Python developer Malappuram",
  "open source developer India",
  "Bititude",
  ...RESUME_DATA.projects.map((p) => p.title),
  "Python",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "FastAPI",
  "LangChain",
  "RAG",
  "AI agents",
  "Telegram bots",
  "web scraping",
];

const person = `${SITE_URL}#person`;
const website = `${SITE_URL}#website`;
const org = "https://bititude.com/#organization";

// "Jul 8, 2025" -> "2025-07-08" (use local date parts; toISOString would shift across timezones)
const isoDate = (s: string) => {
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return undefined;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const categoryOf = (tags: readonly string[]) =>
  tags.includes("VsCode Extension")
    ? "VS Code extension"
    : tags.includes("npm package")
      ? "npm package"
      : tags.some((t) => /telegram/i.test(t))
        ? "Telegram bot"
        : "Python package";

const languageOf = (tags: readonly string[]) =>
  ["Python", "Typescript", "TypeScript", "Javascript", "Node", "Node.js"].filter((l) => tags.includes(l));

/** schema.org @graph: WebSite + ProfilePage + Person + projects + articles */
export function jsonLd() {
  const { work, education, projects, publications, certifications, holopins, skills, contact } = RESUME_DATA;
  const current = work[0];

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": website,
        url: SITE_URL,
        name: SITE_NAME,
        description: DESCRIPTION,
        inLanguage: "en",
        publisher: { "@id": person },
      },
      {
        "@type": "ProfilePage",
        "@id": `${SITE_URL}#profile`,
        url: SITE_URL,
        name: TITLE,
        isPartOf: { "@id": website },
        mainEntity: { "@id": person },
        dateModified: new Date().toISOString().slice(0, 10),
        primaryImageOfPage: OG_IMAGE.url,
      },
      {
        "@type": "Person",
        "@id": person,
        name: RESUME_DATA.name,
        givenName: "Nuhman",
        familyName: "PK",
        alternateName: ["Nuhman", "PK Nuhman", "nuhmanpk"],
        url: SITE_URL,
        image: AVATAR_URL,
        jobTitle: current.title,
        description: RESUME_DATA.summary.split("\n")[0],
        worksFor: { "@id": org },
        address: {
          "@type": "PostalAddress",
          addressLocality: "Malappuram",
          addressRegion: "Kerala",
          addressCountry: "IN",
        },
        alumniOf: education.map((e) => ({ "@type": "CollegeOrUniversity", name: e.school })),
        knowsAbout: [...skills, "Large Language Models", "Retrieval-Augmented Generation", "Open source software"],
        knowsLanguage: ["en", "ml"],
        hasCredential: certifications.map((c) => ({
          "@type": "EducationalOccupationalCredential",
          name: c.title.trim(),
          credentialCategory: "certificate",
          recognizedBy: { "@type": "Organization", name: c.techStack[0] },
          url: c.link.href,
        })),
        award: holopins.map((h) => h.title),
        sameAs: [...contact.social.map((s) => s.url), ...EXTRA_PROFILES.map((p) => p.url)],
      },
      {
        "@type": "Organization",
        "@id": org,
        name: current.company,
        url: current.link,
      },
      {
        "@type": "ItemList",
        "@id": `${SITE_URL}#projects`,
        name: `Open-source projects by ${RESUME_DATA.name}`,
        numberOfItems: projects.length,
        itemListElement: projects.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "SoftwareSourceCode",
            name: p.title,
            description: p.description,
            url: p.link.href,
            programmingLanguage: languageOf(p.techStack),
            applicationCategory: categoryOf(p.techStack),
            keywords: p.techStack.join(", "),
            author: { "@id": person },
          },
        })),
      },
      {
        "@type": "ItemList",
        "@id": `${SITE_URL}#articles`,
        name: `Articles by ${RESUME_DATA.name}`,
        numberOfItems: publications.length,
        itemListElement: publications.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "Article",
            headline: p.title,
            url: p.link.href,
            datePublished: isoDate(p.techStack[0]),
            publisher: { "@type": "Organization", name: "Medium" },
            author: { "@id": person },
          },
        })),
      },
    ],
  };
}

/** Full plain-markdown dump of the site for LLM crawlers (served as /llms-full.txt). */
export function llmsFull() {
  const { name, location, summary, work, education, skills, projects, publications, certifications, holopins, contact } =
    RESUME_DATA;
  const lines: string[] = [];
  const h = (t: string) => lines.push("", `## ${t}`, "");

  lines.push(`# ${name}`, "", `> ${RESUME_DATA.about}`, "");
  lines.push(
    `Canonical: ${SITE_URL}`,
    `Location: ${location}, India`,
    `Current role: ${work[0].title} at ${work[0].company} (${work[0].start} to ${work[0].end})`,
    `Not currently available for new work.`
  );

  h("Summary");
  lines.push(...summary.split("\n").filter(Boolean).flatMap((p) => [p, ""]));

  h("Experience");
  for (const w of work) {
    lines.push(`- **${w.title}**, ${w.company} (${w.start} to ${w.end}; ${w.badges.join(", ")}): ${w.link}`);
    if (w.description) lines.push(`  ${w.description}`);
  }

  h("Education");
  for (const e of education) lines.push(`- ${e.degree}, ${e.school} (${e.start} to ${e.end})`);

  h("Skills");
  lines.push(skills.join(", "));

  h(`Open-source projects (${projects.length})`);
  for (const p of projects) lines.push(`- [${p.title}](${p.link.href}): ${p.description} _(${p.techStack.join(", ")})_`);

  h(`Articles (${publications.length})`);
  for (const p of publications) lines.push(`- [${p.title}](${p.link.href}): Medium, ${p.techStack[0]}`);

  h(`Certifications (${certifications.length})`);
  for (const c of certifications) lines.push(`- [${c.title.trim()}](${c.link.href}): ${c.techStack[0]}, ${c.techStack[1]}`);

  h(`Community badges (${holopins.length})`);
  for (const b of holopins) lines.push(`- [${b.title}](${b.link}): ${b.description}`);

  h("Profiles");
  for (const s of [...contact.social.map((s) => ({ name: s.name, url: s.url })), ...EXTRA_PROFILES])
    lines.push(`- [${s.name}](${s.url})`);

  lines.push("", "---", `Generated from the portfolio source (${SITE_URL}). Hand-written context: ${url("llms.txt")}`);
  return lines.join("\n") + "\n";
}
