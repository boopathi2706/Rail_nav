import React, { useEffect, useState } from "react";
import axios from "axios";
import { Save, X } from "lucide-react";

import Toast from "../auth/Toast";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:8000/api";

const EditOfficerModal = ({
  officer,
  stations,
  onClose,
  onUpdated,
}) => {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    officerType: "",
    phoneNumber: "",
    stationId: "",
  });

  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });

  useEffect(() => {
    if (!officer) return;

    const stationId =
      typeof officer.stationId === "object"
        ? officer.stationId?._id
        : officer.stationId;

    setForm({
      name: officer.name || "",
      email: officer.email || "",
      officerType:
        officer.officerType || "",
      phoneNumber:
        officer.phoneNumber || "",
      stationId: stationId || "",
    });
  }, [officer]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const token =
        localStorage.getItem("adminToken");

      const id =
        officer?._id || officer?.id;

      const response = await axios.put(
        `${API_URL}/officers/admin_update/${id}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.success === false) {
        throw new Error(
          response.data?.message ||
            "Failed to update officer"
        );
      }

      onUpdated?.(
        response.data?.message ||
          "Officer updated successfully"
      );
    } catch (error) {
      console.error(
        "Update Officer Error:",
        error.response?.data || error
      );

      setToast({
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to update officer",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">

      <div className="w-full max-w-xl rounded-3xl bg-white shadow-2xl dark:bg-slate-900">

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

        <div className="flex items-center justify-between border-b border-slate-200 p-6 dark:border-slate-800">

          <div>
            <h2 className="text-xl font-bold text-white">
              Edit Officer
            </h2>

            <p className="text-xs text-slate-500">
              Update officer information
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X size={20} />
          </button>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-6"
        >

          <Input
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
          />

          <Input
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
          />

          <Input
            label="Phone Number"
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={handleChange}
          />

          <div>
            <label className="mb-2 block text-xs font-bold text-white">
              Officer Type
            </label>

            <select
              name="officerType"
              value={form.officerType}
              onChange={handleChange}
              className="w-full text-slate-500 rounded-xl border border-slate-200 px-3 py-3 text-sm dark:border-slate-700 dark:bg-slate-800"
            >
              {[
                "electric",
                "water",
                "cleaning",
                "ttr",
                "others",
              ].map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold text-white">
              Station
            </label>

            <select
              name="stationId"
              value={form.stationId}
              onChange={handleChange}
              className="w-full text-slate-500 rounded-xl border border-slate-200 px-3 py-3 text-sm dark:border-slate-700 dark:bg-slate-800"
            >
              <option value="">
                Select station
              </option>

              {stations.map((station) => (
                <option
                  key={station._id}
                  value={station._id}
                >
                  {station.stationName} (
                  {station.stationCode})
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3">

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl text-white bg-slate-100 px-5 py-3 text-sm font-bold dark:bg-slate-800"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white disabled:opacity-50"
            >
              <Save size={17} />
              {loading ? "Saving..." : "Save"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

const Input = ({
  label,
  ...props
}) => (
  <div>
    <label className="mb-2 block text-xs font-bold text-white">
      {label}
    </label>

    <input
      {...props}
      className="w-full rounded-xl border text-slate-500 border-slate-200 px-3 py-3 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800"
    />
  </div>
);

export default EditOfficerModal;