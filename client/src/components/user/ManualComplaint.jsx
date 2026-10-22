import React, { useState } from "react";
import {
  Send,
  Image as ImageIcon,
  Video,
  Loader2,
} from "lucide-react";

import { createComplaint } from "../../services/userApi";
import Toast from "../auth/Toast";

const categories = [
  "catering",
  "cleanliness",
  "electrical",
  "security",
  "water",
  "medical",
  "staff",
  "ticketing",
  "coach",
  "platform",
  "other",
];

const ManualComplaint = ({ onSuccess }) => {
  const [form, setForm] = useState({
    pnrNumber: "",
    trainNumber: "",
    incidentDateTime: "",
    complaintCategory: "",
    description: "",
  });

  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.pnrNumber.trim()) {
      setToast({
        message: "Please enter PNR number",
        type: "error",
      });
      return;
    }

    if (!form.trainNumber.trim()) {
      setToast({
        message: "Please enter train number",
        type: "error",
      });
      return;
    }

    if (!form.incidentDateTime) {
      setToast({
        message: "Please select incident date and time",
        type: "error",
      });
      return;
    }

    if (!form.complaintCategory) {
      setToast({
        message: "Please select complaint category",
        type: "error",
      });
      return;
    }

    if (!form.description.trim()) {
      setToast({
        message: "Please enter complaint description",
        type: "error",
      });
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("pnrNumber", form.pnrNumber);
      formData.append("trainNumber", form.trainNumber);
      formData.append(
        "incidentDateTime",
        form.incidentDateTime
      );
      formData.append(
        "complaintCategory",
        form.complaintCategory
      );

      /*
       * Backend complaint schema uses descriptions[].
       * Sending JSON string here allows the controller
       * to create the initial description.
       */
      formData.append(
        "description",
        form.description
      );

      images.forEach((file) => {
        formData.append("images", file);
      });

      videos.forEach((file) => {
        formData.append("videos", file);
      });

      const response = await createComplaint(formData);

      if (response?.success === false) {
        throw new Error(
          response?.message || "Failed to create complaint"
        );
      }

      setToast({
        message:
          response?.message ||
          "Complaint submitted successfully",
        type: "success",
      });

      setForm({
        pnrNumber: "",
        trainNumber: "",
        incidentDateTime: "",
        complaintCategory: "",
        description: "",
      });

      setImages([]);
      setVideos([]);

      onSuccess?.();

    } catch (error) {
      setToast({
        message:
          error?.response?.data?.message ||
          error?.message ||
          "Failed to submit complaint",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

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

      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-3xl space-y-6"
      >

        {/* PNR + Train */}
        <div className="grid gap-5 md:grid-cols-2">

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-300">
              PNR Number
            </label>

            <input
              type="text"
              name="pnrNumber"
              value={form.pnrNumber}
              onChange={handleChange}
              placeholder="Enter PNR number"
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-300">
              Train Number
            </label>

            <input
              type="text"
              name="trainNumber"
              value={form.trainNumber}
              onChange={handleChange}
              placeholder="Enter train number"
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900"
            />
          </div>

        </div>

        {/* Date */}
        <div>
          <label className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-300">
            Incident Date & Time
          </label>

          <input
            type="datetime-local"
            name="incidentDateTime"
            value={form.incidentDateTime}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900"
          />
        </div>

        {/* Category */}
        <div>
          <label className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-300">
            Complaint Category
          </label>

          <select
            name="complaintCategory"
            value={form.complaintCategory}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 capitalize outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900"
          >
            <option value="">
              Select complaint category
            </option>

            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-300">
            Complaint Description
          </label>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={5}
            placeholder="Describe your complaint clearly..."
            className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900"
          />

          <p className="mt-1 text-xs text-gray-500">
            Please explain what happened and where the issue occurred.
          </p>
        </div>

        {/* Images */}
        <div>
          <label className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-300">
            Evidence Images
          </label>

          <label className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-gray-300 p-5 transition hover:border-blue-500 dark:border-gray-700">
            <ImageIcon className="text-blue-500" />

            <div>
              <p className="text-sm font-bold">
                Upload Images
              </p>

              <p className="text-xs text-gray-500">
                Maximum 5 images
              </p>
            </div>

            <input
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={(e) =>
                setImages(
                  Array.from(e.target.files || []).slice(0, 5)
                )
              }
            />
          </label>

          {images.length > 0 && (
            <p className="mt-2 text-xs font-semibold text-green-600">
              {images.length} image(s) selected
            </p>
          )}
        </div>

        {/* Videos */}
        <div>
          <label className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-300">
            Evidence Videos
          </label>

          <label className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-gray-300 p-5 transition hover:border-purple-500 dark:border-gray-700">
            <Video className="text-purple-500" />

            <div>
              <p className="text-sm font-bold">
                Upload Videos
              </p>

              <p className="text-xs text-gray-500">
                Maximum 3 videos
              </p>
            </div>

            <input
              type="file"
              accept="video/*"
              multiple
              hidden
              onChange={(e) =>
                setVideos(
                  Array.from(e.target.files || []).slice(0, 3)
                )
              }
            />
          </label>

          {videos.length > 0 && (
            <p className="mt-2 text-xs font-semibold text-green-600">
              {videos.length} video(s) selected
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={19} />
              Submitting Complaint...
            </>
          ) : (
            <>
              <Send size={19} />
              Submit Complaint
            </>
          )}
        </button>

      </form>
    </>
  );
};

export default ManualComplaint;