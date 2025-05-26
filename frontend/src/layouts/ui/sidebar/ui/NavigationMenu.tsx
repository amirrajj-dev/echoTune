import { Home, MessageSquare } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import React from "react";

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/chat", label: "Messages", icon: MessageSquare },
];

const NavigationMenu = () => {
  const location = useLocation();

  return (
    <motion.ul
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-base-300 backdrop-blur-md space-y-2 p-4 rounded-xl shadow-md"
    >
      {navItems.map(({ to, label, icon: Icon }) => {
        const isActive = location.pathname === to;

        return (
          <motion.li
            key={to}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Link
              to={to}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-gradient-to-br from-primary to-secondary font-medium"
                  : "hover:bg-base-200"
              }`}
            >
              <Icon size={18} className={`${isActive ? "text-base-content" : ""}`} />
              <span>{label}</span>
            </Link>
          </motion.li>
        );
      })}
    </motion.ul>
  );
};

export default NavigationMenu;