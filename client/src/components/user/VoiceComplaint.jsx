import React, { useEffect, useRef, useState } from "react";
import {
  Mic,
  MicOff,
  Volume2,
  RotateCcw,
  CheckCircle,
  Bot,
  User,
  Send,
} from "lucide-react";

import FieldApproval from "./FieldApproval";
import ComplaintReview from "./ComplaintReview";
import TicketUploader from "./TicketUploader";
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

const FIELDS = [
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

const VoiceComplaint = ({ onSuccess }) => {
  const [step, setStep] = useState(0);

  const [form, setForm] = useState({
    pnrNumber: "",
    trainNumber: "",
    incidentDateTime: "",
    complaintCategory: "",
    description: "",
  });

  const [approved, setApproved] = useState({});

  const [messages, setMessages] = useState([]);

  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const [transcript, setTranscript] = useState("");

  const [showReview, setShowReview] = useState(false);

  const [showTicketUploader, setShowTicketUploader] =
    useState(true);

  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);

  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });

  const recognitionRef = useRef(null);

  const currentField = FIELDS[step];

  /* =====================================================
     TEXT TO SPEECH
  ===================================================== */

  const speak = (text) => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = "en-IN";
    utterance.rate = 0.9;
    utterance.pitch = 1;

    utterance.onstart = () => {
      setSpeaking(true);
    };

    utterance.onend = () => {
      setSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  /* =====================================================
     ADD CHAT MESSAGE
  ===================================================== */

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

  /* =====================================================
     QUESTIONS
  ===================================================== */

  const getQuestion = (field) => {
    switch (field) {
      case "pnrNumber":
        return "Please tell me your PNR number.";

      case "trainNumber":
        return "Please tell me your train number.";

      case "incidentDateTime":
        return "Please tell me the date and time when the incident happened.";

      case "complaintCategory":
        return `Please tell me the complaint category. You can say catering, cleanliness, electrical, security, water, medical, staff, ticketing, coach, platform, or other.`;

      case "description":
        return "Please describe your complaint clearly.";

      default:
        return "";
    }
  };

  /* =====================================================
     START VOICE CONVERSATION
  ===================================================== */

  useEffect(() => {
    if (!showReview && !form.pnrNumber && messages.length === 0) {
      const text =
        "Hello! I am your railway complaint voice assistant. I will ask for each detail and ask you to confirm every answer.";

      addMessage("bot", text);
      speak(text);

      setTimeout(() => {
        askCurrentQuestion("pnrNumber");
      }, 2500);
    }

    return () => {
      window.speechSynthesis?.cancel();

      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const askCurrentQuestion = (field) => {
    const question = getQuestion(field);

    addMessage("bot", question);

    speak(question);
  };

  /* =====================================================
     SPEECH RECOGNITION
  ===================================================== */

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window) &&
        !("SpeechRecognition" in window)) {
      setToast({
        message:
          "Speech recognition is not supported in this browser. Please use Chrome or enter the answer manually.",
        type: "error",
      });

      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setListening(true);
      setTranscript("");

      addMessage(
        "bot",
        "I'm listening. Please speak now."
      );
    };

    recognition.onresult = (event) => {
      const result =
        event.results[0][0].transcript;

      setTranscript(result);

      addMessage("user", result);

      processVoiceAnswer(result);
    };

    recognition.onerror = () => {
      setListening(false);

      setToast({
        message:
          "I could not understand your voice. Please try again.",
        type: "error",
      });
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;

    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    setListening(false);
  };

  /* =====================================================
     PROCESS VOICE ANSWER
  ===================================================== */

  const processVoiceAnswer = (answer) => {
    const cleaned = answer.trim();

    if (!cleaned) return;

    if (currentField === "complaintCategory") {
      const category = findCategory(cleaned);

      if (!category) {
        const text =
          "I could not identify the complaint category. Please say one of the available categories.";

        addMessage("bot", text);
        speak(text);

        return;
      }

      setForm((prev) => ({
        ...prev,
        complaintCategory: category,
      }));

      const confirmation =
        `I heard the complaint category as ${category}. Please confirm.`;

      addMessage("bot", confirmation);
      speak(confirmation);

      return;
    }

    setForm((prev) => ({
      ...prev,
      [currentField]: cleaned,
    }));

    const confirmation =
      `I heard your ${LABELS[
        currentField
      ].toLowerCase()} as ${cleaned}. Is that correct?`;

    addMessage("bot", confirmation);

    speak(confirmation);
  };

  const findCategory = (text) => {
    const lower = text.toLowerCase();

    return CATEGORIES.find((category) =>
      lower.includes(category)
    );
  };

  /* =====================================================
     FIELD APPROVAL
  ===================================================== */

  const approveField = (field) => {
    setApproved((prev) => ({
      ...prev,
      [field]: true,
    }));

    const confirmation =
      `Okay. Your ${LABELS[
        field
      ].toLowerCase()} has been confirmed.`;

    addMessage("user", "Yes");
    addMessage("bot", confirmation);

    speak(confirmation);

    const nextIndex = FIELDS.indexOf(field) + 1;

    if (nextIndex >= FIELDS.length) {
      setTimeout(() => {
        const finalMessage =
          "All complaint details are collected. Please review the complaint before submission.";

        addMessage("bot", finalMessage);
        speak(finalMessage);

        setShowReview(true);
      }, 1000);

      return;
    }

    setTimeout(() => {
      setStep(nextIndex);
      setTranscript("");
      askCurrentQuestion(FIELDS[nextIndex]);
    }, 1200);
  };

  const rejectField = (field) => {
    setApproved((prev) => ({
      ...prev,
      [field]: false,
    }));

    setForm((prev) => ({
      ...prev,
      [field]: "",
    }));

    setTranscript("");

    const message =
      `Okay. Let's enter the ${LABELS[
        field
      ].toLowerCase()} again.`;

    addMessage("user", "No");
    addMessage("bot", message);

    speak(message);

    setTimeout(() => {
      askCurrentQuestion(field);
    }, 800);
  };

  const editField = (field) => {
    setApproved((prev) => ({
      ...prev,
      [field]: false,
    }));

    setForm((prev) => ({
      ...prev,
      [field]: "",
    }));

    setTranscript("");

    const message =
      `Please tell me the correct ${LABELS[
        field
      ].toLowerCase()}.`;

    addMessage("bot", message);

    speak(message);
  };

  /* =====================================================
     TICKET EXTRACTION
  ===================================================== */

  const handleTicketData = (ticketData) => {
    if (!ticketData) return;

    setForm((prev) => ({
      ...prev,

      ...(ticketData.pnrNumber && {
        pnrNumber: ticketData.pnrNumber,
      }),

      ...(ticketData.trainNumber && {
        trainNumber: ticketData.trainNumber,
      }),

      ...(ticketData.incidentDateTime && {
        incidentDateTime:
          ticketData.incidentDateTime,
      }),
    }));

    setShowTicketUploader(false);

    const message =
      "I received information from your ticket. I will ask you to verify each extracted field.";

    addMessage("bot", message);
    speak(message);
  };

  /* =====================================================
     FILE UPLOAD
  ===================================================== */

  const handleImages = (e) => {
    setImages(
      Array.from(e.target.files || []).slice(0, 5)
    );
  };

  const handleVideos = (e) => {
    setVideos(
      Array.from(e.target.files || []).slice(0, 3)
    );
  };

  /* =====================================================
     SUBMIT
  ===================================================== */

  const submitComplaint = async () => {
    try {
      setLoading(true);

      const formData = new FormData();

      formData.append(
        "pnrNumber",
        form.pnrNumber
      );

      formData.append(
        "trainNumber",
        form.trainNumber
      );

      formData.append(
        "incidentDateTime",
        form.incidentDateTime
      );

      formData.append(
        "complaintCategory",
        form.complaintCategory
      );

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

      const response =
        await createComplaint(formData);

      if (response?.success === false) {
        throw new Error(
          response.message ||
            "Failed to create complaint"
        );
      }

      setToast({
        message:
          response?.message ||
          "Complaint submitted successfully",
        type: "success",
      });

      onSuccess?.();

      resetVoiceComplaint();

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

  /* =====================================================
     RESET
  ===================================================== */

  const resetVoiceComplaint = () => {
    window.speechSynthesis?.cancel();

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    setStep(0);

    setForm({
      pnrNumber: "",
      trainNumber: "",
      incidentDateTime: "",
      complaintCategory: "",
      description: "",
    });

    setApproved({});
    setMessages([]);
    setTranscript("");
    setShowReview(false);
    setShowTicketUploader(true);
    setImages([]);
    setVideos([]);
  };

  const currentValue = form[currentField];

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
            onBack={() =>
              setShowReview(false)
            }
            onSubmit={submitComplaint}
            loading={loading}
          />

          {/* Evidence */}
          <div className="mx-auto max-w-3xl rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">

            <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
              Add Evidence
            </h3>

            <div className="grid gap-4 md:grid-cols-2">

              <label className="cursor-pointer rounded-xl border-2 border-dashed border-gray-300 p-5 text-center hover:border-blue-500 dark:border-gray-700">
                <p className="text-sm font-bold">
                  Upload Images
                </p>

                <p className="mt-1 text-xs text-gray-500">
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
                    {images.length} image(s) selected
                  </p>
                )}
              </label>

              <label className="cursor-pointer rounded-xl border-2 border-dashed border-gray-300 p-5 text-center hover:border-purple-500 dark:border-gray-700">
                <p className="text-sm font-bold">
                  Upload Videos
                </p>

                <p className="mt-1 text-xs text-gray-500">
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
                    {videos.length} video(s) selected
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
                Voice Complaint Assistant
              </h2>

              <p className="text-sm text-gray-500">
                Speak naturally. I will verify every detail.
              </p>
            </div>

            <button
              type="button"
              onClick={resetVoiceComplaint}
              className="flex items-center gap-2 rounded-xl border border-gray-300 px-3 py-2 text-sm font-bold hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
            >
              <RotateCcw size={16} />
              Reset
            </button>

          </div>

          {/* Ticket */}
          {showTicketUploader && (
            <div className="mb-5">
              <TicketUploader
                onExtracted={handleTicketData}
              />
            </div>
          )}

          {/* Voice status */}
          <div className="mb-5 rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-700 dark:bg-gray-900">

            <div
              className={`mx-auto mb-5 flex h-28 w-28 items-center justify-center rounded-full ${
                listening
                  ? "animate-pulse bg-red-100 text-red-600"
                  : speaking
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {listening ? (
                <Mic size={42} />
              ) : speaking ? (
                <Volume2 size={42} />
              ) : (
                <Bot size={42} />
              )}
            </div>

            <h3 className="text-lg font-black text-gray-900 dark:text-white">
              {listening
                ? "Listening..."
                : speaking
                ? "Speaking..."
                : "Ready"}
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              {listening
                ? "Please speak your answer."
                : speaking
                ? "Please wait..."
                : "Press the microphone and speak."}
            </p>

            {!speaking && (
              <button
                type="button"
                onClick={
                  listening
                    ? stopListening
                    : startListening
                }
                className={`mt-6 inline-flex items-center gap-2 rounded-full px-7 py-4 font-bold text-white ${
                  listening
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {listening ? (
                  <>
                    <MicOff size={20} />
                    Stop Listening
                  </>
                ) : (
                  <>
                    <Mic size={20} />
                    Speak
                  </>
                )}
              </button>
            )}

          </div>

          {/* Current detected answer */}
          {currentValue && (
            <div className="mb-5">

              <FieldApproval
                label={LABELS[currentField]}
                value={
                  currentField ===
                  "incidentDateTime"
                    ? new Date(
                        currentValue
                      ).toLocaleString("en-IN")
                    : currentValue
                }
                onApprove={() =>
                  approveField(currentField)
                }
                onReject={() =>
                  rejectField(currentField)
                }
                onEdit={() =>
                  editField(currentField)
                }
              />

            </div>
          )}

          {/* Manual category fallback */}
          {currentField === "complaintCategory" &&
            !currentValue && (
              <div className="mb-5 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">

                <p className="mb-3 text-sm font-bold text-gray-700 dark:text-gray-300">
                  Or select a category manually:
                </p>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">

                  {CATEGORIES.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => {
                        setForm((prev) => ({
                          ...prev,
                          complaintCategory:
                            category,
                        }));

                        addMessage(
                          "user",
                          category
                        );

                        const text = `You selected ${category}. Please confirm.`;

                        addMessage(
                          "bot",
                          text
                        );

                        speak(text);
                      }}
                      className="rounded-xl border border-gray-300 px-3 py-3 text-sm font-semibold capitalize hover:border-blue-500 hover:bg-blue-50 dark:border-gray-700 dark:hover:bg-blue-900/20"
                    >
                      {category}
                    </button>
                  ))}

                </div>
              </div>
            )}

          {/* Conversation */}
          <div className="mb-5 max-h-[350px] overflow-y-auto rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-950">

            <div className="space-y-3">

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
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
                      <Bot size={16} />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                      message.sender === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-white shadow-sm dark:bg-gray-900"
                    }`}
                  >
                    {message.text}
                  </div>

                  {message.sender === "user" && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-800 text-white">
                      <User size={16} />
                    </div>
                  )}

                </div>
              ))}

            </div>
          </div>

          {/* Progress */}
          <div className="mt-5">

            <div className="mb-2 flex justify-between text-xs font-bold text-gray-500">
              <span>
                Step {Math.min(step + 1, FIELDS.length)} /{" "}
                {FIELDS.length}
              </span>

              <span>
                {Math.round(
                  ((step + 1) /
                    FIELDS.length) *
                    100
                )}
                %
              </span>
            </div>

            <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-800">
              <div
                className="h-2 rounded-full bg-blue-600 transition-all"
                style={{
                  width: `${
                    ((step + 1) /
                      FIELDS.length) *
                    100
                  }%`,
                }}
              />
            </div>

          </div>

          {/* Approved fields */}
          <div className="mt-5 grid gap-3 sm:grid-cols-2">

            {FIELDS.map((field) => (
              <div
                key={field}
                className={`flex items-center gap-2 rounded-xl border p-3 ${
                  approved[field]
                    ? "border-green-200 bg-green-50 dark:border-green-900/30 dark:bg-green-900/10"
                    : "border-gray-200 dark:border-gray-700"
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

                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
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

export default VoiceComplaint;