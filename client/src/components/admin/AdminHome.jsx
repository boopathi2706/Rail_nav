import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  MessageSquareWarning,
  CheckCircle,
  Clock3,
  Activity,
  Users,
  UserCog,
  Building2,
  TrendingUp,
  CalendarDays,
} from "lucide-react";

import Toast from "../auth/Toast";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:8000/api";

const AdminHome = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("adminToken");

      const response = await axios.get(
        `${API_URL}/admin/admin_dashboard`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData(response.data?.dashboard);
    } catch (error) {
      console.error(
        "Admin Dashboard Error:",
        error.response?.data || error
      );

      setToast({
        message:
          error.response?.data?.message ||
          "Failed to load dashboard",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
      </div>
    );
  }

  const complaints = data?.complaints || {};
  const periods = data?.complaintPeriod || {};

  const complaintCards = [
    {
      title: "Total Complaints",
      value: complaints.total || 0,
      icon: MessageSquareWarning,
      className: "bg-indigo-600",
    },
    {
      title: "Solved",
      value: complaints.solved || 0,
      icon: CheckCircle,
      className: "bg-emerald-600",
    },
    {
      title: "Pending",
      value: complaints.pending || 0,
      icon: Clock3,
      className: "bg-amber-500",
    },
    {
      title: "Ongoing",
      value: complaints.inProgress || 0,
      icon: Activity,
      className: "bg-blue-600",
    },
  ];

  const resourceCards = [
    {
      title: "Total Officers",
      value: data?.totalOfficers || 0,
      icon: UserCog,
    },
    {
      title: "Total Stations",
      value: data?.totalStations || 0,
      icon: Building2,
    },
    {
      title: "Total Users",
      value: data?.totalUsers || 0,
      icon: Users,
    },
  ];

  const periodCards = [
    ["Last 7 Days", periods.last7Days],
    ["Last 30 Days", periods.last30Days],
    ["Last 90 Days", periods.last90Days],
    ["Last 180 Days", periods.last180Days],
    ["Last 365 Days", periods.last365Days],
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-7">

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

      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
          Admin Dashboard
        </h1>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Monitor railway complaints, stations, officers and users.
        </p>
      </div>

      {/* Complaint Cards */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {complaintCards.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="overflow-hidden rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"
            >

              <div className="flex items-start justify-between">

                <div>
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                    {item.title}
                  </p>

                  <p className="mt-3 text-3xl font-black text-slate-900 dark:text-white">
                    {item.value}
                  </p>
                </div>

                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl text-white ${item.className}`}
                >
                  <Icon size={21} />
                </div>

              </div>

            </div>
          );
        })}

      </div>

      {/* Period */}

      <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800 sm:p-6">

        <div className="mb-6 flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
            <TrendingUp size={20} />
          </div>

          <div>
            <h2 className="font-bold text-slate-900 dark:text-white">
              Complaint Activity
            </h2>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Complaints created during selected periods
            </p>
          </div>

        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

          {periodCards.map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-800/60"
            >
              <div className="mb-3 flex items-center gap-2">
                <CalendarDays
                  size={17}
                  className="text-indigo-600"
                />

                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {label}
                </p>
              </div>

              <p className="text-2xl font-black text-slate-900 dark:text-white">
                {value || 0}
              </p>
            </div>
          ))}

        </div>

      </section>

      {/* Resources */}

      <section>

        <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
          System Overview
        </h2>

        <div className="grid gap-4 sm:grid-cols-3">

          {resourceCards.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"
              >

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                  <Icon size={22} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                    {item.title}
                  </p>

                  <p className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
                    {item.value}
                  </p>
                </div>

              </div>
            );
          })}

        </div>

      </section>

    </div>
  );
};

export default AdminHome;