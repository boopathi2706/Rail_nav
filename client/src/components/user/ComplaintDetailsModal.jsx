import React from "react";
import {
  X,
  Calendar,
  TrainFront,
  Hash,
  Tag,
  Clock,
  Image as ImageIcon,
  Video,
  MapPin,
  CheckCircle,
  MessageSquare,
} from "lucide-react";

import ComplaintStatusTracker from "./ComplaintStatusTracker";

const ComplaintDetailsModal = ({
  complaint,
  onClose,
}) => {
  if (!complaint) return null;

  const formatDateTime = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isVideo = (url) => {
    return /\.(mp4|mov|avi|mkv|webm)(\?.*)?$/i.test(
      url
    );
  };

  const evidenceImages =
    complaint.evidenceProof?.images || [];

  const evidenceVideos =
    complaint.evidenceProof?.videos || [];

  const solvedImages =
    complaint.solvedProof?.images || [];

  const solvedVideos =
    complaint.solvedProof?.videos || [];

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm sm:p-5">

      <div className="flex max-h-[95vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-gray-950">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800">

          <div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white">
              Complaint Details
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Complaint #{complaint._id?.slice(-8)}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800"
          >
            <X size={22} />
          </button>

        </div>

        {/* Body */}
        <div className="overflow-y-auto p-5">

          <div className="space-y-6">

            {/* Status */}
            <ComplaintStatusTracker
              status={complaint.status}
            />

            {/* Passenger / Train details */}
            <div className="grid gap-4 sm:grid-cols-2">

              <InfoItem
                icon={Hash}
                label="PNR Number"
                value={complaint.pnrNumber}
              />

              <InfoItem
                icon={TrainFront}
                label="Train Number"
                value={complaint.trainNumber}
              />

              <InfoItem
                icon={Tag}
                label="Complaint Category"
                value={complaint.complaintCategory}
                capitalize
              />

              <InfoItem
                icon={Calendar}
                label="Incident Date & Time"
                value={formatDateTime(
                  complaint.incidentDateTime
                )}
              />

              <InfoItem
                icon={Clock}
                label="Created At"
                value={formatDateTime(
                  complaint.createdAt
                )}
              />

              {complaint.solvedDateTime && (
                <InfoItem
                  icon={CheckCircle}
                  label="Solved At"
                  value={formatDateTime(
                    complaint.solvedDateTime
                  )}
                />
              )}

            </div>

            {/* Description history */}
            {complaint.descriptions?.length > 0 && (
              <section>

                <SectionTitle
                  icon={MessageSquare}
                  title="Complaint History"
                />

                <div className="space-y-3">

                  {complaint.descriptions.map(
                    (description, index) => (
                      <div
                        key={
                          description.id ||
                          description._id ||
                          index
                        }
                        className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900"
                      >

                        <div className="mb-2 flex items-center justify-between">

                          <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-bold capitalize text-blue-700">
                            {description.who ||
                              "user"}
                          </span>

                          <span className="text-xs text-gray-500">
                            {formatDateTime(
                              description.createdAt
                            )}
                          </span>

                        </div>

                        <p className="whitespace-pre-wrap text-sm leading-6 text-gray-700 dark:text-gray-300">
                          {description.message}
                        </p>

                      </div>
                    )
                  )}

                </div>

              </section>
            )}

            {/* Evidence */}
            {(evidenceImages.length > 0 ||
              evidenceVideos.length > 0) && (
              <section>

                <SectionTitle
                  icon={ImageIcon}
                  title="Evidence"
                />

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">

                  {evidenceImages.map(
                    (url, index) => (
                      <a
                        key={`image-${index}`}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="group overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700"
                      >
                        <img
                          src={url}
                          alt={`Evidence ${index + 1}`}
                          className="h-40 w-full object-cover transition group-hover:scale-105"
                        />
                      </a>
                    )
                  )}

                  {evidenceVideos.map(
                    (url, index) => (
                      <video
                        key={`video-${index}`}
                        src={url}
                        controls
                        className="h-40 w-full rounded-xl border border-gray-200 object-cover dark:border-gray-700"
                      />
                    )
                  )}

                </div>

              </section>
            )}

            {/* Solved proof */}
            {(solvedImages.length > 0 ||
              solvedVideos.length > 0) && (
              <section>

                <SectionTitle
                  icon={CheckCircle}
                  title="Solved Proof"
                />

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">

                  {solvedImages.map(
                    (url, index) => (
                      <a
                        key={`solved-image-${index}`}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700"
                      >
                        <img
                          src={url}
                          alt={`Solved proof ${index + 1}`}
                          className="h-40 w-full object-cover"
                        />
                      </a>
                    )
                  )}

                  {solvedVideos.map(
                    (url, index) => (
                      <video
                        key={`solved-video-${index}`}
                        src={url}
                        controls
                        className="h-40 w-full rounded-xl border border-gray-200 object-cover"
                      />
                    )
                  )}

                </div>

              </section>
            )}

            {/* Next routes */}
            {complaint.nextRoutes?.length > 0 && (
              <section>

                <SectionTitle
                  icon={MapPin}
                  title="Complaint Route"
                />

                <div className="space-y-2">

                  {complaint.nextRoutes.map(
                    (route, index) => (
                      <div
                        key={
                          route._id ||
                          route.stationId ||
                          index
                        }
                        className="flex items-center gap-3 rounded-xl border border-gray-200 p-3 dark:border-gray-700"
                      >

                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                          {index + 1}
                        </div>

                        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                          {route.stationName ||
                            "Unknown Station"}
                        </span>

                      </div>
                    )
                  )}

                </div>

              </section>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};

/* =========================================================
   SMALL COMPONENTS
========================================================= */

const InfoItem = ({
  icon: Icon,
  label,
  value,
  capitalize = false,
}) => (
  <div className="rounded-2xl border border-gray-200 p-4 dark:border-gray-700">

    <div className="flex items-center gap-3">

      <div className="rounded-xl bg-gray-100 p-2.5 dark:bg-gray-800">
        <Icon size={18} />
      </div>

      <div className="min-w-0">

        <p className="text-xs font-semibold text-gray-500">
          {label}
        </p>

        <p
          className={`mt-1 break-words text-sm font-bold text-gray-900 dark:text-white ${
            capitalize ? "capitalize" : ""
          }`}
        >
          {value || "N/A"}
        </p>

      </div>

    </div>

  </div>
);

const SectionTitle = ({
  icon: Icon,
  title,
}) => (
  <div className="mb-3 flex items-center gap-2">

    <Icon
      size={19}
      className="text-blue-600"
    />

    <h3 className="text-lg font-black text-gray-900 dark:text-white">
      {title}
    </h3>

  </div>
);

export default ComplaintDetailsModal;