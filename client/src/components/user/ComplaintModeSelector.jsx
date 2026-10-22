import React from "react";
import {
  FileEdit,
  Bot,
  Mic,
} from "lucide-react";

const ComplaintModeSelector = ({
  mode,
  onModeChange,
}) => {
  const modes = [
    {
      id: "manual",
      title: "Manual",
      description: "Fill the complaint form yourself",
      icon: FileEdit,
    },
    {
      id: "chatbot",
      title: "AI Chatbot",
      description: "Create complaint through conversation",
      icon: Bot,
    },
    {
      id: "voice",
      title: "Voice Assistant",
      description: "Create complaint using your voice",
      icon: Mic,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {modes.map((item) => {
        const Icon = item.icon;
        const selected = mode === item.id;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onModeChange(item.id)}
            className={`rounded-2xl border p-5 text-left transition-all duration-200 ${
              selected
                ? "border-indigo-500 bg-indigo-50 shadow-lg shadow-indigo-500/10 dark:bg-indigo-950/30"
                : "border-slate-200 bg-white hover:border-indigo-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-700"
            }`}
          >
            <div
              className={`mb-4 inline-flex rounded-xl p-3 ${
                selected
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              <Icon size={22} />
            </div>

            <h3 className="font-bold text-slate-900 dark:text-white">
              {item.title}
            </h3>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {item.description}
            </p>
          </button>
        );
      })}
    </div>
  );
};

export default ComplaintModeSelector;