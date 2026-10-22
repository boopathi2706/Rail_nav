import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  UserPlus,
  User,
  Mail,
  Phone,
  Lock,
  Building2,
  ShieldCheck,
  Eye,
  EyeOff,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Toast from "../components/auth/Toast";

const OfficerCreate = () => {
  const navigate = useNavigate();

  const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:8000/api";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    officerType: "",
    password: "",
    phoneNumber: "",
    stationCode: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      name,
      email,
      officerType,
      password,
      phoneNumber,
      stationCode,
    } = formData;

    // -----------------------------
    // Frontend validation
    // -----------------------------

    if (
      !name ||
      !email ||
      !officerType ||
      !password ||
      !phoneNumber ||
      !stationCode
    ) {
      showToast(
        "Please fill all officer details.",
        "error"
      );
      return;
    }

    if (password.length < 6) {
      showToast(
        "Password must be at least 6 characters.",
        "error"
      );
      return;
    }

    if (!/^\d{10}$/.test(phoneNumber)) {
      showToast(
        "Phone number must contain 10 digits.",
        "error"
      );
      return;
    }

    // -----------------------------
    // Get JWT from localStorage
    // -----------------------------

    const token = localStorage.getItem("token");

    if (!token) {
      showToast(
        "Authentication required. Please login again.",
        "error"
      );

      setTimeout(() => {
        navigate("/officer-login");
      }, 1200);

      return;
    }

    setLoading(true);

    try {
      // -----------------------------
      // API Request
      // -----------------------------

      const response = await axios.post(
        `${API_URL}/officers/create_officers`,
        {
          name: name.trim(),
          email: email.toLowerCase().trim(),
          officerType: officerType.toLowerCase(),
          password,
          phoneNumber: phoneNumber.trim(),
          stationCode: stationCode.toUpperCase().trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        showToast(
          response.data.message ||
            "Officer created successfully.",
          "success"
        );

        // Clear form
        setFormData({
          name: "",
          email: "",
          officerType: "",
          password: "",
          phoneNumber: "",
          stationCode: "",
        });
      } else {
        showToast(
          response.data.message ||
            "Failed to create officer.",
          "error"
        );
      }
    } catch (error) {
      console.error(
        "Create Officer Error:",
        error
      );

      // JWT expired / unauthorized
      if (error?.response?.status === 401) {
        showToast(
          "Session expired. Please login again.",
          "error"
        );

        localStorage.removeItem("token");

        setTimeout(() => {
          navigate("/officer-login");
        }, 1500);

        return;
      }

      const message =
        error?.response?.data?.message ||
        "Failed to create officer.";

      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50">

      {/* ================= Background ================= */}

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

      {/* ================= Toast ================= */}

      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />
      )}

      {/* ================= Main ================= */}

      <div
        className="
          relative
          z-10
          flex
          min-h-screen
          items-center
          justify-center
          px-4
          py-10
        "
      >

        <motion.div
          initial={{
            opacity: 0,
            y: 40,
            scale: 0.96,
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
            w-full
            max-w-2xl
            rounded-[2rem]
            border
            border-white/70
            bg-white/80
            p-7
            shadow-2xl
            backdrop-blur-xl
            sm:p-10
          "
        >

          {/* ================= Header ================= */}

          <div className="text-center">

            <motion.div
              initial={{
                scale: 0,
                rotate: -20,
              }}
              animate={{
                scale: 1,
                rotate: 0,
              }}
              transition={{
                delay: 0.2,
                type: "spring",
                stiffness: 180,
              }}
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
              <UserPlus size={38} />
            </motion.div>

            <h1
              className="
                mt-6
                text-3xl
                font-bold
                text-slate-900
              "
            >
              Create Officer
            </h1>

            <p
              className="
                mt-2
                text-sm
                text-slate-500
              "
            >
              Add a new railway station officer
            </p>

          </div>

          {/* ================= Form ================= */}

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >

            {/* Name + Email */}

            <div className="grid gap-5 md:grid-cols-2">

              {/* Name */}

              <div>

                <label
                  className="
                    mb-2
                    block
                    text-sm
                    font-semibold
                    text-slate-700
                  "
                >
                  Officer Name
                </label>

                <div className="relative">

                  <User
                    size={19}
                    className="
                      pointer-events-none
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-slate-400
                    "
                  />

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter officer name"
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

              {/* Email */}

              <div>

                <label
                  className="
                    mb-2
                    block
                    text-sm
                    font-semibold
                    text-slate-700
                  "
                >
                  Email
                </label>

                <div className="relative">

                  <Mail
                    size={19}
                    className="
                      pointer-events-none
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-slate-400
                    "
                  />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="officer@example.com"
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

            {/* Phone + Officer Type */}

            <div className="grid gap-5 md:grid-cols-2">

              {/* Phone */}

              <div>

                <label
                  className="
                    mb-2
                    block
                    text-sm
                    font-semibold
                    text-slate-700
                  "
                >
                  Phone Number
                </label>

                <div className="relative">

                  <Phone
                    size={19}
                    className="
                      pointer-events-none
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-slate-400
                    "
                  />

                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        phoneNumber: e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 10),
                      }))
                    }
                    placeholder="9876543210"
                    maxLength={10}
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

              {/* Officer Type */}

              <div>

                <label
                  className="
                    mb-2
                    block
                    text-sm
                    font-semibold
                    text-slate-700
                  "
                >
                  Officer Type
                </label>

                <div className="relative">

                  <ShieldCheck
                    size={19}
                    className="
                      pointer-events-none
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-slate-400
                    "
                  />

                  <select
                    name="officerType"
                    value={formData.officerType}
                    onChange={handleChange}
                    className="
                      w-full
                      appearance-none
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

            </div>

            {/* Password + Station Code */}

            <div className="grid gap-5 md:grid-cols-2">

              {/* Password */}

              <div>

                <label
                  className="
                    mb-2
                    block
                    text-sm
                    font-semibold
                    text-slate-700
                  "
                >
                  Password
                </label>

                <div className="relative">

                  <Lock
                    size={19}
                    className="
                      pointer-events-none
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-slate-400
                    "
                  />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Minimum 6 characters"
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
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>

                </div>

              </div>

              {/* Station Code */}

              <div>

                <label
                  className="
                    mb-2
                    block
                    text-sm
                    font-semibold
                    text-slate-700
                  "
                >
                  Station Code
                </label>

                <div className="relative">

                  <Building2
                    size={19}
                    className="
                      pointer-events-none
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-slate-400
                    "
                  />

                  <input
                    type="text"
                    name="stationCode"
                    value={formData.stationCode}
                    onChange={handleChange}
                    placeholder="Example: PLNI"
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
                      uppercase
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

            {/* Submit */}

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
                mt-3
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-gradient-to-r
                from-blue-600
                to-cyan-500
                px-5
                py-3.5
                font-semibold
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

                  Creating Officer...
                </>
              ) : (
                <>
                  <UserPlus size={20} />

                  Create Officer
                </>
              )}

            </motion.button>

          </form>

          {/* ================= Back ================= */}

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="
              mx-auto
              mt-6
              flex
              items-center
              gap-2
              text-sm
              font-semibold
              text-slate-500
              transition
              hover:text-blue-600
            "
          >
            <ArrowLeft size={17} />

            Back
          </button>

        </motion.div>

      </div>
    </main>
  );
};

export default OfficerCreate;