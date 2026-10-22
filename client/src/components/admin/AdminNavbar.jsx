import React, { useEffect, useState } from "react";
import {
  Menu,
  Sun,
  Moon,
  Bell,
  ShieldCheck,
} from "lucide-react";

const AdminNavbar = ({ setSidebarOpen }) => {
  const [dark, setDark] = useState(
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <header className="sticky top-0 z-30 h-[72px] border-b border-slate-200 bg-white/90 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/90">

      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">

        <button
          onClick={() => setSidebarOpen(true)}
          className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 lg:hidden dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <Menu size={22} />
        </button>

        <div className="hidden lg:block">
          <h2 className="font-bold text-slate-900 dark:text-white">
            Administration
          </h2>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Railway Management System
          </p>
        </div>

        <div className="ml-auto flex items-center gap-2">

          <button className="relative rounded-xl p-2.5 text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
            <Bell size={20} />

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
          </button>

          <button
            onClick={() => setDark((prev) => !prev)}
            className="rounded-xl p-2.5 text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {dark ? (
              <Sun size={20} />
            ) : (
              <Moon size={20} />
            )}
          </button>

          <div className="ml-2 hidden items-center gap-3 border-l border-slate-200 pl-4 sm:flex dark:border-slate-700">

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
              <ShieldCheck size={19} />
            </div>

            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                Administrator
              </p>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Admin
              </p>
            </div>

          </div>

        </div>

      </div>
    </header>
  );
};

export default AdminNavbar;