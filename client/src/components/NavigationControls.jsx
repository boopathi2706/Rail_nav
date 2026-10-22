import { motion } from "framer-motion";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
} from "lucide-react";

const NavigationControls = ({
  isNavigating,
  setIsNavigating,
  voiceEnabled,
  setVoiceEnabled,
  resetNavigation,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 rounded-3xl bg-white p-6 shadow-xl"
    >
      <h2 className="mb-6 text-2xl font-bold text-slate-800">
        Navigation Controls
      </h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        {/* Start */}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: .95 }}
          onClick={() => setIsNavigating(true)}
          className="flex items-center justify-center gap-3 rounded-xl bg-green-600 py-4 font-semibold text-white shadow-lg"
        >
          <Play />
          Start
        </motion.button>

        {/* Pause */}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: .95 }}
          onClick={() => setIsNavigating(false)}
          className="flex items-center justify-center gap-3 rounded-xl bg-yellow-500 py-4 font-semibold text-white shadow-lg"
        >
          <Pause />
          Pause
        </motion.button>

        {/* Voice */}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: .95 }}
          onClick={() => setVoiceEnabled(!voiceEnabled)}
          className="flex items-center justify-center gap-3 rounded-xl bg-blue-600 py-4 font-semibold text-white shadow-lg"
        >
          {voiceEnabled ? <Volume2 /> : <VolumeX />}
          {voiceEnabled ? "Voice ON" : "Voice OFF"}
        </motion.button>

        {/* Reset */}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: .95 }}
          onClick={resetNavigation}
          className="flex items-center justify-center gap-3 rounded-xl bg-red-600 py-4 font-semibold text-white shadow-lg"
        >
          <RotateCcw />
          Reset
        </motion.button>

      </div>

      <div className="mt-6 rounded-xl bg-slate-100 p-4">

        <p className="text-lg font-semibold">
          Status :
          <span
            className={`ml-2 ${
              isNavigating
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {isNavigating
              ? "Navigation Started"
              : "Navigation Stopped"}
          </span>
        </p>

      </div>

    </motion.div>
  );
};

export default NavigationControls;