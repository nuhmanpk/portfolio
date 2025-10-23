import { motion } from "framer-motion";
import { Badge } from "./ui/badge";

interface Props {
  title: string;
  description: string;
  tags: readonly string[];
  link?: string;
}

export function ProjectCard({ title, description, tags, link }: Props) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="flex flex-col overflow-hidden rounded-lg border border-muted bg-card shadow-sm"
    >
      <a href={link} target="_blank" className="p-6">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </a>
      <div className="mt-auto flex flex-wrap gap-2 p-6 pt-0">
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary">
            {tag}
          </Badge>
        ))}
      </div>
    </motion.div>
  );
}
