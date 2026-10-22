import React, { useState } from "react";
import axios from "axios";
import {
  Lock,
  Eye,
  EyeOff,
  Save,
  ShieldCheck,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const ChangeOfficerPassword = ({
  showToast,
  onSuccess,
}) => {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrent, setShowCurrent] =
    useState(false);

  const [showNew, setShowNew] =
    useState(false);

  const [showConfirm, setShowConfirm] =
    useState(false);

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const submit = async (e) => {
    e.preventDefault();

    if (
      !form.currentPassword ||
      !form.newPassword ||
      !form.confirmPassword
    ) {
      showToast?.(
        "Please fill all password fields",
        "error"
      );
      return;
    }

    if (form.newPassword.length < 6) {
      showToast?.(
        "New password must contain at least 6 characters",
        "error"
      );
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      showToast?.(
        "New password and confirm password do not match",
        "error"
      );
      return;
    }

    try {
      setLoading(true);

      const token =
        localStorage.getItem("officerToken") ||
        localStorage.getItem("token");

      const response = await axios.put(
        `${API_URL}/officers/change-password`,
        {
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        showToast?.(
          "Password changed successfully"
        );

        setForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

        onSuccess?.();
      } else {
        showToast?.(
          response.data.message ||
            "Unable to change password",
          "error"
        );
      }
    } catch (error) {
      console.error(
        "Change Password Error:",
        error
      );

      showToast?.(
        error.response?.data?.message ||
          "Failed to change password",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="max-w-2xl space-y-5"
    >
      <div className="rounded-2xl bg-slate-50 p-4">
        <div className="flex gap-3">
          <ShieldCheck className="shrink-0 text-slate-600" />

          <div>
            <p className="text-sm font-semibold">
              Password security
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Use a strong password containing a mixture
              of letters, numbers, and special characters.
            </p>
          </div>
        </div>
      </div>

      <PasswordInput
        label="Current Password"
        name="currentPassword"
        value={form.currentPassword}
        onChange={handleChange}
        visible={showCurrent}
        setVisible={setShowCurrent}
      />

      <PasswordInput
        label="New Password"
        name="newPassword"
        value={form.newPassword}
        onChange={handleChange}
        visible={showNew}
        setVisible={setShowNew}
      />

      <PasswordInput
        label="Confirm New Password"
        name="confirmPassword"
        value={form.confirmPassword}
        onChange={handleChange}
        visible={showConfirm}
        setVisible={setShowConfirm}
      />

      <button
        type="submit"
        disabled={loading}
        className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Save size={17} />

        {loading
          ? "Changing Password..."
          : "Change Password"}
      </button>
    </form>
  );
};

const PasswordInput = ({
  label,
  name,
  value,
  onChange,
  visible,
  setVisible,
}) => (
  <div>
    <label className="mb-2 block text-sm font-semibold text-slate-700">
      {label}
    </label>

    <div className="relative">
      <Lock
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
      />

      <input
        type={visible ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-12 text-sm outline-none transition focus:border-slate-400"
      />

      <button
        type="button"
        onClick={() => setVisible(!visible)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
      >
        {visible ? (
          <EyeOff size={18} />
        ) : (
          <Eye size={18} />
        )}
      </button>
    </div>
  </div>
);

export default ChangeOfficerPassword;