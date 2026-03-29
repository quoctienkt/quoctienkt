export function Home() {
  return (
    <>
      <main className="z-10 flex-1 flex flex-row justify-evenly items-center max-lg:flex-col">
        {/* Content */}
        <section className="w-[420px] flex flex-col justify-end max-sm:w-[327px]">
          <div className="text-3xl uppercase font-['Barlow_Condensed'] tracking-tighter text-[#D0D6F9] max-lg:text-xl max-lg:text-center">
            So, you want to travel to
          </div>
          <div className="text-[140px] uppercase w-full font-['Bellefair'] max-lg:text-center max-sm:text-[80px]">
            Space
          </div>
          <div className="text-justify font-['Barlow'] text-[#D0D6F9] max-lg:text-center max-sm:leading-[25px]">
            Let&apos;s face it; if you want to go to space, you might as well
            genuinely go to outer space and not hover kind of on the edge of it.
            Well sit back, and relax because we&apos;ll give you a truly out of this
            world experience!
          </div>
        </section>

        {/* Explore button */}
        <section>
          <div className="w-[274px] h-[274px] rounded-full bg-white text-black cursor-pointer flex justify-center items-center uppercase text-3xl font-['Bellefair'] max-sm:w-[200px] max-sm:h-[200px]">
            Explore
          </div>
        </section>
      </main>
    </>
  );
}
