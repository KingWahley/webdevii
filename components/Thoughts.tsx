import Link from "next/link";

interface Thought {
  title: string;
  description: string;
  date: string;
  url: string;
}

const thoughts: Thought[] = [
  {
    title: "Starting and Growing a Career in Web Design",
    description:
      "An in-depth guide on how to kickstart your creative career, master high-end digital design systems, build an authoritative design portfolio, and attract high-paying clients.",
    date: "Apr 15, 2026",
    url: "/blog#starting-career-web-design",
  },
  {
    title: "Create a Landing Page That Performs Great",
    description:
      "Key design principles and copywriting strategies to maximize conversions. Learn how visual hierarchy, typography sizing, and strategic micro-interactions guide user behavior.",
    date: "Mar 12, 2026",
    url: "/blog#create-landing-page",
  },
  {
    title: "How Can Designers Prepare for the Future?",
    description:
      "Exploring the intersection of AI tools and user interface design. Learn how designers can leverage creative engineering to build unique interactive experiences.",
    date: "Feb 28, 2026",
    url: "/blog#designers-prepare-future",
  },
];

export default function Thoughts() {
  return (
    <section id="thoughts" className="space-y-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
        <h2 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-white uppercase font-display leading-[0.85]">
          Design
          <br />
          <span className="text-[#2C2C2C]">Thoughts</span>
        </h2>

        <Link
          href="/blog"
          className="self-start sm:self-auto inline-flex items-center gap-2 px-6 py-3.5 border border-[#262626] rounded-full hover:border-[#FF6B35] hover:text-[#FF6B35] text-neutral-400 font-bold transition duration-300 uppercase tracking-wider text-xs pointer-events-auto group"
        >
          <span>View All Blogs</span>
          <svg
            className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
            />
          </svg>
        </Link>
      </div>

      <div className="space-y-4">
        {thoughts.map((thought, index) => (
          <div
            key={thought.title}
            className={`group border-b border-[#262626] ${
              index === 0 ? "pb-8" : "py-8"
            } flex items-start justify-between gap-6 hover:border-neutral-700 transition-colors duration-300 thought-card`}
          >
            <div className="flex-1 space-y-3">
              <h4 className="text-2xl font-extrabold text-white group-hover:text-[#FF6B35] transition-colors duration-300 font-display">
                {thought.title}
              </h4>
              <p className="text-neutral-400 text-sm md:text-base leading-relaxed max-w-3xl">
                {thought.description}
              </p>
              <div className="flex items-center gap-6 pt-2">
                <span className="text-xs text-neutral-500 font-bold uppercase tracking-wider">
                  {thought.date}
                </span>
                <Link
                  href={thought.url}
                  className="text-xs text-white font-extrabold uppercase tracking-wider underline hover:text-[#FF6B35] transition-colors"
                >
                  Read more
                </Link>
              </div>
            </div>
            <Link
              href={thought.url}
              className="w-12 h-12 rounded-2xl border border-[#262626] flex items-center justify-center text-neutral-500 group-hover:text-[#FF6B35] group-hover:border-[#FF6B35] group-hover:rotate-45 transition duration-300 mt-1"
              aria-label={`Read article: ${thought.title}`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                />
              </svg>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
