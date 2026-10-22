import React, { useEffect } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Toast = ({
  message,
  type = "success",
  onClose,
}) => {
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      onClose();
    }, 3500);

    return () => clearTimeout(timer);
  }, [message, onClose]);

  const isSuccess = type === "success";

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{
            opacity: 0,
            x: 80,
            scale: 0.95,
          }}
          animate={{
            opacity: 1,
            x: 0,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            x: 80,
            scale: 0.95,
          }}
          transition={{
            duration: 0.3,
          }}
          className={`
            fixed
            right-4
            top-4
            z-[100]
            flex
            w-[calc(100%-2rem)]
            max-w-md
            items-center
            gap-3
            rounded-2xl
            border
            p-4
            shadow-2xl
            backdrop-blur-xl
            ${
              isSuccess
                ? "border-green-200 bg-green-50/95 text-green-800"
                : "border-red-200 bg-red-50/95 text-red-800"
            }
          `}
        >

          {isSuccess ? (
            <CheckCircle
              className="shrink-0 text-green-600"
              size={22}
            />
          ) : (
            <XCircle
              className="shrink-0 text-red-600"
              size={22}
            />
          )}

          <p className="flex-1 text-sm font-semibold">
            {message}
          </p>

          <button
            type="button"
            onClick={onClose}
            className="
              rounded-lg
              p-1
              transition
              hover:bg-black/5
            "
          >
            <X size={18} />
          </button>

        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;