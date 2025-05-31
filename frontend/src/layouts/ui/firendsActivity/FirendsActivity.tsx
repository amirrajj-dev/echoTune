import { motion } from "framer-motion";
import { Users, Music2, PauseCircle } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import SignInWithGoogleBtn from "../../../components/ui/SignInWithGoogleBtn";
import { useFriends } from "../../../hooks/firend.hook";

const FirendsActivity = () => {
  const { isSignedIn } = useUser();
  const { data: friends, isLoading } = useFriends()

  if (!isSignedIn) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-base-100/60 w-full md:w-auto backdrop-blur-md border border-white/10 p-6 rounded-xl shadow-xl max-w-md mx-auto md:mx-0"
      >
        <div className="text-center space-y-4">
          <motion.div
            animate={{
              rotate: [0, 3, -3, 0],
              scale: [1, 1.1, 1],
              opacity: [1, 0.8, 1],
            }}
            initial={{ opacity: 0, y: -10 }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="mx-auto w-12 h-12 bg-gradient-to-bl from-primary to-secondary flex items-center justify-center rounded-full shadow-lg"
          >
            <Music2 />
          </motion.div>
          <h2 className="text-lg font-semibold">
            See What Your Friends Are Listening To
          </h2>
          <p className="text-sm text-base-content/80">
            Connect with your friends and discover their music tastes.
          </p>
          <SignInWithGoogleBtn />
        </div>
      </motion.div>
    );
  }

  const isOnline = false;
  const isListening = false;
  return (
    <div className="bg-base-100/60 backdrop-blur-lg rounded-lg p-4 shadow-xl border border-white/10">
      <div className="flex flex-col bg-base-300 p-4 rounded-md">
        <div className="border-b border-white/10 pb-4 mb-2">
          <h2 className="flex items-center gap-2 font-semibold text-lg">
            <Users size={18} /> What They're Listening To
          </h2>
        </div>

        {isLoading ? (
          <div className="space-y-3 px-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0.3 }}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="flex items-center gap-3 p-3 rounded-lg bg-base-200/50 animate-pulse"
              >
                <div className="w-10 h-10 bg-base-100/70 rounded-full" />
                <div className="flex flex-col gap-2 w-full">
                  <div className="w-1/2 h-3 bg-base-100/70 rounded" />
                  <div className="w-1/3 h-3 bg-base-100/50 rounded" />
                </div>
              </motion.div>
            ))}
          </div>
        ) : friends?.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center text-sm text-base-content/70 p-4 bg-base-200/50 rounded-lg"
          >
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="bg-gradient-to-br from-primary to-secondary p-2 rounded-full flex items-center justify-center">
              <Music2 size={22} />
              </div>
              <p>No friend activity yet.</p>
              <p className="text-xs text-base-content/60">
                Your friends will appear here once they start listening 🎧
              </p>
            </div>
          </motion.div>
        ) : null}

        <div className="flex flex-col gap-3">
          {friends?.map((friend) => (
            <motion.div
              key={friend._id}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-base-200/60 transition-colors relative"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="relative w-10 h-10 shrink-0">
                <img
                  src={friend.imageUrl}
                  alt={friend.fullName}
                  className="w-10 h-10 rounded-full object-cover border border-white/10"
                />
                {isOnline ? (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                ) : (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-gray-400 ring-2 ring-white" />
                )}
              </div>

              <div className="flex flex-col">
                <span className="font-medium text-base">{friend.fullName}</span>
                {isListening ? (
                  <span className="text-sm text-white/80 flex items-center gap-1">
                    <Music2 size={14} className="text-primary" />
                    <span>song name — song artist</span>
                  </span>
                ) : (
                  <span className="text-sm text-gray-400 flex items-center gap-1">
                    <PauseCircle size={14} />
                    Idle
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FirendsActivity;
