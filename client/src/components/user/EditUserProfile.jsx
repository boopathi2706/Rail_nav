import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Save,
  User,
  Mail,
  Phone,
  Loader2,
} from "lucide-react";

import {
  updateUserProfile,
} from "../../services/userApi";

import Toast from "../auth/Toast";

const EditUserProfile = ({
  user,
  onClose,
  onUpdated,
}) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
  });

  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });

  useEffect(() => {
    if (!user) return;

    setForm({
      name: user.name || "",
      email: user.email || "",
      phoneNumber: user.phoneNumber || "",
    });
  }, [user]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      setToast({
        message: "Name is required",
        type: "error",
      });
      return;
    }

    if (!form.email.trim()) {
      setToast({
        message: "Email is required",
        type: "error",
      });
      return;
    }

    if (!form.phoneNumber.trim()) {
      setToast({
        message: "Phone number is required",
        type: "error",
      });
      return;
    }

    try {
      setLoading(true);

      const response =
        await updateUserProfile(form);

      if (response?.success === false) {
        throw new Error(
          response.message ||
            "Failed to update profile"
        );
      }

      const updatedUser =
        response?.data || {
          ...user,
          ...form,
        };

      onUpdated?.(
        updatedUser,
        response?.message ||
          "Profile updated successfully"
      );
    } catch (error) {
      setToast({
        message:
          error?.response?.data?.message ||
          error?.message ||
          "Failed to update profile",
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

      <div className="mx-auto max-w-2xl">

        <button
          type="button"
          onClick={onClose}
          className="mb-5 flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-2 text-sm font-bold hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
        >
          <ArrowLeft size={17} />
          Back
        </button>

        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">

          <h2 className="text-xl font-black text-gray-900 dark:text-white">
            Edit Profile
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Update your account information.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-5"
          >

            <Input
              icon={User}
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your name"
            />

            <Input
              icon={Mail}
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />

            <Input
              icon={Phone}
              label="Phone Number"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              placeholder="Enter phone number"
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
                  Updating...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Changes
                </>
              )}
            </button>

          </form>

        </div>
      </div>
    </>
  );
};

const Input = ({
  icon: Icon,
  label,
  ...props
}) => (
  <div>

    <label className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-300">
      {label}
    </label>

    <div className="relative">

      <Icon
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />

      <input
        {...props}
        className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-950"
      />

    </div>

  </div>
);

export default EditUserProfile;