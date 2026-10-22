import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Search,
  Filter,
  Eye,
  Pencil,
  Trash2,
  RefreshCw,
  Building2,
} from "lucide-react";

import StationDetailsModal from "./StationDetailsModal";
import EditStationModal from "./EditStationModal";
import DeleteStationModal from "./DeleteStationModal";
import Toast from "../auth/Toast";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:8000/api";

const AdminStations = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [district, setDistrict] = useState("all");

  const [selectedStation, setSelectedStation] =
    useState(null);

  const [modal, setModal] = useState(null);

  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });

  const fetchStations = async () => {
    try {
      setLoading(true);

      const token =
        localStorage.getItem("adminToken");

      const response = await axios.get(
        `${API_URL}/stations/all_stations`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStations(response.data?.data || []);
    } catch (error) {
      console.error(
        "Fetch Stations Error:",
        error.response?.data || error
      );

      setToast({
        message:
          error.response?.data?.message ||
          "Failed to load stations",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStations();
  }, []);

  const districts = useMemo(() => {
    return [
      ...new Set(
        stations
          .map((station) =>
            station.address?.district
          )
          .filter(Boolean)
      ),
    ].sort();
  }, [stations]);

  const filteredStations = useMemo(() => {
    const value = search
      .trim()
      .toLowerCase();

    return stations.filter((station) => {
      const matchesSearch =
        !value ||
        station.stationName
          ?.toLowerCase()
          .includes(value) ||
        station.stationCode
          ?.toLowerCase()
          .includes(value) ||
        station.address?.city
          ?.toLowerCase()
          .includes(value);

      const matchesDistrict =
        district === "all" ||
        station.address?.district === district;

      return (
        matchesSearch &&
        matchesDistrict
      );
    });
  }, [stations, search, district]);

  const handleSuccess = (message) => {
    setModal(null);
    setSelectedStation(null);

    setToast({
      message,
      type: "success",
    });

    fetchStations();
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() =>
          setToast({
            message: "",
            type: "success",
          })
        }
      />

      {/* Header */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Stations
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage all railway stations.
          </p>
        </div>

        <button
          onClick={fetchStations}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-800"
        >
          <RefreshCw size={17} />
          Refresh
        </button>

      </div>

      {/* Filters */}

      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">

        <div className="grid gap-3 md:grid-cols-[1fr_220px]">

          <div className="relative">

            <Search
              size={19}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search station name, code or city..."
              className="w-full rounded-xl border text-slate-300 border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800"
            />

          </div>

          <div className="relative">

            <Filter
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <select
              value={district}
              onChange={(e) =>
                setDistrict(e.target.value)
              }
              className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none dark:border-slate-700 text-slate-300 dark:bg-slate-800"
            >
              <option value="all">
                All Districts
              </option>

              {districts.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}
            </select>

          </div>

        </div>
      </div>

      {/* Content */}

      {loading ? (
        <Loader />
      ) : filteredStations.length === 0 ? (
        <EmptyState
          icon={Building2}
          message="No stations found"
        />
      ) : (
        <>
          {/* Desktop */}

          <div className="hidden overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 lg:block dark:bg-slate-900 dark:ring-slate-800">

            <div className="overflow-x-auto">

              <table className="w-full text-left">

                <thead className="bg-slate-50 dark:bg-slate-800/70">
                  <tr>
                    <th className="px-5 py-4 text-xs font-bold uppercase text-slate-500">
                      Station
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase text-slate-500">
                      Code
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase text-slate-500">
                      District
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase text-slate-500">
                      Category
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-bold uppercase text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">

                  {filteredStations.map((station) => (
                    <tr
                      key={station._id || station.id}
                      className="transition hover:bg-slate-50 dark:hover:bg-slate-800/40"
                    >

                      <td className="px-5 py-4">
                        <p className="font-bold text-slate-900 dark:text-white">
                          {station.stationName}
                        </p>

                        <p className="text-xs text-slate-500">
                          {station.address?.city}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                          {station.stationCode}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-300">
                        {station.address?.district ||
                          "---"}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-300">
                        {station.stationCategory ||
                          "---"}
                      </td>

                      <td className="px-5 py-4">

                        <div className="flex justify-end gap-2">

                          <ActionButton
                            icon={Eye}
                            title="View"
                            className="text-indigo-600 hover:bg-indigo-50"
                            onClick={() => {
                              setSelectedStation(station);
                              setModal("view");
                            }}
                          />

                          <ActionButton
                            icon={Pencil}
                            title="Edit"
                            className="text-amber-600 hover:bg-amber-50"
                            onClick={() => {
                              setSelectedStation(station);
                              setModal("edit");
                            }}
                          />

                          <ActionButton
                            icon={Trash2}
                            title="Delete"
                            className="text-red-600 hover:bg-red-50"
                            onClick={() => {
                              setSelectedStation(station);
                              setModal("delete");
                            }}
                          />

                        </div>

                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          </div>

          {/* Mobile */}

          <div className="grid gap-4 lg:hidden">

            {filteredStations.map((station) => (
              <div
                key={station._id || station.id}
                className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"
              >

                <div className="flex items-start justify-between gap-3">

                  <div>
                    <h3 className="font-bold">
                      {station.stationName}
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      {station.stationCode}
                    </p>
                  </div>

                  <span className="rounded-lg bg-indigo-50 px-2 py-1 text-xs font-bold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                    {station.stationCategory}
                  </span>

                </div>

                <p className="mt-4 text-sm text-slate-500">
                  {station.address?.district},{" "}
                  {station.address?.state}
                </p>

                <div className="mt-4 flex gap-2">

                  <ActionButton
                    icon={Eye}
                    title="View"
                    className="flex-1 bg-indigo-50 text-indigo-600"
                    onClick={() => {
                      setSelectedStation(station);
                      setModal("view");
                    }}
                  />

                  <ActionButton
                    icon={Pencil}
                    title="Edit"
                    className="flex-1 bg-amber-50 text-amber-600"
                    onClick={() => {
                      setSelectedStation(station);
                      setModal("edit");
                    }}
                  />

                  <ActionButton
                    icon={Trash2}
                    title="Delete"
                    className="flex-1 bg-red-50 text-red-600"
                    onClick={() => {
                      setSelectedStation(station);
                      setModal("delete");
                    }}
                  />

                </div>

              </div>
            ))}

          </div>
        </>
      )}

      {modal === "view" && (
        <StationDetailsModal
          station={selectedStation}
          onClose={() => setModal(null)}
        />
      )}

      {modal === "edit" && (
        <EditStationModal
          station={selectedStation}
          onClose={() => setModal(null)}
          onUpdated={() =>
            handleSuccess(
              "Station updated successfully"
            )
          }
        />
      )}

      {modal === "delete" && (
        <DeleteStationModal
          station={selectedStation}
          onClose={() => setModal(null)}
          onDeleted={() =>
            handleSuccess(
              "Station deleted successfully"
            )
          }
        />
      )}

    </div>
  );
};

const ActionButton = ({
  icon: Icon,
  title,
  onClick,
  className,
}) => (
  <button
    onClick={onClick}
    title={title}
    className={`inline-flex items-center justify-center rounded-lg p-2 transition ${className}`}
  >
    <Icon size={18} />
  </button>
);

const Loader = () => (
  <div className="flex min-h-[400px] items-center justify-center">
    <div className="h-9 w-9 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
  </div>
);

const EmptyState = ({
  icon: Icon,
  message,
}) => (
  <div className="flex min-h-[350px] flex-col items-center justify-center rounded-2xl bg-white ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
    <Icon size={40} className="text-slate-400" />
    <p className="mt-3 text-sm font-semibold text-slate-500">
      {message}
    </p>
  </div>
);

export default AdminStations;