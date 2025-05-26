import TopBar from "../components/ui/TopBar";
import { Outlet } from "react-router-dom";
import FirendsActivity from "./ui/firendsActivity/FirendsActivity";
import Sidebar from "./ui/sidebar/Sidebar";
import { motion } from "framer-motion";

const MainLayout = () => {
  return (
    <div className="grid grid-cols-12 gap-4 px-2">
      {/* Sidebar */}
      <motion.div
        className="col-span-3 mt-3"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <Sidebar />
      </motion.div>

      {/* Main content */}
      <motion.div
        className="col-span-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <TopBar />
        <motion.div
          className="mt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Outlet />
        </motion.div>
      </motion.div>

      {/* Friends Activity */}
      <motion.div
        className="col-span-3 mt-3"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <FirendsActivity />
      </motion.div>
    </div>
  );
};

export default MainLayout;