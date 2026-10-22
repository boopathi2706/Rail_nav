import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  LogIn,
  Loader2,
  MapPin,
  TrainFront,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Toast from "../components/auth/Toast";

const StationLogin = () => {
  const navigate = useNavigate();

  const [stationCode, setStationCode] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // ------------------------------------------
  // Toast
  // ------------------------------------------

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

  // ------------------------------------------
  // API URL
  // ------------------------------------------

  const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:8000/api";

  // ------------------------------------------
  // Login
  // ------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!stationCode.trim()) {
      showToast("Please enter station code", "error");
      return;
    }

    if (!password) {
      showToast("Please enter station password", "error");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/stations/login`,
        {
          stationCode: stationCode.trim().toUpperCase(),
          password,
        }
      );

      if (response.data.success) {
        const { token, station } = response.data.data;

        // ------------------------------------------
        // Store JWT
        // ------------------------------------------

        localStorage.setItem(
          "stationToken",
          token
        );

        // ------------------------------------------
        // Store station information
        // ------------------------------------------

        localStorage.setItem(
          "station",
          JSON.stringify(station)
        );

        showToast(
          response.data.message ||
            "Station login successful",
          "success"
        );

        // ------------------------------------------
        // Redirect
        // ------------------------------------------

        setTimeout(() => {
          navigate("/station-main");
        }, 1200);
      } else {
        showToast(
          response.data.message ||
            "Station login failed",
          "error"
        );
      }
    } catch (error) {
      console.error(
        "Station Login Error:",
        error
      );

      const message =
        error?.response?.data?.message ||
        "Unable to login. Please try again.";

      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50">

      {/* =====================================================
          Background Animation
      ====================================================== */}

      <motion.div
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -30, 20, 0],
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
          Main Container
      ====================================================== */}

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

        {/* =====================================================
            Login Card
        ====================================================== */}

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
            bg-white/85
            p-7
            shadow-2xl
            backdrop-blur-xl
            sm:p-10
          "
        >

          {/* =================================================
              Station Icon
          ================================================== */}

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
              shadow-blue-500/20
            "
          >
            <TrainFront size={38} />
          </motion.div>

          {/* =================================================
              Heading
          ================================================== */}

          <div className="mt-7 text-center">

            <h1
              className="
                text-3xl
                font-bold
                text-slate-900
              "
            >
              Station Login
            </h1>

            <p
              className="
                mt-3
                text-sm
                leading-6
                text-slate-500
              "
            >
              Login to manage your railway
              station and navigation services.
            </p>

          </div>

          {/* =================================================
              Station Badge
          ================================================== */}

          <div
            className="
              mt-6
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
              size={21}
              className="shrink-0 text-blue-600"
            />

            <div>

              <p
                className="
                  text-xs
                  font-medium
                  text-blue-600
                "
              >
                Railway Station Portal
              </p>

              <p
                className="
                  mt-0.5
                  text-sm
                  font-semibold
                  text-slate-700
                "
              >
                Secure Station Access
              </p>

            </div>

          </div>

          {/* =================================================
              Form
          ================================================== */}

          <form
            onSubmit={handleSubmit}
            className="mt-7 space-y-5"
          >

            {/* Station Code */}

            <div>

              <label
                htmlFor="stationCode"
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

                <MapPin
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
                  id="stationCode"
                  type="text"
                  value={stationCode}
                  onChange={(e) =>
                    setStationCode(
                      e.target.value
                        .toUpperCase()
                        .replace(/\s/g, "")
                    )
                  }
                  placeholder="Enter station code"
                  autoComplete="username"
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
                    font-semibold
                    uppercase
                    tracking-wider
                    text-slate-800
                    outline-none
                    transition-all
                    placeholder:normal-case
                    placeholder:tracking-normal
                    placeholder:font-normal
                    focus:border-blue-500
                    focus:bg-white
                    focus:ring-4
                    focus:ring-blue-500/10
                  "
                />

              </div>

              <p className="mt-2 text-xs text-slate-400">
                Example: CBE, POY, PLNI
              </p>

            </div>

            {/* Password */}

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
                  placeholder="Enter station password"
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
                    hover:text-slate-700
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

            {/* =================================================
                Login Button
            ================================================== */}

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
                transition-all
                hover:shadow-xl
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

                  Login to Station
                </>
              )}

            </motion.button>

          </form>

          {/* =================================================
              Security Information
          ================================================== */}

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

            <LockKeyhole
              size={19}
              className="
                mt-0.5
                shrink-0
                text-green-600
              "
            />

            <p
              className="
                text-xs
                leading-5
                text-slate-500
              "
            >
              Your station credentials are protected
              using secure authentication and JWT
              based access.
            </p>

          </div>

          {/* =================================================
              Footer
          ================================================== */}

          <p
            className="
              mt-6
              text-center
              text-xs
              text-slate-400
            "
          >
            Railway Station Management System
          </p>

        </motion.div>

      </div>
    </main>
  );
};

export default StationLogin;