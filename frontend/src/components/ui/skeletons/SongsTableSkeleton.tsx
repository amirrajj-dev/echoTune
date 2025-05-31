import { motion } from "framer-motion";

const SongsTableSkeleton = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 60 }}
      className="overflow-x-auto mt-10 bg-base-300 p-4 rounded-md max-h-[500px] overflow-y-auto"
    >
      <table className="table table-zebra bg-base-100 shadow-md border border-base-300 rounded-md rounded-box">
        <thead className="bg-base-200 text-base-content sticky -top-4">
          <tr>
            <th>Title</th>
            <th>Artist</th>
            <th>Release Date</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {[...Array(5)].map((_ , index) => (
            <tr key={index + 1}>
              <td className="font-semibold flex items-center gap-2">
                <div className="size-10 rounded-md bg-base-200 animate-pulse skeleton"></div>
                <div className="h-4 w-32 bg-base-200 animate-pulse skeleton rounded"></div>
              </td>
              <td>
                <div className="h-4 w-24 bg-base-200 animate-pulse skeleton rounded"></div>
              </td>
              <td>
                <div className="h-4 w-20 bg-base-200 animate-pulse skeleton rounded"></div>
              </td>
              <td className="text-right">
                <div className="btn btn-sm btn-ghost btn-circle btn-soft">
                  <div className="h-5 w-5 bg-base-200 animate-pulse skeleton rounded-full"></div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};

export default SongsTableSkeleton;