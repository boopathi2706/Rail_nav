import React from "react";
import {
  LogOut,
  X,
  AlertTriangle,
} from "lucide-react";

const LogoutModal = ({
  onClose,
  onConfirm,
}) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400">
            <AlertTriangle size={27} />
          </div>

          <h2 className="mt-5 text-xl font-bold">
            Logout?
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Are you sure you want to logout from the
            station dashboard?
          </p>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl bg-slate-100 py-3 text-sm font-bold dark:bg-slate-800"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 py-3 text-sm font-bold text-white"
          >
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;