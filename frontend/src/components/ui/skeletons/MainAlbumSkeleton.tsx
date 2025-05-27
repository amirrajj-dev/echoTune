import { motion } from "framer-motion";

const pulseTransition = {
  repeat: Infinity,
  repeatType: "reverse" as const,
  duration: 1.2,
  ease: "easeInOut",
};

const SkeletonRow = () => (
  <motion.tr
    initial={{ opacity: 0.6 }}
    animate={{ opacity: 1 }}
    transition={pulseTransition}
    className="cursor-default select-none"
  >
    <td className="px-2 py-3">
      <div className="size-5 rounded-full skeleton bg-base-100" />
    </td>
    <td className="flex items-center gap-3 px-1 py-3">
      <div className="w-18 h-12 rounded-lg skeleton bg-base-100" />
      <div className="flex flex-col gap-2 w-full">
        <div className="h-5 w-5/6 rounded-lg skeleton bg-base-100" />
        <div className="h-3 w-3/6 rounded-md skeleton bg-base-100" />
      </div>
    </td>
    <td className="px-2 py-3">
      <div className="h-4 w-20 rounded-md skeleton bg-base-100" />
    </td>
    <td className="px-2 py-3">
      <div className="h-4 w-14 rounded-md skeleton bg-base-100" />
    </td>
  </motion.tr>
);

const MainAlbumSkeleton = () => {
  return (
    <div className="p-6 space-y-6 bg-base-100/60 backdrop-blur-xl rounded-2xl shadow-2xl mx-auto">
      {/* Hero Skeleton */}
      <motion.div
        initial={{ opacity: 0.6, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={pulseTransition}
        className="bg-base-300 border border-white/20 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-8 shadow-lg"
      >
        <div className="w-44 h-44 rounded-2xl skeleton bg-base-100" />
        <div className="flex flex-col gap-5 flex-1">
          <div className="h-10 w-3/4 rounded-xl skeleton bg-base-100" />
          <div className="h-6 w-2/5 rounded-lg skeleton bg-base-100" />
          <div className="h-6 w-1/4 rounded-lg skeleton bg-base-100" />
          <div className="size-14 rounded-full skeleton bg-base-100" />
        </div>
      </motion.div>

      {/* Table Skeleton */}
      <motion.div
        className="bg-base-300 p-4 rounded-xl shadow border border-white/10"
        initial={{ opacity: 0.6 }}
        animate={{ opacity: 1 }}
        transition={pulseTransition}
      >
        <table className="table bg-base-300 text-base-content w-full">
          <thead className="bg-base-100 sticky top-0 z-10">
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Release Date</th>
              <th>Duration</th>
            </tr>
          </thead>
            <tbody>
              {[...Array(3)].map((_, i) => (
                <SkeletonRow key={i} />
              ))}
            </tbody>
        </table>
      </motion.div>
    </div>
  );
};

export default MainAlbumSkeleton;