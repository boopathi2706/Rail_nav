import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import FormInput from "./FormInput";
import { loginUser } from "../../services/authService";

const LoginForm = ({ onSuccess, onError }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

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

    if (!formData.email.trim()) {
      onError("Please enter your email address.");
      return;
    }

    if (!formData.password) {
      onError("Please enter your password.");
      return;
    }

    setIsLoading(true);

    try {
      const data = await loginUser(
        formData.email.trim(),
        formData.password
      );

      if (data.success) {
        /*
         * Store JWT token
         */
        localStorage.setItem(
          "userToken",
          data.data.token
        );

        /*
         * Store user information
         */
        localStorage.setItem(
          "user",
          JSON.stringify(data.data.user)
        );

        onSuccess(
          data.message || "Login successful"
        );

        /*
         * Small delay so user can see
         * success toast.
         */
        setTimeout(() => {
          navigate("/user_main", {
            replace: true,
          });
        }, 1000);
      } else {
        onError(
          data.message || "Login failed."
        );
      }
    } catch (error) {
      console.error("Login Error:", error);

      const message =
        error?.response?.data?.message ||
        "Unable to login. Please try again.";

      onError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.form
      initial={{
        opacity: 0,
        y: 30,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.5,
      }}
      onSubmit={handleSubmit}
      className="space-y-5"
    >

      {/* Email */}

      <FormInput
        id="login-email"
        name="email"
        type="email"
        label="Email Address"
        value={formData.email}
        onChange={handleChange}
        placeholder="Enter your email"
        icon={Mail}
      />

      {/* Password */}

      <FormInput
        id="login-password"
        name="password"
        type={showPassword ? "text" : "password"}
        label="Password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Enter your password"
        icon={Lock}
        rightElement={
          <button
            type="button"
            onClick={() =>
              setShowPassword((prev) => !prev)
            }
            className="
              rounded-lg
              p-1
              text-slate-400
              transition
              hover:bg-slate-100
              hover:text-slate-700
            "
          >
            {showPassword ? (
              <EyeOff size={19} />
            ) : (
              <Eye size={19} />
            )}
          </button>
        }
      />

      {/* Forgot Password */}

      <div className="flex justify-end">

        <button
          type="button"
          onClick={() => {
            navigate("/forgot-password");
          }}
          className="
            text-sm
            font-semibold
            text-blue-600
            transition
            hover:text-blue-800
          "
        >
          Forgot Password?
        </button>

      </div>

      {/* Login Button */}

      <motion.button
        type="submit"
        disabled={isLoading}
        whileHover={
          !isLoading
            ? {
                scale: 1.02,
              }
            : {}
        }
        whileTap={
          !isLoading
            ? {
                scale: 0.98,
              }
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
          transition-all
          duration-300
          hover:from-blue-700
          hover:to-cyan-600
          disabled:cursor-not-allowed
          disabled:opacity-60
        "
      >

        {isLoading ? (
          <>
            <Loader2
              size={20}
              className="animate-spin"
            />

            Signing In...
          </>
        ) : (
          <>
            Login

            <ArrowRight size={20} />
          </>
        )}

      </motion.button>

    </motion.form>
  );
};

export default LoginForm;