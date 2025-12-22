import { motion } from "framer-motion";

interface Props {
  title: string;
  description: string;
  link?: string;
}

export function HolopinCard({ title, description, link }: Props) {
  return (
    <motion.div
      initial={{ y: 0 }}
      whileHover={{
        y: -5,
        scale: 1.02,
        boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1), 0 0 15px 2px rgba(255, 100, 200, 0.1)",
        borderColor: "rgba(255, 100, 200, 0.2)"
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="flex flex-col overflow-hidden rounded-lg border border-muted bg-card shadow-sm p-6 cursor-pointer transition-colors"
    >
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </motion.div>
  );
}
