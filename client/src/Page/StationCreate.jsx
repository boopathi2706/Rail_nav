import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  MapPin,
  Navigation,
  Lock,
  Eye,
  EyeOff,
  Save,
  Loader2,
  ArrowLeft,
  LocateFixed,
  Map,
  Mountain,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Toast from "../components/auth/Toast";

const StationCreate = () => {
  const navigate = useNavigate();

  const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:8000/api";

  // =========================================================
  // Form State
  // =========================================================

  const [formData, setFormData] = useState({
    stationName: "",
    stationCode: "",
    stationPassword: "",
    stationCategory: "NSG-1",

    street: "",
    city: "",
    district: "",
    state: "",
    pincode: "",

    latitude: "",
    longitude: "",

    elevation: "",
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [locationLoading, setLocationLoading] =
    useState(false);

  // =========================================================
  // Toast
  // =========================================================

  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });

  const showToast = (
    message,
    type = "success"
  ) => {
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

  // =========================================================
  // Input Change
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // Get Current Location
  // =========================================================

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      showToast(
        "Geolocation is not supported by your browser.",
        "error"
      );

      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude =
          position.coords.latitude;

        const longitude =
          position.coords.longitude;

        setFormData((prev) => ({
          ...prev,
          latitude: latitude.toFixed(6),
          longitude: longitude.toFixed(6),
        }));

        setLocationLoading(false);

        showToast(
          "Current location detected successfully.",
          "success"
        );
      },

      (error) => {
        console.error(
          "Location Error:",
          error
        );

        setLocationLoading(false);

        let message =
          "Unable to get your current location.";

        if (error.code === 1) {
          message =
            "Location permission denied. Please allow location access.";
        }

        if (error.code === 2) {
          message =
            "Current location is unavailable.";
        }

        if (error.code === 3) {
          message =
            "Location request timed out.";
        }

        showToast(message, "error");
      },

      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  // =========================================================
  // Validation
  // =========================================================

  const validateForm = () => {
    if (!formData.stationName.trim()) {
      showToast(
        "Please enter station name.",
        "error"
      );
      return false;
    }

    if (!formData.stationCode.trim()) {
      showToast(
        "Please enter station code.",
        "error"
      );
      return false;
    }

    if (!formData.stationPassword) {
      showToast(
        "Please enter station password.",
        "error"
      );
      return false;
    }

    if (formData.stationPassword.length < 6) {
      showToast(
        "Station password must be at least 6 characters.",
        "error"
      );
      return false;
    }

    if (!formData.stationCategory) {
      showToast(
        "Please select station category.",
        "error"
      );
      return false;
    }

    if (!formData.street.trim()) {
      showToast(
        "Please enter street address.",
        "error"
      );
      return false;
    }

    if (!formData.city.trim()) {
      showToast(
        "Please enter city.",
        "error"
      );
      return false;
    }

    if (!formData.district.trim()) {
      showToast(
        "Please enter district.",
        "error"
      );
      return false;
    }

    if (!formData.state.trim()) {
      showToast(
        "Please enter state.",
        "error"
      );
      return false;
    }

    if (
      formData.latitude === "" ||
      formData.longitude === ""
    ) {
      showToast(
        "Please enter latitude and longitude or use current location.",
        "error"
      );
      return false;
    }

    const latitude =
      Number(formData.latitude);

    const longitude =
      Number(formData.longitude);

    if (
      Number.isNaN(latitude) ||
      latitude < -90 ||
      latitude > 90
    ) {
      showToast(
        "Please enter a valid latitude.",
        "error"
      );
      return false;
    }

    if (
      Number.isNaN(longitude) ||
      longitude < -180 ||
      longitude > 180
    ) {
      showToast(
        "Please enter a valid longitude.",
        "error"
      );
      return false;
    }

    return true;
  };

  // =========================================================
  // Submit
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // =======================================================
    // Get JWT
    // =======================================================

    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("adminToken");

    if (!token) {
      showToast(
        "Admin authentication token not found. Please login again.",
        "error"
      );

      setTimeout(() => {
        navigate("/admin-login");
      }, 1200);

      return;
    }

    setLoading(true);

    try {
      // =====================================================
      // Backend Payload
      // =====================================================

      const payload = {
        stationName:
          formData.stationName.trim(),

        stationCode:
          formData.stationCode
            .trim()
            .toUpperCase(),

        stationPassword:
          formData.stationPassword,

        stationCategory:
          formData.stationCategory,

        address: {
          street:
            formData.street.trim(),

          city:
            formData.city.trim(),

          district:
            formData.district.trim(),

          state:
            formData.state.trim(),

          pincode:
            formData.pincode.trim(),
        },

        coordinates: {
          latitude:
            Number(formData.latitude),

          longitude:
            Number(formData.longitude),
        },

        elevation:
          formData.elevation !== ""
            ? Number(formData.elevation)
            : null,
      };

      // =====================================================
      // API Request
      // =====================================================

      const response = await axios.post(
        `${API_URL}/stations/create`,
        payload,
        {
          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        showToast(
          response.data.message ||
            "Station created successfully.",
          "success"
        );

        // ===================================================
        // Reset Form
        // ===================================================

        setFormData({
          stationName: "",
          stationCode: "",
          stationPassword: "",
          stationCategory: "NSG-1",

          street: "",
          city: "",
          district: "",
          state: "",
          pincode: "",

          latitude: "",
          longitude: "",

          elevation: "",
        });

        // ===================================================
        // Redirect
        // ===================================================

        setTimeout(() => {
          navigate("/admin_main");
        }, 1500);
      } else {
        showToast(
          response.data.message ||
            "Failed to create station.",
          "error"
        );
      }
    } catch (error) {
      console.error(
        "Create Station Error:",
        error
      );

      const message =
        error?.response?.data?.message ||
        "Failed to create station.";

      // JWT expired / unauthorized
      if (
        error?.response?.status === 401 ||
        error?.response?.status === 403
      ) {
        showToast(
          "Your admin session has expired. Please login again.",
          "error"
        );

        localStorage.removeItem("token");
        localStorage.removeItem(
          "adminToken"
        );
        localStorage.removeItem("admin");

        setTimeout(() => {
          navigate("/admin-login");
        }, 1500);

        return;
      }

      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50">

      {/* =====================================================
          Background
      ====================================================== */}

      <motion.div
        animate={{
          x: [0, 35, -20, 0],
          y: [0, -25, 20, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute
          -left-32
          -top-32
          h-80
          w-80
          rounded-full
          bg-blue-300/30
          blur-3xl
        "
      />

      <motion.div
        animate={{
          x: [0, -30, 20, 0],
          y: [0, 30, -20, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute
          -bottom-40
          -right-32
          h-96
          w-96
          rounded-full
          bg-cyan-300/30
          blur-3xl
        "
      />

      {/* =====================================================
          Toast
      ====================================================== */}

      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />
      )}

      {/* =====================================================
          Main
      ====================================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          max-w-5xl
          px-4
          py-8
          sm:px-6
          lg:px-8
        "
      >

        {/* ===================================================
            Header
        ==================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: -30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
          }}
          className="mb-8 text-center"
        >

          <div
            className="
              mx-auto
              flex
              h-20
              w-20
              items-center
              justify-center
              rounded-3xl
              bg-gradient-to-br
              from-blue-600
              to-cyan-500
              text-white
              shadow-xl
            "
          >
            <Building2 size={38} />
          </div>

          <h1
            className="
              mt-5
              text-3xl
              font-bold
              text-slate-900
              sm:text-4xl
            "
          >
            Create Railway Station
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Add a new railway station to the
            Rail Nav system
          </p>

        </motion.div>

        {/* ===================================================
            Form Card
        ==================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 40,
            scale: 0.98,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          transition={{
            duration: 0.6,
          }}
          className="
            rounded-[2rem]
            border
            border-white/70
            bg-white/85
            p-5
            shadow-2xl
            backdrop-blur-xl
            sm:p-8
          "
        >

          <form
            onSubmit={handleSubmit}
            className="space-y-8"
          >

            {/* =================================================
                Basic Station Information
            ================================================== */}

            <section>

              <div className="mb-5 flex items-center gap-3">

                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    bg-blue-100
                    text-blue-600
                  "
                >
                  <Building2 size={20} />
                </div>

                <div>
                  <h2 className="font-bold text-slate-800">
                    Station Information
                  </h2>

                  <p className="text-xs text-slate-500">
                    Basic station details
                  </p>
                </div>

              </div>

              <div className="grid gap-5 md:grid-cols-2">

                {/* Station Name */}

                <InputField
                  label="Station Name"
                  name="stationName"
                  value={formData.stationName}
                  onChange={handleChange}
                  placeholder="e.g. Palani Railway Station"
                  icon={<Building2 size={18} />}
                  required
                />

                {/* Station Code */}

                <InputField
                  label="Station Code"
                  name="stationCode"
                  value={formData.stationCode}
                  onChange={handleChange}
                  placeholder="e.g. PLNI"
                  icon={<Map size={18} />}
                  required
                  uppercase
                />

                {/* Station Password */}

                <div>

                  <label
                    htmlFor="stationPassword"
                    className="
                      mb-2
                      block
                      text-sm
                      font-semibold
                      text-slate-700
                    "
                  >
                    Station Password
                  </label>

                  <div className="relative">

                    <Lock
                      size={18}
                      className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-slate-400
                      "
                    />

                    <input
                      id="stationPassword"
                      name="stationPassword"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={
                        formData.stationPassword
                      }
                      onChange={handleChange}
                      placeholder="Enter station password"
                      className="
                        w-full
                        rounded-xl
                        border
                        border-slate-200
                        bg-slate-50
                        py-3.5
                        pl-11
                        pr-12
                        text-sm
                        outline-none
                        transition
                        focus:border-blue-500
                        focus:bg-white
                        focus:ring-4
                        focus:ring-blue-500/10
                      "
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (prev) => !prev
                        )
                      }
                      className="
                        absolute
                        right-3
                        top-1/2
                        -translate-y-1/2
                        rounded-lg
                        p-1.5
                        text-slate-400
                        hover:bg-slate-100
                      "
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>

                  </div>

                </div>

                {/* Category */}

                <div>

                  <label
                    htmlFor="stationCategory"
                    className="
                      mb-2
                      block
                      text-sm
                      font-semibold
                      text-slate-700
                    "
                  >
                    Station Category
                  </label>

                  <select
                    id="stationCategory"
                    name="stationCategory"
                    value={
                      formData.stationCategory
                    }
                    onChange={handleChange}
                    className="
                      w-full
                      rounded-xl
                      border
                      border-slate-200
                      bg-slate-50
                      px-4
                      py-3.5
                      text-sm
                      outline-none
                      transition
                      focus:border-blue-500
                      focus:bg-white
                      focus:ring-4
                      focus:ring-blue-500/10
                    "
                  >

                    <optgroup label="NSG">
                      {[
                        "NSG-1",
                        "NSG-2",
                        "NSG-3",
                        "NSG-4",
                        "NSG-5",
                        "NSG-6",
                      ].map((item) => (
                        <option
                          key={item}
                          value={item}
                        >
                          {item}
                        </option>
                      ))}
                    </optgroup>

                    <optgroup label="HG">
                      {[
                        "HG-1",
                        "HG-2",
                        "HG-3",
                      ].map((item) => (
                        <option
                          key={item}
                          value={item}
                        >
                          {item}
                        </option>
                      ))}
                    </optgroup>

                  </select>

                </div>

              </div>

            </section>

            {/* =================================================
                Address
            ================================================== */}

            <section>

              <div className="mb-5 flex items-center gap-3">

                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    bg-cyan-100
                    text-cyan-600
                  "
                >
                  <MapPin size={20} />
                </div>

                <div>
                  <h2 className="font-bold text-slate-800">
                    Station Address
                  </h2>

                  <p className="text-xs text-slate-500">
                    Location and address details
                  </p>
                </div>

              </div>

              <div className="grid gap-5 md:grid-cols-2">

                <div className="md:col-span-2">

                  <InputField
                    label="Street"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    placeholder="Railway Feeder Road, Anna Nagar"
                    icon={<MapPin size={18} />}
                    required
                  />

                </div>

                <InputField
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Palani"
                  required
                />

                <InputField
                  label="District"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  placeholder="Dindigul"
                  required
                />

                <InputField
                  label="State"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Tamil Nadu"
                  required
                />

                <InputField
                  label="Pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="624618"
                  maxLength={6}
                  inputMode="numeric"
                />

              </div>

            </section>

            {/* =================================================
                Coordinates
            ================================================== */}

            <section>

              <div className="mb-5 flex items-center gap-3">

                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    bg-green-100
                    text-green-600
                  "
                >
                  <LocateFixed size={20} />
                </div>

                <div className="flex-1">

                  <h2 className="font-bold text-slate-800">
                    Station Coordinates
                  </h2>

                  <p className="text-xs text-slate-500">
                    Enter manually or detect your current
                    location
                  </p>

                </div>

              </div>

              {/* Current Location */}

              <motion.button
                type="button"
                onClick={getCurrentLocation}
                disabled={locationLoading}
                whileHover={
                  !locationLoading
                    ? { scale: 1.01 }
                    : {}
                }
                whileTap={
                  !locationLoading
                    ? { scale: 0.98 }
                    : {}
                }
                className="
                  mb-5
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-green-200
                  bg-green-50
                  px-5
                  py-3.5
                  text-sm
                  font-semibold
                  text-green-700
                  transition
                  hover:bg-green-100
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >

                {locationLoading ? (
                  <>
                    <Loader2
                      size={19}
                      className="animate-spin"
                    />

                    Detecting Current Location...
                  </>
                ) : (
                  <>
                    <LocateFixed size={19} />

                    Use Current Location
                  </>
                )}

              </motion.button>

              <div className="grid gap-5 md:grid-cols-2">

                {/* Latitude */}

                <div>

                  <label
                    htmlFor="latitude"
                    className="
                      mb-2
                      block
                      text-sm
                      font-semibold
                      text-slate-700
                    "
                  >
                    Latitude
                  </label>

                  <div className="relative">

                    <Navigation
                      size={18}
                      className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-slate-400
                      "
                    />

                    <input
                      id="latitude"
                      name="latitude"
                      type="number"
                      step="any"
                      value={formData.latitude}
                      onChange={handleChange}
                      placeholder="10.4583"
                      className="
                        w-full
                        rounded-xl
                        border
                        border-slate-200
                        bg-slate-50
                        py-3.5
                        pl-11
                        pr-4
                        text-sm
                        outline-none
                        transition
                        focus:border-blue-500
                        focus:bg-white
                        focus:ring-4
                        focus:ring-blue-500/10
                      "
                    />

                  </div>

                </div>

                {/* Longitude */}

                <div>

                  <label
                    htmlFor="longitude"
                    className="
                      mb-2
                      block
                      text-sm
                      font-semibold
                      text-slate-700
                    "
                  >
                    Longitude
                  </label>

                  <div className="relative">

                    <Navigation
                      size={18}
                      className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        rotate-90
                        text-slate-400
                      "
                    />

                    <input
                      id="longitude"
                      name="longitude"
                      type="number"
                      step="any"
                      value={formData.longitude}
                      onChange={handleChange}
                      placeholder="77.5209"
                      className="
                        w-full
                        rounded-xl
                        border
                        border-slate-200
                        bg-slate-50
                        py-3.5
                        pl-11
                        pr-4
                        text-sm
                        outline-none
                        transition
                        focus:border-blue-500
                        focus:bg-white
                        focus:ring-4
                        focus:ring-blue-500/10
                      "
                    />

                  </div>

                </div>

              </div>

              {/* Coordinate Preview */}

              {formData.latitude &&
                formData.longitude && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    className="
                      mt-5
                      flex
                      items-center
                      gap-3
                      rounded-2xl
                      border
                      border-blue-100
                      bg-blue-50
                      p-4
                    "
                  >

                    <MapPin
                      size={22}
                      className="shrink-0 text-blue-600"
                    />

                    <div>

                      <p className="text-xs text-blue-600">
                        Station Location
                      </p>

                      <p className="mt-1 text-sm font-bold text-slate-700">
                        {formData.latitude},{" "}
                        {formData.longitude}
                      </p>

                    </div>

                  </motion.div>
                )}

            </section>

            {/* =================================================
                Elevation
            ================================================== */}

            <section>

              <div className="mb-5 flex items-center gap-3">

                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    bg-purple-100
                    text-purple-600
                  "
                >
                  <Mountain size={20} />
                </div>

                <div>

                  <h2 className="font-bold text-slate-800">
                    Elevation
                  </h2>

                  <p className="text-xs text-slate-500">
                    Optional station elevation in meters
                  </p>

                </div>

              </div>

              <InputField
                label="Elevation (meters)"
                name="elevation"
                value={formData.elevation}
                onChange={handleChange}
                placeholder="e.g. 322"
                type="number"
                step="any"
                icon={<Mountain size={18} />}
              />

            </section>

            {/* =================================================
                Submit
            ================================================== */}

            <div className="border-t border-slate-200 pt-6">

              <div className="grid gap-3 sm:grid-cols-2">

                {/* Back */}

                <button
                  type="button"
                  onClick={() =>
                    navigate("/admin_main")
                  }
                  disabled={loading}
                  className="
                    flex
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    px-5
                    py-3.5
                    text-sm
                    font-semibold
                    text-slate-600
                    transition
                    hover:bg-slate-50
                    disabled:opacity-50
                  "
                >

                  <ArrowLeft size={19} />

                  Cancel
                </button>

                {/* Create */}

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={
                    !loading
                      ? { scale: 1.02 }
                      : {}
                  }
                  whileTap={
                    !loading
                      ? { scale: 0.98 }
                      : {}
                  }
                  className="
                    flex
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-gradient-to-r
                    from-blue-600
                    to-cyan-500
                    px-5
                    py-3.5
                    text-sm
                    font-bold
                    text-white
                    shadow-lg
                    shadow-blue-500/20
                    transition
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >

                  {loading ? (
                    <>
                      <Loader2
                        size={20}
                        className="animate-spin"
                      />

                      Creating Station...
                    </>
                  ) : (
                    <>
                      <Save size={20} />

                      Create Station
                    </>
                  )}

                </motion.button>

              </div>

            </div>

          </form>

        </motion.div>

      </div>
    </main>
  );
};

// =============================================================
// Reusable Input Component
// =============================================================

const InputField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  icon,
  required = false,
  maxLength,
  inputMode,
  step,
  uppercase = false,
}) => {
  return (
    <div>

      <label
        htmlFor={name}
        className="
          mb-2
          block
          text-sm
          font-semibold
          text-slate-700
        "
      >
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>

      <div className="relative">

        {icon && (
          <div
            className="
              pointer-events-none
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-slate-400
            "
          >
            {icon}
          </div>
        )}

        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          maxLength={maxLength}
          inputMode={inputMode}
          step={step}
          className={`
            w-full
            rounded-xl
            border
            border-slate-200
            bg-slate-50
            py-3.5
            ${icon ? "pl-11" : "pl-4"}
            pr-4
            text-sm
            outline-none
            transition
            focus:border-blue-500
            focus:bg-white
            focus:ring-4
            focus:ring-blue-500/10
            ${uppercase ? "uppercase" : ""}
          `}
        />

      </div>

    </div>
  );
};

export default StationCreate;