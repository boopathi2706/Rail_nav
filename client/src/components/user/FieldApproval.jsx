import React from "react";
import { Check, X, Edit3 } from "lucide-react";

const FieldApproval = ({
  label,
  value,
  onApprove,
  onReject,
  onEdit,
  approved = false,
}) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">

      <div className="mb-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          {label}
        </p>

        <p className="mt-1 break-words text-base font-bold text-gray-900 dark:text-white">
          {value || "Not provided"}
        </p>
      </div>

      {approved ? (
        <div className="flex items-center gap-2 rounded-xl bg-green-50 px-3 py-2 text-sm font-semibold text-green-700 dark:bg-green-900/20 dark:text-green-400">
          <Check size={18} />
          Approved
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">

          <button
            type="button"
            onClick={onApprove}
            className="flex items-center justify-center gap-1 rounded-xl bg-green-600 px-3 py-2 text-sm font-bold text-white transition hover:bg-green-700"
          >
            <Check size={16} />
            Yes
          </button>

          <button
            type="button"
            onClick={onReject}
            className="flex items-center justify-center gap-1 rounded-xl bg-red-600 px-3 py-2 text-sm font-bold text-white transition hover:bg-red-700"
          >
            <X size={16} />
            No
          </button>

          <button
            type="button"
            onClick={onEdit}
            className="flex items-center justify-center gap-1 rounded-xl border border-gray-300 px-3 py-2 text-sm font-bold text-gray-700 transition hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <Edit3 size={16} />
            Edit
          </button>

        </div>
      )}
    </div>
  );
};

export default FieldApproval;