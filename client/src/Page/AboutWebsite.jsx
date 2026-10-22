import React from "react";
import { motion } from "framer-motion";
import {
  MapPinned,
  TrainFront,
  Utensils,
  Ticket,
  Bath,
  MessageSquareWarning,
  QrCode,
  ArrowRight,
  TrendingUp,
  Award,
  Users2,
} from "lucide-react";

const features = [
  {
    icon: <TrainFront size={20} />,
    title: "Platform Navigation",
    desc: "Find Platform 1, 2, 3 and more with step-by-step directions.",
  },
  {
    icon: <Ticket size={20} />,
    title: "Ticket Counter",
    desc: "Locate the nearest booking and reservation counters instantly.",
  },
  {
    icon: <Utensils size={20} />,
    title: "Food & Canteen",
    desc: "Discover restaurants, food courts and tea stalls inside stations.",
  },
  {
    icon: <Bath size={20} />,
    title: "Waiting Hall & Restroom",
    desc: "Quickly locate waiting rooms and clean washrooms.",
  },
  {
    icon: <QrCode size={20} />,
    title: "QR Navigation",
    desc: "Scan station QR codes to start navigation immediately.",
  },
  {
    icon: <MessageSquareWarning size={20} />,
    title: "Complaint System",
    desc: "Report issues directly through our integrated complaint portal.",
  },
];

const stats = [
  { value: "50+", label: "Stations Mapped", icon: <TrainFront className="text-blue-500" size={20} /> },
  { value: "100K+", label: "Active Commuters", icon: <Users2 className="text-emerald-500" size={20} /> },
  { value: "99.8%", label: "Accuracy Rating", icon: <Award className="text-amber-500" size={20} /> },
  { value: "10s", label: "QR Launch Speed", icon: <TrendingUp className="text-purple-500" size={20} /> },
];

const AboutWebsite = () => {
  return (
    <section className="bg-white py-24 px-6 relative overflow-hidden">
      {/* Decorative blurred backgrounds */}
      <div className="absolute top-1/4 right-0 h-[500px] w-[500px] rounded-full bg-blue-50/70 blur-3xl -z-10"></div>
      <div className="absolute bottom-1/4 left-0 h-[500px] w-[500px] rounded-full bg-cyan-50/70 blur-3xl -z-10"></div>

      <div className="mx-auto flex max-w-7xl flex-col items-center gap-20 lg:flex-row">
        {/* Left Image Section */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative flex-1 w-full"
        >
          <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100">
            <img
              src="/train.webp"
              alt="Railway Station"
              className="w-full object-cover h-[480px]"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=800&q=80";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 to-transparent"></div>
          </div>

          {/* Floating badge 1 */}
          <motion.div
            animate={{
              y: [0, -12, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 4,
              ease: "easeInOut",
            }}
            className="absolute -right-4 top-12 rounded-2xl bg-white p-4.5 shadow-xl shadow-slate-100 border border-slate-100 flex items-center gap-3"
          >
            <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
              <MapPinned size={26} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Live Position</p>
              <p className="text-sm font-extrabold text-slate-800">Indoor Navigation</p>
            </div>
          </motion.div>

          {/* Floating badge 2 */}
          <motion.div
            animate={{
              y: [0, 12, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 4,
              delay: 2,
              ease: "easeInOut",
            }}
            className="absolute -left-4 bottom-12 rounded-2xl bg-white p-4.5 shadow-xl shadow-slate-100 border border-slate-100 flex items-center gap-3"
          >
            <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
              <TrainFront size={26} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Terminal Guide</p>
              <p className="text-sm font-extrabold text-slate-800">Platform Finder</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Content Section */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex-1 text-left w-full space-y-6"
        >
          <div>
            <span className="rounded-full bg-blue-50 px-4.5 py-1.5 text-xs font-bold text-blue-600 uppercase tracking-widest">
              Smart Terminal Maps
            </span>

            <h2 className="mt-4 text-4xl font-extrabold leading-tight text-slate-900 md:text-5xl tracking-tight">
              Never get lost inside a railway station again.
            </h2>

            <p className="mt-4 text-base leading-relaxed text-slate-500 font-medium">
              Locating platforms, ticket reservation counters, restrooms, and food courts should be stress-free. RailNav maps terminal layouts interactively to elevate passenger convenience.
            </p>
          </div>

          {/* Stats Counter Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 bg-slate-50/70 border border-slate-100 rounded-3xl">
            {stats.map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center text-center p-3">
                <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-100 mb-2">
                  {stat.icon}
                </div>
                <span className="text-2xl font-black text-slate-900 leading-none">{stat.value}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Features Grid */}
          <div className="grid gap-6 sm:grid-cols-2">
            {features.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{
                  y: -3,
                  boxShadow: "0 10px 25px -10px rgba(59,130,246,0.1)",
                }}
                className="flex gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-5 transition-all duration-300"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  {item.icon}
                </div>

                <div>
                  <h4 className="font-bold text-slate-800 text-sm md:text-base">
                    {item.title}
                  </h4>

                  <p className="mt-1.5 text-xs md:text-sm text-slate-500 leading-normal font-medium">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Call To Action Button */}
          <div className="pt-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 rounded-full bg-blue-600 px-8 py-4 font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all text-sm cursor-pointer"
            >
              Explore Stations
              <ArrowRight size={18} />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutWebsite;