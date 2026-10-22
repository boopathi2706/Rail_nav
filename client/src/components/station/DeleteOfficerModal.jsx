import React, { useState } from "react";
import axios from "axios";
import {
  X,
  Trash2,
  AlertTriangle,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const DeleteOfficerModal = ({
  officer,
  onClose,
  onDeleted,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("stationToken");

      /*
       * DELETE /api/officers/delete_officers/:id
       */
      const response = await axios.delete(
        `${API_URL}/officers/delete_officers/${officer._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.success === false) {
        throw new Error(
          response.data?.message ||
            "Failed to delete officer"
        );
      }

      onDeleted?.();
    } catch (err) {
      console.error(
        "Delete Officer Error:",
        err.response?.data || err
      );

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to delete officer"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl dark:bg-slate-900">
        <div className="p-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400">
            <AlertTriangle size={27} />
          </div>

          <h2 className="mt-5 text-xl font-bold">
            Delete Officer?
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            Are you sure you want to delete{" "}
            <strong className="text-slate-900 dark:text-white">
              {officer?.name}
            </strong>
            ? This action cannot be undone.
          </p>

          {error && (
            <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700 dark:bg-red-500/10 dark:text-red-400">
              {error}
            </div>
          )}

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 rounded-xl bg-slate-100 py-3 text-sm font-bold dark:bg-slate-800"
            >
              Cancel
            </button>

            <button
              onClick={handleDelete}
              disabled={loading}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 py-3 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-50"
            >
              <Trash2 size={17} />

              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteOfficerModal;