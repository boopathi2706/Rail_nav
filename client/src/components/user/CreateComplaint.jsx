import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";

import ComplaintModeSelector from "./ComplaintModeSelector";
import ManualComplaint from "./ManualComplaint";
import ChatbotComplaint from "./ChatbotComplaint";
import VoiceComplaint from "./VoiceComplaint";

const CreateComplaint = ({ onComplaintCreated }) => {
  const [mode, setMode] = useState(null);

  const handleComplaintCreated = () => {
    setMode(null);
    onComplaintCreated?.();
  };

  // No mode selected → show mode selector
  if (!mode) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Create Complaint
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Choose how you want to create your railway complaint.
          </p>
        </div>

        <ComplaintModeSelector
          mode={mode}
          onModeChange={setMode}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back to mode selection */}
      <button
        type="button"
        onClick={() => setMode(null)}
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-500 dark:hover:bg-indigo-950/30 dark:hover:text-indigo-400"
      >
        <ArrowLeft size={18} />
        Change Complaint Mode
      </button>

      {/* Selected complaint mode */}
      {mode === "manual" && (
        <ManualComplaint
          onComplaintCreated={handleComplaintCreated}
        />
      )}

      {mode === "chatbot" && (
        <ChatbotComplaint
          onComplaintCreated={handleComplaintCreated}
        />
      )}

      {mode === "voice" && (
        <VoiceComplaint
          onComplaintCreated={handleComplaintCreated}
        />
      )}
    </div>
  );
};

export default CreateComplaint;