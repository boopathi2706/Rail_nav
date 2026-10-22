import React from "react";
import {
  LogOut,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminLogoutModal = ({
  open,
  onClose,
}) => {
  const navigate = useNavigate();

  if (!open) return null;

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");

    onClose();

    navigate("/admin-login");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">

      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900">

        <div className="flex items-center justify-between">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-500/10">
            <LogOut size={23} />
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X size={20} />
          </button>

        </div>

        <h2 className="mt-5 text-xl font-bold">
          Logout?
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Are you sure you want to logout from the admin dashboard?
        </p>

        <div className="mt-6 flex gap-3">

          <button
            onClick={onClose}
            className="flex-1 rounded-xl bg-slate-100 py-3 text-sm font-bold dark:bg-slate-800"
          >
            Cancel
          </button>

          <button
            onClick={handleLogout}
            className="flex-1 rounded-xl bg-red-600 py-3 text-sm font-bold text-white hover:bg-red-700"
          >
            Logout
          </button>

        </div>

      </div>

    </div>
  );
};

export default AdminLogoutModal;