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
      initial={{ y: 0 }}
      whileHover={{
        y: -5,
        scale: 1.02,
        boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1), 0 0 15px 2px rgba(100, 100, 255, 0.1)",
        borderColor: "rgba(100, 100, 255, 0.2)"
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="flex flex-col overflow-hidden rounded-lg border border-muted bg-card shadow-sm transition-colors"
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
