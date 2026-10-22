import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import axios from "axios";

import {
  Search,
  Eye,
  Trash2,
  RefreshCw,
  Users,
} from "lucide-react";

import UserDetailsModal from "./UserDetailsModal";
import DeleteUserModal from "./DeleteUserModal";

import Toast from "../auth/Toast";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:8000/api";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [selectedUser, setSelectedUser] =
    useState(null);

  const [modal, setModal] = useState(null);

  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const token =
        localStorage.getItem("adminToken");

      const response = await axios.get(
        `${API_URL}/users/all-users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers(response.data?.data || []);
    } catch (error) {
      console.error(
        "Fetch Users Error:",
        error.response?.data || error
      );

      setToast({
        message:
          error.response?.data?.message ||
          "Failed to load users",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    if (!query) return users;

    return users.filter(
      (user) =>
        user.name
          ?.toLowerCase()
          .includes(query) ||
        user.email
          ?.toLowerCase()
          .includes(query) ||
        user.phoneNumber
          ?.toLowerCase()
          .includes(query)
    );
  }, [users, search]);

  const handleSuccess = (message) => {
    setModal(null);
    setSelectedUser(null);

    setToast({
      message,
      type: "success",
    });

    fetchUsers();
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">

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

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div>
          <h1 className="text-2xl font-bold text-white">
            Users
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage registered railway users.
          </p>
        </div>

        <button
          onClick={fetchUsers}
          className="inline-flex text-white items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"
        >
          <RefreshCw size={17} />
          Refresh
        </button>

      </div>

      {/* Search */}

      <div className="rounded-2xl text-slate-300 bg-white p-4 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">

        <div className="relative">

          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search name, email or phone..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm dark:border-slate-700 dark:bg-slate-800"
          />

        </div>
      </div>

      {loading ? (
        <Loader />
      ) : filteredUsers.length === 0 ? (
        <Empty />
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">

          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead className="bg-slate-50 dark:bg-slate-800">

                <tr>

                  <th className="px-5 py-4 text-xs font-bold uppercase text-slate-500">
                    User
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase text-slate-500">
                    Phone
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase text-slate-500">
                    Created
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-bold uppercase text-slate-500">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">

                {filteredUsers.map((user) => (

                  <tr
                    key={user._id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40"
                  >

                    <td className="px-5 py-4">

                      <p className="font-bold text-white">
                        {user.name}
                      </p>

                      <p className="text-xs text-slate-500">
                        {user.email}
                      </p>

                    </td>

                    <td className="px-5 py-4 text-sm text-slate-300">
                      {user.phoneNumber ||
                        "---"}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-300">
                      {user.createdAt
                        ? new Date(
                            user.createdAt
                          ).toLocaleDateString()
                        : "---"}
                    </td>

                    <td className="px-5 py-4">

                      <div className="flex justify-end gap-2">

                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setModal("view");
                          }}
                          className="rounded-lg p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10"
                        >
                          <Eye size={18} />
                        </button>

                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setModal("delete");
                          }}
                          className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                        >
                          <Trash2 size={18} />
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>
      )}

      {modal === "view" && (
        <UserDetailsModal
          user={selectedUser}
          onClose={() => setModal(null)}
        />
      )}

      {modal === "delete" && (
        <DeleteUserModal
          user={selectedUser}
          onClose={() => setModal(null)}
          onDeleted={(message) =>
            handleSuccess(message)
          }
        />
      )}

    </div>
  );
};

const Loader = () => (
  <div className="flex min-h-[400px] items-center justify-center">
    <div className="h-9 w-9 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
  </div>
);

const Empty = () => (
  <div className="flex min-h-[350px] flex-col items-center justify-center rounded-2xl bg-white dark:bg-slate-900">
    <Users
      size={42}
      className="text-slate-400"
    />
    <p className="mt-3 text-sm font-semibold text-slate-500">
      No users found
    </p>
  </div>
);

export default AdminUsers;