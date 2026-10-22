import React, { useState } from "react";
import axios from "axios";
import {
  UserPlus,
  User,
  Mail,
  Phone,
  Lock,
  Building2,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";

import Toast from "../auth/Toast";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const CreateOfficer = ({ stationData, onCreated }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    officerType: "",
    password: "",
    phoneNumber: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const getAuthConfig = () => {
    const token = localStorage.getItem("stationToken");

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.email ||
      !form.officerType ||
      !form.password ||
      !form.phoneNumber
    ) {
      showToast(
        "Please fill all required fields",
        "error"
      );
      return;
    }

    if (form.password.length < 6) {
      showToast(
        "Password must contain at least 6 characters",
        "error"
      );
      return;
    }

    if (!/^[0-9]{10}$/.test(form.phoneNumber)) {
      showToast(
        "Enter a valid 10 digit phone number",
        "error"
      );
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_URL}/officers/create_officers`,
        {
          ...form,
          stationCode:
            stationData?.stationCode?.toUpperCase(),
        },
        getAuthConfig()
      );

      if (response.data?.success === false) {
        throw new Error(
          response.data?.message ||
            "Failed to create officer"
        );
      }

      showToast(
        response.data?.message ||
          "Officer created successfully",
        "success"
      );

      setForm({
        name: "",
        email: "",
        officerType: "",
        password: "",
        phoneNumber: "",
      });

      setTimeout(() => {
        onCreated?.();
      }, 1000);
    } catch (error) {
      console.error(
        "Create Officer Error:",
        error.response?.data || error
      );

      showToast(
        error.response?.data?.message ||
          error.message ||
          "Failed to create officer",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() =>
          setToast({ message: "", type: "success" })
        }
      />

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">
          Create Officer
        </h1>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Add a new officer to your railway station.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
      >
        {/* Form Header */}
        <div className="border-b border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-800/40">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
              <UserPlus size={23} />
            </div>

            <div>
              <h2 className="font-bold">
                Officer Information
              </h2>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                Enter the officer's details below.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-5 p-6 md:grid-cols-2">
          <InputField
            label="Officer Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter officer name"
            icon={User}
            required
          />

          <InputField
            label="Email Address"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="officer@example.com"
            icon={Mail}
            required
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
                required
                className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800"
              >
                <option value="">
                  Select officer type
                </option>

                <option value="electric">
                  Electric
                </option>

                <option value="water">
                  Water
                </option>

                <option value="cleaning">
                  Cleaning
                </option>

                <option value="ttr">
                  TTR
                </option>

                <option value="others">
                  Others
                </option>
              </select>
            </div>
          </div>

          <InputField
            label="Phone Number"
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={handleChange}
            placeholder="10 digit phone number"
            icon={Phone}
            maxLength={10}
            required
          />

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Password
            </label>

            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Minimum 6 characters"
                required
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-11 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword((prev) => !prev)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          {/* Station Code */}
          <div>
            <label className="mb-2 block text-sm font-semibold">
              Station Code
            </label>

            <div className="relative">
              <Building2
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={stationData?.stationCode || ""}
                disabled
                className="w-full rounded-xl border border-slate-200 bg-slate-100 py-3 pl-10 pr-4 text-sm font-bold uppercase text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              />
            </div>

            <p className="mt-1 text-xs text-slate-400">
              Automatically assigned from your station.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 p-6 sm:flex-row sm:justify-end dark:border-slate-800 dark:bg-slate-800/40">
          <button
            type="button"
            onClick={() =>
              setForm({
                name: "",
                email: "",
                officerType: "",
                password: "",
                phoneNumber: "",
              })
            }
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
          >
            Clear
          </button>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <UserPlus size={18} />

            {loading
              ? "Creating..."
              : "Create Officer"}
          </button>
        </div>
      </form>
    </div>
  );
};

const InputField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  icon: Icon,
  type = "text",
  required = false,
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
        placeholder={placeholder}
        required={required}
        maxLength={maxLength}
        className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800"
      />
    </div>
  </div>
);

export default CreateOfficer;