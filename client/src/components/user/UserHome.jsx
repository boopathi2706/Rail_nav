import React, { useEffect, useState } from "react";
import {
  FileText,
  CheckCircle,
  Clock,
  LoaderCircle,
  RefreshCw,
} from "lucide-react";

import { getUserDashboard } from "../../services/userApi";
import Toast from "../auth/Toast";

const UserHome = ({ refreshKey = 0 }) => {
  const [dashboard, setDashboard] = useState({
    totalComplaintCount: 0,
    solvedComplaintCount: 0,
    pendingComplaintCount: 0,
    ongoingComplaintCount: 0,
  });

  const [loading, setLoading] = useState(true);

  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const response = await getUserDashboard();

      if (response?.dashboard) {
        setDashboard(response.dashboard);
      }
    } catch (error) {
      setToast({
        message:
          error?.response?.data?.message ||
          "Failed to load dashboard",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [refreshKey]);

  const cards = [
    {
      title: "Total Complaints",
      value: dashboard.totalComplaintCount,
      icon: FileText,
      bg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Solved",
      value: dashboard.solvedComplaintCount,
      icon: CheckCircle,
      bg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Pending",
      value: dashboard.pendingComplaintCount,
      icon: Clock,
      bg: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
    {
      title: "Ongoing",
      value: dashboard.ongoingComplaintCount,
      icon: LoaderCircle,
      bg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
  ];

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

        <div className="flex items-center justify-between">

          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">
              Dashboard
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Track your railway complaints and their status.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchDashboard}
            disabled={loading}
            className="rounded-xl border border-gray-300 p-2.5 transition hover:bg-gray-100 disabled:opacity-50 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            <RefreshCw
              size={18}
              className={loading ? "animate-spin" : ""}
            />
          </button>

        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-900"
              >

                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-sm font-semibold text-gray-500">
                      {card.title}
                    </p>

                    <p className="mt-2 text-3xl font-black text-gray-900 dark:text-white">
                      {loading ? "—" : card.value}
                    </p>
                  </div>

                  <div
                    className={`rounded-2xl p-3 ${card.bg}`}
                  >
                    <Icon
                      size={24}
                      className={card.iconColor}
                    />
                  </div>

                </div>

              </div>
            );
          })}

        </div>

      </div>
    </>
  );
};

export default UserHome;