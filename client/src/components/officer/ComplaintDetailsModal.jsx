import React from "react";

import {
  X,
  User,
  TrainFront,
  CalendarDays,
  Phone,
  Mail,
  FileText,
  Clock,
  Image as ImageIcon,
  Video,
  Route,
  CheckCircle2,
} from "lucide-react";

const ComplaintDetailsModal = ({ complaint, onClose }) => {
  if (!complaint) return null;

  // =========================================================
  // DATE FORMAT
  // =========================================================

  const formatDate = (date) => {
    if (!date) return "-";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return String(date);
    }

    return parsed.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // =========================================================
  // STATUS STYLE
  // =========================================================

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "solved":
        return "bg-green-100 text-green-700";

      case "ongoing":
        return "bg-blue-100 text-blue-700";

      case "pending":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  // =========================================================
  // URL HELPER
  // =========================================================

  const getUrl = (item) => {
    if (!item) return "";

    if (typeof item === "string") {
      return item;
    }

    return item?.url || item?.secure_url || "";
  };

  // =========================================================
  // EVIDENCE
  // =========================================================

  const evidenceImages = Array.isArray(
    complaint.evidenceProof?.images
  )
    ? complaint.evidenceProof.images
    : [];

  const evidenceVideos = Array.isArray(
    complaint.evidenceProof?.videos
  )
    ? complaint.evidenceProof.videos
    : [];

  // =========================================================
  // SOLVED PROOF
  // =========================================================

  const solvedImages = Array.isArray(
    complaint.solvedProof?.images
  )
    ? complaint.solvedProof.images
    : [];

  const solvedVideos = Array.isArray(
    complaint.solvedProof?.videos
  )
    ? complaint.solvedProof.videos
    : [];

  // =========================================================
  // DESCRIPTION / HISTORY
  // =========================================================

  const descriptions = Array.isArray(
    complaint.descriptions
  )
    ? complaint.descriptions
    : [];

  // =========================================================
  // NEXT ROUTES
  // =========================================================

  const nextRoutes = Array.isArray(
    complaint.nextRoutes
  )
    ? complaint.nextRoutes
    : [];

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 p-2 backdrop-blur-sm sm:p-4 md:p-6">

      {/* =====================================================
          MODAL
      ====================================================== */}

      <div className="flex max-h-[95vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:rounded-3xl">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-3 sm:px-6 sm:py-4">

          <div className="min-w-0">

            <div className="flex flex-wrap items-center gap-2">

              <h2 className="text-base font-bold text-slate-900 sm:text-lg md:text-xl">
                Complaint Details
              </h2>

              <span
                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize sm:text-xs ${getStatusClass(
                  complaint.status
                )}`}
              >
                {complaint.status || "Unknown"}
              </span>

            </div>

            <p className="mt-1 text-[11px] text-slate-500 sm:text-xs">
              Complaint Information
            </p>

          </div>

          <button
            type="button"
            onClick={onClose}
            className="ml-3 shrink-0 rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <X size={20} />
          </button>

        </div>

        {/* =====================================================
            CONTENT
        ====================================================== */}

        <div className="overflow-y-auto p-3 sm:p-5 md:p-6">

          {/* ===================================================
              PASSENGER + TRAIN
          ==================================================== */}

          <div className="grid gap-4 lg:grid-cols-2 lg:gap-5">

            {/* Passenger Information */}

            <Section
              title="Passenger Information"
              icon={User}
            >

              <Detail
                label="Passenger Name"
                value={complaint.userName}
              />

              <Detail
                label="Phone Number"
                value={complaint.phoneNumber}
                icon={Phone}
              />

              <Detail
                label="Email"
                value={complaint.email}
                icon={Mail}
              />

              <Detail
                label="PNR Number"
                value={complaint.pnrNumber}
              />

            </Section>

            {/* Train Information */}

            <Section
              title="Train Information"
              icon={TrainFront}
            >

              <Detail
                label="Train Number"
                value={complaint.trainNumber}
              />

              <Detail
                label="Incident Date & Time"
                value={formatDate(
                  complaint.incidentDateTime
                )}
                icon={CalendarDays}
              />

              <Detail
                label="Complaint Category"
                value={complaint.complaintCategory}
              />

              <Detail
                label="Status"
                value={complaint.status}
              />

            </Section>

          </div>

          {/* ===================================================
              NEXT ROUTES
              
              FULL WIDTH
              ==================================================== */}

          {nextRoutes.length > 0 && (
            <div className="mt-4 sm:mt-5">

              <Section
                title="Next Routes"
                icon={Route}
              >

                <div className="col-span-1 sm:col-span-2">

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

                    {nextRoutes.map((route, index) => (
                      <div
                        key={route._id || index}
                        className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 transition hover:bg-slate-100"
                      >

                        {/* Route Number */}

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                          {index + 1}
                        </div>

                        {/* Station Name */}

                        <div className="min-w-0">

                          <p className="truncate text-sm font-semibold text-slate-800">
                            {route.stationName || "-"}
                          </p>

                          <p className="mt-0.5 text-xs text-slate-500">
                            Next Station
                          </p>

                        </div>

                      </div>
                    ))}

                  </div>

                </div>

              </Section>

            </div>
          )}

          {/* ===================================================
              TIMELINE
          ==================================================== */}

          <div className="mt-4 sm:mt-5">

            <Section
              title="Timeline"
              icon={Clock}
            >

              <Detail
                label="Created At"
                value={formatDate(
                  complaint.createdAt
                )}
              />

              <Detail
                label="Last Updated"
                value={formatDate(
                  complaint.updatedAt
                )}
              />

              <Detail
                label="Incident Date"
                value={formatDate(
                  complaint.incidentDateTime
                )}
              />

              <Detail
                label="Solved Date"
                value={formatDate(
                  complaint.solvedDateTime
                )}
              />

            </Section>

          </div>

          {/* ===================================================
              DESCRIPTION / HISTORY
          ==================================================== */}

          <div className="mt-4 rounded-2xl border border-slate-200 p-4 sm:mt-5 sm:p-5">

            <div className="flex items-center gap-2">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                <FileText size={18} />
              </div>

              <h3 className="font-bold text-slate-900">
                Complaint Description
              </h3>

            </div>

            {descriptions.length > 0 ? (

              <div className="mt-4 space-y-3 sm:mt-5 sm:space-y-4">

                {descriptions.map((item, index) => (

                  <div
                    key={item.id || index}
                    className="rounded-xl bg-slate-50 p-3 sm:p-4"
                  >

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                      <span className="w-fit rounded-full bg-slate-200 px-2.5 py-1 text-[11px] font-semibold capitalize text-slate-700">
                        {item.who || "Unknown"}
                      </span>

                      <span className="text-[11px] text-slate-400 sm:text-xs">
                        {formatDate(item.createdAt)}
                      </span>

                    </div>

                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      {item.message || "-"}
                    </p>

                  </div>

                ))}

              </div>

            ) : (

              <p className="mt-4 text-sm text-slate-500">
                No description available.
              </p>

            )}

          </div>

          {/* ===================================================
              COMPLAINT EVIDENCE
          ==================================================== */}

          {(evidenceImages.length > 0 ||
            evidenceVideos.length > 0) && (

            <div className="mt-4 rounded-2xl border border-slate-200 p-4 sm:mt-5 sm:p-5">

              <div className="flex items-center gap-2">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                  <FileText size={18} />
                </div>

                <h3 className="font-bold text-slate-900">
                  Complaint Evidence
                </h3>

              </div>

              {/* Evidence Images */}

              {evidenceImages.length > 0 && (

                <div className="mt-4 sm:mt-5">

                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <ImageIcon size={17} />
                    Evidence Images
                  </div>

                  <div className="grid grid-cols-1 gap-3 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">

                    {evidenceImages.map((item, index) => {

                      const url = getUrl(item);

                      if (!url) return null;

                      return (
                        <a
                          key={index}
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className="group overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
                        >

                          <img
                            src={url}
                            alt={`Evidence ${index + 1}`}
                            className="h-44 w-full object-cover transition duration-300 group-hover:scale-105 sm:h-40"
                          />

                        </a>
                      );
                    })}

                  </div>

                </div>

              )}

              {/* Evidence Videos */}

              {evidenceVideos.length > 0 && (

                <div className="mt-5">

                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <Video size={17} />
                    Evidence Videos
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">

                    {evidenceVideos.map((item, index) => {

                      const url = getUrl(item);

                      if (!url) return null;

                      return (
                        <video
                          key={index}
                          src={url}
                          controls
                          className="max-h-80 w-full rounded-xl bg-black"
                        />
                      );
                    })}

                  </div>

                </div>

              )}

            </div>
          )}

          {/* ===================================================
              SOLVED PROOF
          ==================================================== */}

          {(solvedImages.length > 0 ||
            solvedVideos.length > 0) && (

            <div className="mt-4 rounded-2xl border border-green-200 bg-green-50/30 p-4 sm:mt-5 sm:p-5">

              <div className="flex items-center gap-2">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-700">
                  <CheckCircle2 size={18} />
                </div>

                <h3 className="font-bold text-slate-900">
                  Solved Proof
                </h3>

              </div>

              {/* Solved Images */}

              {solvedImages.length > 0 && (

                <div className="mt-4 sm:mt-5">

                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <ImageIcon size={17} />
                    Solved Images
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">

                    {solvedImages.map((item, index) => {

                      const url = getUrl(item);

                      if (!url) return null;

                      return (
                        <a
                          key={index}
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className="group overflow-hidden rounded-xl border border-green-200 bg-white"
                        >

                          <img
                            src={url}
                            alt={`Solved proof ${index + 1}`}
                            className="h-44 w-full object-cover transition duration-300 group-hover:scale-105 sm:h-40"
                          />

                        </a>
                      );
                    })}

                  </div>

                </div>

              )}

              {/* Solved Videos */}

              {solvedVideos.length > 0 && (

                <div className="mt-5">

                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <Video size={17} />
                    Solved Videos
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">

                    {solvedVideos.map((item, index) => {

                      const url = getUrl(item);

                      if (!url) return null;

                      return (
                        <video
                          key={index}
                          src={url}
                          controls
                          className="max-h-80 w-full rounded-xl bg-black"
                        />
                      );
                    })}

                  </div>

                </div>

              )}

            </div>
          )}

        </div>

        {/* =====================================================
            FOOTER
        ====================================================== */}

        <div className="flex shrink-0 justify-end border-t border-slate-200 px-4 py-3 sm:px-6 sm:py-4">

          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 sm:w-auto"
          >
            Close
          </button>

        </div>

      </div>
    </div>
  );
};

// ============================================================
// SECTION
// ============================================================

const Section = ({
  title,
  icon: Icon,
  children,
}) => (
  <div className="rounded-2xl border border-slate-200 p-4 sm:p-5">

    <div className="flex items-center gap-2">

      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
        <Icon size={18} />
      </div>

      <h3 className="font-bold text-slate-900">
        {title}
      </h3>

    </div>

    <div className="mt-4 grid gap-4 sm:mt-5 sm:grid-cols-2">
      {children}
    </div>

  </div>
);

// ============================================================
// DETAIL
// ============================================================

const Detail = ({
  label,
  value,
  icon: Icon,
}) => (
  <div className="min-w-0">

    <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
      {label}
    </p>

    <div className="mt-1 flex min-w-0 items-center gap-1.5">

      {Icon && (
        <Icon
          size={14}
          className="shrink-0 text-slate-400"
        />
      )}

      <p className="break-words text-sm font-semibold capitalize text-slate-700">
        {value || "-"}
      </p>

    </div>

  </div>
);

export default ComplaintDetailsModal;