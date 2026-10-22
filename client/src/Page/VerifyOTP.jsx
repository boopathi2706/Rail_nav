import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  MailCheck,
  ShieldCheck,
  ArrowRight,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import OTPInput from "../components/auth/OTPInput";
import Toast from "../components/auth/Toast";
import { verifyOTP } from "../services/authService";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();

  /*
    Email comes from Register page:
    navigate("/verify-otp", {
      state: { email: formData.email }
    })
  */

  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });

  const showToast = (message, type) => {
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

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!email) {
      showToast(
        "Email address is missing. Please register again.",
        "error"
      );
      return;
    }

    if (otp.length !== 6) {
      showToast(
        "Please enter the complete 6-digit OTP.",
        "error"
      );
      return;
    }

    setIsLoading(true);

    try {
      const data = await verifyOTP(email, otp);

      if (data.success) {
        showToast(
          data.message ||
            "Email verified successfully!",
          "success"
        );

        // Navigate after toast is visible
        setTimeout(() => {
          navigate("/user_main", {
            replace: true,
          });
        }, 1200);
      } else {
        showToast(
          data.message || "OTP verification failed.",
          "error"
        );
      }
    } catch (error) {
      console.error("OTP Verification Error:", error);

      const message =
        error?.response?.data?.message ||
        "OTP verification failed. Please try again.";

      showToast(message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50">

      {/* Background blobs */}

      <motion.div
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -20, 30, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute -left-32 -top-32
          h-80 w-80
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
          absolute -bottom-32 -right-32
          h-96 w-96
          rounded-full
          bg-cyan-300/30
          blur-3xl
        "
      />

      {/* Toast */}

      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />
      )}

      {/* Main */}

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">

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
            w-full max-w-md
            rounded-[2rem]
            border border-white/70
            bg-white/80
            p-7
            shadow-2xl
            backdrop-blur-xl
            sm:p-10
          "
        >

          {/* Icon */}

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.2,
              type: "spring",
              stiffness: 180,
            }}
            className="
              mx-auto flex h-20 w-20
              items-center justify-center
              rounded-3xl
              bg-gradient-to-br
              from-blue-600
              to-cyan-500
              text-white
              shadow-xl
              shadow-blue-500/20
            "
          >
            <MailCheck size={38} />
          </motion.div>

          {/* Heading */}

          <div className="mt-7 text-center">

            <h1 className="text-3xl font-bold text-slate-900">
              Verify Your Email
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              We've sent a 6-digit verification code
              to your email address.
            </p>

          </div>

          {/* Email */}

          <div className="mt-6 rounded-2xl bg-blue-50 p-4 text-center">

            <div className="flex items-center justify-center gap-2 text-blue-700">

              <MailCheck size={18} />

              <span className="break-all text-sm font-semibold">
                {email || "Email not available"}
              </span>

            </div>

          </div>

          {/* Form */}

          <form
            onSubmit={handleVerify}
            className="mt-8"
          >

            <label className="mb-4 block text-center text-sm font-semibold text-slate-700">
              Enter verification code
            </label>

            <OTPInput
              otp={otp}
              setOtp={setOtp}
            />

            {/* Verify */}

            <motion.button
              type="submit"
              disabled={isLoading || otp.length !== 6}
              whileHover={
                !isLoading && otp.length === 6
                  ? { scale: 1.02 }
                  : {}
              }
              whileTap={
                !isLoading && otp.length === 6
                  ? { scale: 0.98 }
                  : {}
              }
              className="
                mt-8 flex w-full
                items-center justify-center
                gap-2
                rounded-xl
                bg-gradient-to-r
                from-blue-600
                to-cyan-500
                px-5 py-3.5
                font-semibold text-white
                shadow-lg
                shadow-blue-500/20
                transition-all duration-300
                hover:from-blue-700
                hover:to-cyan-600
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {isLoading ? (
                <>
                  <Loader2
                    size={20}
                    className="animate-spin"
                  />
                  Verifying...
                </>
              ) : (
                <>
                  Verify Email
                  <ArrowRight size={20} />
                </>
              )}
            </motion.button>

          </form>

          {/* Security */}

          <div className="mt-7 flex items-start gap-3 rounded-2xl bg-slate-50 p-4">

            <ShieldCheck
              size={20}
              className="mt-0.5 shrink-0 text-green-600"
            />

            <p className="text-xs leading-5 text-slate-500">
              Your verification code is temporary.
              Never share your OTP with anyone.
            </p>

          </div>

          {/* Resend placeholder */}

          <button
            type="button"
            onClick={() =>
              showToast(
                "Please use the registration page to request a new OTP.",
                "error"
              )
            }
            className="
              mx-auto mt-6
              flex items-center gap-2
              text-sm font-semibold
              text-blue-600
              transition
              hover:text-blue-800
            "
          >
            <RefreshCw size={16} />
            Didn't receive the code?
          </button>

        </motion.div>

      </div>
    </main>
  );
};

export default VerifyOTP;