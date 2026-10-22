import React from "react";
import {
  LayoutDashboard,
  ClipboardList,
  UserCircle,
  LogOut,
  X,
  TrainFront,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const OfficerSidebar = ({
  activePage,
  setActivePage,
  sidebarOpen,
}) => {
  const navigate = useNavigate();

  const officerData = JSON.parse(
    localStorage.getItem("officerData") || "{}"
  );

  const menuItems = [
    {
      id: "home",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "complaints",
      label: "Complaints",
      icon: ClipboardList,
    },
    {
      id: "profile",
      label: "My Profile",
      icon: UserCircle,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("officerToken");
    localStorage.removeItem("officerData");

    navigate("/officer-login");
  };

  return (
    <aside
      className={`fixed left-0 top-0 z-50 h-screen w-72 transform bg-slate-950 text-white shadow-2xl transition-transform duration-300 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0`}
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-slate-950">
              <TrainFront size={24} />
            </div>

            <div>
              <h1 className="text-lg font-bold">Rail Nav</h1>
              <p className="text-xs text-slate-400">Officer Portal</p>
            </div>
          </div>

          <button
            onClick={() => setActivePage("home")}
            className="rounded-lg p-2 hover:bg-white/10 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Officer info */}
        <div className="mx-4 mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-sm font-bold text-slate-900">
              {officerData?.name?.charAt(0)?.toUpperCase() || "O"}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">
                {officerData?.name || "Officer"}
              </p>

              <p className="truncate text-xs capitalize text-slate-400">
                {officerData?.officerType || "Officer"}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 px-4 py-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = activePage === item.id;

            return (
              <motion.button
                key={item.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActivePage(item.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  active
                    ? "bg-white text-slate-950 shadow-lg"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon size={20} />
                {item.label}
              </motion.button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-white/10 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-500/10 hover:text-red-200"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};

export default OfficerSidebar;