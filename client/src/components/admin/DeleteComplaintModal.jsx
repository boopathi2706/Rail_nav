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

const DeleteComplaintModal = ({
  complaint,
  onClose,
  onDeleted,
}) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);

      const token =
        localStorage.getItem("adminToken");

      const response = await axios.delete(
        `${API_URL}/complaints/admin/delete/${complaint._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.success === false) {
        throw new Error(
          response.data?.message ||
            "Failed to delete complaint"
        );
      }

      onDeleted?.(
        response.data?.message ||
          "Complaint deleted successfully"
      );
    } catch (error) {
      console.error(
        "Delete Complaint Error:",
        error.response?.data || error
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete complaint"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">

      <div className="w-full max-w-md rounded-3xl bg-white p-6 dark:bg-slate-900">

        <div className="flex justify-between">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-500/10">
            <AlertTriangle size={24} />
          </div>

          <button onClick={onClose}>
            <X size={20} />
          </button>

        </div>

        <h2 className="mt-5 text-xl font-bold">
          Delete Complaint?
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Are you sure you want to delete this complaint?

          <span className="mt-2 block font-semibold text-slate-900 dark:text-white">
            PNR:{" "}
            {complaint?.pnrNumber || "---"}
          </span>
        </p>

        <div className="mt-6 flex gap-3">

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
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 py-3 text-sm font-bold text-white disabled:opacity-50"
          >
            <Trash2 size={17} />
            {loading ? "Deleting..." : "Delete"}
          </button>

        </div>

      </div>

    </div>
  );
};

export default DeleteComplaintModal;