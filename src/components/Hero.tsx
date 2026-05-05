const Hero = () => {
  return (
    <section className="relative overflow-hidden px-4 pb-10 pt-14 md:pt-20">
      <div className="pointer-events-none absolute left-1/2 top-24 h-136 w-136 -translate-x-1/2 rounded-full bg-[#8368ff]/20 blur-[130px]" />

      <div className="relative z-10 mx-auto max-w-5xl text-center">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#d8d9e8] bg-white px-4 py-2 shadow-sm">
          <span className="text-sm text-[#6C4CF1]">✦</span>
          <span className="text-sm font-semibold text-[#626984]">
            AI-powered cinematic generation
          </span>
        </div>

        {/* Heading */}
        <h1 className="font-heading text-[2.6rem] font-bold leading-[0.92] tracking-tighter text-[#121429] md:text-[5.1rem]">
          Create Stunning
          <br />
          <span className="bg-linear-to-r from-[#7660ff] to-[#5b66ff] bg-clip-text text-transparent">
            Motion Graphics
          </span>
          <br />
          With AI in Seconds
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-7 max-w-3xl text-[1.05rem] font-medium leading-8 text-[#5f6681] md:text-[1.35rem] md:leading-10">
          Craft your idea, choose duration and format, and generate polished
          motion graphics in seconds.
        </p>
      </div>
    </section>
  );
}

export default Hero;