import React, { useState } from "react";
import {
  LayoutDashboard,
  Building2,
  UserCog,
  Users,
  MessageSquareWarning,
  Plus,
  LogOut,
  X,
  ShieldCheck,
  TrainFront
} from "lucide-react";

import AdminLogoutModal from "./AdminLogoutModal";

const AdminSidebar = ({
  activePage,
  setActivePage,
  sidebarOpen,
  setSidebarOpen,
}) => {
  const [showLogout, setShowLogout] = useState(false);

  const menuItems = [
    {
      id: "home",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "stations",
      label: "Stations",
      icon: Building2,
    },
    {
      id: "create-station",
      label: "Create Station",
      icon: Plus,
    },
    {
      id: "officers",
      label: "Officers",
      icon: UserCog,
    },
    {
      id: "users",
      label: "Users",
      icon: Users,
    },
    {
      id: "complaints",
      label: "Complaints",
      icon: MessageSquareWarning,
    },
  ];

  const handleNavigation = (page) => {
    setActivePage(page);
    setSidebarOpen(false);
  };

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-300 dark:border-slate-800 dark:bg-slate-900 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >

        {/* Header */}

        <div className="flex h-20 items-center justify-between border-b border-slate-200 px-6 dark:border-slate-800">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg">
              <TrainFront size={24} />
            </div>

            <div>
              <h1 className="font-bold text-slate-900 dark:text-white">
                Rail Nav
              </h1>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Admin Panel
              </p>
            </div>

          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden dark:hover:bg-slate-800"
          >
            <X size={20} />
          </button>

        </div>

        {/* Navigation */}

        <nav className="flex-1 space-y-2 overflow-y-auto p-4">

          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = activePage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  active
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
              >
                <Icon size={19} />
                {item.label}
              </button>
            );
          })}

        </nav>

        {/* Logout */}

        <div className="border-t border-slate-200 p-4 dark:border-slate-800">

          <button
            onClick={() => setShowLogout(true)}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:hover:bg-red-500/10"
          >
            <LogOut size={19} />
            Logout
          </button>

        </div>

      </aside>

      <AdminLogoutModal
        open={showLogout}
        onClose={() => setShowLogout(false)}
      />
    </>
  );
};

export default AdminSidebar;