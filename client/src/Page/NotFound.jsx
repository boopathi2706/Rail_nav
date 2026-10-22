import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { TrainFront, ArrowLeft, TriangleAlert } from "lucide-react";

const NotFound = () => {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-950 text-white px-6">
      {/* Background visual effects */}
      <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-blue-600/10 blur-3xl"></div>
      <div className="absolute -bottom-40 -right-40 h-[600px] w-[600px] rounded-full bg-cyan-600/10 blur-3xl"></div>

      {/* Decorative Rail Tracks */}
      <div className="absolute bottom-20 left-0 right-0 h-2 flex justify-center gap-1 opacity-20">
        {Array.from({ length: 40 }).map((_, i) => (
          <div key={i} className="h-6 w-1 bg-slate-400 -mt-2 rotate-12"></div>
        ))}
        <div className="absolute h-[2px] w-full bg-slate-400 top-0"></div>
        <div className="absolute h-[2px] w-full bg-slate-400 top-2"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-lg">
        {/* Animated Signal / Icon */}
        <motion.div
          animate={{
            y: [0, -15, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative mb-8 rounded-full bg-red-500/10 p-6 text-red-500 border border-red-500/20 shadow-[0_0_50px_rgba(239,68,68,0.2)]"
        >
          <TriangleAlert size={56} />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute top-2 right-2 h-4 w-4 rounded-full bg-red-500"
          ></motion.div>
        </motion.div>

        {/* Status Code */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-8xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-400 to-amber-400"
        >
          404
        </motion.h1>

        {/* Message */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-4 text-3xl font-bold text-slate-100"
        >
          Platform Not Found
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-4 text-lg text-slate-400 leading-relaxed"
        >
          The train you're trying to catch has departed, or the platform/track does not exist. Let's redirect you back to safety.
        </motion.p>

        {/* Animated moving train indicator */}
        <div className="w-full bg-slate-800/40 rounded-full h-2 mt-8 overflow-hidden relative">
          <motion.div
            initial={{ left: "-20%" }}
            animate={{ left: "120%" }}
            transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
            className="absolute top-0 h-full flex items-center text-blue-400"
          >
            <TrainFront size={16} />
          </motion.div>
        </div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-10"
        >
          <Link to="/">
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 10px 30px rgba(59,130,246,0.3)",
              }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-8 py-4 font-semibold text-white transition-all"
            >
              <ArrowLeft size={20} />
              Return to Home Station
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
