import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  UserCircle,
  Mail,
  Phone,
  Shield,
  MapPin,
  Edit3,
  Save,
  X,
  LockKeyhole,
  RefreshCw,
} from "lucide-react";

import Toast from "../auth/Toast";
import ChangeOfficerPassword from "./ChangeOfficerPassword";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const OfficerProfile = () => {
  // --------------------------------------------------
  // PROFILE
  // --------------------------------------------------

  const [profile, setProfile] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    officerType: "",
    stationId: "",
    stationName: "",
    stationCode: "",
  });

  // --------------------------------------------------
  // STATIONS
  // --------------------------------------------------

  const [stations, setStations] = useState([]);
  const [stationsLoading, setStationsLoading] = useState(false);

  // --------------------------------------------------
  // UI STATES
  // --------------------------------------------------

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // --------------------------------------------------
  // TOAST
  // --------------------------------------------------

  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });

  const showToast = (message, type = "success") => {
    setToast({
      message,
      type,
    });
  };

  const closeToast = () => {
    setToast({
      message: "",
      type: "success",
    });
  };

  // --------------------------------------------------
  // TOKEN
  // --------------------------------------------------

  const getToken = () => {
    return localStorage.getItem("officerToken");
  };

  // --------------------------------------------------
  // FETCH PROFILE
  // --------------------------------------------------

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const token = getToken();

      if (!token) {
        throw new Error("Officer token not found");
      }

      const response = await axios.get(
        `${API_URL}/officers/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "PROFILE RESPONSE:",
        response.data
      );

      // Your backend response:
      //
      // {
      //   success: true,
      //   message: "...",
      //   data: {
      //      name,
      //      email,
      //      officerType,
      //      phoneNumber,
      //      stationId: {
      //        _id,
      //        stationName,
      //        stationCode
      //      }
      //   }
      // }

      const officer = response.data?.data;

      if (!officer) {
        throw new Error(
          "Officer data not found in API response"
        );
      }

      // Save complete profile
      setProfile(officer);

      // Convert backend data into frontend form
      setForm({
        name: officer.name || "",
        email: officer.email || "",
        phoneNumber: officer.phoneNumber || "",

        officerType:
          officer.officerType || "",

        // IMPORTANT:
        // Only keep station ID in stationId
        stationId:
          officer.stationId?._id ||
          officer.stationId ||
          "",

        // Keep station display information separately
        stationName:
          officer.stationId?.stationName || "",

        stationCode:
          officer.stationId?.stationCode || "",
      });
    } catch (error) {
      console.error(
        "Profile Error:",
        error.response?.data || error.message
      );

      showToast(
        error.response?.data?.message ||
          error.message ||
          "Failed to load officer profile",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // FETCH STATIONS
  // --------------------------------------------------

  const fetchStations = async () => {
    try {
      setStationsLoading(true);

      const token = getToken();

      /*
       * IMPORTANT:
       *
       * This assumes your backend route is:
       *
       * GET /api/stations/get_all
       *
       * If your station GET-all route has a different
       * name, change only the URL below.
       */

      const response = await axios.get(
        `${API_URL}/stations/get_all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "STATIONS RESPONSE:",
        response.data
      );

      const stationData =
        response.data?.data ||
        response.data?.stations ||
        [];

      setStations(
        Array.isArray(stationData)
          ? stationData
          : []
      );
    } catch (error) {
      console.error(
        "Stations Error:",
        error.response?.data || error.message
      );

      /*
       * Don't show an error immediately.
       * Profile can still work if the station API
       * isn't available.
       */
    } finally {
      setStationsLoading(false);
    }
  };

  // --------------------------------------------------
  // INITIAL LOAD
  // --------------------------------------------------

  useEffect(() => {
    fetchProfile();
    fetchStations();
  }, []);

  // --------------------------------------------------
  // INPUT CHANGE
  // --------------------------------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Station changed
    if (name === "stationId") {
      const selectedStation = stations.find(
        (station) => station._id === value
      );

      setForm((prev) => ({
        ...prev,

        stationId: value,

        stationName:
          selectedStation?.stationName || "",

        stationCode:
          selectedStation?.stationCode || "",
      }));

      return;
    }

    // Normal fields
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // --------------------------------------------------
  // SAVE PROFILE
  // --------------------------------------------------

  const saveProfile = async () => {
    try {
      setSaving(true);

      const token = getToken();

      if (!token) {
        throw new Error("Officer token not found");
      }

      /*
       * IMPORTANT:
       *
       * Do NOT send stationName/stationCode.
       * Backend only needs stationId.
       */

      const updateData = {
        name: form.name.trim(),
        email: form.email.trim(),
        phoneNumber: form.phoneNumber.trim(),
        officerType: form.officerType,
        stationId: form.stationId,
      };

      console.log(
        "UPDATE DATA:",
        updateData
      );

      const response = await axios.put(
        `${API_URL}/officers/update`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "UPDATE RESPONSE:",
        response.data
      );

      if (response.data?.success) {
        showToast(
          "Profile updated successfully",
          "success"
        );

        setEditing(false);

        // Reload latest profile
        await fetchProfile();
      } else {
        showToast(
          response.data?.message ||
            "Unable to update profile",
          "error"
        );
      }
    } catch (error) {
      console.error(
        "Update Profile Error:",
        error.response?.data || error.message
      );

      showToast(
        error.response?.data?.message ||
          error.message ||
          "Failed to update profile",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------------------------
  // START EDIT
  // --------------------------------------------------

  const startEdit = () => {
    // Reload stations when editing
    fetchStations();

    setEditing(true);
  };

  // --------------------------------------------------
  // CANCEL EDIT
  // --------------------------------------------------

  const cancelEdit = () => {
    if (!profile) {
      setEditing(false);
      return;
    }

    setForm({
      name: profile.name || "",
      email: profile.email || "",
      phoneNumber:
        profile.phoneNumber || "",

      officerType:
        profile.officerType || "",

      stationId:
        profile.stationId?._id ||
        profile.stationId ||
        "",

      stationName:
        profile.stationId?.stationName ||
        "",

      stationCode:
        profile.stationId?.stationCode ||
        "",
    });

    setEditing(false);
  };

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-32 animate-pulse rounded-3xl bg-slate-200" />

        <div className="h-96 animate-pulse rounded-3xl bg-slate-200" />
      </div>
    );
  }

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <>
      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />
      )}

      <div className="space-y-6">

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <p className="text-sm font-medium text-slate-500">
              Account
            </p>

            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              Officer Profile
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              View and manage your officer information.
            </p>
          </div>

          <div className="flex gap-2">

            {editing ? (
              <>
                {/* CANCEL */}

                <button
                  type="button"
                  onClick={cancelEdit}
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold transition hover:bg-slate-50 disabled:opacity-50"
                >
                  <X size={17} />

                  Cancel
                </button>

                {/* SAVE */}

                <button
                  type="button"
                  onClick={saveProfile}
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Save size={17} />

                  {saving
                    ? "Saving..."
                    : "Save"}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={startEdit}
                className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                <Edit3 size={17} />

                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* ==================================================
            PROFILE CARD
        ================================================== */}

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          {/* PROFILE HEADER */}

          <div className="bg-slate-950 px-6 py-8 text-white sm:px-8">

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

              {/* AVATAR */}

              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-white text-2xl font-bold text-slate-950">
                {form?.name
                  ?.charAt(0)
                  ?.toUpperCase() || "O"}
              </div>

              <div>

                <h2 className="text-2xl font-bold">
                  {form?.name || "Officer"}
                </h2>

                <p className="mt-1 capitalize text-slate-400">
                  {form?.officerType ||
                    "Officer"}
                </p>

                <div className="mt-3 flex flex-wrap gap-2">

                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">
                    Active Officer
                  </span>

                </div>
              </div>
            </div>
          </div>

          {/* FORM */}

          <div className="grid gap-6 p-6 sm:p-8 md:grid-cols-2">

            {/* ==================================================
                NAME
            ================================================== */}

            <Field
              icon={UserCircle}
              label="Full Name"
              name="name"
              value={form.name}
              editing={editing}
              onChange={handleChange}
            />

            {/* ==================================================
                EMAIL
            ================================================== */}

            <Field
              icon={Mail}
              label="Email Address"
              name="email"
              value={form.email}
              editing={editing}
              onChange={handleChange}
              type="email"
            />

            {/* ==================================================
                PHONE
            ================================================== */}

            <Field
              icon={Phone}
              label="Phone Number"
              name="phoneNumber"
              value={form.phoneNumber}
              editing={editing}
              onChange={handleChange}
            />

            {/* ==================================================
                OFFICER TYPE
            ================================================== */}

            <div>

              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">

                <Shield size={15} />

                Officer Type

              </div>

              {editing ? (
                <select
                  name="officerType"
                  value={form.officerType}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                >

                  <option value="">
                    Select Officer Type
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
              ) : (
                <p className="rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold capitalize text-slate-700">
                  {form?.officerType
                    ? form.officerType
                        .charAt(0)
                        .toUpperCase() +
                      form.officerType.slice(1)
                    : "-"}
                </p>
              )}
            </div>

            {/* ==================================================
                STATION
            ================================================== */}

            <div className="md:col-span-2">

              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">

                <MapPin size={15} />

                Station

              </div>

              {editing ? (
                <>
                  {/* STATION SELECT */}

                  <div className="relative">

                    <select
                      name="stationId"
                      value={form.stationId}
                      onChange={handleChange}
                      disabled={
                        stationsLoading
                      }
                      className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-12 text-sm font-medium outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                    >

                      <option value="">
                        Select Station
                      </option>

                      {stations.map(
                        (station) => (
                          <option
                            key={
                              station._id
                            }
                            value={
                              station._id
                            }
                          >
                            {
                              station.stationName
                            }{" "}
                            (
                            {
                              station.stationCode
                            }
                            )
                          </option>
                        )
                      )}

                    </select>

                    {stationsLoading && (
                      <RefreshCw
                        size={17}
                        className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-slate-400"
                      />
                    )}

                  </div>

                  {/* SELECTED STATION PREVIEW */}

                  {form.stationId && (
                    <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">

                      <p className="text-sm font-semibold text-slate-800">
                        {form.stationName ||
                          "Station"}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Code:{" "}
                        {form.stationCode ||
                          "-"}
                      </p>

                    </div>
                  )}
                </>
              ) : (
                <div className="rounded-xl bg-slate-50 px-4 py-3">

                  <p className="text-sm font-semibold text-slate-800">
                    {form.stationName ||
                      "Station"}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Code:{" "}
                    {form.stationCode ||
                      "-"}
                  </p>

                </div>
              )}

            </div>
          </div>
        </section>

        {/* ==================================================
            PASSWORD / SECURITY
        ================================================== */}

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <div className="flex items-center gap-2">

                <LockKeyhole size={20} />

                <h2 className="text-lg font-bold">
                  Security
                </h2>

              </div>

              <p className="mt-1 text-sm text-slate-500">
                Update your officer account password.
              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  (prev) => !prev
                )
              }
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold transition hover:bg-slate-50"
            >

              <LockKeyhole size={17} />

              {showPassword
                ? "Hide Password Form"
                : "Change Password"}

            </button>
          </div>

          {showPassword && (
            <div className="mt-6 border-t border-slate-200 pt-6">

              <ChangeOfficerPassword
                showToast={showToast}
                onSuccess={() =>
                  setShowPassword(false)
                }
              />

            </div>
          )}
        </section>
      </div>
    </>
  );
};

// ======================================================
// REUSABLE FIELD
// ======================================================

const Field = ({
  icon: Icon,
  label,
  name,
  value,
  editing,
  onChange,
  type = "text",
}) => {
  return (
    <div>

      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">

        <Icon size={15} />

        {label}

      </div>

      {editing ? (
        <input
          type={type}
          name={name}
          value={value || ""}
          onChange={onChange}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
        />
      ) : (
        <p className="break-all rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
          {value || "-"}
        </p>
      )}

    </div>
  );
};

export default OfficerProfile;