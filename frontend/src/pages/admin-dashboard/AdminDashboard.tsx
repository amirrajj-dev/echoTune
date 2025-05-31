import Logo from "../../components/ui/Logo";
import { UserButton } from "@clerk/clerk-react";
import ThemePallette from "../../components/ui/theme/ThemePallette";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import Stats from "./ui/stats/Stats";
import Tabs from "./ui/tabs/Tabs";

const AdminDashboard = () => {
  return (
    <div className="bg-base-100/80 backdrop-blur-md rounded-xl shadow-lg mx-2 sm:mx-4 md:mx-6 lg:mx-8 mt-2 sm:mt-4 p-3 sm:p-4 md:p-5">
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-base-200 p-3 sm:p-4 rounded-xl z-10">
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <Logo />
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl sm:text-3xl md:text-3xl font-bold text-base-content">
                Music Manager
              </h1>
              <p className="text-xs sm:text-sm text-base-content/70">
                Welcome to the Admin Dashboard of EchoTune 🎵
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 mt-3 sm:mt-0 w-full sm:w-auto justify-end">
            <UserButton />
            <button className="btn btn-circle btn-primary btn-sm sm:btn-md">
              <ThemePallette />
            </button>
            <Link
              to="/favourites"
              data-tip="Favourites"
              className="btn btn-circle btn-sm sm:btn-md btn-soft tooltip bg-rose-600 border-none"
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </div>
        </div>
        {/* Stats */}
        <Stats />
        {/* Songs and Albums Tabs */}
        <Tabs />
      </div>
    </div>
  );
};

export default AdminDashboard;
