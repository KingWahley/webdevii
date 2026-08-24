"use client";

import { useState } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import { blogPosts } from "@/lib/blog-data";

const categories = ["All", "Web Design", "Frontend Engineering", "UI/UX Systems", "AI & Tech"] as const;

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const filteredPosts =
    selectedCategory === "All"
      ? blogPosts
      : blogPosts.filter((post) => post.category === selectedCategory);

  return (
    <div className="bg-dark text-neutral-100 min-h-screen relative pb-12">


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
          {filteredPosts.map((post) => (
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

              <Link href={`/blog/${post.slug}`} className="block group">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white group-hover:text-[#FF6B35] transition-colors duration-300 font-display">
                  {post.title}
                </h2>
              </Link>

              <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
                {post.excerpt}
              </p>

              <div className="pt-2 flex items-center justify-between">
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-2 text-xs text-white font-extrabold uppercase tracking-wider underline hover:text-[#FF6B35] transition-colors"
                >
                  <span>Read Full Article</span>
                  <svg
                    className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    />
                  </svg>
                </Link>

                <Link
                  href={`/blog/${post.slug}`}
                  aria-label={`Read article: ${post.title}`}
                  className="w-10 h-10 rounded-xl border border-[#262626] flex items-center justify-center text-neutral-500 group-hover:text-[#FF6B35] group-hover:border-[#FF6B35] group-hover:rotate-45 transition duration-300"
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
            </article>
          ))}
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
