import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Filter,
  RefreshCw,
  Eye,
  Trash2,
  AlertCircle,
} from "lucide-react";

import ComplaintCard from "./ComplaintCard";
import ComplaintDetailsModal from "./ComplaintDetailsModal";
import Toast from "../auth/Toast";

import {
  getUserComplaints,
  deleteComplaint,
} from "../../services/userApi";

const UserComplaints = ({ refreshKey = 0 }) => {
  const [complaints, setComplaints] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedComplaint, setSelectedComplaint] =
    useState(null);

  const [deleteLoading, setDeleteLoading] =
    useState(false);

  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });

  const fetchComplaints = async () => {
    try {
      setLoading(true);

      const userData = JSON.parse(
        localStorage.getItem("userData") || "{}"
      );

      const userId =
        userData?._id ||
        userData?.id ||
        userData?.userId;

      if (!userId) {
        throw new Error("User information not found");
      }

      const response = await getUserComplaints();
      setComplaints(response?.data || []);
    } catch (error) {
      setToast({
        message:
          error?.response?.data?.message ||
          error?.message ||
          "Failed to load complaints",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [refreshKey]);

  const filteredComplaints = useMemo(() => {
    return complaints.filter((complaint) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        !search ||
        complaint.pnrNumber
          ?.toLowerCase()
          .includes(searchText) ||
        complaint.trainNumber
          ?.toLowerCase()
          .includes(searchText) ||
        complaint.complaintCategory
          ?.toLowerCase()
          .includes(searchText);

      const matchesStatus =
        statusFilter === "all" ||
        complaint.status?.toLowerCase() ===
          statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [complaints, search, statusFilter]);

  const handleDelete = async (complaint) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this complaint?"
    );

    if (!confirmed) return;

    try {
      setDeleteLoading(true);

      await deleteComplaint(complaint._id);

      setComplaints((prev) =>
        prev.filter(
          (item) => item._id !== complaint._id
        )
      );

      setToast({
        message: "Complaint deleted successfully",
        type: "success",
      });

      setSelectedComplaint(null);
    } catch (error) {
      setToast({
        message:
          error?.response?.data?.message ||
          "Failed to delete complaint",
        type: "error",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
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

      <div className="space-y-6">

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">
              My Complaints
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              View and track all your complaints.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchComplaints}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-bold hover:bg-gray-100 disabled:opacity-50 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            <RefreshCw
              size={17}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>

        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 md:flex-row dark:border-gray-700 dark:bg-gray-900">

          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search PNR, train number or category..."
              className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950"
            />
          </div>

          <div className="relative">
            <Filter
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="w-full appearance-none rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-8 text-sm font-semibold capitalize outline-none dark:border-gray-700 dark:bg-gray-950 md:w-48"
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

        </div>

        {/* Loading */}
        {loading && (
          <div className="flex min-h-[250px] items-center justify-center">
            <RefreshCw
              size={30}
              className="animate-spin text-blue-600"
            />
          </div>
        )}

        {/* Empty */}
        {!loading &&
          filteredComplaints.length === 0 && (
            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-900">

              <AlertCircle
                size={45}
                className="text-gray-400"
              />

              <h3 className="mt-4 text-lg font-bold text-gray-900 dark:text-white">
                No complaints found
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Try changing your search or status filter.
              </p>

            </div>
          )}

        {/* Mobile cards */}
        {!loading &&
          filteredComplaints.length > 0 && (
            <div className="grid gap-4 md:hidden">
              {filteredComplaints.map((complaint) => (
                <ComplaintCard
                  key={complaint._id}
                  complaint={complaint}
                  onView={setSelectedComplaint}
                />
              ))}
            </div>
          )}

        {/* Desktop */}
        {!loading &&
          filteredComplaints.length > 0 && (
            <div className="hidden overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm md:block dark:border-gray-700 dark:bg-gray-900">

              <div className="overflow-x-auto">

                <table className="w-full text-left text-sm">

                  <thead className="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-800">
                    <tr>
                      <th className="px-5 py-4">
                        Category
                      </th>

                      <th className="px-5 py-4">
                        PNR
                      </th>

                      <th className="px-5 py-4">
                        Train
                      </th>

                      <th className="px-5 py-4">
                        Incident
                      </th>

                      <th className="px-5 py-4">
                        Status
                      </th>

                      <th className="px-5 py-4 text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">

                    {filteredComplaints.map(
                      (complaint) => (
                        <tr
                          key={complaint._id}
                          className="transition hover:bg-gray-50 dark:hover:bg-gray-800/50"
                        >

                          <td className="px-5 py-4 font-bold capitalize">
                            {complaint.complaintCategory}
                          </td>

                          <td className="px-5 py-4">
                            {complaint.pnrNumber || "N/A"}
                          </td>

                          <td className="px-5 py-4">
                            {complaint.trainNumber || "N/A"}
                          </td>

                          <td className="px-5 py-4">
                            {complaint.incidentDateTime
                              ? new Date(
                                  complaint.incidentDateTime
                                ).toLocaleDateString(
                                  "en-IN"
                                )
                              : "N/A"}
                          </td>

                          <td className="px-5 py-4">
                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold capitalize dark:bg-gray-800">
                              {complaint.status}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex justify-end gap-2">

                              <button
                                type="button"
                                title="View"
                                onClick={() =>
                                  setSelectedComplaint(
                                    complaint
                                  )
                                }
                                className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50 dark:hover:bg-blue-900/20"
                              >
                                <Eye size={18} />
                              </button>

                              <button
                                type="button"
                                title="Delete"
                                disabled={deleteLoading}
                                onClick={() =>
                                  handleDelete(
                                    complaint
                                  )
                                }
                                className="rounded-lg p-2 text-red-600 transition hover:bg-red-50 disabled:opacity-50 dark:hover:bg-red-900/20"
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

      </div>

      {/* Details */}
      {selectedComplaint && (
        <ComplaintDetailsModal
          complaint={selectedComplaint}
          onClose={() =>
            setSelectedComplaint(null)
          }
          onDelete={handleDelete}
        />
      )}
    </>
  );
};

export default UserComplaints;