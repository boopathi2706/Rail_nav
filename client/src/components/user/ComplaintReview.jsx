import React from "react";
import {
  CheckCircle,
  FileText,
  Train,
  Calendar,
  Tag,
  MessageSquare,
  Image as ImageIcon,
  Video,
  Send,
  ArrowLeft,
} from "lucide-react";

const ComplaintReview = ({
  form,
  images = [],
  videos = [],
  onSubmit,
  onBack,
  loading = false,
}) => {
  const formatDate = (value) => {
    if (!value) return "Not provided";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleString();
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">

        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-emerald-100 p-3 dark:bg-emerald-500/10">
            <CheckCircle
              size={24}
              className="text-emerald-600"
            />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Review Your Complaint
            </h2>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              Please verify all information before submitting.
            </p>
          </div>
        </div>
      </div>

      {/* Complaint Information */}
      <div className="grid gap-4 md:grid-cols-2">

        <ReviewItem
          icon={<FileText size={18} />}
          label="PNR Number"
          value={form.pnrNumber}
        />

        <ReviewItem
          icon={<Train size={18} />}
          label="Train Number"
          value={form.trainNumber}
        />

        <ReviewItem
          icon={<Calendar size={18} />}
          label="Incident Date & Time"
          value={formatDate(form.incidentDateTime)}
        />

        <ReviewItem
          icon={<Tag size={18} />}
          label="Category"
          value={form.complaintCategory}
        />

      </div>

      {/* Description */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">

        <div className="mb-3 flex items-center gap-2">
          <MessageSquare size={18} />

          <h3 className="font-semibold text-slate-900 dark:text-white">
            Description
          </h3>
        </div>

        <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600 dark:text-slate-300">
          {form.description || "No description provided"}
        </p>

      </div>

      {/* Evidence */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">

        <h3 className="mb-4 font-semibold text-slate-900 dark:text-white">
          Evidence
        </h3>

        <div className="grid gap-4 md:grid-cols-2">

          {/* Images */}
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium">
              <ImageIcon size={17} />
              Images ({images.length})
            </div>

            {images.length === 0 ? (
              <p className="text-sm text-slate-500">
                No images attached
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-3">

                {images.map((file, index) => (
                  <div
                    key={index}
                    className="overflow-hidden rounded-xl border"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Evidence ${index + 1}`}
                      className="h-32 w-full object-cover"
                    />
                  </div>
                ))}

              </div>
            )}
          </div>

          {/* Videos */}
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium">
              <Video size={17} />
              Videos ({videos.length})
            </div>

            {videos.length === 0 ? (
              <p className="text-sm text-slate-500">
                No videos attached
              </p>
            ) : (
              <div className="space-y-2">

                {videos.map((file, index) => (
                  <div
                    key={index}
                    className="rounded-xl border p-3 text-sm"
                  >
                    {file.name}
                  </div>
                ))}

              </div>
            )}
          </div>

        </div>
      </div>

      {/* Final confirmation */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-500/20 dark:bg-amber-500/10">

        <p className="text-sm leading-6 text-amber-800 dark:text-amber-200">
          Please make sure all information is correct.
          Once submitted, your complaint will be sent to
          the railway complaint management system.
        </p>

      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">

        <button
          type="button"
          onClick={onBack}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 font-semibold transition hover:bg-slate-100 disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800"
        >
          <ArrowLeft size={18} />
          Go Back
        </button>

        <button
          type="button"
          onClick={onSubmit}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Send size={18} />

          {loading
            ? "Submitting..."
            : "Confirm & Submit Complaint"}
        </button>

      </div>

    </div>
  );
};

const ReviewItem = ({
  icon,
  label,
  value,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">

      <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-500">
        {icon}
        {label}
      </div>

      <p className="font-semibold text-slate-900 dark:text-white">
        {value || "Not provided"}
      </p>

    </div>
  );
};

export default ComplaintReview;