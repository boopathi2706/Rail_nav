import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ClipboardList,
  CheckCircle2,
  Clock3,
  AlertCircle,
  RefreshCw,
  CalendarDays,
  TrainFront,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";

import Toast from "../auth/Toast";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const OfficerHome = () => {
  const [dashboard, setDashboard] = useState(null);
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const closeToast = () => {
    setToast({
      message: "",
      type: "success",
    });
  };

  const getToken = () => {
    return (
      localStorage.getItem("officerToken") ||
      localStorage.getItem("token")
    );
  };

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const token = getToken();

      if (!token) {
        showToast("Officer login session expired", "error");
        return;
      }

      const response = await axios.get(
        `${API_URL}/officers/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;

      if (data.success) {
        setDashboard(data.dashboard);
        setRecentComplaints(data.recentComplaints || []);
      } else {
        showToast(
          data.message || "Failed to load dashboard",
          "error"
        );
      }
    } catch (error) {
      console.error("Dashboard Error:", error);

      showToast(
        error.response?.data?.message ||
          "Unable to load officer dashboard",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "solved":
        return "bg-green-100 text-green-700";

      case "ongoing":
        return "bg-blue-100 text-blue-700";

      case "pending":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-32 animate-pulse rounded-3xl bg-slate-200" />

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-32 animate-pulse rounded-2xl bg-slate-200"
            />
          ))}
        </div>

        <div className="h-80 animate-pulse rounded-3xl bg-slate-200" />
      </div>
    );
  }

  return (
    <>
      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />
      )}

      <div className="space-y-7">
        {/* Hero */}
        <section className="rounded-3xl bg-slate-950 p-6 text-white shadow-xl sm:p-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-medium text-slate-400">
                Officer Dashboard
              </p>

              <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
                Complaint Operations
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
                Monitor assigned complaints, track ongoing cases,
                and manage complaint resolution requests.
              </p>
            </div>

            <button
              onClick={fetchDashboard}
              className="flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              <RefreshCw size={17} />
              Refresh
            </button>
          </div>
        </section>

        {/* Stats */}
        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard
            title="Total Complaints"
            value={dashboard?.totalComplaintCount || 0}
            icon={ClipboardList}
            description="Assigned complaints"
          />

          <StatCard
            title="Solved Complaints"
            value={dashboard?.totalSolvedComplaintCount || 0}
            icon={CheckCircle2}
            description="Accepted as solved"
          />

          <StatCard
            title="Ongoing Complaints"
            value={dashboard?.totalInProgressComplaintCount || 0}
            icon={Clock3}
            description="Currently in progress"
          />
        </section>

        {/* Recent */}
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold">
                Recent Complaints
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Latest complaints assigned to you
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <CalendarDays size={15} />
              Latest 5
            </div>
          </div>

          {recentComplaints.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                <AlertCircle className="text-slate-400" />
              </div>

              <h3 className="mt-4 font-semibold">
                No complaints found
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                There are no recent complaints assigned to you.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentComplaints.map((complaint) => (
                <div
                  key={complaint._id}
                  className="flex flex-col gap-4 p-5 transition hover:bg-slate-50 md:flex-row md:items-center md:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-slate-900">
                        {complaint.pnrNumber || "No PNR"}
                      </span>

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${getStatusClass(
                          complaint.status
                        )}`}
                      >
                        {complaint.status || "Unknown"}
                      </span>
                    </div>

                    <p className="mt-1 text-sm font-medium text-slate-700">
                      {complaint.userName || "Passenger"}
                    </p>

                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <TrainFront size={13} />
                        Train {complaint.trainNumber || "-"}
                      </span>

                      <span className="flex items-center gap-1">
                        <MapPin size={13} />
                        {complaint.nextStationName || "-"}
                      </span>

                      <span>
                        {formatDate(
                          complaint.incidentDateTime
                        )}
                      </span>
                    </div>
                  </div>

                  <ArrowRight
                    size={18}
                    className="hidden text-slate-400 md:block"
                  />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
};

const StatCard = ({
  title,
  value,
  icon: Icon,
  description,
}) => {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {value}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
          <Icon size={21} />
        </div>
      </div>

      <p className="mt-4 text-xs text-slate-500">
        {description}
      </p>
    </motion.div>
  );
};

export default OfficerHome;