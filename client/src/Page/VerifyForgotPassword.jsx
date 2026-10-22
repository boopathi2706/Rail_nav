import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Toast from "../components/auth/Toast";

const VerifyForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);

  // ================= TOAST =================

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

  // ================= API =================

  const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:8000/api";

  // ================= GET EMAIL =================

  useEffect(() => {
    const savedEmail =
      sessionStorage.getItem("forgotPasswordEmail");

    if (!savedEmail) {
      showToast(
        "Please enter your email first.",
        "error"
      );

      setTimeout(() => {
        navigate("/forgot-password");
      }, 1000);

      return;
    }

    setEmail(savedEmail);
  }, [navigate]);

  // ================= OTP =================

  const handleOtpChange = (index, value) => {
    // Only numbers
    const numericValue = value
      .replace(/\D/g, "")
      .slice(0, 1);

    const otpArray = otp.split("");

    otpArray[index] = numericValue;

    const newOtp = otpArray
      .join("")
      .slice(0, 6);

    setOtp(newOtp);

    // Move to next box
    if (numericValue && index < 5) {
      document
        .getElementById(`otp-${index + 1}`)
        ?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    // Backspace
    if (e.key === "Backspace") {
      if (otp[index]) {
        const otpArray = otp.split("");

        otpArray[index] = "";

        setOtp(otpArray.join(""));

        return;
      }

      // Move to previous box
      if (index > 0) {
        document
          .getElementById(`otp-${index - 1}`)
          ?.focus();
      }
    }

    // Arrow Left
    if (
      e.key === "ArrowLeft" &&
      index > 0
    ) {
      document
        .getElementById(`otp-${index - 1}`)
        ?.focus();
    }

    // Arrow Right
    if (
      e.key === "ArrowRight" &&
      index < 5
    ) {
      document
        .getElementById(`otp-${index + 1}`)
        ?.focus();
    }
  };

  // ================= OTP PASTE =================

  const handleOtpPaste = (e) => {
    e.preventDefault();

    const pastedOtp = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pastedOtp) return;

    setOtp(pastedOtp);

    // Focus last entered box
    const focusIndex =
      Math.min(pastedOtp.length - 1, 5);

    document
      .getElementById(`otp-${focusIndex}`)
      ?.focus();
  };

  // ================= SUBMIT =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Email
    if (!email) {
      showToast(
        "Email information is missing.",
        "error"
      );

      return;
    }

    // OTP
    if (!otp) {
      showToast(
        "Please enter the OTP.",
        "error"
      );

      return;
    }

    if (otp.length !== 6) {
      showToast(
        "OTP must contain 6 digits.",
        "error"
      );

      return;
    }

    // Password
    if (!newPassword) {
      showToast(
        "Please enter your new password.",
        "error"
      );

      return;
    }

    if (newPassword.length < 6) {
      showToast(
        "Password must contain at least 6 characters.",
        "error"
      );

      return;
    }

    // Confirm password
    if (!confirmPassword) {
      showToast(
        "Please confirm your password.",
        "error"
      );

      return;
    }

    if (newPassword !== confirmPassword) {
      showToast(
        "Passwords do not match.",
        "error"
      );

      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/users/verify-forgot-password`,
        {
          email,
          otp,
          newPassword,
        }
      );

      if (response.data.success) {
        showToast(
          response.data.message ||
            "Password changed successfully!",
          "success"
        );

        // Remove saved email
        sessionStorage.removeItem(
          "forgotPasswordEmail"
        );

        // Navigate to login
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        showToast(
          response.data.message ||
            "Password reset failed.",
          "error"
        );
      }
    } catch (error) {
      console.error(
        "Verify Forgot Password Error:",
        error
      );

      const message =
        error?.response?.data?.message ||
        "Invalid OTP or unable to change password.";

      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  // ================= UI =================

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50">

      {/* ================= BACKGROUND ================= */}

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

      {/* ================= TOAST ================= */}

      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />
      )}

      {/* ================= CONTENT ================= */}

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

          {/* ================= ICON ================= */}

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
            <KeyRound size={38} />
          </motion.div>

          {/* ================= HEADING ================= */}

          <div className="mt-7 text-center">

            <h1
              className="
                text-3xl
                font-bold
                text-slate-900
              "
            >
              Reset Password
            </h1>

            <p
              className="
                mt-3
                text-sm
                leading-6
                text-slate-500
              "
            >
              Enter the OTP sent to your email
              and create your new password.
            </p>

          </div>

          {/* ================= EMAIL ================= */}

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

            <Mail
              size={20}
              className="shrink-0 text-blue-600"
            />

            <div className="min-w-0">

              <p
                className="
                  text-xs
                  text-blue-600
                "
              >
                OTP sent to
              </p>

              <p
                className="
                  truncate
                  text-sm
                  font-semibold
                  text-slate-700
                "
              >
                {email}
              </p>

            </div>

          </div>

          {/* ================= FORM ================= */}

          <form
            onSubmit={handleSubmit}
            className="mt-7 space-y-5"
          >

            {/* ================= OTP ================= */}

            <div>

              <label
                htmlFor="otp-0"
                className="
                  mb-2
                  block
                  text-sm
                  font-semibold
                  text-slate-700
                "
              >
                Verification OTP
              </label>

              <div className="flex justify-between gap-2 sm:gap-3">

                {[0, 1, 2, 3, 4, 5].map(
                  (index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      autoComplete={
                        index === 0
                          ? "one-time-code"
                          : "off"
                      }
                      maxLength={1}
                      value={
                        otp[index] || ""
                      }
                      onChange={(e) =>
                        handleOtpChange(
                          index,
                          e.target.value
                        )
                      }
                      onKeyDown={(e) =>
                        handleOtpKeyDown(
                          index,
                          e
                        )
                      }
                      onPaste={
                        index === 0
                          ? handleOtpPaste
                          : undefined
                      }
                      className="
                        h-14
                        w-11
                        rounded-xl
                        border
                        border-slate-200
                        bg-slate-50
                        text-center
                        text-xl
                        font-bold
                        text-slate-800
                        outline-none
                        transition-all
                        focus:border-blue-500
                        focus:bg-white
                        focus:ring-4
                        focus:ring-blue-500/10
                        sm:h-16
                        sm:w-14
                      "
                    />
                  )
                )}

              </div>

              <p className="mt-2 text-xs text-slate-400">
                OTP is valid for 10 minutes.
              </p>

            </div>

            {/* ================= NEW PASSWORD ================= */}

            <div>

              <label
                htmlFor="newPassword"
                className="
                  mb-2
                  block
                  text-sm
                  font-semibold
                  text-slate-700
                "
              >
                New Password
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
                  id="newPassword"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={newPassword}
                  onChange={(e) =>
                    setNewPassword(
                      e.target.value
                    )
                  }
                  placeholder="Enter new password"
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

            {/* ================= CONFIRM PASSWORD ================= */}

            <div>

              <label
                htmlFor="confirmPassword"
                className="
                  mb-2
                  block
                  text-sm
                  font-semibold
                  text-slate-700
                "
              >
                Confirm Password
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
                  id="confirmPassword"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                  placeholder="Confirm new password"
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
                    setShowConfirmPassword(
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
                  {showConfirmPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>

              </div>

            </div>

            {/* ================= SUBMIT ================= */}

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

                  Resetting Password...
                </>
              ) : (
                <>
                  Reset Password

                  <CheckCircle2 size={20} />
                </>
              )}

            </motion.button>

          </form>

          {/* ================= SECURITY ================= */}

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

            <p
              className="
                text-xs
                leading-5
                text-slate-500
              "
            >
              Your new password will be securely
              encrypted before it is stored.
            </p>

          </div>

          {/* ================= BACK ================= */}

          <button
            type="button"
            onClick={() =>
              navigate("/forgot-password")
            }
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

            Change Email
          </button>

        </motion.div>

      </div>
    </main>
  );
};

export default VerifyForgotPassword;