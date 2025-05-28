import TopBar from "../components/ui/TopBar";
import { Outlet } from "react-router-dom";
import FirendsActivity from "./ui/firendsActivity/FirendsActivity";
import Sidebar from "./ui/sidebar/Sidebar";
import { motion } from "framer-motion";

const MainLayout = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-4 p-2 xl:px-8 max-w-screen-2xl mx-auto">
      {/* Sidebar - shows on left on desktop, full-width top on mobile */}
      <motion.div
        className="col-span-1 md:col-span-8 lg:col-span-4 order-2 md:order-1 space-y-6 z-10"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <Sidebar />
        {/* Friends Activity - shows on right on desktop, full-width bottom on mobile */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <FirendsActivity />
        </motion.div>
      </motion.div>

      {/* Main content */}
      <motion.div
        className="md:col-span-8 order-1 md:order-2"
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
    </div>
  );
};

export default MainLayout;
