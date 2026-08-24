"use client";

import { useState } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";

interface BlogPost {
  id: string;
  title: string;
  category: "Web Design" | "Frontend Engineering" | "UI/UX Systems" | "AI & Tech";
  readTime: string;
  date: string;
  excerpt: string;
  content: string[];
}

const blogPosts: BlogPost[] = [
  {
    id: "starting-career-web-design",
    title: "Starting and Growing a Career in Web Design",
    category: "Web Design",
    readTime: "6 min read",
    date: "Apr 15, 2026",
    excerpt:
      "An in-depth guide on how to kickstart your creative career, master high-end digital design systems, build an authoritative design portfolio, and attract high-paying clients.",
    content: [
      "Breaking into web design requires more than just knowing Figma or Photoshop. In today's competitive landscape, high-performing designers understand business outcomes, conversion metrics, and design systems.",
      "Focus on mastering the fundamentals: typography hierarchy, spatial cadence, responsive grid systems, and subtle motion design that serves clarity rather than distraction.",
      "When building your portfolio, showcase case studies that explain the problem, your strategic decision-making, and the quantifiable impact of the final product.",
    ],
  },
  {
    id: "create-landing-page",
    title: "Create a Landing Page That Performs Great",
    category: "UI/UX Systems",
    readTime: "5 min read",
    date: "Mar 12, 2026",
    excerpt:
      "Key design principles and copywriting strategies to maximize conversions. Learn how visual hierarchy, typography sizing, and strategic micro-interactions guide user behavior.",
    content: [
      "A landing page has one job: communicate value swiftly and guide visitors to a singular desired action with minimal friction.",
      "Structure your hero section with razor-sharp value propositions: an unmissable headline, concise supporting proof, and a high-contrast primary call to action above the fold.",
      "Reduce cognitive load through clear section rhythm, honest testimonials, and interactive previews that demonstrate product capability instantly.",
    ],
  },
  {
    id: "designers-prepare-future",
    title: "How Can Designers Prepare for the Future?",
    category: "AI & Tech",
    readTime: "7 min read",
    date: "Feb 28, 2026",
    excerpt:
      "Exploring the intersection of AI tools and user interface design. Learn how designers can leverage creative engineering to build unique interactive experiences.",
    content: [
      "Generative AI and agentic coding tools are transforming the speed at which ideas become interactive reality. The boundary between design and code is blurring faster than ever.",
      "Designers who embrace creative engineering—understanding component architectures, animation libraries like GSAP, and programmatic design tokens—will be best positioned to lead.",
      "AI will automate repetitive layouts; human taste, deep empathy, and refined art direction remain the true differentiators.",
    ],
  },
  {
    id: "mastering-tailwind-v4",
    title: "Modern Component Architecture with Tailwind & Next.js",
    category: "Frontend Engineering",
    readTime: "8 min read",
    date: "Jan 18, 2026",
    excerpt:
      "Architecting scalable, modular design tokens and performant React components without sacrificing visual nuance or runtime efficiency.",
    content: [
      "Modern frontend architecture relies heavily on composable primitives and strict token enforcement. By mapping brand colors and typography into CSS variables and Tailwind themes, design consistency remains effortless.",
      "Leverage React Server Components by default for static sections and isolate client-side boundaries solely for interactive forms, sliders, and animation controllers.",
    ],
  },
  {
    id: "micro-interactions-guide",
    title: "The Art of Subtle Motion & Micro-Interactions",
    category: "UI/UX Systems",
    readTime: "4 min read",
    date: "Jan 04, 2026",
    excerpt:
      "Why the best web animations are felt rather than noticed, and how to implement buttery smooth interactions using Lenis and GSAP.",
    content: [
      "Micro-interactions provide kinetic feedback that reassures users their actions are acknowledged. A well-timed easing curve makes an interface feel tangible and responsive.",
      "Avoid jarring transitions. Prioritize performant properties (transform, opacity) and ensure motion respects user preferences for reduced motion.",
    ],
  },
];

const categories = ["All", "Web Design", "Frontend Engineering", "UI/UX Systems", "AI & Tech"] as const;

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);

  const filteredPosts =
    selectedCategory === "All"
      ? blogPosts
      : blogPosts.filter((post) => post.category === selectedCategory);

  const toggleExpand = (id: string) => {
    setExpandedPostId(expandedPostId === id ? null : id);
  };

  return (
    <div className="bg-dark text-neutral-100 min-h-screen relative pb-12">
      {/* Floating Top Navigation */}
      <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none animate-fade-in">
        <nav className="flex items-center justify-between sm:justify-center w-[92%] sm:w-auto max-w-[420px] sm:max-w-none gap-4 px-6 sm:px-6 py-3 bg-[#161616]/90 border border-[#262626]/90 rounded-full backdrop-blur-md shadow-2xl pointer-events-auto">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-300 hover:text-[#FF6B35] transition-colors"
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
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
            <span>Back to Portfolio</span>
          </Link>
          <div className="h-4 w-px bg-neutral-800 hidden sm:block"></div>
          <a
            href="/#contact"
            className="text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-white transition-colors"
          >
            Contact
          </a>
        </nav>
      </div>

      {/* Main Blog Container */}
      <main className="max-w-4xl mx-auto px-6 pt-28 sm:pt-36 pb-16 space-y-16">
        {/* Header */}
        <header className="space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neutral-800 bg-[#161616] text-xs font-semibold text-[#FF6B35] uppercase tracking-wider">
            <span>●</span>
            <span>Insights & Engineering</span>
          </div>

          <h1 className="text-6xl sm:text-7xl font-extrabold tracking-tight text-white uppercase font-display leading-[0.88]">
            Design & Tech
            <br />
            <span className="text-[#3A3A3A]">Thoughts</span>
          </h1>

          <p className="text-neutral-400 text-lg sm:text-xl font-normal leading-relaxed max-w-2xl">
            Articles, breakdowns, and engineering insights on modern web development, UI/UX design systems, and software architecture.
          </p>
        </header>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2.5 pt-2 border-b border-[#262626] pb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              type="button"
              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                selectedCategory === category
                  ? "bg-[#FF6B35] text-neutral-950 shadow-md shadow-[#FF6B35]/20"
                  : "bg-[#161616] border border-[#262626] text-neutral-400 hover:text-white hover:border-neutral-700"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Articles List */}
        <div className="space-y-8">
          {filteredPosts.map((post) => {
            const isExpanded = expandedPostId === post.id;
            return (
              <article
                key={post.id}
                id={post.id}
                className="group border border-[#262626] bg-[#161616]/70 rounded-3xl p-6 sm:p-8 hover:border-neutral-700 hover:bg-[#161616] transition-all duration-300 space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-[#FF6B35] font-bold uppercase tracking-wider">
                      {post.category}
                    </span>
                    <span className="text-neutral-500 font-semibold">
                      {post.readTime}
                    </span>
                  </div>
                  <time className="text-neutral-500 font-bold uppercase tracking-wider">
                    {post.date}
                  </time>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-white group-hover:text-[#FF6B35] transition-colors duration-300 font-display">
                  {post.title}
                </h2>

                <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
                  {post.excerpt}
                </p>

                {isExpanded && (
                  <div className="pt-4 border-t border-neutral-800 space-y-3 text-neutral-300 text-sm sm:text-base leading-relaxed animate-fade-in">
                    {post.content.map((paragraph, pIdx) => (
                      <p key={pIdx}>{paragraph}</p>
                    ))}
                  </div>
                )}

                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={() => toggleExpand(post.id)}
                    type="button"
                    className="inline-flex items-center gap-2 text-xs text-white font-extrabold uppercase tracking-wider underline hover:text-[#FF6B35] transition-colors"
                  >
                    <span>{isExpanded ? "Show Less" : "Read Full Article"}</span>
                    <svg
                      className={`w-3.5 h-3.5 transition-transform duration-300 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                      />
                    </svg>
                  </button>

                  <button
                    onClick={() => toggleExpand(post.id)}
                    type="button"
                    aria-label={isExpanded ? "Collapse" : "Expand"}
                    className="w-10 h-10 rounded-xl border border-[#262626] flex items-center justify-center text-neutral-500 group-hover:text-[#FF6B35] group-hover:border-[#FF6B35] transition duration-300"
                  >
                    <svg
                      className={`w-4 h-4 transition-transform duration-300 ${
                        isExpanded ? "rotate-45" : ""
                      }`}
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
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* Call to action card */}
        <div className="bg-gradient-to-br from-[#1c1c1c] to-[#121212] border border-[#262626] rounded-3xl p-8 sm:p-12 text-center space-y-6">
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
            Have a project in mind?
          </h3>
          <p className="text-neutral-400 max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
            I help businesses turn visions into high-performing websites and digital experiences. Let&apos;s talk.
          </p>
          <Link
            href="/#contact"
            className="inline-block bg-[#FF6B35] text-neutral-950 font-black uppercase px-8 py-4 rounded-2xl hover:bg-[#e05a2b] active:scale-95 transition duration-300 tracking-wider text-xs"
          >
            Start a Conversation
          </Link>
        </div>

        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
}
