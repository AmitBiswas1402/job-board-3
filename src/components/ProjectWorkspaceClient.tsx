"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, SendHorizontal } from "lucide-react"

import VideoProgress from "@/components/VideoProgress"

type Video = {
  id: number
  projectId: number
  url: string | null
  status: string
  progressStep?: string | null
  progressMessage?: string | null
  generatedPrompt?: string | null
  themeConfig?: Record<string, unknown> | null
  compositionCode?: string | null
  duration: number
  aspectRation: string
  credits: number
  createdAt: string | Date
}

export default function ProjectWorkspaceClient({ projectId, projectStatus, initialVideos = [] }: { projectId: number; projectStatus?: string; initialVideos?: Video[] }) {
  const router = useRouter()
  const [videos, setVideos] = useState<Video[]>(initialVideos)
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const hasQueuedRef = useRef(false)
  const hasRefreshedAfterCompletionRef = useRef(false)

  const activeVideo = useMemo(
    () => videos.find((video) => video.status === "pending" || video.status === "processing") ?? videos[0],
    [videos]
  )

  const fetchVideos = useCallback(async () => {
    try {
      const res = await fetch(`/api/videos?projectId=${projectId}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Unable to load videos")
      setVideos(data.videos || [])
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error fetching videos"
      setError(message)
    }
  }, [projectId])

  const queueGeneration = useCallback(async () => {
    if (hasQueuedRef.current || projectId <= 0) {
      return
    }

    hasQueuedRef.current = true
    hasRefreshedAfterCompletionRef.current = false
    setIsCreating(true)
    setError(null)

    try {
      const res = await fetch(`/api/projects/${projectId}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Unable to queue generation")

      await fetchVideos()
      router.refresh()
    } catch (err: unknown) {
      hasQueuedRef.current = false
      const message = err instanceof Error ? err.message : "Error starting generation"
      setError(message)
    } finally {
      hasQueuedRef.current = false
      setIsCreating(false)
    }
  }, [fetchVideos, projectId, router])

  useEffect(() => {
    if (projectStatus === "pending") {
      const timeout = window.setTimeout(() => {
        void queueGeneration()
      }, 0)

      return () => window.clearTimeout(timeout)
    }
    return undefined
  }, [projectStatus, queueGeneration])

  useEffect(() => {
    const hasRunningJob = videos.some((video) => video.status === "pending" || video.status === "processing")
    if (!hasRunningJob) {
      return
    }

    const interval = window.setInterval(() => {
      void fetchVideos()
    }, 3000)

    return () => window.clearInterval(interval)
  }, [fetchVideos, videos])

  useEffect(() => {
    if (projectStatus !== "pending" || hasRefreshedAfterCompletionRef.current) {
      return
    }

    if (activeVideo?.status === "completed") {
      hasRefreshedAfterCompletionRef.current = true
      router.refresh()
    }
  }, [activeVideo?.status, projectStatus, router])

  async function handleGenerate() {
    await queueGeneration()
  }

  return (
    <div className="mt-6">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="text-lg font-medium">Generated Videos</h4>
        <button
          onClick={handleGenerate}
          disabled={isCreating}
          className="inline-flex items-center gap-2 rounded-full bg-[#6C4CF1] px-4 py-2 text-sm font-semibold text-white hover:bg-[#5b3ee6] disabled:opacity-60"
        >
          {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : <SendHorizontal className="h-4 w-4" />}
          {isCreating ? "Queuing..." : "Generate new"}
        </button>
      </div>

      {activeVideo ? (
        <div className="mb-4 rounded-2xl border border-border bg-muted/20 p-4">
          <VideoProgress
            activeStep={activeVideo.progressStep ?? activeVideo.status}
            status={activeVideo.status}
            message={activeVideo.progressMessage ?? "Waiting for the next generation step."}
          />
        </div>
      ) : null}

      {error ? (
        <div className="text-sm text-red-600">{error}</div>
      ) : videos.length === 0 ? (
        <div className="rounded-md bg-[#f6f6fb] p-4 text-sm text-[#5b5f78]">No videos yet. Click &quot;Generate new&quot; to start.</div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {videos.map((v) => (
            <div key={v.id} className="flex items-center justify-between rounded-md border p-3">
              <div>
                <div className="text-sm font-medium">Video #{v.id}</div>
                <div className="text-xs text-[#6b6f87]">Status: {v.status} • {v.duration}s • {v.aspectRation}</div>
                {v.progressMessage ? (
                  <div className="mt-1 text-xs text-[#4f556f]">{v.progressMessage}</div>
                ) : null}
                <div className="mt-1 text-xs text-[#4f556f]">Created: {new Date(v.createdAt).toLocaleString()}</div>
              </div>

              <div className="flex items-center gap-3">
                {v.url ? (
                  <a href={v.url} target="_blank" rel="noreferrer" className="text-sm text-[#6C4CF1]">Open artifact</a>
                ) : (
                  <span className="text-sm text-[#9aa0b6]">No URL yet</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
