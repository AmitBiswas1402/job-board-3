"use client";

import { CheckCircle, CircleDashed, Loader2 } from "lucide-react";

interface ProgressStep {
  name: string;
  status: "completed" | "in_progress" | "pending";
}

const VideoProgress = ({ steps }: { steps?: ProgressStep[] }) => {
  const defaultSteps: ProgressStep[] = [
    { name: "Initializing generation", status: "completed" },
    { name: "Processing prompt", status: "completed" },
    { name: "Generating frames", status: "in_progress" },
    { name: "Rendering video", status: "pending" },
    { name: "Finalizing output", status: "pending" },
  ];

  const progressSteps = steps || defaultSteps;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0" />
        );
      case "in_progress":
        return (
          <Loader2 className="h-5 w-5 text-blue-500 animate-spin flex-shrink-0" />
        );
      case "pending":
      default:
        return (
          <CircleDashed className="h-5 w-5 text-muted-foreground/50 flex-shrink-0" />
        );
    }
  };

  const completedCount = progressSteps.filter(
    (s) => s.status === "completed"
  ).length;
  const totalCount = progressSteps.length;
  const progressPercent = (completedCount / totalCount) * 100;

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Overall Progress</span>
          <span className="text-xs font-semibold text-muted-foreground">
            {completedCount}/{totalCount} completed
          </span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Steps List */}
      <ul className="space-y-3">
        {progressSteps.map((step, index) => (
          <li
            key={index}
            className={`flex items-center gap-3 p-2 rounded-md transition-colors ${
              step.status === "in_progress"
                ? "bg-blue-500/10 border border-blue-500/20"
                : ""
            }`}
          >
            {getStatusIcon(step.status)}
            <span
              className={`text-sm flex-1 ${
                step.status === "in_progress"
                  ? "font-semibold text-foreground"
                  : step.status === "completed"
                  ? "text-foreground/70"
                  : "text-muted-foreground"
              }`}
            >
              {step.name}
            </span>
            {step.status === "completed" && (
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                Done
              </span>
            )}
            {step.status === "in_progress" && (
              <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                Active
              </span>
            )}
          </li>
        ))}
      </ul>

      {/* Estimated Time */}
      <div className="p-3 rounded-lg bg-muted/50 border border-muted">
        <p className="text-xs font-medium text-muted-foreground">
          ⏱️ Estimated time remaining: <span className="text-foreground">2-3 minutes</span>
        </p>
      </div>
    </div>
  );
};

export default VideoProgress;
