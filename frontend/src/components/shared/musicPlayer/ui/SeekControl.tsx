import { motion } from "framer-motion";
import { useMusic } from "../../../../store/music.store";

interface SeekControlProps {
  currentTime: number;
  duration: number;
  setCurrentTime: (value: number) => void;
}

const SeekControl = ({
  currentTime,
  duration,
  setCurrentTime
}: SeekControlProps) => {
  const formatTime = (time: number) =>
      new Date(time * 1000).toISOString().substring(14, 19)
  const {seekTo} = useMusic()
  return (
    <div className="flex items-center gap-2 text-xs text-base-content/60 w-full sm:w-64">
      <span>{formatTime(currentTime)}</span>
      <div className="relative w-full">
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={currentTime}
          onChange={(e) => {
            const time = parseFloat(e.target.value);
            setCurrentTime(time);
            seekTo(time);
          }}
          className="w-full h-1 bg-base-200 rounded-full appearance-none cursor-pointer accent-primary"
        />
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 h-1 bg-primary/50 rounded-full"
          style={{ width: `${(currentTime / duration) * 100}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${(currentTime / duration) * 100}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>
      <span>{formatTime(duration)}</span>
    </div>
  );
};

export default SeekControl;