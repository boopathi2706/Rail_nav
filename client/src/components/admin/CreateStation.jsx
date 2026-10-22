import React, { useState } from "react";
import axios from "axios";
import {
  Building2,
  MapPin,
  Navigation,
  Lock,
  Save,
  RotateCcw,
} from "lucide-react";

import Toast from "../auth/Toast";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:8000/api";

const initialForm = {
  stationName: "",
  stationCode: "",
  stationPassword: "",
  stationCategory: "",
  street: "",
  city: "",
  district: "",
  state: "",
  latitude: "",
  longitude: "",
  elevation: "",
};

const CreateStation = () => {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });

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

      const token = localStorage.getItem("adminToken");

      const payload = {
        stationName: form.stationName.trim(),
        stationCode: form.stationCode
          .trim()
          .toUpperCase(),
        stationPassword: form.stationPassword,
        stationCategory: form.stationCategory,

        address: {
          street: form.street.trim(),
          city: form.city.trim(),
          district: form.district.trim(),
          state: form.state.trim(),
        },

        coordinates: {
          latitude: Number(form.latitude),
          longitude: Number(form.longitude),
        },

        elevation:
          form.elevation === ""
            ? null
            : Number(form.elevation),
      };

      const response = await axios.post(
        `${API_URL}/stations/create`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.success === false) {
        throw new Error(
          response.data?.message ||
            "Failed to create station"
        );
      }

      setForm(initialForm);

      setToast({
        message:
          response.data?.message ||
          "Station created successfully",
        type: "success",
      });
    } catch (error) {
      console.error(
        "Create Station Error:",
        error.response?.data || error
      );

      setToast({
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to create station",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">

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

      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Create Station
        </h1>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Add a new railway station to the system.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >

        {/* Basic Information */}

        <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">

          <SectionTitle
            icon={Building2}
            title="Station Information"
            description="Basic station details"
          />

          <div className="mt-6 grid gap-5 md:grid-cols-2">

            <Input
              label="Station Name"
              name="stationName"
              value={form.stationName}
              onChange={handleChange}
              required
              placeholder="Enter station name"
            />

            <Input
              label="Station Code"
              name="stationCode"
              value={form.stationCode}
              onChange={handleChange}
              required
              placeholder="Example: CBE"
            />

            <Select
              label="Station Category"
              name="stationCategory"
              value={form.stationCategory}
              onChange={handleChange}
              required
              options={[
                "NSG-1",
                "NSG-2",
                "NSG-3",
                "NSG-4",
                "NSG-5",
                "NSG-6",
                "HG-1",
                "HG-2",
                "HG-3",
              ]}
            />

            <Input
              label="Station Password"
              name="stationPassword"
              type="password"
              value={form.stationPassword}
              onChange={handleChange}
              required
              placeholder="Minimum 6 characters"
            />

          </div>
        </section>

        {/* Address */}

        <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">

          <SectionTitle
            icon={MapPin}
            title="Station Address"
            description="Station location details"
          />

          <div className="mt-6 grid gap-5 md:grid-cols-2">

            <Input
              label="Street"
              name="street"
              value={form.street}
              onChange={handleChange}
              required
            />

            <Input
              label="City"
              name="city"
              value={form.city}
              onChange={handleChange}
              required
            />

            <Input
              label="District"
              name="district"
              value={form.district}
              onChange={handleChange}
              required
            />

            <Input
              label="State"
              name="state"
              value={form.state}
              onChange={handleChange}
              required
            />

          </div>
        </section>

        {/* Coordinates */}

        <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">

          <SectionTitle
            icon={Navigation}
            title="Location & Elevation"
            description="GPS coordinates and station elevation"
          />

          <div className="mt-6 grid gap-5 md:grid-cols-3">

            <Input
              label="Latitude"
              name="latitude"
              type="number"
              step="any"
              value={form.latitude}
              onChange={handleChange}
              required
            />

            <Input
              label="Longitude"
              name="longitude"
              type="number"
              step="any"
              value={form.longitude}
              onChange={handleChange}
              required
            />

            <Input
              label="Elevation"
              name="elevation"
              type="number"
              step="any"
              value={form.elevation}
              onChange={handleChange}
              placeholder="Optional"
            />

          </div>
        </section>

        {/* Buttons */}

        <div className="flex flex-col justify-end gap-3 sm:flex-row">

          <button
            type="button"
            onClick={() => setForm(initialForm)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <RotateCcw size={17} />
            Reset
          </button>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            <Save size={17} />
            {loading
              ? "Creating..."
              : "Create Station"}
          </button>

        </div>

      </form>
    </div>
  );
};

const SectionTitle = ({
  icon: Icon,
  title,
  description,
}) => (
  <div className="flex items-center gap-3">

    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
      <Icon size={21} />
    </div>

    <div>
      <h2 className="font-bold text-slate-900 dark:text-white">
        {title}
      </h2>

      <p className="text-xs text-slate-500 dark:text-slate-400">
        {description}
      </p>
    </div>

  </div>
);

const Input = ({
  label,
  ...props
}) => (
  <div>
    <label className="mb-2 block text-xs font-bold text-slate-600 dark:text-slate-400">
      {label}
    </label>

    <input
      {...props}
      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
    />
  </div>
);

const Select = ({
  label,
  options,
  ...props
}) => (
  <div>
    <label className="mb-2 block text-xs font-bold text-slate-600 dark:text-slate-400">
      {label}
    </label>

    <select
      {...props}
      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
    >
      <option value="">Select category</option>

      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

export default CreateStation;