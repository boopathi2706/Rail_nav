import React from "react";
import { motion } from "framer-motion";
import { TrainFront, MapPin, Building2, Eye, Wifi, Info, ShieldCheck } from "lucide-react";

const stations = [
  {
    name: "Chennai Central",
    city: "Chennai",
    district: "Chennai",
    image: "/Chennai_Central.jpg",
    liveStatus: "Active",
    platforms: 17,
    wifi: true,
  },
  {
    name: "Coimbatore Junction",
    city: "Coimbatore",
    district: "Coimbatore",
    image: "coimbatore-junction.avif",
    liveStatus: "Active",
    platforms: 6,
    wifi: true,
  },
  {
    name: "Madurai Junction",
    city: "Madurai",
    district: "Madurai",
    image: "/madurai-junction.avif",
    liveStatus: "Active",
    platforms: 8,
    wifi: true,
  },
  {
    name: "Salem Junction",
    city: "Salem",
    district: "Salem",
    image: "/Salem_Junction.jpg",
    liveStatus: "Active",
    platforms: 5,
    wifi: false,
  },
  {
    name: "Trichy Junction",
    city: "Trichy",
    district: "Trichy",
    image: "/Tiruchy.jpg",
    liveStatus: "Active",
    platforms: 7,
    wifi: true,
  },
  {
    name: "Erode Junction",
    city: "Erode",
    district: "Erode",
    image: "/erode.jpg",
    liveStatus: "Active",
    platforms: 4,
    wifi: true,
  },
  {
    name: "Tirunelveli",
    city: "Tirunelveli",
    district: "Tirunelveli",
    image: "/tirunelveli.jpg",
    liveStatus: "Active",
    platforms: 5,
    wifi: false,
  },
  {
    name: "Villupuram",
    city: "Villupuram",
    district: "Villupuram",
    image: "/Viluppuram_Railway_Junction.jpg",
    liveStatus: "Maintenance",
    platforms: 6,
    wifi: true,
  },
];

const StationList = () => {
  return (
    <section className="min-h-screen bg-slate-50 px-6 py-20">
      {/* Heading */}
      <div className="mb-16 text-center">
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="rounded-full bg-blue-50 px-4 py-1.5 text-xs font-bold text-blue-600 uppercase tracking-widest"
        >
          Station Directory
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl"
        >
          Railway Station Directory
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-3 text-slate-500 max-w-xl mx-auto font-medium"
        >
          Navigate platforms, food courts, washrooms, and other facilities across prominent terminals.
        </motion.p>
      </div>

      {/* Grid */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {stations.map((station, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: index * 0.05,
            }}
            whileHover={{
              y: -8,
              boxShadow: "0 20px 40px -15px rgba(59,130,246,0.15)",
            }}
            viewport={{ once: true }}
            className="group overflow-hidden rounded-[2rem] bg-white border border-slate-100 shadow-sm transition-all duration-300 flex flex-col justify-between"
          >
            {/* Image & Badge Overlay */}
            <div className="relative h-60 overflow-hidden">
              <motion.img
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.4 }}
                src={station.image}
                alt={station.name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1532103054090-334e6e60ab29?auto=format&fit=crop&w=600&q=80";
                }}
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent"></div>

              {/* Station Indicators on Top */}
              <div className="absolute inset-x-4 top-4 flex justify-between items-center z-10">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase backdrop-blur-md border ${
                    station.liveStatus === "Active"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      station.liveStatus === "Active" ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                    }`}
                  ></span>
                  {station.liveStatus === "Active" ? "Live Maps" : "Maintenance"}
                </span>

                <div className="rounded-full bg-white/95 p-2 text-blue-600 shadow-md backdrop-blur-sm">
                  <TrainFront size={16} />
                </div>
              </div>

              {/* Station Name */}
              <div className="absolute bottom-4 left-5 right-5">
                <h3 className="text-xl font-extrabold text-white leading-tight">
                  {station.name}
                </h3>
              </div>
            </div>

            {/* Details */}
            <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                  <span className="flex items-center gap-2">
                    <Building2 size={14} className="text-blue-500" /> City
                  </span>
                  <span className="text-slate-800 font-semibold">{station.city}</span>
                </div>

                <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                  <span className="flex items-center gap-2">
                    <MapPin size={14} className="text-rose-500" /> District
                  </span>
                  <span className="text-slate-800 font-semibold">{station.district}</span>
                </div>

                <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                  <span className="flex items-center gap-2">
                    <ShieldCheck size={14} className="text-emerald-500" /> Platforms
                  </span>
                  <span className="text-slate-800 font-semibold">{station.platforms} Tracks</span>
                </div>

                <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                  <span className="flex items-center gap-2">
                    <Wifi size={14} className="text-blue-400" /> High-speed WiFi
                  </span>
                  <span className={`font-semibold ${station.wifi ? "text-emerald-600" : "text-slate-400"}`}>
                    {station.wifi ? "Available" : "Unavailable"}
                  </span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-blue-50 py-3 text-sm font-bold text-blue-600 hover:bg-blue-600 hover:text-white transition-all cursor-pointer mt-4"
              >
                <Eye size={15} />
                Explore Terminal Maps
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default StationList;