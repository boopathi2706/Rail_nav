import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Users,
  Search,
  Eye,
  Pencil,
  Trash2,
  UserPlus,
  RefreshCw,
} from "lucide-react";

import OfficerDetailsModal from "./OfficerDetailsModal";
import EditOfficerModal from "./EditOfficerModal";
import DeleteOfficerModal from "./DeleteOfficerModal";
import Toast from "../auth/Toast";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const StationOfficers = ({ stationData }) => {
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [selectedOfficer, setSelectedOfficer] = useState(null);

  const [showDetails, setShowDetails] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const getAuthConfig = () => {
    const token = localStorage.getItem("stationToken");

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const stationId =
    stationData?.id ||
    stationData?._id;

  const fetchOfficers = async () => {
    if (!stationId) return;

    try {
      setLoading(true);

      /*
       * Add/use your station officer-list endpoint here.
       *
       * If your dashboard endpoint already returns officers,
       * this can be changed to:
       *
       * GET /api/stations/dashboard/:stationId
       */

      const response = await axios.get(
        `${API_URL}/stations/dashboard/${stationId}`,
        getAuthConfig()
      );

      setOfficers(response.data?.officers || []);
    } catch (error) {
      console.error(
        "Fetch Officers Error:",
        error.response?.data || error
      );

      showToast(
        error.response?.data?.message ||
          "Failed to load officers",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOfficers();
  }, [stationId]);

  const filteredOfficers = officers.filter((officer) => {
    const value = search.toLowerCase();

    return (
      officer.name?.toLowerCase().includes(value) ||
      officer.email?.toLowerCase().includes(value) ||
      officer.phoneNumber?.includes(value) ||
      officer.officerType?.toLowerCase().includes(value)
    );
  });

  return (
    <div className="space-y-6">
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() =>
          setToast({ message: "", type: "success" })
        }
      />

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">
            Station Officers
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage officers assigned to{" "}
            {stationData?.stationName || "this station"}.
          </p>
        </div>

        <button
          onClick={() => fetchOfficers()}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          size={19}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          placeholder="Search officer by name, email, phone or type..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-900"
        />
      </div>

      {/* Desktop */}
      <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-slate-50 dark:bg-slate-800/60">
              <tr>
                <th className="px-5 py-4 text-left text-xs font-bold uppercase text-slate-500">
                  Officer
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold uppercase text-slate-500">
                  Type
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold uppercase text-slate-500">
                  Phone
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold uppercase text-slate-500">
                  Email
                </th>

                <th className="px-5 py-4 text-right text-xs font-bold uppercase text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredOfficers.map((officer) => (
                <tr
                  key={officer._id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 font-bold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                        {officer.name
                          ?.charAt(0)
                          ?.toUpperCase()}
                      </div>

                      <div>
                        <p className="font-semibold">
                          {officer.name}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold capitalize text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400">
                      {officer.officerType}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-sm">
                    {officer.phoneNumber}
                  </td>

                  <td className="px-5 py-4 text-sm">
                    {officer.email}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedOfficer(officer);
                          setShowDetails(true);
                        }}
                        className="rounded-lg p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10"
                      >
                        <Eye size={18} />
                      </button>

                      <button
                        onClick={() => {
                          setSelectedOfficer(officer);
                          setShowEdit(true);
                        }}
                        className="rounded-lg p-2 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-500/10"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        onClick={() => {
                          setSelectedOfficer(officer);
                          setShowDelete(true);
                        }}
                        className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!loading && filteredOfficers.length === 0 && (
          <EmptyState />
        )}

        {loading && <LoadingState />}
      </div>

      {/* Mobile */}
      <div className="space-y-4 md:hidden">
        {loading ? (
          <LoadingState />
        ) : filteredOfficers.length === 0 ? (
          <EmptyState />
        ) : (
          filteredOfficers.map((officer) => (
            <div
              key={officer._id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 font-bold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                  {officer.name
                    ?.charAt(0)
                    ?.toUpperCase()}
                </div>

                <div className="min-w-0">
                  <p className="truncate font-bold">
                    {officer.name}
                  </p>

                  <p className="truncate text-xs text-slate-500">
                    {officer.email}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-slate-400">
                    Type
                  </p>

                  <p className="mt-1 font-semibold capitalize">
                    {officer.officerType}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Phone
                  </p>

                  <p className="mt-1 font-semibold">
                    {officer.phoneNumber}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex gap-2 border-t border-slate-200 pt-4 dark:border-slate-800">
                <button
                  onClick={() => {
                    setSelectedOfficer(officer);
                    setShowDetails(true);
                  }}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-50 py-2.5 text-sm font-semibold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
                >
                  <Eye size={17} />
                  View
                </button>

                <button
                  onClick={() => {
                    setSelectedOfficer(officer);
                    setShowEdit(true);
                  }}
                  className="rounded-xl bg-orange-50 p-2.5 text-orange-600 dark:bg-orange-500/10"
                >
                  <Pencil size={17} />
                </button>

                <button
                  onClick={() => {
                    setSelectedOfficer(officer);
                    setShowDelete(true);
                  }}
                  className="rounded-xl bg-red-50 p-2.5 text-red-600 dark:bg-red-500/10"
                >
                  <Trash2 size={17} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showDetails && selectedOfficer && (
        <OfficerDetailsModal
          officer={selectedOfficer}
          onClose={() => {
            setShowDetails(false);
            setSelectedOfficer(null);
          }}
        />
      )}

      {showEdit && selectedOfficer && (
        <EditOfficerModal
          officer={selectedOfficer}
          onClose={() => {
            setShowEdit(false);
            setSelectedOfficer(null);
          }}
          onUpdated={() => {
            setShowEdit(false);
            setSelectedOfficer(null);
            showToast(
              "Officer updated successfully",
              "success"
            );
            fetchOfficers();
          }}
        />
      )}

      {showDelete && selectedOfficer && (
        <DeleteOfficerModal
          officer={selectedOfficer}
          onClose={() => {
            setShowDelete(false);
            setSelectedOfficer(null);
          }}
          onDeleted={() => {
            setShowDelete(false);
            setSelectedOfficer(null);
            showToast(
              "Officer deleted successfully",
              "success"
            );
            fetchOfficers();
          }}
        />
      )}
    </div>
  );
};

const EmptyState = () => (
  <div className="p-12 text-center">
    <Users className="mx-auto text-slate-400" size={40} />

    <h3 className="mt-4 font-bold">
      No officers found
    </h3>

    <p className="mt-1 text-sm text-slate-500">
      No officers match your search.
    </p>
  </div>
);

const LoadingState = () => (
  <div className="p-12 text-center">
    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />

    <p className="mt-3 text-sm text-slate-500">
      Loading officers...
    </p>
  </div>
);

export default StationOfficers;