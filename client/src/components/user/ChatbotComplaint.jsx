import React, { useState } from "react";
import {
  Bot,
  User,
  Send,
  RotateCcw,
  CheckCircle,
  Paperclip,
} from "lucide-react";

import TicketUploader from "./TicketUploader";
import FieldApproval from "./FieldApproval";
import ComplaintReview from "./ComplaintReview";
import Toast from "../auth/Toast";
import { createComplaint } from "../../services/userApi";

const CATEGORIES = [
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

const STEPS = [
  "pnrNumber",
  "trainNumber",
  "incidentDateTime",
  "complaintCategory",
  "description",
];

const LABELS = {
  pnrNumber: "PNR Number",
  trainNumber: "Train Number",
  incidentDateTime: "Incident Date & Time",
  complaintCategory: "Complaint Category",
  description: "Complaint Description",
};

const ChatbotComplaint = ({ onSuccess }) => {
  const [step, setStep] = useState(0);

  const [form, setForm] = useState({
    pnrNumber: "",
    trainNumber: "",
    incidentDateTime: "",
    complaintCategory: "",
    description: "",
  });

  const [approved, setApproved] = useState({});

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Hello! 👋 I will help you create your railway complaint. I will ask for each detail one by one and ask you to confirm every answer.",
    },
    {
      id: 2,
      sender: "bot",
      text: "You can also upload your train ticket first, and ticket information can be used to fill the complaint details.",
    },
  ]);

  const [input, setInput] = useState("");

  const [showTicketUploader, setShowTicketUploader] =
    useState(true);

  const [showReview, setShowReview] = useState(false);

  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);

  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });

  const currentField = STEPS[step];

  const addMessage = (sender, text) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        sender,
        text,
      },
    ]);
  };

  const getQuestion = (field) => {
    switch (field) {
      case "pnrNumber":
        return "What is your PNR number?";

      case "trainNumber":
        return "What is your train number?";

      case "incidentDateTime":
        return "When did the incident happen? Please enter the date and time.";

      case "complaintCategory":
        return "Please select the complaint category.";

      case "description":
        return "Please describe your complaint clearly. Tell me what happened.";

      default:
        return "";
    }
  };

  const startConversation = () => {
    addMessage("bot", getQuestion(currentField));
  };

  const handleTicketData = (ticketData) => {
    if (!ticketData) return;

    const updated = {
      ...form,
      ...(ticketData.pnrNumber && {
        pnrNumber: ticketData.pnrNumber,
      }),
      ...(ticketData.trainNumber && {
        trainNumber: ticketData.trainNumber,
      }),
      ...(ticketData.incidentDateTime && {
        incidentDateTime: ticketData.incidentDateTime,
      }),
    };

    setForm(updated);

    if (ticketData.pnrNumber) {
      addMessage(
        "bot",
        `I found PNR number "${ticketData.pnrNumber}" from the ticket.`
      );
    }

    if (ticketData.trainNumber) {
      addMessage(
        "bot",
        `I found train number "${ticketData.trainNumber}" from the ticket.`
      );
    }

    if (ticketData.incidentDateTime) {
      addMessage(
        "bot",
        `I found the incident date/time "${ticketData.incidentDateTime}" from the ticket.`
      );
    }

    addMessage(
      "bot",
      "Please verify each extracted field before continuing."
    );

    setShowTicketUploader(false);

    setTimeout(() => {
      setStep(0);
    }, 100);
  };

  const handleInputSubmit = () => {
    const value = input.trim();

    if (!value) return;

    setForm((prev) => ({
      ...prev,
      [currentField]: value,
    }));

    addMessage("user", value);

    addMessage(
      "bot",
      `I received your ${LABELS[currentField].toLowerCase()}. Please verify it below.`
    );

    setInput("");
  };

  const handleApprove = (field) => {
    setApproved((prev) => ({
      ...prev,
      [field]: true,
    }));

    addMessage(
      "user",
      `Yes, my ${LABELS[field].toLowerCase()} is correct.`
    );

    moveToNextField(field);
  };

  const handleReject = (field) => {
    setApproved((prev) => ({
      ...prev,
      [field]: false,
    }));

    setForm((prev) => ({
      ...prev,
      [field]: "",
    }));

    addMessage(
      "user",
      `No, I want to enter my ${LABELS[field].toLowerCase()} again.`
    );

    addMessage("bot", getQuestion(field));
  };

  const handleEdit = (field) => {
    setApproved((prev) => ({
      ...prev,
      [field]: false,
    }));

    addMessage(
      "bot",
      `Please enter the correct ${LABELS[field].toLowerCase()}.`
    );
  };

  const moveToNextField = (field) => {
    const currentIndex = STEPS.indexOf(field);
    const nextIndex = currentIndex + 1;

    if (nextIndex >= STEPS.length) {
      addMessage(
        "bot",
        "Excellent! All complaint details have been collected. Please review your complaint before submitting."
      );

      setShowReview(true);
      return;
    }

    setTimeout(() => {
      setStep(nextIndex);
      addMessage(
        "bot",
        getQuestion(STEPS[nextIndex])
      );
    }, 300);
  };

  const handleCategorySelect = (category) => {
    setForm((prev) => ({
      ...prev,
      complaintCategory: category,
    }));

    addMessage("user", category);

    addMessage(
      "bot",
      `You selected "${category}". Please confirm this category below.`
    );
  };

  const handleImages = (e) => {
    const selected = Array.from(e.target.files || []);

    setImages(selected.slice(0, 5));
  };

  const handleVideos = (e) => {
    const selected = Array.from(e.target.files || []);

    setVideos(selected.slice(0, 3));
  };

  const submitComplaint = async () => {
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

      formData.append("description", form.description);

      images.forEach((file) => {
        formData.append("images", file);
      });

      videos.forEach((file) => {
        formData.append("videos", file);
      });

      const response = await createComplaint(formData);

      if (response?.success === false) {
        throw new Error(
          response.message || "Failed to create complaint"
        );
      }

      setToast({
        message:
          response?.message ||
          "Complaint submitted successfully",
        type: "success",
      });

      onSuccess?.();

      resetConversation();
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

  const resetConversation = () => {
    setStep(0);

    setForm({
      pnrNumber: "",
      trainNumber: "",
      incidentDateTime: "",
      complaintCategory: "",
      description: "",
    });

    setApproved({});

    setImages([]);
    setVideos([]);

    setShowReview(false);

    setMessages([
      {
        id: Date.now(),
        sender: "bot",
        text: "New complaint started. Let's collect the details again.",
      },
    ]);

    setShowTicketUploader(true);
  };

  const fieldValue = form[currentField];

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

      {showReview ? (
        <div className="space-y-6">

          <ComplaintReview
            complaint={form}
            onBack={() => setShowReview(false)}
            onSubmit={submitComplaint}
            loading={loading}
          />

          {/* Evidence */}
          <div className="mx-auto max-w-3xl rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">

            <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
              Add Evidence
            </h3>

            <div className="grid gap-4 md:grid-cols-2">

              <label className="cursor-pointer rounded-xl border-2 border-dashed border-gray-300 p-5 text-center transition hover:border-blue-500 dark:border-gray-700">
                <Paperclip className="mx-auto mb-2 text-blue-500" />

                <p className="text-sm font-bold">
                  Upload Images
                </p>

                <p className="text-xs text-gray-500">
                  Maximum 5 images
                </p>

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={handleImages}
                />

                {images.length > 0 && (
                  <p className="mt-2 text-xs font-semibold text-green-600">
                    {images.length} selected
                  </p>
                )}
              </label>

              <label className="cursor-pointer rounded-xl border-2 border-dashed border-gray-300 p-5 text-center transition hover:border-purple-500 dark:border-gray-700">
                <Paperclip className="mx-auto mb-2 text-purple-500" />

                <p className="text-sm font-bold">
                  Upload Videos
                </p>

                <p className="text-xs text-gray-500">
                  Maximum 3 videos
                </p>

                <input
                  type="file"
                  accept="video/*"
                  multiple
                  hidden
                  onChange={handleVideos}
                />

                {videos.length > 0 && (
                  <p className="mt-2 text-xs font-semibold text-green-600">
                    {videos.length} selected
                  </p>
                )}
              </label>

            </div>
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-4xl">

          {/* Header */}
          <div className="mb-5 flex items-center justify-between">

            <div>
              <h2 className="text-xl font-black text-gray-900 dark:text-white">
                AI Complaint Assistant
              </h2>

              <p className="text-sm text-gray-500">
                I'll collect and verify each complaint detail.
              </p>
            </div>

            <button
              type="button"
              onClick={resetConversation}
              className="flex items-center gap-2 rounded-xl border border-gray-300 px-3 py-2 text-sm font-bold hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
            >
              <RotateCcw size={16} />
              Reset
            </button>

          </div>

          {/* Ticket uploader */}
          {showTicketUploader && (
            <div className="mb-5">
              <TicketUploader
                onExtracted={handleTicketData}
              />
            </div>
          )}

          {/* Chat */}
          <div className="mb-5 h-[420px] overflow-y-auto rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-950">

            <div className="space-y-4">

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.sender === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >

                  {message.sender === "bot" && (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
                      <Bot size={18} />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                      message.sender === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-800 shadow-sm dark:bg-gray-900 dark:text-gray-200"
                    }`}
                  >
                    {message.text}
                  </div>

                  {message.sender === "user" && (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-800 text-white">
                      <User size={18} />
                    </div>
                  )}

                </div>
              ))}

            </div>
          </div>

          {/* Current field */}
          {fieldValue && !approved[currentField] && (
            <div className="mb-5">

              <FieldApproval
                label={LABELS[currentField]}
                value={
                  currentField === "complaintCategory"
                    ? fieldValue
                    : currentField === "incidentDateTime"
                    ? new Date(
                        fieldValue
                      ).toLocaleString("en-IN")
                    : fieldValue
                }
                onApprove={() =>
                  handleApprove(currentField)
                }
                onReject={() =>
                  handleReject(currentField)
                }
                onEdit={() =>
                  handleEdit(currentField)
                }
              />

            </div>
          )}

          {/* Category selector */}
          {currentField === "complaintCategory" &&
            !fieldValue && (
              <div className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">

                {CATEGORIES.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() =>
                      handleCategorySelect(category)
                    }
                    className="rounded-xl border border-gray-300 bg-white px-3 py-3 text-sm font-semibold capitalize transition hover:border-blue-500 hover:bg-blue-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-blue-900/20"
                  >
                    {category}
                  </button>
                ))}

              </div>
            )}

          {/* Text input */}
          {currentField !== "complaintCategory" &&
            (!fieldValue || !approved[currentField]) && (
              <div className="flex gap-2">

                <input
                  type={
                    currentField === "incidentDateTime"
                      ? "datetime-local"
                      : "text"
                  }
                  value={input}
                  onChange={(e) =>
                    setInput(e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleInputSubmit();
                    }
                  }}
                  placeholder={`Enter ${LABELS[
                    currentField
                  ].toLowerCase()}`}
                  className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900"
                />

                <button
                  type="button"
                  onClick={handleInputSubmit}
                  className="flex items-center justify-center rounded-xl bg-blue-600 px-5 text-white transition hover:bg-blue-700"
                >
                  <Send size={18} />
                </button>

              </div>
            )}

          {/* Progress */}
          <div className="mt-6">

            <div className="mb-2 flex justify-between text-xs font-semibold text-gray-500">
              <span>
                Step {Math.min(step + 1, STEPS.length)} of{" "}
                {STEPS.length}
              </span>

              <span>
                {Math.round(
                  ((step + 1) / STEPS.length) * 100
                )}
                %
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
              <div
                className="h-full rounded-full bg-blue-600 transition-all"
                style={{
                  width: `${
                    ((step + 1) / STEPS.length) * 100
                  }%`,
                }}
              />
            </div>

          </div>

          {/* Completed fields */}
          <div className="mt-6 grid gap-3 sm:grid-cols-2">

            {STEPS.map((field) => (
              <div
                key={field}
                className={`flex items-center gap-2 rounded-xl border p-3 ${
                  approved[field]
                    ? "border-green-200 bg-green-50 dark:border-green-900/40 dark:bg-green-900/10"
                    : "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"
                }`}
              >
                <CheckCircle
                  size={17}
                  className={
                    approved[field]
                      ? "text-green-600"
                      : "text-gray-300"
                  }
                />

                <span className="text-sm font-semibold capitalize text-gray-700 dark:text-gray-300">
                  {LABELS[field]}
                </span>
              </div>
            ))}

          </div>

        </div>
      )}
    </>
  );
};

export default ChatbotComplaint;