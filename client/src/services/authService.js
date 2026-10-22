import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// Register
export const registerUser = async (formData) => {
  const response = await axios.post(
    `${API_URL}/users/register`,
    formData
  );

  return response.data;
};

// Verify OTP
export const verifyOTP = async (email, otp) => {
  const response = await axios.post(
    `${API_URL}/users/verify-otp`,
    {
      email,
      otp,
    }
  );

  return response.data;
};

export const loginUser = async (email, password) => {
  const response = await axios.post(
    `${API_URL}/users/login`,
    {
      email,
      password,
    }
  );

  return response.data;
};