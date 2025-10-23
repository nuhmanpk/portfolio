import { motion } from "framer-motion";

interface Props {
  title: string;
  description: string;
  link?: string;
}

export function HolopinCard({ title, description, link }: Props) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onTap={() => window.open(link, "_blank")}
      className="flex flex-col overflow-hidden rounded-lg border border-muted bg-card shadow-sm p-6 cursor-pointer"
    >
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </motion.div>
  );
}
