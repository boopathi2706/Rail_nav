import React from "react";
import {
  X,
  User,
  Mail,
  Phone,
  ShieldCheck,
  Building2,
  CalendarDays,
} from "lucide-react";

const OfficerDetailsModal = ({ officer, onClose }) => {
  if (!officer) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white shadow-2xl dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 p-5 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold">
              Officer Details
            </h2>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              Officer information
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X size={20} />
          </button>
        </div>

        {/* Profile */}
        <div className="p-6">
          <div className="flex flex-col items-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-100 text-3xl font-bold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
              {officer.name
                ?.charAt(0)
                ?.toUpperCase() || "O"}
            </div>

            <h3 className="mt-4 text-xl font-bold">
              {officer.name}
            </h3>

            <span className="mt-2 rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold capitalize text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400">
              {officer.officerType}
            </span>
          </div>

          <div className="mt-7 space-y-3">
            <InfoRow
              icon={Mail}
              label="Email"
              value={officer.email}
            />

            <InfoRow
              icon={Phone}
              label="Phone"
              value={officer.phoneNumber}
            />

            <InfoRow
              icon={ShieldCheck}
              label="Officer Type"
              value={officer.officerType}
            />

            <InfoRow
              icon={Building2}
              label="Station"
              value={
                officer.station?.stationName ||
                "Current Station"
              }
            />

            {officer.createdAt && (
              <InfoRow
                icon={CalendarDays}
                label="Created"
                value={new Date(
                  officer.createdAt
                ).toLocaleString()}
              />
            )}
          </div>
        </div>

        <div className="border-t border-slate-200 p-5 dark:border-slate-800">
          <button
            onClick={onClose}
            className="w-full rounded-xl bg-slate-100 py-3 text-sm font-bold hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-slate-500 shadow-sm dark:bg-slate-900 dark:text-slate-400">
      <Icon size={18} />
    </div>

    <div className="min-w-0">
      <p className="text-xs text-slate-400">
        {label}
      </p>

      <p className="mt-0.5 break-all text-sm font-semibold">
        {value || "---"}
      </p>
    </div>
  </div>
);

export default OfficerDetailsModal;