import React from "react";
import {
  Clock3,
  LoaderCircle,
  CheckCircle2,
} from "lucide-react";

const ComplaintStatusTracker = ({
  status,
}) => {
  const statuses = [
    {
      key: "pending",
      label: "Pending",
      icon: Clock3,
    },
    {
      key: "ongoing",
      label: "In Progress",
      icon: LoaderCircle,
    },
    {
      key: "solved",
      label: "Solved",
      icon: CheckCircle2,
    },
  ];

  const currentIndex =
    statuses.findIndex(
      (item) => item.key === status
    );

  return (
    <div className="w-full">

      <div className="flex items-center">

        {statuses.map(
          (item, index) => {
            const Icon = item.icon;

            const completed =
              index <= currentIndex;

            return (
              <React.Fragment
                key={item.key}
              >

                <div className="flex flex-col items-center">

                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-full border-2 ${
                      completed
                        ? "border-indigo-600 bg-indigo-600 text-white"
                        : "border-slate-300 bg-white text-slate-400 dark:border-slate-700 dark:bg-slate-900"
                    }`}
                  >
                    <Icon
                      size={19}
                      className={
                        item.key === "ongoing" &&
                        completed
                          ? "animate-spin"
                          : ""
                      }
                    />
                  </div>

                  <span
                    className={`mt-2 text-xs font-semibold ${
                      completed
                        ? "text-indigo-600"
                        : "text-slate-400"
                    }`}
                  >
                    {item.label}
                  </span>

                </div>

                {index <
                  statuses.length - 1 && (
                  <div
                    className={`mx-2 h-1 flex-1 rounded ${
                      index <
                      currentIndex
                        ? "bg-indigo-600"
                        : "bg-slate-200 dark:bg-slate-700"
                    }`}
                  />
                )}

              </React.Fragment>
            );
          }
        )}

      </div>

    </div>
  );
};

export default ComplaintStatusTracker;