import { Award } from "lucide-react";

interface Props {
  title: string;
  description: string;
  link?: string;
}

export function HolopinCard({ title, description, link }: Props) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand"
    >
      <span className="grid h-11 w-11 place-items-center rounded-full bg-muted text-foreground transition-colors duration-300 group-hover:bg-brand group-hover:text-brand-foreground">
        <Award className="h-5 w-5" />
      </span>
      <h3 className="mt-6 font-display text-lg font-semibold leading-snug tracking-tight">
        {title}
      </h3>
      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </a>
  );
}
