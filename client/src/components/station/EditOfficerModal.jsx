import React, { useState } from "react";
import axios from "axios";
import {
  X,
  User,
  Mail,
  Phone,
  ShieldCheck,
  Save,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const EditOfficerModal = ({
  officer,
  onClose,
  onUpdated,
}) => {
  const [form, setForm] = useState({
    name: officer?.name || "",
    email: officer?.email || "",
    officerType: officer?.officerType || "",
    phoneNumber: officer?.phoneNumber || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!form.name || !form.email || !form.officerType) {
      setError("Please fill all required fields.");
      return;
    }

    if (!/^[0-9]{10}$/.test(form.phoneNumber)) {
      setError("Enter a valid 10 digit phone number.");
      return;
    }

    try {
      setLoading(true);

      const token =
        localStorage.getItem("stationToken");

      /*
       * IMPORTANT:
       * Backend should update req.params.id.
       *
       * PUT /api/officers/update/:id
       */
      const response = await axios.put(
        `${API_URL}/officers/update/${officer._id}`,
        {
          name: form.name,
          email: form.email,
          officerType: form.officerType,
          phoneNumber: form.phoneNumber,

          // Keep current station.
          stationId:
            officer.stationId?._id ||
            officer.stationId,
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
            "Failed to update officer"
        );
      }

      onUpdated?.();
    } catch (err) {
      console.error(
        "Update Officer Error:",
        err.response?.data || err
      );

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to update officer"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-3xl bg-white shadow-2xl dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-200 p-5 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold">
              Edit Officer
            </h2>

            <p className="text-sm text-slate-500">
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

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
              {error}
            </div>
          )}

          <div className="space-y-5">
            <Field
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              icon={User}
            />

            <Field
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              icon={Mail}
            />

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Officer Type
              </label>

              <div className="relative">
                <ShieldCheck
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <select
                  name="officerType"
                  value={form.officerType}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800"
                >
                  <option value="electric">
                    Electric
                  </option>
                  <option value="water">Water</option>
                  <option value="cleaning">
                    Cleaning
                  </option>
                  <option value="ttr">TTR</option>
                  <option value="others">Others</option>
                </select>
              </div>
            </div>

            <Field
              label="Phone Number"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              icon={Phone}
              maxLength={10}
            />
          </div>

          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
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
              <Save size={17} />
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Field = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  icon: Icon,
  maxLength,
}) => (
  <div>
    <label className="mb-2 block text-sm font-semibold">
      {label}
    </label>

    <div className="relative">
      <Icon
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
      />

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800"
      />
    </div>
  </div>
);

export default EditOfficerModal;