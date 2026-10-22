import React from "react";
import {
  Bell,
  ShieldCheck,
  MapPin,
} from "lucide-react";

const OfficerNavbar = () => {
  const officerData = JSON.parse(
    localStorage.getItem("officerData") || "{}"
  );

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
      <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck size={19} className="text-slate-700" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Officer Workspace
            </span>
          </div>

          <h2 className="mt-1 text-lg font-bold text-slate-900 sm:text-xl">
            Welcome, {officerData?.name || "Officer"}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 sm:flex">
            <MapPin size={16} />
            <span className="max-w-[150px] truncate text-xs font-medium text-slate-600">
              {officerData?.stationName?.stationName|| "Station"}
            </span>
          </div>

          <button className="relative rounded-xl border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-50">
            <Bell size={19} />

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
          </button>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
            {officerData?.name?.charAt(0)?.toUpperCase() || "O"}
          </div>
        </div>
      </div>
    </header>
  );
};

export default OfficerNavbar;