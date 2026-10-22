import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  LogIn,
  ShieldCheck,
  Loader2,
  TrainFront,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Toast from "../components/auth/Toast";

const OfficerLogin = () => {
  const navigate = useNavigate();

  // ==============================
  // Form State
  // ==============================

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);

  // ==============================
  // Toast State
  // ==============================

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

  // ==============================
  // API URL
  // ==============================

  const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:8000/api";

  // ==============================
  // Login
  // ==============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ------------------------------
    // Validation
    // ------------------------------

    if (!email.trim()) {
      showToast(
        "Please enter your email.",
        "error"
      );
      return;
    }

    if (!password) {
      showToast(
        "Please enter your password.",
        "error"
      );
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/officers/login`,
        {
          email: email.trim(),
          password,
        }
      );

      // ------------------------------
      // Success
      // ------------------------------

      if (response.data.success) {
        const { token, officer } =
          response.data.data;

        // Save officer authentication
        localStorage.setItem(
          "officerToken",
          token
        );

        // Save officer information
        localStorage.setItem(
          "officerData",
          JSON.stringify(officer)
        );

        showToast(
          response.data.message ||
            "Officer login successful",
          "success"
        );

        // Redirect
        setTimeout(() => {
          navigate("/officer-main");
        }, 1200);
      } else {
        showToast(
          response.data.message ||
            "Officer login failed.",
          "error"
        );
      }
    } catch (error) {
      console.error(
        "Officer Login Error:",
        error
      );

      const message =
        error?.response?.data?.message ||
        "Invalid email or password.";

      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // UI
  // ==============================

  return (
    <main
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-slate-50
      "
    >

      {/* ================================= */}
      {/* Background Animation */}
      {/* ================================= */}

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

      {/* ================================= */}
      {/* Toast */}
      {/* ================================= */}

      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />
      )}

      {/* ================================= */}
      {/* Main Container */}
      {/* ================================= */}

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

        {/* ================================= */}
        {/* Login Card */}
        {/* ================================= */}

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
            max-w-md
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

          {/* ================================= */}
          {/* Officer Icon */}
          {/* ================================= */}

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
            <TrainFront size={38} />
          </motion.div>

          {/* ================================= */}
          {/* Heading */}
          {/* ================================= */}

          <div className="mt-7 text-center">

            <h1
              className="
                text-3xl
                font-bold
                text-slate-900
              "
            >
              Officer Login
            </h1>

            <p
              className="
                mt-3
                text-sm
                leading-6
                text-slate-500
              "
            >
              Sign in to access your railway
              officer dashboard.
            </p>

          </div>

          {/* ================================= */}
          {/* Form */}
          {/* ================================= */}

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >

            {/* ================================= */}
            {/* Email */}
            {/* ================================= */}

            <div>

              <label
                htmlFor="email"
                className="
                  mb-2
                  block
                  text-sm
                  font-semibold
                  text-slate-700
                "
              >
                Officer Email
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
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="Enter officer email"
                  autoComplete="email"
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
                    text-slate-800
                    outline-none
                    transition-all
                    placeholder:text-slate-400
                    focus:border-blue-500
                    focus:bg-white
                    focus:ring-4
                    focus:ring-blue-500/10
                  "
                />

              </div>

            </div>

            {/* ================================= */}
            {/* Password */}
            {/* ================================= */}

            <div>

              <label
                htmlFor="password"
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

                <LockKeyhole
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
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Enter password"
                  autoComplete="current-password"
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
                    text-slate-800
                    outline-none
                    transition-all
                    placeholder:text-slate-400
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
                    transition
                    hover:bg-slate-100
                    hover:text-slate-600
                  "
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>

              </div>

            </div>

            {/* ================================= */}
            {/* Login Button */}
            {/* ================================= */}

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

                  Signing in...
                </>
              ) : (
                <>
                  <LogIn size={20} />

                  Officer Login
                </>
              )}

            </motion.button>

          </form>

          {/* ================================= */}
          {/* Security Information */}
          {/* ================================= */}

          <div
            className="
              mt-6
              flex
              items-start
              gap-3
              rounded-2xl
              bg-slate-50
              p-4
            "
          >

            <ShieldCheck
              size={20}
              className="
                mt-0.5
                shrink-0
                text-green-600
              "
            />

            <div>

              <p
                className="
                  text-sm
                  font-semibold
                  text-slate-700
                "
              >
                Secure Officer Access
              </p>

              <p
                className="
                  mt-1
                  text-xs
                  leading-5
                  text-slate-500
                "
              >
                Your officer account is protected
                using secure authentication and
                encrypted credentials.
              </p>

            </div>

          </div>

          {/* ================================= */}
          {/* Footer */}
          {/* ================================= */}

          <p
            className="
              mt-6
              text-center
              text-xs
              text-slate-400
            "
          >
            Rail Nav • Railway Officer Portal
          </p>

        </motion.div>

      </div>
    </main>
  );
};

export default OfficerLogin;