import React, { useState } from "react";
import axios from "axios";
import {
  X,
  Send,
  MapPin,
  MessageSquare,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const MoveNextStationModal = ({
  complaint,
  onClose,
  onMoved,
}) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      setError("Please enter a message.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("stationToken");

      const response = await axios.put(
        `${API_URL}/complaints/station/move-next-station`,
        {
          complaintId: complaint._id,
          message: message.trim(),
          who: "station",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.success === false) {
        throw new Error(
          response.data?.message ||
            "Failed to move complaint"
        );
      }

      onMoved?.(response.data);
    } catch (err) {
      console.error(
        "Move Next Station Error:",
        err.response?.data || err
      );

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to move complaint to next station"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-200 p-5 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <MapPin className="text-indigo-600" size={20} />

              <h2 className="font-bold">
                Move to Next Station
              </h2>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              Send this complaint to the next station.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
            <p className="text-xs font-semibold text-slate-400">
              Complaint
            </p>

            <p className="mt-1 font-bold">
              {complaint?.complaintCategory ||
                "Complaint"}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              PNR: {complaint?.pnrNumber || "---"}
            </p>
          </div>

          <div className="mt-5">
            <label className="mb-2 block text-sm font-semibold">
              Message
            </label>

            <div className="relative">
              <MessageSquare
                size={18}
                className="absolute left-3 top-3.5 text-slate-400"
              />

              <textarea
                value={message}
                onChange={(e) =>
                  setMessage(e.target.value)
                }
                rows={5}
                placeholder="Enter message for the next station..."
                className="w-full resize-none rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800"
              />
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700 dark:bg-red-500/10 dark:text-red-400">
              {error}
            </div>
          )}

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-slate-100 px-5 py-3 text-sm font-bold dark:bg-slate-800"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white disabled:opacity-50"
            >
              <Send size={17} />

              {loading
                ? "Sending..."
                : "Move Complaint"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MoveNextStationModal;