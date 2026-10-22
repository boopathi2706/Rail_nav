import React, { useState } from "react";
import axios from "axios";
import {
  AlertTriangle,
  Trash2,
  X,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:8000/api";

const DeleteStationModal = ({
  station,
  onClose,
  onDeleted,
}) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);

      const token =
        localStorage.getItem("adminToken");

      const id =
        station?._id || station?.id;

      const response = await axios.delete(
        `${API_URL}/stations/delete_stations/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.success === false) {
        throw new Error(
          response.data?.message ||
            "Failed to delete station"
        );
      }

      onDeleted?.(
        response.data?.message ||
          "Station deleted successfully"
      );
    } catch (error) {
      console.error(
        "Delete Station Error:",
        error.response?.data || error
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete station"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">

      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900">

        <div className="flex justify-between">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-500/10">
            <AlertTriangle size={24} />
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X size={20} />
          </button>

        </div>

        <h2 className="mt-5 text-xl font-bold">
          Delete Station?
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Are you sure you want to delete{" "}
          <strong className="text-slate-900 dark:text-white">
            {station?.stationName}
          </strong>
          ? This action cannot be undone.
        </p>

        <div className="mt-6 flex gap-3">

          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-xl bg-slate-100 px-4 py-3 text-sm font-bold dark:bg-slate-800"
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-50"
          >
            <Trash2 size={17} />
            {loading ? "Deleting..." : "Delete"}
          </button>

        </div>

      </div>

    </div>
  );
};

export default DeleteStationModal;