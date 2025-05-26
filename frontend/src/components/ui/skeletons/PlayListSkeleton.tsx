import { motion } from "framer-motion";

const skeletonVariants = {
  hidden: { opacity: 0, y: 5 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
      ease: "easeOut",
    },
  }),
};

const PlaylistsSkeleton = () => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-4 bg-base-300 backdrop-blur-md p-4 rounded-xl shadow-md"
    >
      {Array.from({ length: 10 }).map((_, i) => (
        <motion.div
          key={i}
          custom={i}
          variants={skeletonVariants}
          className="flex items-center gap-3 p-2 rounded-lg bg-base-200/50"
        >
          <div className="skeleton size-14 rounded-md" />
          <div className="flex flex-col gap-1 w-full">
            <div className="skeleton h-4 w-3/4 rounded" />
            <div className="skeleton h-3 w-1/2 rounded" />
            <div className="skeleton h-3 w-1/3 rounded" />
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default PlaylistsSkeleton;
