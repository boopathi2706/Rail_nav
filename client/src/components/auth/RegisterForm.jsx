import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
} from "lucide-react";

import FormInput from "./FormInput";
import { registerUser } from "../../services/authService";

const RegisterForm = ({ onSuccess, onError }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
  });
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.phoneNumber.length !== 10) {
      onError("Please enter a valid 10-digit phone number.");
      return;
    }

    if (formData.password.length < 6) {
      onError("Password must contain at least 6 characters.");
      return;
    }

    setIsLoading(true);

    try {
  const data = await registerUser(formData);

  if (data.success) {
    onSuccess(
      data.message || "OTP sent successfully."
    );

    setTimeout(() => {
      navigate("/verify-otp", {
        state: {
          email: formData.email,
        },
      });
    }, 1000);
  } else {
    onError(
      data.message || "Registration failed."
    );
  }
} catch (error) {
  console.error("Registration Error:", error);

  const message =
    error?.response?.data?.message ||
    "Unable to register. Please try again.";

  onError(message);
} finally {
  setIsLoading(false);
}
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <FormInput
        id="name"
        name="name"
        label="Full Name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Enter your full name"
        icon={User}
      />

      <FormInput
        id="email"
        name="email"
        type="email"
        label="Email Address"
        value={formData.email}
        onChange={handleChange}
        placeholder="Enter your email"
        icon={Mail}
      />

      <FormInput
        id="phoneNumber"
        name="phoneNumber"
        type="tel"
        label="Phone Number"
        value={formData.phoneNumber}
        onChange={handleChange}
        placeholder="Enter 10-digit mobile number"
        icon={Phone}
      />

      <FormInput
        id="password"
        name="password"
        type={showPassword ? "text" : "password"}
        label="Password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Create a strong password"
        icon={Lock}
        rightElement={
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            {showPassword ? (
              <EyeOff size={19} />
            ) : (
              <Eye size={19} />
            )}
          </button>
        }
      />

      <motion.button
        type="submit"
        disabled={isLoading}
        whileHover={!isLoading ? { scale: 1.02 } : {}}
        whileTap={!isLoading ? { scale: 0.98 } : {}}
        className="
          flex w-full items-center justify-center gap-2
          rounded-xl bg-gradient-to-r
          from-blue-600 to-cyan-500
          px-5 py-3.5
          font-semibold text-white
          shadow-lg shadow-blue-500/20
          transition-all duration-300
          hover:from-blue-700 hover:to-cyan-600
          disabled:cursor-not-allowed
          disabled:opacity-60
        "
      >
        {isLoading ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            Creating Account...
          </>
        ) : (
          <>
            Create Account
            <ArrowRight size={20} />
          </>
        )}
      </motion.button>

      <p className="text-center text-xs leading-5 text-slate-500">
        By creating an account, you agree to use RailNav responsibly.
      </p>
    </motion.form>
  );
};

export default RegisterForm;