import React, { useState } from "react";
import {
  Upload,
  FileText,
  X,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { analyzeTicket } from "../../services/userApi";

const TicketUploader = ({ onExtracted }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleFile = (selectedFile) => {
    setError("");
    setSuccess("");

    if (!selectedFile) return;

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      setError(
        "Please upload a JPG, JPEG, or PNG ticket image."
      );
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("Maximum ticket size is 10MB.");
      return;
    }

    setFile(selectedFile);

    setPreview(
      URL.createObjectURL(selectedFile)
    );
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a ticket image.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const formData = new FormData();

      formData.append("ticket", file);

      const response = await analyzeTicket(formData);

      if (!response?.success) {
        throw new Error(
          response?.message || "Ticket analysis failed."
        );
      }

      setSuccess(
        "Ticket analyzed successfully."
      );

      onExtracted?.(response.data);

    } catch (error) {
      setError(
        error?.response?.data?.message ||
        error.message ||
        "Unable to analyze ticket."
      );
    } finally {
      setLoading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreview("");
    setError("");
    setSuccess("");
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">

      <div className="mb-5">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Upload Railway Ticket
        </h3>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          AI can read your ticket and extract PNR,
          train number and journey details.
        </p>
      </div>

      {!file ? (
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 p-10 text-center transition hover:border-indigo-500 hover:bg-indigo-50/30 dark:border-slate-700 dark:hover:bg-indigo-500/5">

          <div className="mb-4 rounded-2xl bg-indigo-100 p-4 dark:bg-indigo-500/10">
            <Upload
              size={28}
              className="text-indigo-600"
            />
          </div>

          <p className="font-semibold text-slate-900 dark:text-white">
            Upload Ticket
          </p>

          <p className="mt-1 text-sm text-slate-500">
            JPG, JPEG or PNG • Maximum 10MB
          </p>

          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png"
            className="hidden"
            onChange={(e) =>
              handleFile(e.target.files?.[0])
            }
          />

        </label>
      ) : (
        <div className="space-y-4">

          <div className="relative overflow-hidden rounded-2xl border">

            {preview && (
              <img
                src={preview}
                alt="Ticket preview"
                className="max-h-80 w-full object-contain"
              />
            )}

            <button
              type="button"
              onClick={removeFile}
              className="absolute right-3 top-3 rounded-full bg-black/70 p-2 text-white"
            >
              <X size={18} />
            </button>

          </div>

          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800">

            <FileText size={20} />

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">
                {file.name}
              </p>

              <p className="text-xs text-slate-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={handleUpload}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />
                Analyzing Ticket...
              </>
            ) : (
              <>
                <Upload size={18} />
                Analyze Ticket
              </>
            )}
          </button>

        </div>
      )}

      {error && (
        <div className="mt-4 flex gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {success && (
        <div className="mt-4 flex gap-2 rounded-xl bg-green-50 p-3 text-sm text-green-700 dark:bg-green-500/10 dark:text-green-300">
          <CheckCircle size={18} />
          {success}
        </div>
      )}

    </div>
  );
};

export default TicketUploader;