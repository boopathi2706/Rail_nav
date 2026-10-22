import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  X,
  Upload,
  Image as ImageIcon,
  Video,
  Trash2,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const SolvedComplaintModal = ({
  complaint,
  onClose,
  onSubmitted,
}) => {
  // ============================================================
  // STATE
  // ============================================================

  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState([]);

  const [submitting, setSubmitting] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  // ============================================================
  // CLEANUP PREVIEW URLS
  // ============================================================

  useEffect(() => {
    return () => {
      selectedImages.forEach((item) => {
        if (item.preview) {
          URL.revokeObjectURL(item.preview);
        }
      });

      selectedVideos.forEach((item) => {
        if (item.preview) {
          URL.revokeObjectURL(item.preview);
        }
      });
    };
  }, []);

  // ============================================================
  // IMAGE SELECTION
  // ============================================================

  const handleImageChange = (event) => {
    setErrorMessage("");

    const files = Array.from(event.target.files || []);

    if (files.length === 0) return;

    const remainingSlots = 5 - selectedImages.length;

    if (remainingSlots <= 0) {
      setErrorMessage(
        "You can upload a maximum of 5 images."
      );

      event.target.value = "";
      return;
    }

    const filesToAdd = files.slice(0, remainingSlots);

    const invalidFiles = filesToAdd.filter(
      (file) =>
        ![
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/webp",
        ].includes(file.type)
    );

    if (invalidFiles.length > 0) {
      setErrorMessage(
        "Only JPG, PNG and WEBP images are allowed."
      );

      event.target.value = "";
      return;
    }

    const newImages = filesToAdd.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
    }));

    setSelectedImages((previous) => [
      ...previous,
      ...newImages,
    ]);

    event.target.value = "";
  };

  // ============================================================
  // VIDEO SELECTION
  // ============================================================

  const handleVideoChange = (event) => {
    setErrorMessage("");

    const files = Array.from(event.target.files || []);

    if (files.length === 0) return;

    const remainingSlots = 3 - selectedVideos.length;

    if (remainingSlots <= 0) {
      setErrorMessage(
        "You can upload a maximum of 3 videos."
      );

      event.target.value = "";
      return;
    }

    const filesToAdd = files.slice(0, remainingSlots);

    const invalidFiles = filesToAdd.filter(
      (file) =>
        ![
          "video/mp4",
          "video/quicktime",
          "video/webm",
          "video/x-msvideo",
          "video/x-matroska",
        ].includes(file.type)
    );

    if (invalidFiles.length > 0) {
      setErrorMessage(
        "Only MP4, MOV and WEBM videos are allowed."
      );

      event.target.value = "";
      return;
    }

    const newVideos = filesToAdd.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
    }));

    setSelectedVideos((previous) => [
      ...previous,
      ...newVideos,
    ]);

    event.target.value = "";
  };

  // ============================================================
  // REMOVE IMAGE
  // ============================================================

  const removeImage = (id) => {
    setSelectedImages((previous) => {
      const item = previous.find(
        (image) => image.id === id
      );

      if (item?.preview) {
        URL.revokeObjectURL(item.preview);
      }

      return previous.filter(
        (image) => image.id !== id
      );
    });

    setErrorMessage("");
  };

  // ============================================================
  // REMOVE VIDEO
  // ============================================================

  const removeVideo = (id) => {
    setSelectedVideos((previous) => {
      const item = previous.find(
        (video) => video.id === id
      );

      if (item?.preview) {
        URL.revokeObjectURL(item.preview);
      }

      return previous.filter(
        (video) => video.id !== id
      );
    });

    setErrorMessage("");
  };

  // ============================================================
  // SUBMIT SOLVED REQUEST
  // ============================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setErrorMessage("");

    // ----------------------------------------------------------
    // Validate complaint
    // ----------------------------------------------------------

    if (!complaint?._id) {
      setErrorMessage(
        "Complaint information is missing."
      );
      return;
    }

    // ----------------------------------------------------------
    // Validate files
    // ----------------------------------------------------------

    if (
      selectedImages.length === 0 &&
      selectedVideos.length === 0
    ) {
      setErrorMessage(
        "Please upload at least one solved evidence image or video."
      );

      return;
    }

    // ----------------------------------------------------------
    // Get officer token
    // ----------------------------------------------------------

    const token = localStorage.getItem("officerToken");

    if (!token) {
      setErrorMessage(
        "Officer authentication token not found. Please login again."
      );

      return;
    }

    // ----------------------------------------------------------
    // Get officer data
    // ----------------------------------------------------------

    const storedOfficerData =
      localStorage.getItem("officerData");

    if (!storedOfficerData) {
      setErrorMessage(
        "Officer information not found. Please login again."
      );

      return;
    }

    let officerData;

    try {
      officerData = JSON.parse(storedOfficerData);
    } catch (error) {
      console.error(
        "Officer Data Parse Error:",
        error
      );

      setErrorMessage(
        "Invalid officer information. Please login again."
      );

      return;
    }

    // ----------------------------------------------------------
    // Find officer ID
    // ----------------------------------------------------------

    const officerId =
      officerData?._id ||
      officerData?.officerId ||
      officerData?.id;

    if (!officerId) {
      console.error(
        "Officer data:",
        officerData
      );

      setErrorMessage(
        "Officer ID not found. Please login again."
      );

      return;
    }

    try {
      setSubmitting(true);

      // ========================================================
      // CREATE FORM DATA
      // ========================================================

      const formData = new FormData();

      // Complaint ID
      formData.append(
        "complaintId",
        complaint._id
      );

      // Officer ID
      formData.append(
        "officerId",
        officerId
      );

      // ========================================================
      // ADD ACTUAL IMAGE FILES
      // ========================================================

      selectedImages.forEach((item) => {
        /*
          IMPORTANT:

          item is:

          {
            file: File,
            preview: "...",
            id: "..."
          }

          We MUST send item.file,
          not item itself.
        */

        if (item?.file instanceof File) {
          formData.append(
            "images",
            item.file
          );
        }
      });

      // ========================================================
      // ADD ACTUAL VIDEO FILES
      // ========================================================

      selectedVideos.forEach((item) => {
        if (item?.file instanceof File) {
          formData.append(
            "videos",
            item.file
          );
        }
      });

      // ========================================================
      // DEBUG FORM DATA
      // ========================================================

      console.log(
        "===================================="
      );

      console.log(
        "SOLVED REQUEST DATA"
      );

      console.log(
        "Complaint ID:",
        complaint._id
      );

      console.log(
        "Officer ID:",
        officerId
      );

      console.log(
        "Images:",
        selectedImages.length
      );

      console.log(
        "Videos:",
        selectedVideos.length
      );

      for (const [key, value] of formData.entries()) {
        console.log(
          key,
          value instanceof File
            ? {
                name: value.name,
                type: value.type,
                size: value.size,
              }
            : value
        );
      }

      console.log(
        "===================================="
      );

      // ========================================================
      // API REQUEST
      // ========================================================

      const response = await axios.post(
        `${API_URL}/request/solved-requests`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "SOLVED REQUEST RESPONSE:",
        response.data
      );

      // ========================================================
      // SUCCESS
      // ========================================================

      if (
        response.data?.success === false
      ) {
        setErrorMessage(
          response.data?.message ||
            "Failed to submit solved request."
        );

        return;
      }

      /*
        VERY IMPORTANT:

        Do NOT close the modal here directly.

        Send success to OfficerComplaints.

        OfficerComplaints will:

        1. Close modal
        2. Clear selected complaint
        3. Show success toast
        4. Refresh complaints
      */

      if (onSubmitted) {
        await onSubmitted(response.data);
      }
    } catch (error) {
      console.error(
        "SOLVED REQUEST ERROR:",
        error.response?.data || error
      );

      setErrorMessage(
        error.response?.data?.message ||
          "Failed to submit solved request."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ============================================================
  // CLOSE
  // ============================================================

  const handleClose = () => {
    if (submitting) return;

    // Cleanup image previews
    selectedImages.forEach((item) => {
      if (item.preview) {
        URL.revokeObjectURL(item.preview);
      }
    });

    // Cleanup video previews
    selectedVideos.forEach((item) => {
      if (item.preview) {
        URL.revokeObjectURL(item.preview);
      }
    });

    setSelectedImages([]);
    setSelectedVideos([]);
    setErrorMessage("");

    if (onClose) {
      onClose();
    }
  };

  // ============================================================
  // OUTSIDE CLICK
  // ============================================================

  const handleBackdropClick = (event) => {
    if (
      event.target === event.currentTarget &&
      !submitting
    ) {
      handleClose();
    }
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm sm:p-5"
      onMouseDown={handleBackdropClick}
    >
      <div className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* ====================================================
            HEADER
        ===================================================== */}

        <div className="flex shrink-0 items-start justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
              Submit Solved Request
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Complaint:{" "}
              <span className="font-semibold text-slate-700">
                {complaint?.pnrNumber ||
                  complaint?._id ||
                  "-"}
              </span>
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={submitting}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={21} />
          </button>
        </div>

        {/* ====================================================
            CONTENT
        ===================================================== */}

        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
            {/* ==================================================
                ERROR
            =================================================== */}

            {errorMessage && (
              <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700">
                <AlertCircle
                  size={19}
                  className="mt-0.5 shrink-0"
                />

                <p className="font-medium">
                  {errorMessage}
                </p>
              </div>
            )}

            {/* ==================================================
                IMAGES
            =================================================== */}

            <div>
              <div className="mb-2.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <ImageIcon
                    size={18}
                    className="text-slate-700"
                  />

                  <h3 className="text-sm font-bold text-slate-800">
                    Resolution Images
                  </h3>

                  <span className="text-xs text-slate-400">
                    (Maximum 5)
                  </span>
                </div>

                <span className="text-xs font-semibold text-slate-400">
                  {selectedImages.length}/5
                </span>
              </div>

              {/* Image upload area */}

              {selectedImages.length < 5 && (
                <>
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      imageInputRef.current?.click()
                    }
                    disabled={submitting}
                    className="flex min-h-[125px] w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white px-4 py-5 text-center transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Upload
                      size={27}
                      className="mb-2 text-slate-400"
                    />

                    <p className="text-sm font-semibold text-slate-800">
                      Click to upload images
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      JPG, PNG, WEBP
                    </p>
                  </button>
                </>
              )}

              {/* Image previews */}

              {selectedImages.length > 0 && (
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {selectedImages.map((item) => (
                    <div
                      key={item.id}
                      className="group relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
                    >
                      <img
                        src={item.preview}
                        alt={item.file?.name || "Resolution"}
                        className="h-28 w-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          removeImage(item.id)
                        }
                        disabled={submitting}
                        className="absolute right-2 top-2 rounded-lg bg-black/70 p-1.5 text-white opacity-0 transition group-hover:opacity-100 disabled:cursor-not-allowed"
                      >
                        <Trash2 size={14} />
                      </button>

                      <div className="absolute bottom-0 left-0 right-0 truncate bg-black/60 px-2 py-1 text-[10px] text-white">
                        {item.file?.name}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ==================================================
                VIDEOS
            =================================================== */}

            <div className="mt-6">
              <div className="mb-2.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Video
                    size={18}
                    className="text-slate-700"
                  />

                  <h3 className="text-sm font-bold text-slate-800">
                    Resolution Videos
                  </h3>

                  <span className="text-xs text-slate-400">
                    (Maximum 3)
                  </span>
                </div>

                <span className="text-xs font-semibold text-slate-400">
                  {selectedVideos.length}/3
                </span>
              </div>

              {/* Video upload area */}

              {selectedVideos.length < 3 && (
                <>
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/mp4,video/quicktime,video/webm"
                    multiple
                    onChange={handleVideoChange}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      videoInputRef.current?.click()
                    }
                    disabled={submitting}
                    className="flex min-h-[125px] w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white px-4 py-5 text-center transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Upload
                      size={27}
                      className="mb-2 text-slate-400"
                    />

                    <p className="text-sm font-semibold text-slate-800">
                      Click to upload videos
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      MP4, MOV, WEBM
                    </p>
                  </button>
                </>
              )}

              {/* Video previews */}

              {selectedVideos.length > 0 && (
                <div className="mt-3 space-y-3">
                  {selectedVideos.map((item) => (
                    <div
                      key={item.id}
                      className="group relative overflow-hidden rounded-xl border border-slate-200 bg-black"
                    >
                      <video
                        src={item.preview}
                        controls
                        className="max-h-48 w-full object-contain"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          removeVideo(item.id)
                        }
                        disabled={submitting}
                        className="absolute right-2 top-2 rounded-lg bg-black/70 p-1.5 text-white transition hover:bg-red-600 disabled:cursor-not-allowed"
                      >
                        <Trash2 size={14} />
                      </button>

                      <div className="truncate bg-slate-900 px-3 py-2 text-xs text-white">
                        {item.file?.name}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ==================================================
                INFO
            =================================================== */}

            <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-3">
              <div className="flex items-start gap-2">
                <CheckCircle2
                  size={17}
                  className="mt-0.5 shrink-0 text-blue-600"
                />

                <p className="text-xs leading-5 text-blue-700">
                  Upload at least one resolution image or
                  video as proof that the complaint has been
                  resolved. The request will be sent to the
                  passenger for confirmation.
                </p>
              </div>
            </div>
          </div>

          {/* ====================================================
              FOOTER
          ===================================================== */}

          <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-slate-200 bg-white px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />

                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle2 size={17} />

                  Submit Solved Request
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SolvedComplaintModal;