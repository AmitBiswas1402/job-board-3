"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { SendHorizontal } from "lucide-react"

const MAX_PROMPT_LENGTH = 2000

const InputArea = () => {
  const router = useRouter()
  const [prompt, setPrompt] = useState("")
  const [duration, setDuration] = useState("5")
  const [aspectRatio, setAspectRatio] = useState<"16:9" | "9:16">("16:9")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleCreateProject = async () => {
    const normalizedPrompt = prompt.trim()

    if (!normalizedPrompt) {
      setError("Please enter a prompt.")
      return
    }

    if (normalizedPrompt.length > MAX_PROMPT_LENGTH) {
      setError("Prompt must be 2000 characters or less.")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      const title =
        normalizedPrompt.length > 60
          ? `${normalizedPrompt.slice(0, 57)}...`
          : normalizedPrompt

      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          desc: normalizedPrompt,
          prompt: normalizedPrompt,
          duration: Number(duration),
          aspectRatio,
          settings: {
            duration: Number(duration),
            aspectRatio,
          },
          status: "draft",
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data?.error ?? "Unable to create project.")
        setIsSubmitting(false)
        return
      }

      const projectSlug = data?.project?.slug || data?.project?.id
      if (!projectSlug) {
        setError("Project created but ID is missing.")
        setIsSubmitting(false)
        return
      }

      router.push(`/project/${projectSlug}`)
    } catch {
      setError("Something went wrong while creating the project.")
      setIsSubmitting(false)
    }
  }

  return (
    <section className="px-4 pb-16">
      <div className="mx-auto w-full max-w-4xl overflow-hidden rounded-[22px] border border-[#b9b0ef] bg-white shadow-[0_12px_35px_rgba(56,30,177,0.12)]">
        <textarea
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          maxLength={MAX_PROMPT_LENGTH}
          className="h-28 w-full resize-none border-b border-[#e6e8f2] bg-transparent px-5 py-4 text-[15px] text-[#2c314a] placeholder:text-[#8d92a7] focus:outline-none"
          placeholder="Describe your video idea in detail..."
        />

        <div className="flex items-center justify-end px-5 pt-1 text-xs font-medium text-[#7f86a1]">
          {prompt.length}/{MAX_PROMPT_LENGTH}
        </div>

        {error ? (
          <div className="px-5 pt-1 text-sm font-medium text-red-600">{error}</div>
        ) : null}

        <div className="flex flex-col gap-4 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger className="w-20">
                <SelectValue placeholder="5s" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="5">5s</SelectItem>
                  <SelectItem value="10">10s</SelectItem>
                  <SelectItem value="15">15s</SelectItem>
                  <SelectItem value="20">20s</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <ToggleGroup
              type="single"
              value={aspectRatio}
              onValueChange={(value) => {
                if (value === "16:9" || value === "9:16") {
                  setAspectRatio(value)
                }
              }}
              variant="outline"
              size="sm"
              className="rounded-full border border-[#d9dce8] bg-[#f5f6fb] p-1 shadow-sm"
            >
              <ToggleGroupItem
                value="16:9"
                aria-label="Landscape aspect ratio"
                className="h-8 rounded-full border-0 bg-transparent px-4 text-sm font-semibold text-[#4f556f] data-[state=on]:bg-white data-[state=on]:text-[#121429] data-[state=on]:shadow-sm"
              >
                16:9
              </ToggleGroupItem>

              <ToggleGroupItem
                value="9:16"
                aria-label="Portrait aspect ratio"
                className="h-8 rounded-full border-0 bg-transparent px-4 text-sm font-semibold text-[#4f556f] data-[state=on]:bg-white data-[state=on]:text-[#121429] data-[state=on]:shadow-sm"
              >
                9:16
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          <button
            type="button"
            disabled={isSubmitting || prompt.trim().length === 0}
            onClick={handleCreateProject}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#6C4CF1] px-7 py-2.5 text-sm font-bold text-white transition hover:bg-[#5b3ee6] disabled:cursor-not-allowed disabled:opacity-60 sm:self-end"
          >
            <span>{isSubmitting ? "Creating..." : "Generate"}</span>
            <SendHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  )
}

export default InputArea

