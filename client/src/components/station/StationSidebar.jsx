import React from "react";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  MessageSquareWarning,
  Building2,
  LogOut,
  X,
  TrainFront,
} from "lucide-react";

const StationSidebar = ({
  activePage,
  setActivePage,
  sidebarOpen,
  setSidebarOpen,
  stationData,
}) => {
  const menuItems = [
    {
      id: "home",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "officers",
      label: "Officers",
      icon: Users,
    },
    {
      id: "create-officer",
      label: "Create Officer",
      icon: UserPlus,
    },
    {
      id: "complaints",
      label: "Complaints",
      icon: MessageSquareWarning,
    },
    {
      id: "profile",
      label: "Station Profile",
      icon: Building2,
    },
  ];

  const handleNavigation = (id) => {
    setActivePage(id);
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("stationToken");
    localStorage.removeItem("stationData");

    window.location.href = "/station-login";
  };

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-300 dark:border-slate-800 dark:bg-slate-900 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b border-slate-200 px-5 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg">
              <TrainFront size={24} />
            </div>

            <div>
              <h1 className="text-lg font-bold">Rail Nav</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Station Portal
              </p>
            </div>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Station */}
        <div className="border-b border-slate-200 p-5 dark:border-slate-800">
          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/70">
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
                <Building2 size={20} />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-bold">
                  {stationData?.stationName || "Railway Station"}
                </p>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {stationData?.stationCode || "---"}
                </p>
              </div>
            </div>

            <span className="inline-flex rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700 dark:bg-green-500/10 dark:text-green-400">
              Station Active
            </span>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = activePage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                  active
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-slate-200 p-4 dark:border-slate-800">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
          >
            <LogOut size={19} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default StationSidebar;