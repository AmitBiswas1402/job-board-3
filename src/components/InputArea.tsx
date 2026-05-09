"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { SendHorizontal } from "lucide-react";

const MAX_PROMPT_LENGTH = 2000;

const InputArea = () => {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [duration, setDuration] = useState("5");
  const [aspectRatio, setAspectRatio] = useState<"16:9" | "9:16">("16:9");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleCreateProject = async () => {
    const normalizedPrompt = prompt.trim();

    if (!normalizedPrompt) {
      setError("Please enter a prompt.");
      return;
    }

    if (normalizedPrompt.length > MAX_PROMPT_LENGTH) {
      setError("Prompt must be 2000 characters or less.");
      return;
    }

    setIsSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: normalizedPrompt.slice(0, 120),
          desc: normalizedPrompt.slice(0, 200),
          prompt: normalizedPrompt,
          duration: Number(duration),
          aspectRatio,
          settings: {
            duration: Number(duration),
            aspectRatio,
          },
          status: "draft",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data?.error ?? "Unable to create project.");
        setIsSubmitting(false);
        return;
      }

      const projectSlug = data?.project?.slug || data?.project?.id;
      if (!projectSlug) {
        setError("Project created but ID is missing.");
        setIsSubmitting(false);
        return;
      }

      router.push(`/project/${projectSlug}`);
    } catch {
      setError("Something went wrong while creating the project.");
      setIsSubmitting(false);
    }
  };

  return (
    <section className="px-4 pb-18">
      <div className="mx-auto w-full max-w-4xl rounded-[32px] border border-white/60 bg-white/75 p-4 shadow-[0_20px_80px_rgba(122,86,255,0.10)] backdrop-blur-2xl">
        <div className="rounded-[28px] border border-[#f1efff] bg-white p-5">
          {/* Textarea */}
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              maxLength={MAX_PROMPT_LENGTH}
              placeholder="Describe your video idea..."
              className="h-32 w-full resize-none rounded-2xl border border-[#ececff] bg-[#fafafe] px-5 py-4 text-[15px] leading-7 text-[#1f2333] placeholder:text-[#9ca3ba] outline-none transition-all duration-300 focus:border-[#7a56ff] focus:bg-white focus:ring-4 focus:ring-[#7a56ff]/10"
            />

            <div className="absolute bottom-4 right-4 text-xs font-medium text-[#9aa0b6]">
              {prompt.length}/{MAX_PROMPT_LENGTH}
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
            {/* Left Controls */}
            <div className="flex items-center gap-3">
              {/* Duration */}
              <div className="rounded-xl border border-[#ececff] bg-[#fafafe] px-1">
                <Select
                  onValueChange={(val: string) => setDuration(val)}
                  value={duration}
                >
                  <SelectTrigger className="h-20 w-22.5 border-0 bg-transparent text-sm font-medium text-[#4f556b] shadow-none focus:ring-0">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="5">5 sec</SelectItem>
                      <SelectItem value="10">10 sec</SelectItem>
                      <SelectItem value="15">15 sec</SelectItem>
                      <SelectItem value="20">20 sec</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* Aspect Ratio */}
              <ToggleGroup
                type="single"
                value={aspectRatio}
                className="flex items-center rounded-2xl border border-[#ececff] bg-white p-1.5 shadow-sm"
                aria-label="Aspect ratio"
              >
                <ToggleGroupItem
                  value="16:9"
                  aria-label="Landscape"
                  onClick={() => setAspectRatio("16:9")}
                  className={`group flex h-11 items-center gap-2 rounded-xl px-4 text-sm font-semibold transition-all duration-300 ${
                    aspectRatio === "16:9"
                      ? "bg-linear-to-r from-[#7a56ff] to-[#946dff] text-white shadow-md"
                      : "text-[#687086] hover:bg-[#f6f4ff]"
                  }`}
                >
                  <div
                    className={`h-4 w-6 rounded-sm border transition-all ${
                      aspectRatio === "16:9"
                        ? "border-white/70"
                        : "border-[#b3b8cc]"
                    }`}
                  />
                  16:9
                </ToggleGroupItem>

                <ToggleGroupItem
                  value="9:16"
                  aria-label="Portrait"
                  onClick={() => setAspectRatio("9:16")}
                  className={`group flex h-11 items-center gap-2 rounded-xl px-4 text-sm font-semibold transition-all duration-300 ${
                    aspectRatio === "9:16"
                      ? "bg-linear-to-r from-[#7a56ff] to-[#946dff] text-white shadow-md"
                      : "text-[#687086] hover:bg-[#f6f4ff]"
                  }`}
                >
                  <div
                    className={`h-6 w-4 rounded-sm border transition-all ${
                      aspectRatio === "9:16"
                        ? "border-white/70"
                        : "border-[#b3b8cc]"
                    }`}
                  />
                  9:16
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            {/* Generate Button */}
            <button
              className="group inline-flex h-11 items-center gap-2 rounded-xl bg-linear-to-r from-[#7a56ff] to-[#946dff] px-5 text-sm font-semibold text-white shadow-lg shadow-[#7a56ff]/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
              onClick={handleCreateProject}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Generate Video"}

              <SendHorizontal className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>
          </div>

          {/* Error */}
          {error ? (
            <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {error}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default InputArea;
