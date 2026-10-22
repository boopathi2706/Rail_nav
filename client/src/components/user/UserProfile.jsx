import React, { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Pencil,
  Lock,
} from "lucide-react";

import {
  getUserProfile,
} from "../../services/userApi";

import EditUserProfile from "./EditUserProfile";
import ChangeUserPassword from "./ChangeUserPassword";
import Toast from "../auth/Toast";

const UserProfile = () => {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState(false);

  const [changingPassword, setChangingPassword] =
    useState(false);

  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const response = await getUserProfile();

      setUser(response?.data || null);

      if (response?.data) {
        localStorage.setItem(
          "userData",
          JSON.stringify(response.data)
        );
      }
    } catch (error) {
      setToast({
        message:
          error?.response?.data?.message ||
          "Failed to load profile",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
      </div>
    );
  }

  if (editing) {
    return (
      <EditUserProfile
        user={user}
        onClose={() => setEditing(false)}
        onUpdated={(updatedUser, message) => {
          setUser(updatedUser);
          setEditing(false);

          localStorage.setItem(
            "userData",
            JSON.stringify(updatedUser)
          );

          setToast({
            message:
              message ||
              "Profile updated successfully",
            type: "success",
          });
        }}
      />
    );
  }

  if (changingPassword) {
    return (
      <ChangeUserPassword
        onClose={() =>
          setChangingPassword(false)
        }
        onSuccess={(message) => {
          setChangingPassword(false);

          setToast({
            message:
              message ||
              "Password changed successfully",
            type: "success",
          });
        }}
      />
    );
  }

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

      <div className="mx-auto max-w-3xl space-y-6">

        <div className="flex items-center justify-between">

          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">
              My Profile
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage your passenger account.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setEditing(true)}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
          >
            <Pencil size={17} />
            Edit
          </button>

        </div>

        {/* Profile card */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">

          <div className="mb-7 flex flex-col items-center text-center">

            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30">
              <User size={45} />
            </div>

            <h2 className="mt-4 text-xl font-black text-gray-900 dark:text-white">
              {user?.name || "Passenger"}
            </h2>

            <p className="text-sm text-gray-500">
              Railway Passenger
            </p>

          </div>

          <div className="grid gap-4 sm:grid-cols-2">

            <ProfileItem
              icon={User}
              label="Name"
              value={user?.name}
            />

            <ProfileItem
              icon={Mail}
              label="Email"
              value={user?.email}
            />

            <ProfileItem
              icon={Phone}
              label="Phone Number"
              value={user?.phoneNumber}
            />

            <ProfileItem
              icon={Calendar}
              label="Joined"
              value={
                user?.createdAt
                  ? new Date(
                      user.createdAt
                    ).toLocaleDateString(
                      "en-IN"
                    )
                  : "N/A"
              }
            />

          </div>

        </div>

        {/* Password */}
        <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between dark:border-gray-700 dark:bg-gray-900">

          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-gray-100 p-3 dark:bg-gray-800">
              <Lock size={20} />
            </div>

            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">
                Password
              </h3>

              <p className="text-sm text-gray-500">
                Change your account password using OTP verification.
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={() =>
              setChangingPassword(true)
            }
            className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-bold hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            Change Password
          </button>

        </div>

      </div>
    </>
  );
};

const ProfileItem = ({
  icon: Icon,
  label,
  value,
}) => (
  <div className="rounded-2xl border border-gray-200 p-4 dark:border-gray-700">

    <div className="flex items-center gap-3">

      <div className="rounded-xl bg-gray-100 p-2.5 dark:bg-gray-800">
        <Icon size={18} />
      </div>

      <div>
        <p className="text-xs font-semibold text-gray-500">
          {label}
        </p>

        <p className="mt-1 text-sm font-bold text-gray-900 dark:text-white">
          {value || "N/A"}
        </p>
      </div>

    </div>

  </div>
);

export default UserProfile;