import React, { useState } from "react";
import {
  ArrowLeft,
  Lock,
  Mail,
  ShieldCheck,
  Loader2,
} from "lucide-react";

import {
  requestPasswordChange,
  verifyPasswordChange,
} from "../../services/userApi";

import Toast from "../auth/Toast";

const ChangeUserPassword = ({
  onClose,
  onSuccess,
}) => {
  const [step, setStep] = useState("password");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });

  const requestOtp = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      setToast({
        message:
          "Password must be at least 6 characters",
        type: "error",
      });
      return;
    }

    if (password !== confirmPassword) {
      setToast({
        message: "Passwords do not match",
        type: "error",
      });
      return;
    }

    try {
      setLoading(true);

      const response =
        await requestPasswordChange(password);

      if (response?.success === false) {
        throw new Error(
          response.message ||
            "Failed to request password change"
        );
      }

      setToast({
        message:
          response?.message ||
          "OTP sent to your email",
        type: "success",
      });

      setStep("otp");
    } catch (error) {
      setToast({
        message:
          error?.response?.data?.message ||
          error?.message ||
          "Failed to send OTP",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      setToast({
        message: "Please enter the 6-digit OTP",
        type: "error",
      });
      return;
    }

    try {
      setLoading(true);

      const response =
        await verifyPasswordChange(otp);

      if (response?.success === false) {
        throw new Error(
          response.message ||
            "Invalid OTP"
        );
      }

      onSuccess?.(
        response?.message ||
          "Password changed successfully"
      );
    } catch (error) {
      setToast({
        message:
          error?.response?.data?.message ||
          error?.message ||
          "OTP verification failed",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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

      <div className="mx-auto max-w-lg">

        <button
          type="button"
          onClick={onClose}
          className="mb-5 flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-2 text-sm font-bold hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
        >
          <ArrowLeft size={17} />
          Back
        </button>

        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">

          <div className="mb-6 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30">
              {step === "password" ? (
                <Lock size={26} />
              ) : (
                <ShieldCheck size={26} />
              )}
            </div>

            <h2 className="mt-4 text-xl font-black text-gray-900 dark:text-white">
              {step === "password"
                ? "Change Password"
                : "Verify OTP"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {step === "password"
                ? "Create a new password for your account."
                : "Enter the OTP sent to your registered email."}
            </p>

          </div>

          {step === "password" ? (
            <form
              onSubmit={requestOtp}
              className="space-y-5"
            >

              <PasswordInput
                label="New Password"
                value={password}
                onChange={setPassword}
              />

              <PasswordInput
                label="Confirm Password"
                value={confirmPassword}
                onChange={setConfirmPassword}
              />

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                    Sending OTP...
                  </>
                ) : (
                  <>
                    <Mail size={18} />
                    Send OTP
                  </>
                )}
              </button>

            </form>
          ) : (
            <form
              onSubmit={verifyOtp}
              className="space-y-5"
            >

              <div>
                <label className="mb-2 block text-sm font-bold">
                  6-Digit OTP
                </label>

                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(e) =>
                    setOtp(
                      e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 6)
                    )
                  }
                  placeholder="Enter OTP"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-center text-2xl font-black tracking-[0.5em] outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-bold text-white hover:bg-green-700 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                    Verifying...
                  </>
                ) : (
                  <>
                    <ShieldCheck size={18} />
                    Verify & Change Password
                  </>
                )}
              </button>

            </form>
          )}

        </div>
      </div>
    </>
  );
};

const PasswordInput = ({
  label,
  value,
  onChange,
}) => (
  <div>

    <label className="mb-2 block text-sm font-bold">
      {label}
    </label>

    <input
      type="password"
      value={value}
      onChange={(e) =>
        onChange(e.target.value)
      }
      placeholder={label}
      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950"
    />

  </div>
);

export default ChangeUserPassword;