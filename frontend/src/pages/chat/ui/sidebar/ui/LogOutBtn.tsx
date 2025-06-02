import { motion } from "framer-motion";
import { LogOut } from "lucide-react";
import { SignOutButton } from "@clerk/clerk-react";

const LogOutBtn = () => {
  return (
    <div className="tooltip" data-tip="Log Out">
      <motion.button
        className="btn btn-circle btn-sm xs:btn-md"
        whileTap={{ scale: 0.9 }}
      >
        <SignOutButton>
          <LogOut className="w-4 h-4" />
        </SignOutButton>
      </motion.button>
    </div>
  );
};

export default LogOutBtn;