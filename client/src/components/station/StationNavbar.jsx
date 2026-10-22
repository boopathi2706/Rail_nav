import React, { useEffect, useState } from "react";
import {
  Menu,
  Sun,
  Moon,
  Bell,
  User,
  Building2,
} from "lucide-react";

const StationNavbar = ({
  stationData,
  setSidebarOpen,
  setActivePage,
}) => {
  const [darkMode, setDarkMode] = useState(
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/90 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(true)}
          className="rounded-xl p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
        >
          <Menu size={22} />
        </button>

        <div>
          <h2 className="text-lg font-bold">
            Station Management
          </h2>

          <p className="hidden text-xs text-slate-500 dark:text-slate-400 sm:block">
            Manage station operations and passenger complaints
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          className="relative rounded-xl p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <Bell size={20} />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <button
          onClick={() => setDarkMode((prev) => !prev)}
          className="rounded-xl p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          {darkMode ? (
            <Sun size={20} />
          ) : (
            <Moon size={20} />
          )}
        </button>

        <button
          onClick={() => setActivePage("profile")}
          className="flex items-center gap-2 rounded-xl border border-slate-200 px-2 py-1.5 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800 sm:px-3"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
            <User size={17} />
          </div>

          <div className="hidden text-left sm:block">
            <p className="max-w-[150px] truncate text-xs font-bold">
              {stationData?.stationName || "Station"}
            </p>

            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              {stationData?.stationCode || "---"}
            </p>
          </div>
        </button>
      </div>
    </header>
  );
};

export default StationNavbar;