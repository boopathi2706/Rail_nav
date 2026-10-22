import React, { useState } from "react";
import { Search, Scan, Train, MapPin, Calendar, HelpCircle, ArrowRightLeft } from "lucide-react";
import { motion } from "framer-motion";

const Home = () => {
  const [activeTab, setActiveTab] = useState("train");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");

  const popularStations = ["Chennai Central", "Coimbatore Junction", "Madurai Junction", "Trichy Junction"];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Searching for:", { district, city, activeTab });
  };

  const handleQuickSearch = (station) => {
    // Fill in typical values for popular station
    if (station.includes("Chennai")) {
      setDistrict("Chennai");
      setCity("Chennai Central");
    } else if (station.includes("Coimbatore")) {
      setDistrict("Coimbatore");
      setCity("Coimbatore Junction");
    } else if (station.includes("Madurai")) {
      setDistrict("Madurai");
      setCity("Madurai Junction");
    } else {
      setDistrict("Trichy");
      setCity("Trichy Junction");
    }
  };

  return (
    <section className="relative bg-slate-50 py-16 px-6 lg:px-8">
      {/* Top Main Heading (Matching reference) */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-xs font-semibold text-blue-600 mb-4"
        >
          <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
          IRCTC Official Navigation Partner
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight flex items-center justify-center gap-3 uppercase"
        >
          Indian Railways <span>🚆</span>
        </motion.h1>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-4 mt-3 text-xs md:text-sm font-bold text-slate-500 tracking-widest uppercase"
        >
          <span>Safety</span>
          <span className="h-4 w-px bg-slate-300"></span>
          <span>Security</span>
          <span className="h-4 w-px bg-slate-300"></span>
          <span>Punctuality</span>
        </motion.div>
      </div>

      {/* Hero Banner Wrapper Container */}
      <div className="relative mx-auto max-w-6xl">
        {/* Rounded Banner background with overflow-hidden */}
        <div className="relative w-full h-[450px] md:h-[480px] rounded-[3rem] overflow-hidden shadow-2xl border border-slate-100/50">
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-1000 scale-105"
            style={{ backgroundImage: "url('/bg2.jpg')" }}
          >
            {/* Dark/blue gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
          </div>

          {/* Hero Text content */}
          <div className="absolute inset-x-6 top-16 md:top-20 text-center text-white z-10 space-y-3">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-5xl font-black tracking-tight"
            >
              Find Your Railway Station
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="max-w-xl mx-auto text-sm md:text-lg text-slate-200 font-medium"
            >
              Instantly map out indoor platforms, food courts, booking ticket counters, and waiting restrooms.
            </motion.p>
          </div>
        </div>

        {/* Floating Search Card Overlapping the Banner Bottom (Placed outside overflow-hidden) */}
        <div className="absolute inset-x-6 -bottom-16 md:-bottom-12 flex justify-center z-20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="w-full max-w-4xl rounded-3xl bg-white p-6 md:p-8 shadow-[0_25px_60px_-15px_rgba(59,130,246,0.28)] border border-slate-100"
          >
            {/* Tab Controls (Matching style of reference) */}
            <div className="flex justify-center border-b border-slate-100 pb-5 mb-6">
              <div className="flex items-center gap-1.5 bg-slate-100/90 p-1.5 rounded-full">
                {[
                  { id: "train", label: "Search Station Map", icon: <Train size={15} /> },
                  { id: "qr", label: "Scan Station QR", icon: <Scan size={15} /> },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2.5 px-6 py-2.5 text-xs md:text-sm font-bold rounded-full transition-all duration-300 ${
                      activeTab === tab.id
                        ? "bg-white text-blue-600 shadow-sm font-extrabold"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {activeTab === "train" ? (
              /* Search Form */
              <div className="space-y-4">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  {/* District Input */}
                  <div className="flex flex-col px-3 md:border-r border-slate-100 group">
                    <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 mb-1.5 flex items-center gap-1.5 transition-colors group-focus-within:text-blue-500">
                      <MapPin size={12} className="text-blue-500" /> District
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Chennai"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full text-sm font-bold text-slate-800 placeholder-slate-400 outline-none py-1 focus:text-blue-600 transition-colors"
                    />
                  </div>

                  {/* City Input */}
                  <div className="flex flex-col px-3 md:border-r border-slate-100 group">
                    <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 mb-1.5 flex items-center gap-1.5 transition-colors group-focus-within:text-red-500">
                      <MapPin size={12} className="text-red-500" /> City / Area
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Central"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full text-sm font-bold text-slate-800 placeholder-slate-400 outline-none py-1 focus:text-blue-600 transition-colors"
                    />
                  </div>

                  {/* Search Button */}
                  <div className="px-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="w-full flex h-13 items-center justify-center gap-2 rounded-full bg-blue-600 font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all text-sm cursor-pointer"
                    >
                      <Search size={18} />
                      Search Station
                    </motion.button>
                  </div>
                </form>

                {/* Popular Stations Suggestions */}
                <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-bold text-slate-400 mr-1 uppercase tracking-wider text-[10px]">Popular:</span>
                  {popularStations.map((station) => (
                    <button
                      key={station}
                      onClick={() => handleQuickSearch(station)}
                      className="px-3 py-1 rounded-md bg-slate-50 hover:bg-blue-50 hover:text-blue-600 border border-slate-100 hover:border-blue-100 font-semibold text-slate-600 transition-colors cursor-pointer"
                    >
                      {station}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* QR Code Section */
              <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
                <p className="text-sm font-semibold text-slate-500 max-w-md">
                  Point your camera at any RailNav station QR code to load the interactive indoor navigation directory immediately.
                </p>
                <motion.button
                  whileHover={{ scale: 1.03, boxShadow: "0px 10px 25px rgba(16,185,129,0.3)" }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2.5 rounded-full bg-emerald-600 px-8 py-4 font-bold text-white shadow-lg hover:bg-emerald-700 transition-all text-sm cursor-pointer"
                >
                  <Scan size={18} />
                  Scan Station QR Code
                </motion.button>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* AskDISHA Helper Bar at Bottom (Matching reference design) */}
      <div className="mt-32 mx-auto max-w-5xl bg-white border border-slate-100/80 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-md transition-shadow">
        <div className="flex gap-4.5 items-start text-left">
          <div className="rounded-2xl bg-amber-50 p-3.5 text-amber-600 border border-amber-100 shadow-sm shrink-0">
            <HelpCircle size={28} />
          </div>
          <div>
            <span className="inline-block rounded-full bg-amber-100/60 border border-amber-200 px-2.5 py-0.5 text-[10px] font-bold text-amber-800 uppercase tracking-wider mb-2">
              Virtual Assistant
            </span>
            <h3 className="font-extrabold text-slate-800 text-lg md:text-xl">
              Need assistance inside the station?
            </h3>
            <p className="text-sm text-slate-500 mt-1 font-medium leading-relaxed">
              AskDISHA is our dedicated platform for fast, simple, and hassle-free assistance regarding platform locations and reservation desks.
            </p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.03, boxShadow: "0px 10px 25px rgba(217,119,6,0.25)" }}
          whileTap={{ scale: 0.97 }}
          className="whitespace-nowrap rounded-full bg-amber-650 px-8 py-4 font-bold text-white bg-amber-600 shadow-lg shadow-amber-650/20 hover:bg-amber-700 transition-all text-sm cursor-pointer"
        >
          AskDISHA
        </motion.button>
      </div>
    </section>
  );
};

export default Home;