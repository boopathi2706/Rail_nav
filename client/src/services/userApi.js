import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const userApi = axios.create({
  baseURL: API_URL,
});

userApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("userToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ===============================
// PROFILE
// ===============================

export const getUserProfile = async () => {
  const response = await userApi.get("/users/profile");
  return response.data;
};

export const updateUserProfile = async (data) => {
  const response = await userApi.put("/users/update", data);
  return response.data;
};

// ===============================
// DASHBOARD
// ===============================

export const getUserDashboard = async () => {
  const response = await userApi.get("/users/dashboard-data");
  return response.data;
};

// ===============================
// PASSWORD
// ===============================

export const requestPasswordChange = async (newPassword) => {
  const response = await userApi.post(
    "/users/change-password/request",
    {
      newPassword,
    }
  );

  return response.data;
};

export const verifyPasswordChange = async (otp) => {
  const response = await userApi.post(
    "/users/change-password/verify",
    {
      otp,
    }
  );

  return response.data;
};

// ===============================
// COMPLAINTS
// ===============================

export const getUserComplaints = async () => {
  const response = await userApi.get(
    "/complaints/my-complaints"
  );

  return response.data;
};

export const getComplaintById = async (complaintId) => {
  const response = await userApi.get(
    `/complaints/user/${complaintId}`
  );

  return response.data;
};

export const deleteComplaint = async (complaintId) => {
  const response = await userApi.delete(
    `/complaints/user/delete/${complaintId}`
  );

  return response.data;
};

export const createComplaint = async (formData) => {
  const response = await userApi.post(
    "/complaints/create",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

// ===============================
// TICKET AI
// ===============================

export const analyzeTicket = async (formData) => {
  const response = await userApi.post(
    "/tickets/analyze",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export default userApi;