import React from "react";
import {
  Eye,
  Calendar,
  TrainFront,
  Hash,
  ChevronRight,
} from "lucide-react";

const ComplaintCard = ({ complaint, onView }) => {
  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "solved":
        return "bg-green-100 text-green-700 border-green-200";

      case "ongoing":
        return "bg-blue-100 text-blue-700 border-blue-200";

      case "pending":
      default:
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-900">

      {/* Header */}
      <div className="mb-4 flex items-start justify-between gap-3">

        <div>
          <h3 className="text-lg font-bold capitalize text-gray-900 dark:text-white">
            {complaint.complaintCategory || "Complaint"}
          </h3>

          <p className="mt-1 text-xs text-gray-500">
            Complaint ID: #{complaint._id?.slice(-8)}
          </p>
        </div>

        <span
          className={`rounded-full border px-3 py-1 text-xs font-bold capitalize ${getStatusStyle(
            complaint.status
          )}`}
        >
          {complaint.status || "pending"}
        </span>
      </div>

      {/* Information */}
      <div className="grid gap-3 sm:grid-cols-2">

        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-gray-100 p-2 dark:bg-gray-800">
            <Hash size={17} />
          </div>

          <div>
            <p className="text-xs text-gray-500">PNR Number</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {complaint.pnrNumber || "N/A"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-gray-100 p-2 dark:bg-gray-800">
            <TrainFront size={17} />
          </div>

          <div>
            <p className="text-xs text-gray-500">Train Number</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {complaint.trainNumber || "N/A"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-gray-100 p-2 dark:bg-gray-800">
            <Calendar size={17} />
          </div>

          <div>
            <p className="text-xs text-gray-500">Incident Date</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {formatDate(complaint.incidentDateTime)}
            </p>
          </div>
        </div>

      </div>

      {/* Description */}
      <div className="mt-4 rounded-xl bg-gray-50 p-3 dark:bg-gray-800">
        <p className="mb-1 text-xs font-semibold text-gray-500">
          Description
        </p>

        <p className="line-clamp-2 text-sm text-gray-700 dark:text-gray-300">
          {complaint.descriptions?.length
            ? complaint.descriptions[
                complaint.descriptions.length - 1
              ]?.message
            : "No description available"}
        </p>
      </div>

      {/* Button */}
      <button
        type="button"
        onClick={() => onView(complaint)}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
      >
        <Eye size={17} />
        View Complaint
        <ChevronRight size={17} />
      </button>
    </div>
  );
};

export default ComplaintCard;