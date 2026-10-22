import React, { useEffect, useState } from "react";
import axios from "axios";
import { Save, X } from "lucide-react";

import Toast from "../auth/Toast";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:8000/api";

const EditStationModal = ({
  station,
  onClose,
  onUpdated,
}) => {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    stationName: "",
    stationCode: "",
    stationCategory: "",
    stationPassword: "",
    street: "",
    city: "",
    district: "",
    state: "",
    latitude: "",
    longitude: "",
    elevation: "",
  });

  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });

  useEffect(() => {
    if (!station) return;

    const address = station.address || {};
    const coordinates =
      station.coordinates || {};

    setForm({
      stationName:
        station.stationName || "",

      stationCode:
        station.stationCode || "",

      stationCategory:
        station.stationCategory || "",

      stationPassword: "",

      street: address.street || "",
      city: address.city || "",
      district: address.district || "",
      state: address.state || "",

      latitude:
        coordinates.latitude ??
        coordinates.lat ??
        "",

      longitude:
        coordinates.longitude ??
        coordinates.lng ??
        "",

      elevation:
        station.elevation ?? "",
    });
  }, [station]);

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

      const stationId =
        station?._id || station?.id;

      const payload = {
        stationName: form.stationName.trim(),
        stationCode: form.stationCode
          .trim()
          .toUpperCase(),

        stationCategory:
          form.stationCategory,

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

      if (form.stationPassword.trim()) {
        payload.stationPassword =
          form.stationPassword;
      }

      const response = await axios.put(
        `${API_URL}/stations/update_stations/${stationId}`,
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
            "Failed to update station"
        );
      }

      onUpdated?.(
        response.data?.message ||
          "Station updated successfully"
      );
    } catch (error) {
      console.error(
        "Update Station Error:",
        error.response?.data || error
      );

      setToast({
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to update station",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">

      <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl dark:bg-slate-900">

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
            <h2 className="text-xl font-bold">
              Edit Station
            </h2>

            <p className="text-xs text-slate-500">
              Update station information
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

          <div className="grid gap-4 sm:grid-cols-2">

            <Input
              label="Station Name"
              name="stationName"
              value={form.stationName}
              onChange={handleChange}
            />

            <Input
              label="Station Code"
              name="stationCode"
              value={form.stationCode}
              onChange={handleChange}
            />

            <div>
              <label className="mb-2 block text-xs font-bold text-slate-500">
                Station Category
              </label>

              <select
                name="stationCategory"
                value={form.stationCategory}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm dark:border-slate-700 dark:bg-slate-800"
              >
                <option value="">
                  Select category
                </option>

                {[
                  "NSG-1",
                  "NSG-2",
                  "NSG-3",
                  "NSG-4",
                  "NSG-5",
                  "NSG-6",
                  "HG-1",
                  "HG-2",
                  "HG-3",
                ].map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="New Password (Optional)"
              name="stationPassword"
              type="password"
              value={form.stationPassword}
              onChange={handleChange}
              placeholder="Leave empty to keep current"
            />

          </div>

          <div className="grid gap-4 sm:grid-cols-2">

            <Input
              label="Street"
              name="street"
              value={form.street}
              onChange={handleChange}
            />

            <Input
              label="City"
              name="city"
              value={form.city}
              onChange={handleChange}
            />

            <Input
              label="District"
              name="district"
              value={form.district}
              onChange={handleChange}
            />

            <Input
              label="State"
              name="state"
              value={form.state}
              onChange={handleChange}
            />

          </div>

          <div className="grid gap-4 sm:grid-cols-3">

            <Input
              label="Latitude"
              name="latitude"
              type="number"
              step="any"
              value={form.latitude}
              onChange={handleChange}
            />

            <Input
              label="Longitude"
              name="longitude"
              type="number"
              step="any"
              value={form.longitude}
              onChange={handleChange}
            />

            <Input
              label="Elevation"
              name="elevation"
              type="number"
              step="any"
              value={form.elevation}
              onChange={handleChange}
            />

          </div>

          <div className="flex justify-end gap-3">

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
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white disabled:opacity-50"
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

const Input = ({
  label,
  ...props
}) => (
  <div>
    <label className="mb-2 block text-xs font-bold text-slate-500">
      {label}
    </label>

    <input
      {...props}
      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800"
    />
  </div>
);

export default EditStationModal;