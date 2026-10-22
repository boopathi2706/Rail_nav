import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  Search,
  Filter,
  Eye,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  MapPin,
  Send,
  X,
  MessageSquare,
} from "lucide-react";

import ComplaintDetailsModal from "./ComplaintDetailsModal";
import SolvedComplaintModal from "./SolvedComplaintModal";
import Toast from "../auth/Toast";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:8000/api";

const OfficerComplaints = () => {
  // ============================================================
  // STATE
  // ============================================================

  const [complaints, setComplaints] = useState([]);

  const [loading, setLoading] = useState(true);

  const [selectedComplaint, setSelectedComplaint] =
    useState(null);

  const [showSolvedModal, setShowSolvedModal] =
    useState(false);

  // Move next station popup
  const [showMoveNextModal, setShowMoveNextModal] =
    useState(false);

  const [moveNextComplaint, setMoveNextComplaint] =
    useState(null);

  const [moveNextMessage, setMoveNextMessage] =
    useState("");

  const [submittingMoveNext, setSubmittingMoveNext] =
    useState(false);

  // Filters
  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [fromDate, setFromDate] = useState("");

  const [toDate, setToDate] = useState("");

  // Processing complaint
  const [processingId, setProcessingId] =
    useState(null);

  // complaintId -> true
  const [pendingSolvedRequests, setPendingSolvedRequests] =
    useState({});

  // Toast
  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });

  // ============================================================
  // TOAST
  // ============================================================

  const showToast = (
    message,
    type = "success"
  ) => {
    setToast({
      message,
      type,
    });
  };

  const closeToast = () => {
    setToast({
      message: "",
      type: "success",
    });
  };

  // ============================================================
  // AUTH CONFIG
  // ============================================================

  const getAuthConfig = () => {
    const token =
      localStorage.getItem("officerToken");

    if (!token) {
      throw new Error(
        "Officer authentication token not found"
      );
    }

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // ============================================================
  // FETCH COMPLAINTS
  // ============================================================

  const fetchComplaints = useCallback(
    async () => {
      try {
        setLoading(true);

        const config = getAuthConfig();

        const response = await axios.get(
          `${API_URL}/officers/complaints`,
          config
        );

        console.log(
          "COMPLAINT RESPONSE:",
          response.data
        );

        const complaintData =
          response.data?.data ||
          response.data?.complaints ||
          [];

        const finalComplaints =
          Array.isArray(complaintData)
            ? complaintData
            : [];

        setComplaints(finalComplaints);

        return finalComplaints;
      } catch (error) {
        console.error(
          "Complaints Error:",
          error.response?.data || error
        );

        showToast(
          error.response?.data?.message ||
            error.message ||
            "Failed to fetch complaints",
          "error"
        );

        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // ============================================================
  // CHECK PENDING SOLVED REQUEST
  // ============================================================

  const checkSolvedRequest = async (
    complaintId
  ) => {
    if (!complaintId) {
      return false;
    }

    try {
      const config = getAuthConfig();

      const response = await axios.get(
        `${API_URL}/request/check-solved-request`,
        {
          ...config,
          params: {
            complaintId,
          },
        }
      );

      console.log(
        "SOLVED REQUEST CHECK:",
        complaintId,
        response.data
      );

      /*
        Supported responses:

        {
          success: true,
          hasPendingRequest: true
        }

        OR

        {
          success: true,
          exists: true
        }

        OR

        {
          success: true,
          data: true
        }
      */

      const exists =
        response.data?.hasPendingRequest ??
        response.data?.exists ??
        response.data?.data ??
        false;

      return Boolean(exists);
    } catch (error) {
      console.error(
        "Check Solved Request Error:",
        error.response?.data || error
      );

      return false;
    }
  };

  // ============================================================
  // CHECK ALL ONGOING COMPLAINTS
  // ============================================================

  const checkPendingSolvedRequests =
    useCallback(
      async (complaintList) => {
        const ongoingComplaints =
          complaintList.filter(
            (complaint) =>
              complaint.status?.toLowerCase() ===
              "ongoing"
          );

        if (
          ongoingComplaints.length === 0
        ) {
          setPendingSolvedRequests({});
          return;
        }

        const result = {};

        await Promise.all(
          ongoingComplaints.map(
            async (complaint) => {
              const exists =
                await checkSolvedRequest(
                  complaint._id
                );

              result[complaint._id] =
                exists;
            }
          )
        );

        setPendingSolvedRequests(result);
      },
      []
    );

  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  // ============================================================
  // CHECK REQUESTS AFTER COMPLAINTS LOAD
  // ============================================================

  useEffect(() => {
    if (complaints.length > 0) {
      checkPendingSolvedRequests(
        complaints
      );
    } else {
      setPendingSolvedRequests({});
    }
  }, [
    complaints,
    checkPendingSolvedRequests,
  ]);

  // ============================================================
  // MOVE PENDING -> ONGOING
  // ============================================================

  const handleMoveToOngoing = async (
    complaint
  ) => {
    if (!complaint?._id) {
      return;
    }

    try {
      setProcessingId(complaint._id);

      const config = getAuthConfig();

      const response = await axios.put(
        `${API_URL}/complaints/${complaint._id}/ongoing`,
        {},
        config
      );

      console.log(
        "MOVE ONGOING RESPONSE:",
        response.data
      );

      showToast(
        response.data?.message ||
          "Complaint moved to ongoing",
        "success"
      );

      await fetchComplaints();
    } catch (error) {
      console.error(
        "Move Ongoing Error:",
        error.response?.data || error
      );

      showToast(
        error.response?.data?.message ||
          "Failed to move complaint to ongoing",
        "error"
      );
    } finally {
      setProcessingId(null);
    }
  };

  // ============================================================
  // OPEN MOVE NEXT STATION POPUP
  // ============================================================

  const handleOpenMoveNextModal = (
    complaint
  ) => {
    if (!complaint?._id) {
      return;
    }

    setMoveNextComplaint(complaint);

    // Clear previous message
    setMoveNextMessage("");

    setShowMoveNextModal(true);
  };

  // ============================================================
  // CLOSE MOVE NEXT STATION POPUP
  // ============================================================

  const handleCloseMoveNextModal = () => {
    if (submittingMoveNext) {
      return;
    }

    setShowMoveNextModal(false);

    setMoveNextComplaint(null);

    setMoveNextMessage("");
  };

  // ============================================================
  // MOVE TO NEXT STATION
  // ============================================================

  const handleMoveNextStation = async () => {
    if (!moveNextComplaint?._id) {
      return;
    }

    const trimmedMessage =
      moveNextMessage.trim();

    // ----------------------------------------------------------
    // VALIDATE MESSAGE
    // ----------------------------------------------------------

    if (!trimmedMessage) {
      showToast(
        "Please enter a message before moving the complaint.",
        "error"
      );

      return;
    }

    try {
      setSubmittingMoveNext(true);

      setProcessingId(
        moveNextComplaint._id
      );

      const config = getAuthConfig();

      // --------------------------------------------------------
      // BACKEND REQUEST
      // --------------------------------------------------------

      const requestData = {
        complaintId:
          moveNextComplaint._id,

        message: trimmedMessage,

        who: "officer",
      };

      console.log(
        "MOVE NEXT STATION REQUEST:",
        requestData
      );

      const response = await axios.put(
        `${API_URL}/complaints/officer/move-next-station`,
        requestData,
        config
      );

      console.log(
        "MOVE NEXT STATION RESPONSE:",
        response.data
      );

      // --------------------------------------------------------
      // SUCCESS
      // --------------------------------------------------------

      if (
        response.status >= 200 &&
        response.status < 300
      ) {
        // Close popup immediately
        setShowMoveNextModal(false);

        setMoveNextComplaint(null);

        setMoveNextMessage("");

        showToast(
          response.data?.message ||
            "Complaint moved to next station successfully.",
          "success"
        );

        // ------------------------------------------------------
        // REFRESH COMPLAINTS
        // ------------------------------------------------------

        const updatedComplaints =
          await fetchComplaints();

        // ------------------------------------------------------
        // UPDATE OPEN DETAILS MODAL
        // ------------------------------------------------------

        if (
          selectedComplaint?._id ===
          moveNextComplaint._id
        ) {
          const updatedComplaint =
            updatedComplaints.find(
              (item) =>
                item._id ===
                moveNextComplaint._id
            );

          if (updatedComplaint) {
            setSelectedComplaint(
              updatedComplaint
            );
          }
        }

        return;
      }

      showToast(
        response.data?.message ||
          "Failed to move complaint to next station.",
        "error"
      );
    } catch (error) {
      console.error(
        "Move Next Station Error:",
        error.response?.data || error
      );

      showToast(
        error.response?.data?.message ||
          "Failed to move complaint to next station.",
        "error"
      );
    } finally {
      setSubmittingMoveNext(false);

      setProcessingId(null);
    }
  };

  // ============================================================
  // OPEN SOLVED MODAL
  // ============================================================

  const handleOpenSolvedModal = async (
    complaint
  ) => {
    if (!complaint?._id) {
      return;
    }

    try {
      setProcessingId(complaint._id);

      /*
        Always check backend before opening
        solved proof popup.
      */

      const exists =
        await checkSolvedRequest(
          complaint._id
        );

      if (exists) {
        setPendingSolvedRequests(
          (previous) => ({
            ...previous,
            [complaint._id]: true,
          })
        );

        showToast(
          "Solved proof has already been submitted. Waiting for user confirmation.",
          "error"
        );

        return;
      }

      // No pending request
      setSelectedComplaint(complaint);

      setShowSolvedModal(true);
    } catch (error) {
      console.error(
        "Open Solved Modal Error:",
        error
      );

      showToast(
        "Unable to check solved request",
        "error"
      );
    } finally {
      setProcessingId(null);
    }
  };

  // ============================================================
  // CLOSE SOLVED MODAL
  // ============================================================

  const handleCloseSolvedModal = () => {
    setShowSolvedModal(false);

    setSelectedComplaint(null);
  };

  // ============================================================
  // AFTER SOLVED PROOF SUCCESSFULLY SUBMITTED
  // ============================================================

  const handleSolvedSubmitted =
    async () => {
      console.log(
        "Solved proof submitted successfully."
      );

      /*
        CLOSE POPUP FIRST
      */

      setShowSolvedModal(false);

      setSelectedComplaint(null);

      /*
        SHOW SUCCESS TOAST
      */

      showToast(
        "Solved proof submitted successfully. Waiting for user confirmation.",
        "success"
      );

      /*
        REFRESH COMPLAINTS
      */

      await fetchComplaints();
    };

  // ============================================================
  // VIEW COMPLAINT
  // ============================================================

  const handleViewComplaint = (
    complaint
  ) => {
    setSelectedComplaint(complaint);

    setShowSolvedModal(false);
  };

  // ============================================================
  // FILTER
  // ============================================================

  const filteredComplaints =
    complaints.filter(
      (complaint) => {
        const normalizedSearch =
          search.trim().toLowerCase();

        const matchesSearch =
          !normalizedSearch ||
          complaint.userName
            ?.toLowerCase()
            .includes(
              normalizedSearch
            ) ||
          String(
            complaint.pnrNumber || ""
          )
            .toLowerCase()
            .includes(
              normalizedSearch
            ) ||
          String(
            complaint.trainNumber || ""
          )
            .toLowerCase()
            .includes(
              normalizedSearch
            ) ||
          complaint.complaintCategory
            ?.toLowerCase()
            .includes(
              normalizedSearch
            );

        const status =
          complaint.status?.toLowerCase() ||
          "";

        const matchesStatus =
          statusFilter === "all" ||
          status === statusFilter;

        let matchesDate = true;

        const dateValue =
          complaint.incidentDateTime ||
          complaint.createdAt;

        if (dateValue) {
          const complaintDate =
            new Date(dateValue);

          if (fromDate) {
            const start =
              new Date(fromDate);

            start.setHours(
              0,
              0,
              0,
              0
            );

            if (
              complaintDate < start
            ) {
              matchesDate = false;
            }
          }

          if (toDate) {
            const end =
              new Date(toDate);

            end.setHours(
              23,
              59,
              59,
              999
            );

            if (
              complaintDate > end
            ) {
              matchesDate = false;
            }
          }
        }

        return (
          matchesSearch &&
          matchesStatus &&
          matchesDate
        );
      }
    );

  // ============================================================
  // DATE FORMAT
  // ============================================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    const parsed = new Date(date);

    if (
      Number.isNaN(
        parsed.getTime()
      )
    ) {
      return String(date);
    }

    return parsed.toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // ============================================================
  // STATUS STYLE
  // ============================================================

  const getStatusStyle = (
    status
  ) => {
    switch (
      status?.toLowerCase()
    ) {
      case "solved":
        return "bg-green-100 text-green-700 border-green-200";

      case "ongoing":
        return "bg-blue-100 text-blue-700 border-blue-200";

      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";

      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  // ============================================================
  // STATUS ICON
  // ============================================================

  const StatusIcon = ({
    status,
  }) => {
    switch (
      status?.toLowerCase()
    ) {
      case "solved":
        return (
          <CheckCircle2 size={15} />
        );

      case "ongoing":
        return (
          <Clock size={15} />
        );

      case "pending":
        return (
          <AlertCircle size={15} />
        );

      default:
        return (
          <Clock size={15} />
        );
    }
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2
            size={36}
            className="animate-spin text-slate-700"
          />

          <p className="text-sm font-medium text-slate-500">
            Loading complaints...
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // UI
  // ============================================================

  return (
    <>
      <div className="space-y-5">
        {/* ====================================================
            HEADER
        ===================================================== */}

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Complaints
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage complaints assigned
              to you.
            </p>
          </div>

          <button
            type="button"
            onClick={
              fetchComplaints
            }
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh
          </button>
        </div>

        {/* ====================================================
            FILTER
        ===================================================== */}

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-3 lg:grid-cols-12">
            {/* Search */}

            <div className="relative lg:col-span-4">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Search name, PNR, train..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
              />
            </div>

            {/* Status */}

            <div className="relative lg:col-span-2">
              <Filter
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <select
                value={
                  statusFilter
                }
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value
                  )
                }
                className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-slate-400"
              >
                <option value="all">
                  All Status
                </option>

                <option value="pending">
                  Pending
                </option>

                <option value="ongoing">
                  Ongoing
                </option>

                <option value="solved">
                  Solved
                </option>
              </select>
            </div>

            {/* From */}

            <div className="lg:col-span-2">
              <input
                type="date"
                value={fromDate}
                onChange={(e) =>
                  setFromDate(
                    e.target.value
                  )
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
              />
            </div>

            {/* To */}

            <div className="lg:col-span-2">
              <input
                type="date"
                value={toDate}
                onChange={(e) =>
                  setToDate(
                    e.target.value
                  )
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
              />
            </div>

            {/* Clear */}

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setStatusFilter(
                  "all"
                );
                setFromDate("");
                setToDate("");
              }}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 lg:col-span-2"
            >
              Clear
            </button>
          </div>
        </div>

        {/* ====================================================
            COUNT
        ===================================================== */}

        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-bold text-slate-800">
              {
                filteredComplaints.length
              }
            </span>{" "}
            of{" "}
            <span className="font-bold text-slate-800">
              {complaints.length}
            </span>{" "}
            complaints
          </p>
        </div>

        {/* ====================================================
            EMPTY
        ===================================================== */}

        {filteredComplaints.length ===
        0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
              <AlertCircle
                size={25}
                className="text-slate-400"
              />
            </div>

            <h3 className="mt-4 text-base font-bold text-slate-800">
              No complaints found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Try changing your search
              or filters.
            </p>
          </div>
        ) : (
          <>
            {/* ==================================================
                DESKTOP TABLE
            =================================================== */}

            <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:block">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1150px]">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                        Passenger
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                        Train
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                        Category
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                        Incident
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                        Status
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredComplaints.map(
                      (complaint) => {
                        const status =
                          complaint.status?.toLowerCase();

                        const hasPendingSolvedRequest =
                          Boolean(
                            pendingSolvedRequests[
                              complaint._id
                            ]
                          );

                        const isProcessing =
                          processingId ===
                          complaint._id;

                        return (
                          <tr
                            key={
                              complaint._id
                            }
                            className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70"
                          >
                            {/* Passenger */}

                            <td className="px-5 py-4">
                              <p className="font-semibold text-slate-800">
                                {complaint.userName ||
                                  "-"}
                              </p>

                              <p className="mt-1 text-xs text-slate-500">
                                PNR:{" "}
                                {complaint.pnrNumber ||
                                  "-"}
                              </p>
                            </td>

                            {/* Train */}

                            <td className="px-5 py-4">
                              <p className="text-sm font-semibold text-slate-800">
                                {complaint.trainNumber ||
                                  "-"}
                              </p>
                            </td>

                            {/* Category */}

                            <td className="px-5 py-4">
                              <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold capitalize text-slate-700">
                                {complaint.complaintCategory ||
                                  "-"}
                              </span>
                            </td>

                            {/* Incident */}

                            <td className="px-5 py-4">
                              <p className="text-xs font-medium text-slate-600">
                                {formatDate(
                                  complaint.incidentDateTime
                                )}
                              </p>
                            </td>

                            {/* Status */}

                            <td className="px-5 py-4">
                              <span
                                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${getStatusStyle(
                                  complaint.status
                                )}`}
                              >
                                <StatusIcon
                                  status={
                                    complaint.status
                                  }
                                />

                                {complaint.status ||
                                  "Unknown"}
                              </span>

                              {status ===
                                "ongoing" &&
                                hasPendingSolvedRequest && (
                                  <p className="mt-1 text-[11px] font-medium text-orange-600">
                                    Waiting for
                                    user
                                  </p>
                                )}
                            </td>

                            {/* Action */}

                            <td className="px-5 py-4">
                              <div className="flex flex-wrap justify-end gap-2">
                                {/* View */}

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleViewComplaint(
                                      complaint
                                    )
                                  }
                                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                                >
                                  <Eye
                                    size={
                                      15
                                    }
                                  />

                                  View
                                </button>

                                {/* Pending */}

                                {status ===
                                  "pending" && (
                                  <button
                                    type="button"
                                    disabled={
                                      isProcessing
                                    }
                                    onClick={() =>
                                      handleMoveToOngoing(
                                        complaint
                                      )
                                    }
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                                  >
                                    {isProcessing ? (
                                      <Loader2
                                        size={
                                          15
                                        }
                                        className="animate-spin"
                                      />
                                    ) : (
                                      <ArrowRight
                                        size={
                                          15
                                        }
                                      />
                                    )}

                                    Take
                                    Complaint
                                  </button>
                                )}

                                {/* Ongoing */}

                                {status ===
                                  "ongoing" && (
                                  <>
                                    {/* Submit Proof */}

                                    {!hasPendingSolvedRequest ? (
                                      <button
                                        type="button"
                                        disabled={
                                          isProcessing
                                        }
                                        onClick={() =>
                                          handleOpenSolvedModal(
                                            complaint
                                          )
                                        }
                                        className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                                      >
                                        {isProcessing ? (
                                          <Loader2
                                            size={
                                              15
                                            }
                                            className="animate-spin"
                                          />
                                        ) : (
                                          <Send
                                            size={
                                              15
                                            }
                                          />
                                        )}

                                        Submit
                                        Proof
                                      </button>
                                    ) : (
                                      <button
                                        type="button"
                                        disabled
                                        className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-lg bg-orange-100 px-3 py-2 text-xs font-semibold text-orange-700"
                                      >
                                        <Clock
                                          size={
                                            15
                                          }
                                        />

                                        Waiting
                                        for
                                        User
                                      </button>
                                    )}

                                    {/* Move Next Station */}

                                    <button
                                      type="button"
                                      disabled={
                                        isProcessing
                                      }
                                      onClick={() =>
                                        handleOpenMoveNextModal(
                                          complaint
                                        )
                                      }
                                      className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                      <MapPin
                                        size={
                                          15
                                        }
                                      />

                                      Move Next
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ==================================================
                MOBILE / TABLET
            =================================================== */}

            <div className="grid gap-4 lg:hidden">
              {filteredComplaints.map(
                (complaint) => {
                  const status =
                    complaint.status?.toLowerCase();

                  const hasPendingSolvedRequest =
                    Boolean(
                      pendingSolvedRequests[
                        complaint._id
                      ]
                    );

                  const isProcessing =
                    processingId ===
                    complaint._id;

                  return (
                    <div
                      key={
                        complaint._id
                      }
                      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                    >
                      {/* Header */}

                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="truncate font-bold text-slate-900">
                            {complaint.userName ||
                              "-"}
                          </h3>

                          <p className="mt-1 text-xs text-slate-500">
                            PNR:{" "}
                            {complaint.pnrNumber ||
                              "-"}
                          </p>
                        </div>

                        <span
                          className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${getStatusStyle(
                            complaint.status
                          )}`}
                        >
                          <StatusIcon
                            status={
                              complaint.status
                            }
                          />

                          {complaint.status ||
                            "Unknown"}
                        </span>
                      </div>

                      {/* Details */}

                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <div className="rounded-xl bg-slate-50 p-3">
                          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                            Train
                          </p>

                          <p className="mt-1 text-sm font-semibold text-slate-700">
                            {complaint.trainNumber ||
                              "-"}
                          </p>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-3">
                          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                            Category
                          </p>

                          <p className="mt-1 text-sm font-semibold capitalize text-slate-700">
                            {complaint.complaintCategory ||
                              "-"}
                          </p>
                        </div>

                        <div className="col-span-2 rounded-xl bg-slate-50 p-3">
                          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                            Incident
                          </p>

                          <p className="mt-1 text-sm font-semibold text-slate-700">
                            {formatDate(
                              complaint.incidentDateTime
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Waiting */}

                      {status ===
                        "ongoing" &&
                        hasPendingSolvedRequest && (
                          <div className="mt-3 flex items-center gap-2 rounded-xl bg-orange-50 p-3 text-xs font-semibold text-orange-700">
                            <Clock
                              size={16}
                            />

                            Waiting for
                            user
                            confirmation
                          </div>
                        )}

                      {/* Actions */}

                      <div className="mt-4 flex flex-col gap-2">
                        {/* View */}

                        <button
                          type="button"
                          onClick={() =>
                            handleViewComplaint(
                              complaint
                            )
                          }
                          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          <Eye size={17} />

                          View Complaint
                        </button>

                        {/* Pending */}

                        {status ===
                          "pending" && (
                          <button
                            type="button"
                            disabled={
                              isProcessing
                            }
                            onClick={() =>
                              handleMoveToOngoing(
                                complaint
                              )
                            }
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                          >
                            {isProcessing ? (
                              <Loader2
                                size={
                                  17
                                }
                                className="animate-spin"
                              />
                            ) : (
                              <ArrowRight
                                size={
                                  17
                                }
                              />
                            )}

                            Take
                            Complaint
                          </button>
                        )}

                        {/* Ongoing */}

                        {status ===
                          "ongoing" && (
                          <>
                            {/* Submit Proof */}

                            {!hasPendingSolvedRequest ? (
                              <button
                                type="button"
                                disabled={
                                  isProcessing
                                }
                                onClick={() =>
                                  handleOpenSolvedModal(
                                    complaint
                                  )
                                }
                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
                              >
                                {isProcessing ? (
                                  <Loader2
                                    size={
                                      17
                                    }
                                    className="animate-spin"
                                  />
                                ) : (
                                  <Send
                                    size={
                                      17
                                    }
                                  />
                                )}

                                Submit
                                Solved
                                Proof
                              </button>
                            ) : (
                              <button
                                type="button"
                                disabled
                                className="inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-orange-100 px-4 py-2.5 text-sm font-semibold text-orange-700"
                              >
                                <Clock
                                  size={
                                    17
                                  }
                                />

                                Waiting
                                for User
                                Confirmation
                              </button>
                            )}

                            {/* Move Next */}

                            <button
                              type="button"
                              disabled={
                                isProcessing
                              }
                              onClick={() =>
                                handleOpenMoveNextModal(
                                  complaint
                                )
                              }
                              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100 disabled:opacity-50"
                            >
                              <MapPin
                                size={
                                  17
                                }
                              />

                              Move to
                              Next Station
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </>
        )}
      </div>

      {/* ========================================================
          COMPLAINT DETAILS MODAL
      ========================================================= */}

      {selectedComplaint &&
        !showSolvedModal &&
        !showMoveNextModal && (
          <ComplaintDetailsModal
            complaint={
              selectedComplaint
            }
            onClose={() =>
              setSelectedComplaint(
                null
              )
            }
          />
        )}

      {/* ========================================================
          SOLVED COMPLAINT MODAL
      ========================================================= */}

      {showSolvedModal &&
        selectedComplaint && (
          <SolvedComplaintModal
            complaint={
              selectedComplaint
            }
            onClose={
              handleCloseSolvedModal
            }
            onSubmitted={
              handleSolvedSubmitted
            }
          />
        )}

      {/* ========================================================
          MOVE NEXT STATION MODAL
      ========================================================= */}

      {showMoveNextModal &&
        moveNextComplaint && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
              {/* ==================================================
                  MODAL HEADER
              ================================================== */}

              <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                    <MapPin
                      size={22}
                    />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Move to Next Station
                    </h2>

                    <p className="mt-0.5 text-xs text-slate-500">
                      Add a message before
                      forwarding the complaint.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={
                    handleCloseMoveNextModal
                  }
                  disabled={
                    submittingMoveNext
                  }
                  className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <X size={21} />
                </button>
              </div>

              {/* ==================================================
                  MODAL CONTENT
              ================================================== */}

              <div className="px-6 py-5">
                {/* Complaint info */}

                <div className="mb-5 rounded-2xl bg-slate-50 p-4">
                  <div className="flex items-center gap-2">
                    <MessageSquare
                      size={17}
                      className="text-slate-500"
                    />

                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Complaint
                    </p>
                  </div>

                  <p className="mt-2 text-sm font-bold text-slate-800">
                    PNR:{" "}
                    {moveNextComplaint.pnrNumber ||
                      "-"}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Train:{" "}
                    {moveNextComplaint.trainNumber ||
                      "-"}
                  </p>
                </div>

                {/* Message */}

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="moveNextMessage"
                      className="text-sm font-bold text-slate-800"
                    >
                      Message
                    </label>

                    <span className="text-xs text-slate-400">
                      {moveNextMessage.length}
                      /500
                    </span>
                  </div>

                  <textarea
                    id="moveNextMessage"
                    value={
                      moveNextMessage
                    }
                    onChange={(e) => {
                      if (
                        e.target.value
                          .length <= 500
                      ) {
                        setMoveNextMessage(
                          e.target.value
                        );
                      }
                    }}
                    disabled={
                      submittingMoveNext
                    }
                    rows={5}
                    maxLength={500}
                    placeholder="Enter a message explaining why this complaint is being moved to the next station..."
                    className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  <p className="mt-2 text-xs text-slate-400">
                    This message will be added
                    to the complaint history as
                    an officer message.
                  </p>
                </div>
              </div>

              {/* ==================================================
                  MODAL FOOTER
              ================================================== */}

              <div className="flex flex-col-reverse gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={
                    handleCloseMoveNextModal
                  }
                  disabled={
                    submittingMoveNext
                  }
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={
                    handleMoveNextStation
                  }
                  disabled={
                    submittingMoveNext ||
                    !moveNextMessage.trim()
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submittingMoveNext ? (
                    <>
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />

                      Moving...
                    </>
                  ) : (
                    <>
                      <MapPin
                        size={17}
                      />

                      Move to Next
                      Station
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

      {/* ========================================================
          TOAST
      ========================================================= */}

      {toast.message && (
        <Toast
          message={
            toast.message
          }
          type={toast.type}
          onClose={
            closeToast
          }
        />
      )}
    </>
  );
};

export default OfficerComplaints;