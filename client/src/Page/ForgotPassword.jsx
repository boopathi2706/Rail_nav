import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Mail,
  Send,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Toast from "../components/auth/Toast";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // ================= TOAST STATE =================

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

  // ================= SUBMIT =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!email.trim()) {
      showToast("Please enter your email address.", "error");
      return;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      showToast("Please enter a valid email address.", "error");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/users/forgot-password`,
        {
          email: email.trim().toLowerCase(),
        }
      );

      if (response.data.success) {
        showToast(
          response.data.message ||
            "OTP has been sent to your email.",
          "success"
        );

        // Save email for next page
        sessionStorage.setItem(
          "forgotPasswordEmail",
          email.trim().toLowerCase()
        );

        // Navigate after toast
        setTimeout(() => {
          navigate("/verify-forgot-password");
        }, 1200);
      } else {
        showToast(
          response.data.message ||
            "Unable to send OTP.",
          "error"
        );
      }
    } catch (error) {
      console.error(
        "Forgot Password Error:",
        error
      );

      const message =
        error?.response?.data?.message ||
        "Failed to send OTP. Please try again.";

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
            <Mail size={38} />
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
              Forgot Password?
            </h1>

            <p
              className="
                mt-3
                text-sm
                leading-6
                text-slate-500
              "
            >
              Enter your registered email address.
              We'll send you a verification OTP to
              reset your password.
            </p>

          </div>

          {/* ================= FORM ================= */}

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >

            {/* EMAIL */}

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
                Email Address
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
                  placeholder="Enter your email"
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
                    focus:border-blue-500
                    focus:bg-white
                    focus:ring-4
                    focus:ring-blue-500/10
                  "
                />

              </div>

            </div>

            {/* SUBMIT */}

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

                  Sending OTP...
                </>
              ) : (
                <>
                  Send OTP
                  <Send size={19} />
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
              Your password reset request is protected
              with email verification.
            </p>

          </div>

          {/* ================= BACK TO LOGIN ================= */}

          <button
            type="button"
            onClick={() => navigate("/login")}
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

            Back to Login
          </button>

        </motion.div>

      </div>
    </main>
  );
};

export default ForgotPassword;