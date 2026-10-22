import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import axios from "axios";

import {
  Search,
  Eye,
  Trash2,
  RefreshCw,
  MessageSquareWarning,
  Filter,
} from "lucide-react";

import ComplaintDetailsModal from "../officer/ComplaintDetailsModal";
import DeleteComplaintModal from "./DeleteComplaintModal";

import Toast from "../auth/Toast";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:8000/api";

const AdminComplaints = () => {
  const [complaints, setComplaints] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("all");

  const [category, setCategory] =
    useState("all");

  const [selectedComplaint, setSelectedComplaint] =
    useState(null);

  const [modal, setModal] =
    useState(null);

  const [toast, setToast] =
    useState({
      message: "",
      type: "success",
    });

  const fetchComplaints = async () => {
    try {
      setLoading(true);

      const token =
        localStorage.getItem("adminToken");

      const response = await axios.get(
        `${API_URL}/complaints/admin_get_all_complaints`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setComplaints(
        response.data?.data || []
      );
    } catch (error) {
      console.error(
        "Fetch Complaints Error:",
        error.response?.data || error
      );

      setToast({
        message:
          error.response?.data?.message ||
          "Failed to load complaints",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const categories = useMemo(() => {
    return [
      ...new Set(
        complaints
          .map(
            (complaint) =>
              complaint.complaintCategory
          )
          .filter(Boolean)
      ),
    ].sort();
  }, [complaints]);

  const filteredComplaints = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return complaints.filter(
      (complaint) => {
        const matchesSearch =
          !query ||
          complaint.userName
            ?.toLowerCase()
            .includes(query) ||
          complaint.pnrNumber
            ?.toLowerCase()
            .includes(query) ||
          complaint.trainNumber
            ?.toLowerCase()
            .includes(query) ||
          complaint.complaintCategory
            ?.toLowerCase()
            .includes(query) ||
          complaint.nextStationName
            ?.toLowerCase()
            .includes(query);

        const matchesStatus =
          status === "all" ||
          complaint.status === status;

        const matchesCategory =
          category === "all" ||
          complaint.complaintCategory ===
            category;

        return (
          matchesSearch &&
          matchesStatus &&
          matchesCategory
        );
      }
    );
  }, [
    complaints,
    search,
    status,
    category,
  ]);

  const handleDeleted = (message) => {
    setModal(null);
    setSelectedComplaint(null);

    setToast({
      message,
      type: "success",
    });

    fetchComplaints();
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
          <h1 className="text-2xl font-bold text-white">
            Complaints
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Monitor all complaints across stations.
          </p>
        </div>

        <button
          onClick={fetchComplaints}
          className="inline-flex text-white items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"
        >
          <RefreshCw size={17} />
          Refresh
        </button>

      </div>

      {/* Filters */}

      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">

        <div className="grid gap-3 lg:grid-cols-[1fr_190px_210px]">

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
              placeholder="Search PNR, train, user or station..."
              className="w-full rounded-xl text-slate-300 border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm dark:border-slate-700 dark:bg-slate-800"
            />

          </div>

          <div className="relative">

            <Filter
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
              className="w-full rounded-xl text-slate-300 border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm dark:border-slate-700 dark:bg-slate-800"
            >
              <option value="all">
                All Status
              </option>

              <option value="pending">
                Pending
              </option>

              <option value="ongoing">
                Ongoing
              </option>

              <option value="solved">
                Solved
              </option>
            </select>

          </div>

          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
            className="rounded-xl text-slate-300 border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-800"
          >
            <option value="all">
              All Categories
            </option>

            {categories.map((item) => (
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

      {/* Table */}

      {loading ? (
        <Loader />
      ) : filteredComplaints.length === 0 ? (
        <Empty />
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">

          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead className="bg-slate-50 dark:bg-slate-800">

                <tr>

                  <th className="px-5 py-4 text-xs font-bold uppercase text-slate-500">
                    Complaint
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase text-slate-500">
                    Passenger
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase text-slate-500">
                    Category
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase text-slate-500">
                    Status
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-bold uppercase text-slate-500">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">

                {filteredComplaints.map(
                  (complaint) => (

                    <tr
                      key={complaint._id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40"
                    >

                      <td className="px-5 py-4">

                        <p className="font-bold text-white">
                          PNR:{" "}
                          {complaint.pnrNumber ||
                            "---"}
                        </p>

                        <p className="text-xs text-slate-500">
                          Train:{" "}
                          {complaint.trainNumber ||
                            "---"}
                        </p>

                      </td>

                      <td className="px-5 py-4">

                        <p className="text-sm font-semibold text-white">
                          {complaint.userName ||
                            "---"}
                        </p>

                        <p className="text-xs text-slate-500">
                          {complaint.nextStationName ||
                            "---"}
                        </p>

                      </td>

                      <td className="px-5 py-4">

                        <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-bold capitalize text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                          {complaint.complaintCategory ||
                            "---"}
                        </span>

                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge
                          status={
                            complaint.status
                          }
                        />
                      </td>

                      <td className="px-5 py-4">

                        <div className="flex justify-end gap-2">

                          <button
                            onClick={() => {
                              setSelectedComplaint(
                                complaint
                              );
                              setModal("view");
                            }}
                            className="rounded-lg p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10"
                            title="View"
                          >
                            <Eye size={18} />
                          </button>

                          <button
                            onClick={() => {
                              setSelectedComplaint(
                                complaint
                              );
                              setModal("delete");
                            }}
                            className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        </div>
      )}

      {modal === "view" && (
        <ComplaintDetailsModal
          complaint={selectedComplaint}
          onClose={() => setModal(null)}
        />
      )}

      {modal === "delete" && (
        <DeleteComplaintModal
          complaint={selectedComplaint}
          onClose={() => setModal(null)}
          onDeleted={handleDeleted}
        />
      )}

    </div>
  );
};

const StatusBadge = ({ status }) => {
  const styles = {
    pending:
      "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",

    ongoing:
      "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",

    solved:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  };

  return (
    <span
      className={`rounded-lg px-2.5 py-1 text-xs font-bold capitalize ${
        styles[status] ||
        "bg-slate-100 text-slate-600"
      }`}
    >
      {status || "---"}
    </span>
  );
};

const Loader = () => (
  <div className="flex min-h-[400px] items-center justify-center">
    <div className="h-9 w-9 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
  </div>
);

const Empty = () => (
  <div className="flex min-h-[350px] flex-col items-center justify-center rounded-2xl bg-white dark:bg-slate-900">
    <MessageSquareWarning
      size={42}
      className="text-slate-400"
    />

    <p className="mt-3 text-sm font-semibold text-slate-500">
      No complaints found
    </p>
  </div>
);

export default AdminComplaints;