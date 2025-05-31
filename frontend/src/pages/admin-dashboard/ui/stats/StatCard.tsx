import { useEffect, useState } from "react";
import type{ FC } from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  count: number;
  color?: string; // e.g., bg-success, bg-emerald-600
}

const StatCard: FC<StatCardProps> = ({
  icon: Icon,
  title,
  count,
  color = "bg-primary/10 text-primary",
}) => {
  const [displayCount, setDisplayCount] = useState(0);

  // Smooth animated count-up
  useEffect(() => {
    const duration = 1000;
    const frameDuration = 1000 / 60;
    const totalFrames = Math.round(duration / frameDuration);
    let frame = 0;

    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const eased = Math.round(count * progress);
      setDisplayCount(eased > count ? count : eased);
      if (frame === totalFrames) clearInterval(counter);
    }, frameDuration);
  }, [count]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03, rotateX: 2, rotateY: -2 }}
      transition={{ duration: 0.4, type: "spring", stiffness: 120 }}
      className="group relative card rounded-xl bg-base-300 p-5 border border-base-200 hover:border-primary/50 transition-shadow shadow-md hover:shadow-xl transform-gpu"
    >
      {/* Glow border ring */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-accent/30 blur-lg opacity-0 group-hover:opacity-40 transition pointer-events-none rounded-xl z-0" />

      <div className="relative z-10 flex items-center gap-4">
        {/* Icon with soft glow ring */}
        <div
          className={`p-3 rounded-full ${color} relative shadow-inner flex items-center justify-center`}
        >
          <div className="absolute w-10 h-10 bg-current opacity-20 blur-md rounded-full -z-10" />
          <Icon className="w-6 h-6" />
        </div>

        <div className="flex flex-col">
          <h2 className="text-xs font-semibold text-base-content/60 uppercase tracking-wide">
            {title}
          </h2>
          <p className="text-3xl font-bold text-base-content">
            {displayCount.toLocaleString()}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;