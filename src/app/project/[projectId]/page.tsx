import { getProjectBySlug } from "@/action/project.action";

type ProjectPageProps = {
  params: Promise<{ projectId: string }>;
};

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { projectId } = await params;
  // `projectId` here is actually the project slug from the URL
  const slug = projectId;

  const project = await getProjectBySlug(String(slug));

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-6 py-12">
      <header className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="font-heading text-4xl font-bold text-[#111322]">Project Workspace</h1>
          <p className="mt-2 text-lg text-[#4b4f67]">Project ID: {project?.id ?? projectId}</p>
          {project?.title && (
            <p className="mt-1 text-sm text-[#6b6f87]">{project.title}</p>
          )}
        </div>
        <div className="text-sm text-[#7f86a1]">Status: {project?.status ?? "-"}</div>
      </header>

      <div className="grid grid-cols-12 gap-8">
        {/* Left: Control Panel */}
        <aside className="col-span-4">
          <div className="rounded-xl border bg-white p-6 shadow-md">
            <h2 className="mb-4 text-xl font-semibold">Creative control room</h2>
            <p className="mb-4 text-sm text-[#6b6f87]">Toggle between live chat and visual themes while keeping the project settings in sync.</p>

            <div className="mb-4">
              <h3 className="text-sm font-medium text-[#4b4f67]">Project Prompt</h3>
              <p className="mt-2 text-sm text-[#52566e] whitespace-pre-wrap">{project?.prompt ?? "No prompt available."}</p>
            </div>

            <div className="flex gap-3">
              <div className="flex-1">
                <h4 className="text-xs text-[#7f86a1]">Duration</h4>
                <div className="mt-1 text-sm font-medium">{project?.duration ?? "-"}s</div>
              </div>
              <div className="flex-1">
                <h4 className="text-xs text-[#7f86a1]">Aspect</h4>
                <div className="mt-1 text-sm font-medium">{project?.aspectRatio ?? "-"}</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Right: Preview */}
        <section className="col-span-8">
          <div className="rounded-xl border bg-gradient-to-b from-[#0f1020] to-[#1b1633] p-6 text-white shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-2xl font-semibold">Your latest render preview</h3>
              <div className="text-sm rounded-full bg-white/10 px-3 py-1">{project?.aspectRatio ?? "16:9"} render</div>
            </div>

            <div className="relative flex h-[420px] w-full items-center justify-center rounded-lg bg-gradient-to-br from-[#20143a] to-[#4a2a8a]">
              <button className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
                ▶
              </button>
              <div className="absolute bottom-4 left-4 rounded-md bg-white/8 px-4 py-2 text-sm">STATUS: {project?.status ?? "building"}</div>
            </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-md bg-white/5 p-4 text-sm">Project created at: {project?.createdAt ? String(project.createdAt) : "-"}</div>
              <div className="rounded-md bg-white/5 p-4 text-sm">Videos: (generated videos will appear here)</div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
