"use client"

import { useEffect, useState } from "react"
import { SendHorizontal } from "lucide-react"

type Video = {
  id: number
  projectId: number
  url: string | null
  status: string
  duration: number
  aspectRation: string
  credits: number
  createdAt: string
}

export default function ProjectWorkspaceClient({ projectId, duration, aspectRatio }: { projectId: number; duration?: number; aspectRatio?: string }) {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function fetchVideos() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/videos?projectId=${projectId}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Unable to load videos")
      setVideos(data.videos || [])
    } catch (err: any) {
      setError(err?.message ?? "Error fetching videos")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVideos()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId])

  async function handleGenerate() {
    setIsCreating(true)
    setError(null)
    try {
      const res = await fetch(`/api/videos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          url: "",
          status: "pending",
          duration: duration ?? 5,
          aspectRation: aspectRatio ?? "16:9",
          credits: 0,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Unable to create video")
      // refresh
      await fetchVideos()
    } catch (err: any) {
      setError(err?.message ?? "Error creating video")
    } finally {
      setIsCreating(false)
    }
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
          <SendHorizontal className="h-4 w-4" />
          {isCreating ? "Creating..." : "Generate new"}
        </button>
      </div>

      {loading ? (
        <div className="text-sm text-[#8b8fa6]">Loading videos…</div>
      ) : error ? (
        <div className="text-sm text-red-600">{error}</div>
      ) : videos.length === 0 ? (
        <div className="rounded-md bg-[#f6f6fb] p-4 text-sm text-[#5b5f78]">No videos yet. Click "Generate new" to start.</div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {videos.map((v) => (
            <div key={v.id} className="flex items-center justify-between rounded-md border p-3">
              <div>
                <div className="text-sm font-medium">Video #{v.id}</div>
                <div className="text-xs text-[#6b6f87]">Status: {v.status} • {v.duration}s • {v.aspectRation}</div>
                <div className="mt-1 text-xs text-[#4f556f]">Created: {new Date(v.createdAt).toLocaleString()}</div>
              </div>

              <div className="flex items-center gap-3">
                {v.url ? (
                  <a href={v.url} target="_blank" rel="noreferrer" className="text-sm text-[#6C4CF1]">Play</a>
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
