import { motion } from "framer-motion";

const AlbumsTableSkeleton = () => (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 60 }}
      className="overflow-x-auto mt-6 sm:mt-8 bg-base-300 p-3 sm:p-4 rounded-md max-h-[500px] overflow-y-auto"
    >
      <table className="table table-zebra bg-base-100 shadow-md border border-base-300 rounded-md rounded-box w-full">
        <thead className="bg-base-200 text-base-content sticky -top-4 text-xs sm:text-sm">
          <tr>
            <th>Title</th>
            <th>Artist</th>
            <th>Release Year</th>
            <th>Songs</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {[...Array(5)].map((_, index) => (
            <tr key={index}>
              <td className="flex items-center gap-2">
                <div className="size-8 sm:size-10 rounded-md bg-base-200 animate-pulse"></div>
                <div className="h-4 w-24 sm:w-32 bg-base-200 animate-pulse rounded"></div>
              </td>
              <td>
                <div className="h-4 w-20 sm:w-24 bg-base-200 animate-pulse rounded"></div>
              </td>
              <td>
                <div className="h-4 w-16 sm:w-20 bg-base-200 animate-pulse rounded"></div>
              </td>
              <td>
                <div className="h-4 w-16 sm:w-20 bg-base-200 animate-pulse rounded"></div>
              </td>
              <td className="text-right">
                <div className="btn btn-sm btn-error btn-circle btn-soft">
                  <div className="h-4 w-4 sm:h-5 sm:w-5 bg-base-200 animate-pulse rounded-full"></div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );

  export default AlbumsTableSkeleton;