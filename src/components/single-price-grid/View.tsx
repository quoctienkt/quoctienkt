import { classes } from "@/utils/toggle";

type SinglePriceGridProps = {
  className: string;
};

export function SinglePriceGrid(props: SinglePriceGridProps) {
  return (
    <div className={classes("flex flex-col w-full text-black bg-white rounded shadow-[rgba(0,0,0,0.24)_0px_3px_8px]", props.className)}>
      {/* Overview */}
      <div className="flex-auto basis-48 px-[35px] py-[35px]">
        <div className="text-[#3cb2ac] font-bold text-3xl mb-3">Join our community</div>
        <div className="text-[#c1d275] font-bold text-xl mb-2">
          30-day, hassle-free money back guarantee
        </div>
        <div className="text-[#adb0b6] flex flex-col leading-7">
          <span>
            Gain access to our full library of tutorials along with expert code
            reviews.
          </span>
          <span>
            Perfect for any developers who are serious about honing their
            skills.
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-row flex-auto text-[#e9ffff] basis-56 max-sm:flex-col">
        {/* Subscription */}
        <div className="bg-[#2ab1b5] flex-1 basis-1/2 px-[35px] py-[35px]">
          <div className="mb-5 text-xl font-bold text-white">Monthly Subscription</div>
          <div className="flex flex-row items-center mb-4">
            <div className="mr-4 text-3xl font-bold">&#36;29</div>
            <div className="text-[#90dadd]">per month</div>
          </div>
          <div>Full access for less than &#36;1 a day</div>
          <div className="bg-[#bfdf32] w-full p-3 mt-10 font-bold text-center text-white rounded shadow-[rgba(0,0,0,0.24)_0px_3px_8px] cursor-pointer hover:bg-[#a4bd36]">
            Sign Up
          </div>
        </div>

        {/* Why Us */}
        <div className="bg-[#4abebd] flex-auto basis-1/2 px-[35px] py-[35px]">
          <div className="mb-5 text-xl font-bold text-white">Why Us</div>
          <ul className="[&>li]:hover:text-[#409997] [&>li]:cursor-pointer">
            <li>Tutorials by industry experts</li>
            <li>Peer &amp; expert code review</li>
            <li>Coding exercises</li>
            <li>Access to our GitHub repos</li>
            <li>Community forum</li>
            <li>Flashcard decks</li>
            <li>New videos every week</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
