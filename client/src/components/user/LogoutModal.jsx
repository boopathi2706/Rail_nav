import React from "react";
import { LogOut, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LogoutModal = ({ onClose }) => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userData");

    onClose();
    navigate("/login");
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900">
        <div className="flex justify-between">
          <div className="rounded-xl bg-red-100 p-3 text-red-600 dark:bg-red-950/30">
            <LogOut size={22} />
          </div>

          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <h2 className="mt-5 text-xl font-bold">
          Logout?
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Are you sure you want to logout from Rail Nav?
        </p>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-300 px-4 py-3 font-semibold dark:border-slate-700"
          >
            Cancel
          </button>

          <button
            onClick={logout}
            className="flex-1 rounded-xl bg-red-600 px-4 py-3 font-semibold text-white hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;