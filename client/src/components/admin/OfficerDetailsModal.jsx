import React from "react";
import { X, UserCog } from "lucide-react";

const OfficerDetailsModal = ({
  officer,
  station,
  onClose,
}) => {
  if (!officer) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">

      <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl dark:bg-slate-900">

        <div className="flex items-center justify-between border-b border-slate-200 p-6 dark:border-slate-800">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
              <UserCog size={21} />
            </div>

            <div>
              <h2 className="font-bold text-white">
                Officer Details
              </h2>

              <p className="text-xs text-slate-500">
                {"@"}{officer.name}
              </p>
            </div>

          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X size={20} />
          </button>

        </div>

        <div className="grid gap-5 p-6 sm:grid-cols-2">

          <Info
            label="Name"
            value={officer.name}
            
          />

          <Info
            label="Officer Type"
            value={officer.officerType}
            capitalize
          />

          <Info
            label="Email"
            value={officer.email}
          />

          <Info
            label="Phone Number"
            value={officer.phoneNumber}
          />

          <div className="sm:col-span-2">
            <Info
              label="Station"
              value={
                station
                  ? `${station.stationName} (${station.stationCode})`
                  : "---"
              }
            />
          </div>

          <Info
            label="Created"
            value={
              officer.createdAt
                ? new Date(
                    officer.createdAt
                  ).toLocaleString()
                : "---"
            }
          />

          <Info
            label="Last Updated"
            value={
              officer.updatedAt
                ? new Date(
                    officer.updatedAt
                  ).toLocaleString()
                : "---"
            }
          />

        </div>

        <div className="border-t border-slate-200 p-4 dark:border-slate-800">
          <button
            onClick={onClose}
            className="w-full rounded-xl bg-slate-100 py-3 text-sm text-white cursor-pointer font-bold dark:bg-slate-800"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

const Info = ({
  label,
  value,
  capitalize,
}) => (
  <div>
    <p className="text-xs font-bold uppercase text-white">
      {label}
    </p>

    <p
      className={`mt-1 break-words text-sm font-semibold text-slate-500 ${
        capitalize ? "capitalize" : ""
      }`}
    >
      {value || "---"}
    </p>
  </div>
);

export default OfficerDetailsModal;