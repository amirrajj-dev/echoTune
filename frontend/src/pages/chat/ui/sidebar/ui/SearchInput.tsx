import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useSidebar } from "../../../../../store/sidebar.store";

const SearchInput = () => {
  const { query, setQuery } = useSidebar();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="flex items-center bg-base-100/80 backdrop-blur-sm rounded-full px-3 xs:px-4 py-2 shadow-sm border border-base-content/10"
      >
        <Search className="text-base-content/60 mr-2" size={16} />
        <input
          value={query}
          onChange={(e) => handleSearch(e)}
          type="text"
          placeholder="Search conversations..."
          className="flex-1 bg-transparent border-none outline-none text-base-content placeholder-base-content/40 focus:ring-0 text-xs xs:text-sm sm:text-base"
        />
      </motion.div>
    </motion.div>
  );
};

export default SearchInput;