import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Building2,
  MapPin,
  Navigation,
  Mountain,
  Pencil,
  Save,
  X,
  MapPinned,
} from "lucide-react";

import Toast from "../auth/Toast";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const StationProfile = ({ stationData, onUpdated }) => {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    stationName: "",
    stationCode: "",
    stationCategory: "",
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

  // --------------------------------------------------
  // Toast
  // --------------------------------------------------

  const showToast = (message, type = "success") => {
    setToast({
      message,
      type,
    });
  };

  // --------------------------------------------------
  // Load station data
  // --------------------------------------------------

  useEffect(() => {
    if (!stationData) return;

    const address = stationData.address || {};

    setForm({
      stationName: stationData.stationName || "",
      stationCode: stationData.stationCode || "",
      stationCategory: stationData.stationCategory || "",

      street:
        typeof address === "object"
          ? address.street || ""
          : address || "",

      city:
        typeof address === "object"
          ? address.city || ""
          : "",

      district:
        typeof address === "object"
          ? address.district || ""
          : "",

      state:
        typeof address === "object"
          ? address.state || ""
          : "",

      latitude:
        stationData.coordinates?.latitude ??
        stationData.coordinates?.lat ??
        "",

      longitude:
        stationData.coordinates?.longitude ??
        stationData.coordinates?.lng ??
        "",

      elevation: stationData.elevation ?? "",
    });
  }, [stationData]);

  // --------------------------------------------------
  // Handle input change
  // --------------------------------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // --------------------------------------------------
  // Format address for display
  // --------------------------------------------------

  const getFormattedAddress = () => {
    return [
      form.street,
      form.city,
      form.district,
      form.state,
    ]
      .filter(Boolean)
      .join(", ");
  };

  // --------------------------------------------------
  // Save station
  // --------------------------------------------------

  const handleSave = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("stationToken");

      if (!token) {
        showToast(
          "Station authentication token not found",
          "error"
        );
        return;
      }

      const stationId =
        stationData?.id ||
        stationData?._id;

      if (!stationId) {
        showToast(
          "Station ID not found",
          "error"
        );
        return;
      }

      // ----------------------------------------------
      // Prepare address object
      // ----------------------------------------------

      const address = {
        street: form.street.trim(),
        city: form.city.trim(),
        district: form.district.trim(),
        state: form.state.trim(),
      };

      // ----------------------------------------------
      // Prepare request
      // ----------------------------------------------

      const payload = {
        stationName: form.stationName.trim(),
        stationCode: form.stationCode
          .trim()
          .toUpperCase(),

        stationCategory:
          form.stationCategory.trim(),

        address,

        coordinates: {
          latitude: Number(form.latitude),
          longitude: Number(form.longitude),
        },

        elevation: form.elevation,
      };

      // ----------------------------------------------
      // Update API
      // ----------------------------------------------

      const response = await axios.put(
        `${API_URL}/stations/update/${stationId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // ----------------------------------------------
      // Check API response
      // ----------------------------------------------

      if (response.data?.success === false) {
        throw new Error(
          response.data?.message ||
            "Failed to update station"
        );
      }

      // ----------------------------------------------
      // Get updated station
      // ----------------------------------------------

      const updatedStation =
        response.data?.data ||
        response.data?.station;

      if (updatedStation) {
        localStorage.setItem(
          "stationData",
          JSON.stringify(updatedStation)
        );
      }

      // ----------------------------------------------
      // Exit editing mode
      // ----------------------------------------------

      setEditing(false);

      // Refresh parent station data
      onUpdated?.(updatedStation);

      showToast(
        response.data?.message ||
          "Station profile updated successfully",
        "success"
      );
    } catch (error) {
      console.error(
        "Update Station Error:",
        error.response?.data || error
      );

      showToast(
        error.response?.data?.message ||
          error.message ||
          "Failed to update station",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // Cancel editing
  // --------------------------------------------------

  const handleCancel = () => {
    if (!stationData) return;

    const address = stationData.address || {};

    setForm({
      stationName: stationData.stationName || "",
      stationCode: stationData.stationCode || "",
      stationCategory:
        stationData.stationCategory || "",

      street:
        typeof address === "object"
          ? address.street || ""
          : address || "",

      city:
        typeof address === "object"
          ? address.city || ""
          : "",

      district:
        typeof address === "object"
          ? address.district || ""
          : "",

      state:
        typeof address === "object"
          ? address.state || ""
          : "",

      latitude:
        stationData.coordinates?.latitude ??
        stationData.coordinates?.lat ??
        "",

      longitude:
        stationData.coordinates?.longitude ??
        stationData.coordinates?.lng ??
        "",

      elevation:
        stationData.elevation ?? "",
    });

    setEditing(false);
  };

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <div className="mx-auto max-w-6xl space-y-6">

      {/* Toast */}

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

      {/* ------------------------------------------------ */}
      {/* Header */}
      {/* ------------------------------------------------ */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Station Profile
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            View and manage station information.
          </p>
        </div>

        {!editing ? (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700"
          >
            <Pencil size={17} />
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">

            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-200 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <X size={17} />
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save size={17} />

              {loading ? "Saving..." : "Save"}
            </button>

          </div>
        )}
      </div>

      {/* ------------------------------------------------ */}
      {/* Station Identity */}
      {/* ------------------------------------------------ */}

      <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white shadow-xl sm:p-8">

        <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">

          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-white/15 backdrop-blur-xl">
            <Building2 size={36} />
          </div>

          <div className="min-w-0">

            <p className="text-sm text-indigo-100">
              Railway Station
            </p>

            <h2 className="mt-1 break-words text-2xl font-bold">
              {stationData?.stationName ||
                "Station"}
            </h2>

            <p className="mt-1 font-semibold text-indigo-100">
              {stationData?.stationCode ||
                "---"}
            </p>

          </div>

        </div>
      </div>

      {/* ------------------------------------------------ */}
      {/* Station Details */}
      {/* ------------------------------------------------ */}

      <div className="grid gap-5 md:grid-cols-2">

        {/* Station Name */}

        <ProfileField
          icon={Building2}
          label="Station Name"
          name="stationName"
          value={form.stationName}
          editing={editing}
          onChange={handleChange}
        />

        {/* Station Code */}

        <ProfileField
          icon={Navigation}
          label="Station Code"
          name="stationCode"
          value={form.stationCode}
          editing={editing}
          onChange={handleChange}
        />

        {/* Station Category */}

        <ProfileField
          icon={Building2}
          label="Station Category"
          name="stationCategory"
          value={form.stationCategory}
          editing={editing}
          onChange={handleChange}
        />

        {/* Elevation */}

        <ProfileField
          icon={Mountain}
          label="Elevation"
          name="elevation"
          value={form.elevation}
          editing={editing}
          onChange={handleChange}
        />

      </div>

      {/* ------------------------------------------------ */}
      {/* Address */}
      {/* ------------------------------------------------ */}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">

        <div className="mb-5 flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-500/10">
            <MapPin
              size={20}
              className="text-indigo-600 dark:text-indigo-400"
            />
          </div>

          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              Station Address
            </p>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Station location information
            </p>
          </div>

        </div>

        {editing ? (
          <div className="grid gap-4 sm:grid-cols-2">

            {/* Street */}

            <AddressField
              label="Street"
              name="street"
              value={form.street}
              onChange={handleChange}
              placeholder="Enter street"
            />

            {/* City */}

            <AddressField
              label="City"
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="Enter city"
            />

            {/* District */}

            <AddressField
              label="District"
              name="district"
              value={form.district}
              onChange={handleChange}
              placeholder="Enter district"
            />

            {/* State */}

            <AddressField
              label="State"
              name="state"
              value={form.state}
              onChange={handleChange}
              placeholder="Enter state"
            />

          </div>
        ) : (
          <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">

            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
              {getFormattedAddress() ||
                "Address not available"}
            </p>

          </div>
        )}

      </div>

      {/* ------------------------------------------------ */}
      {/* GPS Coordinates */}
      {/* ------------------------------------------------ */}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">

        <div className="mb-5 flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-500/10">
            <MapPinned
              size={20}
              className="text-indigo-600 dark:text-indigo-400"
            />
          </div>

          <div>
            <p className="font-bold text-slate-900 dark:text-white">
              GPS Coordinates
            </p>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Exact geographical location
            </p>
          </div>

        </div>

        <div className="grid gap-4 sm:grid-cols-2">

          <ProfileField
            icon={Navigation}
            label="Latitude"
            name="latitude"
            value={form.latitude}
            editing={editing}
            onChange={handleChange}
          />

          <ProfileField
            icon={Navigation}
            label="Longitude"
            name="longitude"
            value={form.longitude}
            editing={editing}
            onChange={handleChange}
          />

        </div>

      </div>

    </div>
  );
};

// ======================================================
// Profile Field
// ======================================================

const ProfileField = ({
  icon: Icon,
  label,
  name,
  value,
  editing,
  onChange,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">

      <div className="mb-3 flex items-center gap-3">

        {Icon && (
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-500/10">
            <Icon
              size={18}
              className="text-indigo-600 dark:text-indigo-400"
            />
          </div>
        )}

        <p className="text-sm font-bold text-slate-900 dark:text-white">
          {label}
        </p>

      </div>

      {editing ? (
        <input
          type="text"
          name={name}
          value={value ?? ""}
          onChange={onChange}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        />
      ) : (
        <p className="break-words text-sm text-slate-600 dark:text-slate-300">
          {value !== null &&
          value !== undefined &&
          value !== ""
            ? String(value)
            : "---"}
        </p>
      )}

    </div>
  );
};

// ======================================================
// Address Field
// ======================================================

const AddressField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
}) => {
  return (
    <div>

      <label className="mb-2 block text-xs font-semibold text-slate-600 dark:text-slate-400">
        {label}
      </label>

      <input
        type="text"
        name={name}
        value={value ?? ""}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
      />

    </div>
  );
};

export default StationProfile;