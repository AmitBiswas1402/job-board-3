"use client";

import { AlertCircle, CheckCircle, CircleDashed, Loader2 } from "lucide-react";

interface ProgressStep {
  name: string;
  status: "completed" | "in_progress" | "pending" | "failed";
}

const stageOrder = [
  "queued",
  "loading_project",
  "generating_prompt",
  "building_theme",
  "writing_remotion",
  "finalizing",
  "completed",
];

const stageLabels: Record<string, string> = {
  queued: "Queued",
  loading_project: "Loading project",
  generating_prompt: "Generating prompt",
  building_theme: "Building theme config",
  writing_remotion: "Writing Remotion code",
  finalizing: "Finalizing output",
  completed: "Completed",
};

const VideoProgress = ({
  steps,
  activeStep,
  message,
  status,
}: {
  steps?: ProgressStep[];
  activeStep?: string;
  message?: string | null;
  status?: string;
}) => {
  const defaultSteps: ProgressStep[] = [
    { name: "Queued", status: "completed" },
    { name: "Loading project", status: "completed" },
    { name: "Generating prompt", status: "in_progress" },
    { name: "Building theme config", status: "pending" },
    { name: "Writing Remotion code", status: "pending" },
    { name: "Finalizing output", status: "pending" },
  ];

  const progressSteps = activeStep
    ? stageOrder.map((stepKey) => {
        const currentIndex = stageOrder.includes(activeStep)
          ? stageOrder.indexOf(activeStep)
          : 2;
        const stepIndex = stageOrder.indexOf(stepKey);
        let stepStatus: ProgressStep["status"] = "pending";

        if (status === "failed" && stepIndex === currentIndex) {
          stepStatus = "failed";
        } else if (status === "completed" || stepIndex < currentIndex) {
          stepStatus = "completed";
        } else if (stepIndex === currentIndex) {
          stepStatus = "in_progress";
        }

        return {
          name: stageLabels[stepKey] ?? stepKey,
          status: stepStatus,
        } satisfies ProgressStep;
      })
    : steps || defaultSteps;

  const getStatusIcon = (stepStatus: ProgressStep["status"]) => {
    switch (stepStatus) {
      case "completed":
        return (
          <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
        );
      case "in_progress":
        return (
          <Loader2 className="h-5 w-5 text-blue-500 animate-spin shrink-0" />
        );
      case "failed":
        return <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />;
      case "pending":
      default:
        return (
          <CircleDashed className="h-5 w-5 text-muted-foreground/50 shrink-0" />
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
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Overall Progress</span>
          <span className="text-xs font-semibold text-muted-foreground">
            {completedCount}/{totalCount} completed
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-linear-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <ul className="space-y-3">
        {progressSteps.map((step, index) => (
          <li
            key={index}
            className={`flex items-center gap-3 rounded-md p-2 transition-colors ${
              step.status === "in_progress"
                ? "border border-blue-500/20 bg-blue-500/10"
                : ""
            }`}
          >
            {getStatusIcon(step.status)}
            <span
              className={`flex-1 text-sm ${
                step.status === "in_progress"
                  ? "font-semibold text-foreground"
                  : step.status === "completed"
                    ? "text-foreground/70"
                    : step.status === "failed"
                      ? "text-red-600"
                      : "text-muted-foreground"
              }`}
            >
              {step.name}
            </span>
            {step.status === "completed" ? (
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                Done
              </span>
            ) : null}
            {step.status === "in_progress" ? (
              <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                Active
              </span>
            ) : null}
          </li>
        ))}
      </ul>

      {message ? (
        <div className="rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-foreground/80">
          {message}
        </div>
      ) : null}

      <div className="rounded-lg border border-muted bg-muted/50 p-3">
        <p className="text-xs font-medium text-muted-foreground">
          ⏱️ Estimated time remaining: <span className="text-foreground">2-3 minutes</span>
        </p>
      </div>
    </div>
  );
};

export default VideoProgress;
