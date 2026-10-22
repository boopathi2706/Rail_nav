import React, { useEffect, useState } from "react";
import {
  Menu,
  LogOut,
  UserCircle,
  RefreshCw,
} from "lucide-react";

import { getUserProfile } from "../../services/userApi";

const UserNavbar = ({
  onMenuClick,
  onProfileClick,
  onLogout,
}) => {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  const loadProfile = async () => {
    try {
      const response = await getUserProfile();

      if (response?.data) {
        setUser(response.data);

        localStorage.setItem(
          "userData",
          JSON.stringify(response.data)
        );
      }
    } catch (error) {
      console.error(
        "Navbar profile error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const displayName =
    user?.name ||
    user?.userName ||
    "Passenger";

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-gray-200 bg-white/90 px-4 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-950/90 md:px-6">

      <button
        type="button"
        onClick={onMenuClick}
        className="rounded-xl p-2 transition hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
      >
        <Menu size={22} />
      </button>

      <div className="hidden lg:block">
        <h2 className="text-lg font-black text-gray-900 dark:text-white">
          Rail Nav
        </h2>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">

        <button
          type="button"
          onClick={onProfileClick}
          className="flex items-center gap-2 rounded-xl px-2 py-2 transition hover:bg-gray-100 dark:hover:bg-gray-800"
        >

          {user?.profilePhoto ? (
            <img
              src={user.profilePhoto}
              alt="Profile"
              className="h-9 w-9 rounded-full object-cover"
            />
          ) : (
            <UserCircle
              size={35}
              className="text-gray-500"
            />
          )}

          <div className="hidden text-left sm:block">

            <p className="text-sm font-bold text-gray-900 dark:text-white">
              {loading ? "Loading..." : displayName}
            </p>

            <p className="text-xs text-gray-500">
              Passenger
            </p>

          </div>

        </button>

        <button
          type="button"
          onClick={onLogout}
          title="Logout"
          className="rounded-xl p-2.5 text-red-600 transition hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <LogOut size={19} />
        </button>

      </div>

    </header>
  );
};

export default UserNavbar;