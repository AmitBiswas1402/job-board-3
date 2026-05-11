
import { listGeneratedVideos } from "@/action/video.action";
import { getProjectBySlug } from "@/action/project.action";
import ProjectWorkspaceClient from "@/components/ProjectWorkspaceClient";
import ChatInterface from "@/components/ChatInterface";
import ThemeControls from "@/components/ThemeControls";
import VideoProgress from "@/components/VideoProgress";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Share2, Play } from "lucide-react";
import Link from "next/link";

type ProjectPageProps = {
  params: Promise<{ projectId: string }>;
};

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { projectId } = await params;
  const slug = projectId;
  const project = await getProjectBySlug(String(slug));
  const videos = project ? await listGeneratedVideos(project.id) : [];
  const serializedVideos = videos.map(({ createdAt, ...video }) => ({
    ...video,
    createdAt: createdAt.toISOString(),
  }));

  return (
    <main className="min-h-screen w-full bg-background">
      {/* Fixed Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="flex h-16 items-center gap-4 px-6">
          <Link href="/">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>

          <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-sm font-medium">
                  {project?.title || "Untitled Project"}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-xs font-medium">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              Status: {project?.status || "draft"}
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Share</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="flex h-[calc(100vh-64px)]">
        {/* Left Sidebar - Chat & Theme */}
        <aside className="hidden w-96 border-r bg-muted/30 lg:flex flex-col">
          <Tabs defaultValue="chat" className="flex-1 flex flex-col overflow-hidden">
            <div className="border-b px-6 pt-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="chat" className="text-xs sm:text-sm">
                  Chat
                </TabsTrigger>
                <TabsTrigger value="theme" className="text-xs sm:text-sm">
                  Theme
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Chat Tab */}
            <TabsContent value="chat" className="flex-1 overflow-hidden flex flex-col m-0">
              <ChatInterface />
            </TabsContent>

            {/* Theme Tab */}
            <TabsContent value="theme" className="flex-1 overflow-y-auto m-0">
              <ThemeControls />
            </TabsContent>
          </Tabs>
        </aside>

        {/* Right Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="h-full flex flex-col gap-6 p-6 lg:p-8">
            {/* Video Preview Section */}
            <div className="flex-1 rounded-2xl border border-border bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 p-8 flex flex-col items-center justify-center relative overflow-hidden group">
              {/* Animated background effect */}
              <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Play button overlay */}
              <div className="relative z-10 flex flex-col items-center justify-center gap-6">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-linear-to-r from-blue-500 to-purple-500 blur-xl opacity-75 animate-pulse"></div>
                  <button className="relative flex h-24 w-24 items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 transition-all duration-300 hover:scale-110">
                    <Play className="h-10 w-10 ml-1 fill-white" />
                  </button>
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Video Preview
                  </h3>
                  <p className="text-sm text-white/60">
                    {project?.aspectRatio || "16:9"} • {project?.duration || 10}s
                  </p>
                </div>
              </div>

              {/* Info badge */}
              <div className="absolute bottom-6 left-6 z-10 rounded-lg bg-black/40 backdrop-blur-md border border-white/20 px-4 py-2">
                <p className="text-xs font-medium text-white/80">
                  Status: <span className="text-green-400 font-semibold capitalize">{project?.status || "processing"}</span>
                </p>
              </div>
            </div>

            {/* Progress & Project Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Progress Section */}
              <div className="md:col-span-2">
                <Card className="border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Generation Progress</CardTitle>
                    <CardDescription>
                      Real-time status of your video generation
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <VideoProgress />
                  </CardContent>
                </Card>
              </div>

              {/* Project Details */}
              <Card className="border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Project Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Duration
                    </p>
                    <p className="text-lg font-semibold">{project?.duration || "-"}s</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Aspect Ratio
                    </p>
                    <p className="text-lg font-semibold">{project?.aspectRatio || "-"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Project ID
                    </p>
                    <p className="text-xs font-mono text-muted-foreground break-all">
                      {project?.id || "-"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Project Prompt Section */}
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Project Prompt</CardTitle>
                <CardDescription>
                  The creative brief for this video
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-foreground/80 whitespace-pre-wrap">
                  {project?.prompt || "No prompt available"}
                </p>
              </CardContent>
            </Card>

            {/* Generated Videos Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Generated Videos</h3>
              <ProjectWorkspaceClient
                projectId={project?.id ?? 0}
                projectStatus={project?.status}
                initialVideos={serializedVideos}
              />
            </div>
          </div>
        </main>
      </div>
    </main>
  );
}
