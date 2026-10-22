import React from "react";
import { X, User } from "lucide-react";

const UserDetailsModal = ({
  user,
  onClose,
}) => {
  if (!user) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">

      <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl dark:bg-slate-900">

        <div className="flex items-center justify-between border-b border-slate-200 p-6 dark:border-slate-800">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
              <User size={21} />
            </div>

            <div>
              <h2 className="font-bold text-white">
                User Details
              </h2>

              <p className="text-xs text-slate-500">
                {user.name}
              </p>
            </div>

          </div>

          <button onClick={onClose}>
            <X size={20} />
          </button>

        </div>

        <div className="space-y-5 p-6">

          <Info
            label="Name"
            value={user.name}
          />

          <Info
            label="Email"
            value={user.email}
          />

          <Info
            label="Phone Number"
            value={user.phoneNumber}
          />

          <Info
            label="Created At"
            value={
              user.createdAt
                ? new Date(
                    user.createdAt
                  ).toLocaleString()
                : "---"
            }
          />

          <Info
            label="Last Updated"
            value={
              user.lastUpdateAt
                ? new Date(
                    user.lastUpdateAt
                  ).toLocaleString()
                : "---"
            }
          />

        </div>

        <div className="border-t border-slate-200 p-4 dark:border-slate-800">

          <button
            onClick={onClose}
            className="w-full text-white rounded-xl bg-slate-100 py-3 text-sm font-bold dark:bg-slate-800"
          >
            Close
          </button>

        </div>

      </div>

    </div>
  );
};

const Info = ({ label, value }) => (
  <div>
    <p className="text-xs font-bold uppercase text-white">
      {label}
    </p>

    <p className="mt-1 break-words text-sm font-semibold text-slate-500">
      {value || "---"}
    </p>
  </div>
);

export default UserDetailsModal;