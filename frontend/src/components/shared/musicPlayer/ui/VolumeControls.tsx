import { motion } from "framer-motion";
import { Volume2, Volume1, VolumeX } from "lucide-react";
import { useMusic } from "../../../../store/music.store";

const VolumeControl = () => {
  const {volume , setVolume} = useMusic()
  const getVolumeIcon = () => {
    if (volume === 0) return <VolumeX className="w-5 h-5" />;
    if (volume < 0.5) return <Volume1 className="w-5 h-5" />;
    return <Volume2 className="w-5 h-5" />;
  };

  return (
    <div className="flex items-center gap-2">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setVolume(volume > 0 ? 0 : 0.5)}
        className="text-base-content/60 cursor-pointer hover:text-base-content"
      >
        {getVolumeIcon()}
      </motion.button>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={volume}
        onChange={(e) => setVolume(parseFloat(e.target.value))}
        className="w-20 sm:w-24 h-1 bg-base-200 rounded-full appearance-none cursor-pointer accent-primary"
      />
    </div>
  );
};

export default VolumeControl;