import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import axios from "axios";

import {
  Search,
  Filter,
  Eye,
  Pencil,
  Trash2,
  UserCog,
  RefreshCw,
} from "lucide-react";

import OfficerDetailsModal from "./OfficerDetailsModal";
import EditOfficerModal from "./EditOfficerModal";
import DeleteOfficerModal from "./DeleteOfficerModal";

import Toast from "../auth/Toast";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:8000/api";

const AdminOfficers = () => {
  const [officers, setOfficers] = useState([]);
  const [stations, setStations] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] =
    useState("all");
  const [stationFilter, setStationFilter] =
    useState("all");

  const [selectedOfficer, setSelectedOfficer] =
    useState(null);

  const [modal, setModal] = useState(null);

  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });

  const getStation = (officer) => {
    if (
      officer.stationId &&
      typeof officer.stationId === "object"
    ) {
      return officer.stationId;
    }

    return stations.find(
      (station) =>
        String(station._id) ===
        String(officer.stationId)
    );
  };

  const fetchData = async () => {
    try {
      setLoading(true);

      const token =
        localStorage.getItem("adminToken");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const [officerResponse, stationResponse] =
        await Promise.all([
          axios.get(
            `${API_URL}/officers/all`,
            config
          ),

          axios.get(
            `${API_URL}/stations/all_stations`,
            config
          ),
        ]);

      setOfficers(
        officerResponse.data?.data || []
      );

      setStations(
        stationResponse.data?.data || []
      );
    } catch (error) {
      console.error(
        "Fetch Officers Error:",
        error.response?.data || error
      );

      setToast({
        message:
          error.response?.data?.message ||
          "Failed to load officers",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const officerTypes = useMemo(() => {
    return [
      ...new Set(
        officers
          .map((officer) =>
            officer.officerType
          )
          .filter(Boolean)
      ),
    ].sort();
  }, [officers]);

  const filteredOfficers = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return officers.filter((officer) => {
      const station = getStation(officer);

      const matchesSearch =
        !query ||
        officer.name
          ?.toLowerCase()
          .includes(query) ||
        officer.email
          ?.toLowerCase()
          .includes(query) ||
        officer.phoneNumber
          ?.toLowerCase()
          .includes(query) ||
        station?.stationName
          ?.toLowerCase()
          .includes(query) ||
        station?.stationCode
          ?.toLowerCase()
          .includes(query);

      const matchesType =
        typeFilter === "all" ||
        officer.officerType ===
          typeFilter;

      const matchesStation =
        stationFilter === "all" ||
        String(
          station?._id
        ) === String(stationFilter);

      return (
        matchesSearch &&
        matchesType &&
        matchesStation
      );
    });
  }, [
    officers,
    stations,
    search,
    typeFilter,
    stationFilter,
  ]);

  const handleSuccess = (message) => {
    setModal(null);
    setSelectedOfficer(null);

    setToast({
      message,
      type: "success",
    });

    fetchData();
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

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div>
          <h1 className="text-2xl font-bold text-white">
            Officers
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage officers across all stations.
          </p>
        </div>

        <button
          onClick={fetchData}
          className="inline-flex text-slate-300 items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"
        >
          <RefreshCw size={17} />
          Refresh
        </button>

      </div>

      {/* Filters */}

      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">

        <div className="grid gap-3 lg:grid-cols-[1fr_200px_260px]">

          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search officer, email, station..."
              className="w-full text-slate-300 rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm dark:border-slate-700 dark:bg-slate-800"
            />
          </div>

          <div className="relative">
            <Filter
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <select
              value={typeFilter}
              onChange={(e) =>
                setTypeFilter(e.target.value)
              }
              className="w-full text-slate-300 rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm dark:border-slate-700 dark:bg-slate-800"
            >
              <option value="all">
                All Officer Types
              </option>

              {officerTypes.map((type) => (
                <option
                  key={type}
                  value={type}
                >
                  {type}
                </option>
              ))}
            </select>
          </div>

          <select
            value={stationFilter}
            onChange={(e) =>
              setStationFilter(e.target.value)
            }
            className="rounded-xl border text-slate-300 border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-800"
          >
            <option value="all">
              All Stations
            </option>

            {stations.map((station) => (
              <option
                key={station._id}
                value={station._id}
              >
                {station.stationName} (
                {station.stationCode})
              </option>
            ))}
          </select>

        </div>
      </div>

      {loading ? (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
        </div>
      ) : filteredOfficers.length === 0 ? (
        <div className="flex min-h-[350px] flex-col items-center justify-center rounded-2xl bg-white dark:bg-slate-900">
          <UserCog
            size={42}
            className="text-slate-400"
          />
          <p className="mt-3 text-sm font-semibold text-slate-500">
            No officers found
          </p>
        </div>
      ) : (
        <>
          {/* Desktop */}

          <div className="hidden overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 lg:block dark:bg-slate-900 dark:ring-slate-800">

            <div className="overflow-x-auto">

              <table className="w-full text-left">

                <thead className="bg-slate-50 dark:bg-slate-800">
                  <tr>
                    <th className="px-5 py-4 text-xs font-bold uppercase text-slate-500">
                      Officer
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase text-slate-500">
                      Type
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase text-slate-500">
                      Station
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-bold uppercase text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">

                  {filteredOfficers.map(
                    (officer) => {
                      const station =
                        getStation(officer);

                      return (
                        <tr
                          key={
                            officer._id ||
                            officer.id
                          }
                          className="hover:bg-slate-50 dark:hover:bg-slate-800/40"
                        >

                          <td className="px-5 py-4">

                            <p className="font-bold text-white">
                              {officer.name}
                            </p>

                            <p className="text-xs text-slate-500">
                              {officer.email}
                            </p>

                          </td>

                          <td className="px-5 py-4">

                            <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-bold capitalize text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                              {officer.officerType}
                            </span>

                          </td>

                          <td className="px-5 py-4">

                            <p className="text-sm font-semibold text-white">
                              {station?.stationName ||
                                "---"}
                            </p>

                            <p className="text-xs text-slate-500">
                              {station?.stationCode ||
                                "---"}
                            </p>

                          </td>

                          <td className="px-5 py-4">

                            <div className="flex justify-end gap-2">

                              <Action
                                icon={Eye}
                                title="View"
                                color="text-indigo-600"
                                onClick={() => {
                                  setSelectedOfficer(
                                    officer
                                  );
                                  setModal("view");
                                }}
                              />

                              <Action
                                icon={Pencil}
                                title="Edit"
                                color="text-amber-600"
                                onClick={() => {
                                  setSelectedOfficer(
                                    officer
                                  );
                                  setModal("edit");
                                }}
                              />

                              <Action
                                icon={Trash2}
                                title="Delete"
                                color="text-red-600"
                                onClick={() => {
                                  setSelectedOfficer(
                                    officer
                                  );
                                  setModal("delete");
                                }}
                              />

                            </div>

                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            </div>
          </div>

          {/* Mobile */}

          <div className="grid gap-4 lg:hidden">

            {filteredOfficers.map(
              (officer) => {
                const station =
                  getStation(officer);

                return (
                  <div
                    key={
                      officer._id ||
                      officer.id
                    }
                    className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"
                  >

                    <div className="flex justify-between">

                      <div>
                        <h3 className="font-bold">
                          {officer.name}
                        </h3>

                        <p className="mt-1 text-xs text-slate-500">
                          {officer.email}
                        </p>
                      </div>

                      <span className="h-fit rounded-lg bg-indigo-50 px-2 py-1 text-xs font-bold capitalize text-indigo-600">
                        {officer.officerType}
                      </span>

                    </div>

                    <p className="mt-4 text-sm text-slate-500">
                      {station?.stationName ||
                        "No station"}
                    </p>

                    <div className="mt-4 flex gap-2">

                      <Action
                        icon={Eye}
                        title="View"
                        color="text-indigo-600"
                        onClick={() => {
                          setSelectedOfficer(
                            officer
                          );
                          setModal("view");
                        }}
                      />

                      <Action
                        icon={Pencil}
                        title="Edit"
                        color="text-amber-600"
                        onClick={() => {
                          setSelectedOfficer(
                            officer
                          );
                          setModal("edit");
                        }}
                      />

                      <Action
                        icon={Trash2}
                        title="Delete"
                        color="text-red-600"
                        onClick={() => {
                          setSelectedOfficer(
                            officer
                          );
                          setModal("delete");
                        }}
                      />

                    </div>

                  </div>
                );
              }
            )}

          </div>
        </>
      )}

      {modal === "view" && (
        <OfficerDetailsModal
          officer={selectedOfficer}
          station={getStation(selectedOfficer || {})}
          onClose={() => setModal(null)}
        />
      )}

      {modal === "edit" && (
        <EditOfficerModal
          officer={selectedOfficer}
          stations={stations}
          onClose={() => setModal(null)}
          onUpdated={(message) =>
            handleSuccess(message)
          }
        />
      )}

      {modal === "delete" && (
        <DeleteOfficerModal
          officer={selectedOfficer}
          onClose={() => setModal(null)}
          onDeleted={(message) =>
            handleSuccess(message)
          }
        />
      )}

    </div>
  );
};

const Action = ({
  icon: Icon,
  title,
  color,
  onClick,
}) => (
  <button
    onClick={onClick}
    title={title}
    className={`rounded-lg p-2 transition hover:bg-slate-100 dark:hover:bg-slate-800 ${color}`}
  >
    <Icon size={18} />
  </button>
);

export default AdminOfficers;