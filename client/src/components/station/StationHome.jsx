import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  MessageSquareWarning,
  CheckCircle2,
  Clock3,
  AlertCircle,
  Users,
  ArrowRight,
  UserPlus,
  Eye,
} from "lucide-react";

import Toast from "../auth/Toast";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const StationHome = ({ stationData, onNavigate }) => {
  const [dashboard, setDashboard] = useState({
    totalComplaintCount: 0,
    solvedComplaintCount: 0,
    pendingComplaintCount: 0,
    inProgressComplaintCount: 0,
    totalOfficerCount: 0,
  });

  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const fetchDashboard = async () => {
    if (!stationId) return;

    try {
      setLoading(true);

      /*
       * IMPORTANT:
       * Use the exact dashboard route you created
       * for getdashboarddata.
       *
       * Example:
       * GET /api/stations/dashboard/:stationId
       */
      const response = await axios.get(
        `${API_URL}/stations/dashboard/${stationId}`,
        getAuthConfig()
      );

      const data = response.data;

      setDashboard(
        data.dashboard || {
          totalComplaintCount: 0,
          solvedComplaintCount: 0,
          pendingComplaintCount: 0,
          inProgressComplaintCount: 0,
          totalOfficerCount: 0,
        }
      );

      setOfficers(data.officers || []);
    } catch (error) {
      console.error(
        "Station Dashboard Error:",
        error.response?.data || error
      );

      showToast(
        error.response?.data?.message ||
          "Failed to load dashboard",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [stationId]);

  const stats = [
    {
      title: "Total Complaints",
      value: dashboard.totalComplaintCount,
      icon: MessageSquareWarning,
      iconClass:
        "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400",
    },
    {
      title: "Solved",
      value: dashboard.solvedComplaintCount,
      icon: CheckCircle2,
      iconClass:
        "bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400",
    },
    {
      title: "Ongoing",
      value: dashboard.inProgressComplaintCount,
      icon: Clock3,
      iconClass:
        "bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400",
    },
    {
      title: "Pending",
      value: dashboard.pendingComplaintCount,
      icon: AlertCircle,
      iconClass:
        "bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400",
    },
    {
      title: "Officers",
      value: dashboard.totalOfficerCount,
      icon: Users,
      iconClass:
        "bg-purple-100 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400",
    },
  ];

  return (
    <div className="space-y-6">
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() =>
          setToast({ message: "", type: "success" })
        }
      />

      {/* Welcome */}
      <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white shadow-xl sm:p-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <p className="mb-2 text-sm font-medium text-indigo-100">
              Welcome back
            </p>

            <h1 className="text-2xl font-bold sm:text-3xl">
              {stationData?.stationName || "Railway Station"}
            </h1>

            <p className="mt-2 max-w-xl text-sm text-indigo-100">
              Monitor complaints, manage officers and coordinate
              railway station operations from one place.
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-xl">
            <BuildingIcon />

            <p className="mt-2 text-xs text-indigo-100">
              Station Code
            </p>

            <p className="text-xl font-bold">
              {stationData?.stationCode || "---"}
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 gap-4 xl:grid-cols-5">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div
                className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${stat.iconClass}`}
              >
                <Icon size={21} />
              </div>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                {stat.title}
              </p>

              <p className="mt-1 text-2xl font-bold">
                {loading ? "..." : stat.value}
              </p>
            </div>
          );
        })}
      </section>

      {/* Quick actions */}
      <section className="grid gap-4 md:grid-cols-3">
        <button
          onClick={() => onNavigate("complaints")}
          className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
        >
          <MessageSquareWarning className="text-indigo-600 dark:text-indigo-400" />

          <h3 className="mt-4 font-bold">
            Manage Complaints
          </h3>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            View and process passenger complaints.
          </p>

          <ArrowRight className="mt-4 transition group-hover:translate-x-1" size={18} />
        </button>

        <button
          onClick={() => onNavigate("officers")}
          className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
        >
          <Users className="text-purple-600 dark:text-purple-400" />

          <h3 className="mt-4 font-bold">
            Manage Officers
          </h3>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            View and manage station officers.
          </p>

          <ArrowRight className="mt-4 transition group-hover:translate-x-1" size={18} />
        </button>

        <button
          onClick={() => onNavigate("create-officer")}
          className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
        >
          <UserPlus className="text-green-600 dark:text-green-400" />

          <h3 className="mt-4 font-bold">
            Create Officer
          </h3>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Add a new officer to this station.
          </p>

          <ArrowRight className="mt-4 transition group-hover:translate-x-1" size={18} />
        </button>
      </section>

      {/* Officers */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-200 p-5 dark:border-slate-800">
          <div>
            <h2 className="font-bold">Station Officers</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Recently created officers
            </p>
          </div>

          <button
            onClick={() => onNavigate("officers")}
            className="flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400"
          >
            View All
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="divide-y divide-slate-200 dark:divide-slate-800">
          {officers.slice(0, 5).map((officer) => (
            <div
              key={officer._id}
              className="flex items-center justify-between gap-4 p-5"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 font-bold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                  {officer.name?.charAt(0)?.toUpperCase() || "O"}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">
                    {officer.name}
                  </p>

                  <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                    {officer.email}
                  </p>
                </div>
              </div>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize dark:bg-slate-800">
                {officer.officerType}
              </span>
            </div>
          ))}

          {!loading && officers.length === 0 && (
            <div className="p-10 text-center">
              <Users className="mx-auto text-slate-400" size={35} />

              <p className="mt-3 font-semibold">
                No officers found
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

const BuildingIcon = () => {
  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
      <Users size={24} />
    </div>
  );
};

export default StationHome;