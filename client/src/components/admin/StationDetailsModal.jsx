import React from "react";
import {
  X,
  Building2,
  MapPin,
  Navigation,
  Mountain,
} from "lucide-react";

const StationDetailsModal = ({
  station,
  onClose,
}) => {
  if (!station) return null;

  const address = station.address || {};
  const coordinates = station.coordinates || {};

  return (
    <Modal onClose={onClose}>

      <div className="flex items-center gap-3 border-b border-slate-200 p-6 dark:border-slate-800">

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
          <Building2 size={21} />
        </div>

        <div>
          <h2 className="font-bold">
            Station Details
          </h2>

          <p className="text-xs text-slate-500">
            {station.stationName}
          </p>
        </div>

      </div>

      <div className="space-y-5 p-6">

        <Info
          label="Station Name"
          value={station.stationName}
        />

        <Info
          label="Station Code"
          value={station.stationCode}
        />

        <Info
          label="Station Category"
          value={station.stationCategory}
        />

        <div>
          <p className="mb-2 text-xs font-bold uppercase text-slate-400">
            Address
          </p>

          <p className="text-sm leading-6">
            {[
              address.street,
              address.city,
              address.district,
              address.state,
            ]
              .filter(Boolean)
              .join(", ") || "---"}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">

          <Info
            label="Latitude"
            value={
              coordinates.latitude ??
              coordinates.lat ??
              "---"
            }
          />

          <Info
            label="Longitude"
            value={
              coordinates.longitude ??
              coordinates.lng ??
              "---"
            }
          />

        </div>

        <Info
          label="Elevation"
          value={
            station.elevation ??
            "---"
          }
        />

      </div>

      <div className="border-t border-slate-200 p-4 dark:border-slate-800">
        <button
          onClick={onClose}
          className="w-full rounded-xl bg-slate-100 px-4 py-3 text-sm font-bold dark:bg-slate-800"
        >
          Close
        </button>
      </div>

    </Modal>
  );
};

const Info = ({ label, value }) => (
  <div>
    <p className="mb-1 text-xs font-bold uppercase text-slate-400">
      {label}
    </p>

    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
      {value || "---"}
    </p>
  </div>
);

const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">

    <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white shadow-2xl dark:bg-slate-900">

      <div className="relative">

        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X size={20} />
        </button>

        {children}

      </div>

    </div>

  </div>
);

export default StationDetailsModal;