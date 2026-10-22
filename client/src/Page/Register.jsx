import React, { useState } from "react";
import { motion } from "framer-motion";
import { TrainFront, ShieldCheck } from "lucide-react";

import RegisterForm from "../components/auth/RegisterForm";
import Toast from "../components/auth/Toast";
import { useNavigate } from "react-router-dom";
const Register = () => {
  const navigate = useNavigate();
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

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50">

      {/* Background decorations */}

      <motion.div
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -30, 20, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute -left-32 -top-32
          h-80 w-80 rounded-full
          bg-blue-300/30 blur-3xl
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
          h-96 w-96 rounded-full
          bg-cyan-300/30 blur-3xl
        "
      />

      {/* Toast */}

      {toast.message && (
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
      )}

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">

        <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/60 bg-white/80 shadow-2xl backdrop-blur-xl lg:grid-cols-2">

          {/* Left side */}

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="
              hidden flex-col justify-between
              bg-gradient-to-br
              from-blue-600 via-blue-700 to-cyan-600
              p-10 text-white
              lg:flex
            "
          >

            <div>

              <div className="flex items-center gap-3">

                <div className="rounded-2xl bg-white/15 p-3 backdrop-blur">
                  <TrainFront size={30} />
                </div>

                <div>
                  <h1 className="text-2xl font-bold">
                    RailNav
                  </h1>

                  <p className="text-sm text-blue-100">
                    Smart Railway Navigation
                  </p>
                </div>

              </div>

              <div className="mt-20">

                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-100">
                  Welcome aboard
                </p>

                <h2 className="text-4xl font-bold leading-tight">
                  Navigate railway stations with confidence.
                </h2>

                <p className="mt-6 max-w-md leading-7 text-blue-100">
                  Find platforms, ticket counters, waiting halls,
                  food courts and other important station locations
                  from one simple application.
                </p>

              </div>

            </div>

            <div className="flex items-center gap-3 text-sm text-blue-100">
              <ShieldCheck size={20} />
              Secure account registration
            </div>

          </motion.div>

          {/* Form side */}

          <div className="p-6 sm:p-10 lg:p-12">

            {/* Mobile logo */}

            <div className="mb-8 flex items-center gap-3 lg:hidden">

              <div className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 p-2.5 text-white shadow-lg">
                <TrainFront size={24} />
              </div>

              <div>
                <h1 className="text-xl font-bold text-slate-800">
                  RailNav
                </h1>

                <p className="text-xs text-slate-500">
                  Smart Railway Navigation
                </p>
              </div>

            </div>

            <div className="mb-8">

              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                Create your account
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Join RailNav and make your railway journey easier.
              </p>

            </div>

            <RegisterForm
              onSuccess={(message) =>
                showToast(message, "success")
              }
              onError={(message) =>
                showToast(message, "error")
              }
            />

            <p className="mt-7 text-center text-sm text-slate-500">

              Already have an account?{" "}

              <button
                type="button"
                className="font-semibold text-blue-600 transition hover:text-blue-800 cursor-pointer"
                onClick={() => navigate("/login")}
              >
                Login
              </button>

            </p>

          </div>

        </div>

      </div>
    </main>
  );
};

export default Register;