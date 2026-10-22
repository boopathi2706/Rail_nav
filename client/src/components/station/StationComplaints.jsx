import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Search,
  Eye,
  MapPin,
  RefreshCw,
  MessageSquareWarning,
} from "lucide-react";

import ComplaintDetailsModal from "../officer/ComplaintDetailsModal";
import MoveNextStationModal from "./MoveNextStationModal";
import Toast from "../auth/Toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const StationComplaints = ({ stationData }) => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const [showDetails, setShowDetails] = useState(false);
  const [showMoveModal, setShowMoveModal] = useState(false);

  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const stationId = stationData?.id || stationData?._id;

  const getAuthConfig = () => {
    const token = localStorage.getItem("stationToken");

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const fetchComplaints = async () => {
    if (!stationId) return;

    try {
      setLoading(true);

      /*
       * Use the route connected to:
       * getComplaintsByStationId
       *
       * Example:
       * GET /api/complaints/get_all/:stationId
       */

      const response = await axios.get(
        `${API_URL}/complaints/get_all/${stationId}`,
        getAuthConfig(),
      );

      setComplaints(response.data?.data || []);
    } catch (error) {
      console.error(
        "Fetch Station Complaints Error:",
        error.response?.data || error,
      );

      showToast(
        error.response?.data?.message || "Failed to load complaints",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [stationId]);

  const filteredComplaints = useMemo(() => {
    return complaints.filter((complaint) => {
      const query = search.toLowerCase();

      const matchesSearch =
        complaint.userName?.toLowerCase().includes(query) ||
        complaint.pnrNumber?.toLowerCase().includes(query) ||
        complaint.trainNumber?.toLowerCase().includes(query) ||
        complaint.complaintCategory?.toLowerCase().includes(query);

      const matchesStatus = status === "all" || complaint.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [complaints, search, status]);

  const getStatusClass = (value) => {
    switch (value) {
      case "solved":
        return "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400";

      case "ongoing":
        return "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400";

      default:
        return "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400";
    }
  };

  return (
    <div className="space-y-6">
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "success" })}
      />

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">Station Complaints</h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            View and manage complaints assigned to this station.
          </p>
        </div>

        <button
          onClick={fetchComplaints}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold dark:border-slate-700 dark:bg-slate-900"
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="grid gap-3 md:grid-cols-[1fr_180px]">
        <div className="relative">
          <Search
            size={19}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search complaint..."
            className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-900"
          />
        </div>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none dark:border-slate-700 dark:bg-slate-900"
        >
          <option value="all">All Status</option>

          <option value="pending">Pending</option>

          <option value="ongoing">Ongoing</option>

          <option value="solved">Solved</option>
        </select>
      </div>

      {/* Desktop */}
      <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px]">
            <thead className="bg-slate-50 dark:bg-slate-800/60">
              <tr>
                <th className="px-5 py-4 text-left text-xs font-bold uppercase text-slate-500">
                  Passenger
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold uppercase text-slate-500">
                  PNR / Train
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold uppercase text-slate-500">
                  Category
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold uppercase text-slate-500">
                  Date
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold uppercase text-slate-500">
                  Status
                </th>

                <th className="px-5 py-4 text-right text-xs font-bold uppercase text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredComplaints.map((complaint) => (
                <tr
                  key={complaint._id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40"
                >
                  <td className="px-5 py-4">
                    <p className="font-semibold">
                      {complaint.userName || "---"}
                    </p>

                    <p className="text-xs text-slate-500">
                      {complaint.phoneNumber || "---"}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold">
                      {complaint.pnrNumber || "---"}
                    </p>

                    <p className="text-xs text-slate-500">
                      Train {complaint.trainNumber || "---"}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <span className="capitalize">
                      {complaint.complaintCategory || "---"}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-sm">
                    {complaint.incidentDateTime
                      ? new Date(
                          complaint.incidentDateTime,
                        ).toLocaleDateString()
                      : "---"}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${getStatusClass(
                        complaint.status,
                      )}`}
                    >
                      {complaint.status}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedComplaint(complaint);
                          setShowDetails(true);
                        }}
                        className="inline-flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:hover:bg-indigo-500/20"
                      >
                        <Eye size={18} />
                        <span>View</span>
                      </button>

                      {complaint.status !== "solved" && (
                        <button
                          onClick={() => {
                            setSelectedComplaint(complaint);
                            setShowMoveModal(true);
                          }}
                          className="inline-flex items-center gap-2 rounded-lg bg-orange-50 px-3 py-2 text-sm font-semibold text-orange-600 transition hover:bg-orange-100 dark:bg-orange-500/10 dark:text-orange-400 dark:hover:bg-orange-500/20"
                          title="Move to next station"
                        >
                          <MapPin size={18} />
                          <span>Move Next Station</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!loading && filteredComplaints.length === 0 && <EmptyComplaints />}

        {loading && <LoadingState />}
      </div>

      {/* Mobile */}
      <div className="space-y-4 md:hidden">
        {loading ? (
          <LoadingState />
        ) : filteredComplaints.length === 0 ? (
          <EmptyComplaints />
        ) : (
          filteredComplaints.map((complaint) => (
            <div
              key={complaint._id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold">{complaint.userName}</p>

                  <p className="mt-1 text-xs text-slate-500">
                    PNR: {complaint.pnrNumber}
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${getStatusClass(
                    complaint.status,
                  )}`}
                >
                  {complaint.status}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-400">Train</p>

                  <p className="mt-1 text-sm font-semibold">
                    {complaint.trainNumber}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">Category</p>

                  <p className="mt-1 text-sm font-semibold capitalize">
                    {complaint.complaintCategory}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex gap-2 border-t border-slate-200 pt-4 dark:border-slate-800">
                <button
                  onClick={() => {
                    setSelectedComplaint(complaint);
                    setShowDetails(true);
                  }}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-50 py-2.5 text-sm font-semibold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
                >
                  <Eye size={17} />
                  View
                </button>

                {complaint.status !== "solved" && (
                  <button
                    onClick={() => {
                      setSelectedComplaint(complaint);
                      setShowMoveModal(true);
                    }}
                    className="rounded-xl bg-orange-50 px-4 text-orange-600 dark:bg-orange-500/10"
                  >
                    <MapPin size={18} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {showDetails && selectedComplaint && (
        <ComplaintDetailsModal
          complaint={selectedComplaint}
          onClose={() => {
            setShowDetails(false);
            setSelectedComplaint(null);
          }}
        />
      )}

      {showMoveModal && selectedComplaint && (
        <MoveNextStationModal
          complaint={selectedComplaint}
          onClose={() => {
            setShowMoveModal(false);
            setSelectedComplaint(null);
          }}
          onMoved={() => {
            setShowMoveModal(false);
            setSelectedComplaint(null);

            showToast(
              "Complaint moved to next station successfully",
              "success",
            );

            fetchComplaints();
          }}
        />
      )}
    </div>
  );
};

const EmptyComplaints = () => (
  <div className="p-12 text-center">
    <MessageSquareWarning className="mx-auto text-slate-400" size={40} />

    <h3 className="mt-4 font-bold">No complaints found</h3>

    <p className="mt-1 text-sm text-slate-500">
      No complaints match the selected filters.
    </p>
  </div>
);

const LoadingState = () => (
  <div className="p-12 text-center">
    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />

    <p className="mt-3 text-sm text-slate-500">Loading complaints...</p>
  </div>
);

export default StationComplaints;
