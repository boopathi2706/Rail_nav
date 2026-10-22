import React from "react";
import {
  Home,
  FileText,
  PlusCircle,
  User,
  LogOut,
  X,
  TrainFront,
} from "lucide-react";
import { motion } from "framer-motion";

const UserSidebar = ({
  activePage,
  onNavigate,
  mobileOpen,
  onClose,
  onLogout,
}) => {
  const menu = [
    {
      id: "home",
      label: "Home",
      icon: Home,
    },
    {
      id: "complaints",
      label: "My Complaints",
      icon: FileText,
    },
    {
      id: "create",
      label: "Create Complaint",
      icon: PlusCircle,
    },
    {
      id: "profile",
      label: "Profile",
      icon: User,
    },
  ];

  const handleNavigation = (id) => {
    onNavigate(id);
    onClose();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: mobileOpen ? 0 : 0,
        }}
        transition={{
          duration: 0.25,
          ease: "easeInOut",
        }}
        className={`
          fixed
          inset-y-0
          left-0
          z-50
          flex
          w-72
          flex-col
          border-r
          border-slate-200
          bg-white
          shadow-xl
          transition-transform
          duration-300
          dark:border-slate-800
          dark:bg-slate-900

          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        {/* Header */}
        <div className="flex h-20 shrink-0 items-center justify-between border-b border-slate-200 px-6 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-indigo-600 p-2 text-white shadow-lg shadow-indigo-600/20">
              <TrainFront size={22} />
            </div>

            <div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white">
                Rail Nav
              </h1>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Passenger Portal
              </p>
            </div>
          </div>

          {/* Mobile Close */}
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 overflow-y-auto p-4">
          {menu.map((item) => {
            const Icon = item.icon;
            const active = activePage === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavigation(item.id)}
                className={`
                  flex
                  w-full
                  items-center
                  gap-3
                  rounded-xl
                  px-4
                  py-3
                  text-left
                  transition-all
                  duration-200

                  ${
                    active
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  }
                `}
              >
                <Icon size={20} />

                <span className="font-medium">
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="shrink-0 border-t border-slate-200 p-4 dark:border-slate-800">
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
          >
            <LogOut size={20} />

            <span className="font-medium">
              Logout
            </span>
          </button>
        </div>
      </motion.aside>
    </>
  );
};

export default UserSidebar;