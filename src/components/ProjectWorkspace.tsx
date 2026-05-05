"use client"

import { useState } from "react"
import Users from "./Users"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  ArrowUpRight,
  CheckCircle2,
  Clapperboard,
  Film,
  Play,
  SendHorizontal,
  Sparkles,
  WandSparkles,
} from "lucide-react"

const themePresets = [
  {
    name: "Cinematic Glow",
    description: "Smooth gradients, depth, and dramatic motion.",
    accent: "from-[#6C4CF1] to-[#8a76ff]",
  },
  {
    name: "Launch Burst",
    description: "Fast cuts, bold titles, and punchy transitions.",
    accent: "from-[#ff6b9d] to-[#ff8f4c]",
  },
  {
    name: "Minimal Tech",
    description: "Clean spacing, muted tones, and subtle motion.",
    accent: "from-[#19c37d] to-[#4f8cff]",
  },
  {
    name: "Dark Motion",
    description: "High contrast, glossy panels, and neon highlights.",
    accent: "from-[#111322] to-[#6C4CF1]",
  },
]

const workflowSteps = [
  {
    title: "Prompt parsed",
    description: "Extracting story beats and motion intent from your input.",
    status: "done",
    progress: 100,
  },
  {
    title: "Generating scenes",
    description: "Building scene frames and camera directions.",
    status: "current",
    progress: 68,
  },
  {
    title: "Generating video",
    description: "Animating the selected scenes into a full sequence.",
    status: "queued",
    progress: 24,
  },
  {
    title: "Rendering final cut",
    description: "Applying transitions, polish, and export settings.",
    status: "queued",
    progress: 0,
  },
]

const chatMessages = [
  {
    role: "ai",
    title: "AI Studio",
    content:
      "I can shape this into a moody, high-energy motion sequence with a strong intro, transition pulses, and a clean end card.",
  },
  {
    role: "user",
    title: "You",
    content:
      "Make it feel premium, keep the intro fast, and use the purple accent from the current theme.",
  },
]

const ProjectWorkspace = () => {
  const [selectedTheme, setSelectedTheme] = useState(themePresets[0].name)

  const currentTheme =
    themePresets.find((theme) => theme.name === selectedTheme) ?? themePresets[0]

  return (
    <main className="min-h-screen px-4 pb-8 pt-6 md:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="flex flex-col gap-4 rounded-[28px] border border-[#d8d9e8] bg-white/85 px-5 py-4 shadow-[0_12px_40px_rgba(76,63,179,0.08)] backdrop-blur md:flex-row md:items-center md:justify-between md:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#6C4CF1] text-lg font-bold text-white shadow-lg shadow-[#6C4CF1]/25">
              ✦
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-heading text-[1.35rem] font-bold tracking-tight text-[#111322] md:text-[1.75rem]">
                  VidMotionAI Project Studio
                </h1>
                <Badge
                  variant="secondary"
                  className="rounded-full bg-[#efeaff] text-[#5b3ee6]"
                >
                  Live workspace
                </Badge>
              </div>
              <p className="mt-1 text-sm text-[#66708d]">
                Build, refine, and render motion graphics with AI.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className="hidden items-center gap-2 rounded-full border border-[#d9dce8] bg-[#f7f7ff] px-4 py-2 text-sm text-[#4f556f] sm:flex">
              <Sparkles className="h-4 w-4 text-[#6C4CF1]" />
              <span>Current theme: {currentTheme.name}</span>
            </div>

            <Users />
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
          <Card className="flex min-h-190 flex-col border-[#d9d3fb] bg-white/90 shadow-[0_20px_60px_rgba(79,63,179,0.10)] backdrop-blur">
            <CardHeader className="border-b border-[#ece7ff] pb-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Badge
                    variant="secondary"
                    className="rounded-full bg-[#efeaff] text-[#5b3ee6]"
                  >
                    Fire panel
                  </Badge>
                  <CardTitle className="mt-3 font-heading text-2xl text-[#111322]">
                    Creative control room
                  </CardTitle>
                  <CardDescription className="mt-1 max-w-sm text-[#66708d]">
                    Toggle between live chat and visual themes while keeping the
                    purple motion style.
                  </CardDescription>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full border-[#ddd7fb] bg-[#faf9ff] text-[#5b3ee6] hover:bg-[#f1efff]"
                >
                  <WandSparkles className="h-4 w-4" />
                  Refine
                </Button>
              </div>
            </CardHeader>

            <CardContent className="flex flex-1 flex-col pt-5">
              <Tabs defaultValue="chat" className="flex flex-1 flex-col">
                <TabsList className="grid w-full grid-cols-2 rounded-2xl bg-[#edeafb] p-1">
                  <TabsTrigger
                    value="chat"
                    className="rounded-xl text-sm font-semibold data-active:bg-white data-active:text-[#111322] data-active:shadow-sm"
                  >
                    <Clapperboard className="h-4 w-4" />
                    Chat
                  </TabsTrigger>
                  <TabsTrigger
                    value="theme"
                    className="rounded-xl text-sm font-semibold data-active:bg-white data-active:text-[#111322] data-active:shadow-sm"
                  >
                    <Film className="h-4 w-4" />
                    Theme
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="chat" className="mt-5 flex flex-1 flex-col gap-4">
                  <div className="flex-1 space-y-3 rounded-[24px] border border-[#ebe6ff] bg-[#fcfbff] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
                    {chatMessages.map((message) => (
                      <div
                        key={message.title}
                        className={`rounded-2xl border px-4 py-3 ${
                          message.role === "ai"
                            ? "border-[#e2dcff] bg-white"
                            : "border-[#d9dce8] bg-[#f7f8fb]"
                        }`}
                      >
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <span className="text-sm font-semibold text-[#111322]">
                            {message.title}
                          </span>
                          <Badge
                            variant={message.role === "ai" ? "secondary" : "outline"}
                            className={
                              message.role === "ai"
                                ? "rounded-full bg-[#efeaff] text-[#5b3ee6]"
                                : "rounded-full border-[#d9dce8] text-[#66708d]"
                            }
                          >
                            {message.role === "ai" ? "AI" : "You"}
                          </Badge>
                        </div>
                        <p className="text-sm leading-6 text-[#4f556f]">
                          {message.content}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-[24px] border border-[#ded8fb] bg-white p-4 shadow-[0_8px_24px_rgba(76,63,179,0.08)]">
                    <Textarea
                      placeholder="Tell the AI what to adjust, remove, or animate next..."
                      className="min-h-28 resize-none border-0 bg-transparent p-0 text-sm text-[#111322] shadow-none placeholder:text-[#8c93ab] focus-visible:ring-0"
                    />

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-xs text-[#66708d]">
                        <Badge
                          variant="outline"
                          className="rounded-full border-[#d9dce8] text-[#66708d]"
                        >
                          Ready to send
                        </Badge>
                        <span>Supports scene, tone, pacing, and motion prompts.</span>
                      </div>

                      <Button className="rounded-full bg-[#6C4CF1] px-5 text-white hover:bg-[#5b3ee6]">
                        <SendHorizontal className="h-4 w-4" />
                        Send
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="theme" className="mt-5 flex flex-1 flex-col gap-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {themePresets.map((theme) => {
                      const isActive = theme.name === selectedTheme

                      return (
                        <button
                          key={theme.name}
                          type="button"
                          onClick={() => setSelectedTheme(theme.name)}
                          className={`group rounded-[24px] border p-4 text-left transition-all ${
                            isActive
                              ? "border-[#6C4CF1] bg-[#f7f5ff] shadow-[0_12px_30px_rgba(108,76,241,0.12)]"
                              : "border-[#e3e6f2] bg-white hover:border-[#cfc8f8] hover:shadow-[0_10px_24px_rgba(31,38,135,0.06)]"
                          }`}
                        >
                          <div className="mb-3 flex items-center justify-between gap-3">
                              <div
                                className={`h-10 w-10 rounded-2xl bg-linear-to-br ${theme.accent} shadow-lg shadow-[#6C4CF1]/15`}
                              />
                            {isActive ? (
                              <Badge className="rounded-full bg-[#6C4CF1] text-white">
                                Selected
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="rounded-full border-[#d9dce8] text-[#66708d]"
                              >
                                Preset
                              </Badge>
                            )}
                          </div>

                          <h3 className="font-heading text-lg font-semibold text-[#111322]">
                            {theme.name}
                          </h3>
                          <p className="mt-1 text-sm leading-6 text-[#66708d]">
                            {theme.description}
                          </p>
                        </button>
                      )
                    })}
                  </div>

                  <div className="rounded-[24px] border border-[#ebe6ff] bg-[#fcfbff] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-[#111322]">
                          Active theme
                        </p>
                        <p className="text-sm text-[#66708d]">
                          {currentTheme.description}
                        </p>
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full border-[#d9dce8] text-[#5b3ee6]"
                      >
                        Apply
                      </Button>
                    </div>

                    <Separator className="my-4 bg-[#e7e2ff]" />

                    <div className="grid gap-3 sm:grid-cols-3">
                      {[
                        ["Motion", "Medium"],
                        ["Palette", "Purple glow"],
                        ["Tempo", "Fast"],
                      ].map(([label, value]) => (
                        <div
                          key={label}
                          className="rounded-2xl border border-[#e3e6f2] bg-white px-4 py-3"
                        >
                          <p className="text-xs uppercase tracking-[0.2em] text-[#8c93ab]">
                            {label}
                          </p>
                          <p className="mt-2 text-sm font-semibold text-[#111322]">
                            {value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-6">
            <Card className="overflow-hidden border-0 bg-linear-to-br from-[#111322] via-[#1d1b43] to-[#6C4CF1] text-white shadow-[0_24px_70px_rgba(40,23,110,0.28)]">
              <CardHeader className="border-b border-white/10 pb-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <Badge className="rounded-full bg-white/15 text-white hover:bg-white/15">
                      Generated video
                    </Badge>
                    <CardTitle className="mt-3 font-heading text-2xl text-white md:text-3xl">
                      Your latest render preview
                    </CardTitle>
                    <CardDescription className="mt-1 max-w-2xl text-white/70">
                      The preview updates as the scenes and render pipeline move
                      through each stage.
                    </CardDescription>
                  </div>

                  <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white/80 backdrop-blur">
                    <Play className="h-4 w-4" />
                    <span>Preview ready</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-5 pt-5">
                <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[#070816] p-4 shadow-2xl">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.14),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(108,76,241,0.45),transparent_36%)]" />

                  <div className="relative aspect-video overflow-hidden rounded-[24px] border border-white/10 bg-[linear-gradient(135deg,#16172b_0%,#2d2259_45%,#6C4CF1_100%)]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.24),transparent_24%),radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.14),transparent_22%)]" />

                    <div className="relative flex h-full flex-col justify-between p-5">
                      <div className="flex items-center justify-between gap-3">
                        <Badge className="rounded-full bg-black/20 text-white hover:bg-black/20">
                          16:9 render
                        </Badge>

                        <Badge variant="outline" className="rounded-full border-white/20 text-white">
                          4K ready
                        </Badge>
                      </div>

                      <div className="mx-auto flex items-center justify-center rounded-full border border-white/15 bg-white/10 p-5 shadow-[0_0_80px_rgba(255,255,255,0.08)] backdrop-blur">
                        <Play className="h-10 w-10 fill-white text-white" />
                      </div>

                      <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 backdrop-blur">
                        <div>
                          <p className="text-xs uppercase tracking-[0.2em] text-white/55">
                            Status
                          </p>
                          <p className="font-heading text-lg text-white">
                            Building a dramatic intro with motion blur.
                          </p>
                        </div>

                        <Badge className="rounded-full bg-white/15 text-white hover:bg-white/15">
                          Rendering
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[28px] border border-[#dcd6fb] bg-white/95 p-5 text-[#111322] shadow-[0_14px_44px_rgba(76,63,179,0.09)]">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-[#111322]">
                        Render pipeline
                      </p>
                      <p className="text-sm text-[#66708d]">
                        Step-by-step generation status.
                      </p>
                    </div>

                    <Badge variant="secondary" className="rounded-full bg-[#efeaff] text-[#5b3ee6]">
                      68% complete
                    </Badge>
                  </div>

                  <Progress value={68} className="mt-4 h-2 bg-[#ece7ff]" />

                  <div className="mt-5 space-y-4">
                    {workflowSteps.map((step, index) => (
                      <div key={step.title} className="rounded-2xl border border-[#ebe6ff] p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex gap-3">
                            <div
                              className={`mt-1 flex h-9 w-9 items-center justify-center rounded-full ${
                                step.status === "done"
                                  ? "bg-emerald-100 text-emerald-600"
                                  : step.status === "current"
                                    ? "bg-[#efeaff] text-[#5b3ee6]"
                                    : "bg-[#f3f5fa] text-[#8c93ab]"
                              }`}
                            >
                              {step.status === "done" ? (
                                <CheckCircle2 className="h-5 w-5" />
                              ) : (
                                <span className="text-sm font-bold">{index + 1}</span>
                              )}
                            </div>

                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="font-semibold text-[#111322]">{step.title}</p>
                                <Badge
                                  variant={step.status === "done" ? "outline" : "secondary"}
                                  className={`rounded-full ${
                                    step.status === "done"
                                      ? "border-emerald-200 text-emerald-700"
                                      : step.status === "current"
                                        ? "bg-[#efeaff] text-[#5b3ee6]"
                                        : "border-[#d9dce8] text-[#8c93ab]"
                                  }`}
                                >
                                  {step.status === "done"
                                    ? "Done"
                                    : step.status === "current"
                                      ? "Generating"
                                      : "Queued"}
                                </Badge>
                              </div>
                              <p className="mt-1 text-sm leading-6 text-[#66708d]">
                                {step.description}
                              </p>
                            </div>
                          </div>

                          <p className="text-sm font-semibold text-[#111322]">{step.progress}%</p>
                        </div>

                        <Progress
                          value={step.progress}
                          className="mt-3 h-1.5 bg-[#ece7ff]"
                        />
                      </div>
                    ))}
                  </div>

                  <Separator className="my-5 bg-[#ece7ff]" />

                  <div className="grid gap-3 sm:grid-cols-3">
                    {[
                      ["Scenes", "08"],
                      ["Video frames", "124"],
                      ["Export", "1080p"],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="rounded-2xl border border-[#e7e2ff] bg-[#faf9ff] px-4 py-3"
                      >
                        <p className="text-xs uppercase tracking-[0.2em] text-[#8c93ab]">
                          {label}
                        </p>
                        <p className="mt-2 font-heading text-lg font-semibold text-[#111322]">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center justify-between rounded-[24px] border border-[#d9dce8] bg-white/80 px-5 py-4 shadow-[0_10px_30px_rgba(31,38,135,0.06)]">
              <div>
                <p className="text-sm font-semibold text-[#111322]">Next step</p>
                <p className="text-sm text-[#66708d]">Send the prompt or switch theme to continue.</p>
              </div>

              <Button className="rounded-full bg-[#6C4CF1] px-5 text-white hover:bg-[#5b3ee6]">
                Continue
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default ProjectWorkspace