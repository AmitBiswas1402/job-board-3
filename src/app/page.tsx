import InputArea from "@/components/InputArea"
import Navbar from "@/components/Navbar"

const HomePage = () => {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f5ff]">
      <div className="mx-auto max-w-7xl px-6 pt-6 pb-12">
        {/* Navbar */}
        <Navbar />

        {/* Hero */}
        <section className="flex flex-col items-center text-center pt-20">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#ece8ff] bg-white px-5 py-2 shadow-sm">
            <div className="h-2 w-2 rounded-full bg-[#7c5cff]" />

            <span className="text-sm font-semibold text-[#5b47d6]">
              AI-powered cinematic generation
            </span>
          </div>

          {/* Heading */}
          <h1 className="max-w-4xl text-[72px] font-black leading-[0.95] tracking-[-0.04em] text-[#0d1025]">
            Create Stunning
            <br />

            <span className="bg-linear-to-r from-[#6b4dff] to-[#8b5cf6] bg-clip-text text-transparent">
              Motion Graphics
            </span>

            <br />
            With AI in Seconds
          </h1>

          {/* Description */}
          <p className="mt-6 max-w-3xl text-[18px] leading-[1.6] text-[#5f6378]">
            Craft your idea, choose duration and format, and generate polished
            motion graphics in seconds.
          </p>

          {/* Input Card */}
          <div className="mt-8 w-full max-w-5xl">
            <div className="rounded-[30px] border border-[#ece8ff] bg-white p-4 shadow-[0_20px_60px_rgba(124,92,255,0.08)]">
              <InputArea />
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

export default HomePage