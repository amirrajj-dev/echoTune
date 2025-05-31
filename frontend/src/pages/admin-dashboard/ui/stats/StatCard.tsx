import type{ FC } from "react";
import { motion } from "framer-motion";
import type{ LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  count: number;
  color?: string; // e.g., bg-success, bg-emerald-600
}

const StatCard: FC<StatCardProps> = ({ icon: Icon, title, count, color = "bg-primary/10 text-primary" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 80 }}
      className="card rounded-md bg-base-300 shadow-xl border border-base-300 p-4 hover:shadow-2xl transition duration-300"
    >
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-sm font-medium text-base-content/70 uppercase tracking-wide">
            {title}
          </h2>
          <p className="text-2xl font-bold text-base-content">{count}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;