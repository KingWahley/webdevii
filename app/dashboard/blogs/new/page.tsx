"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export const dynamic = "force-dynamic";

interface SectionInput {
  heading: string;
  paragraphs: string;
  quote: string;
  keyTakeaways: string;
}

export default function NewBlogPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("Web Design");
  const [readTime, setReadTime] = useState("5 min read");
  const [date, setDate] = useState(
    new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  );
  const [excerpt, setExcerpt] = useState("");
  const [tags, setTags] = useState("Web Design, UI/UX, Performance");
  const [published, setPublished] = useState(true);

  const [sections, setSections] = useState<SectionInput[]>([
    {
      heading: "1. The Strategic Foundation",
      paragraphs:
        "Every great website begins with a crystal-clear understanding of the target audience and business objectives.\n\nDesign without strategy is merely decoration. When code and visuals align with business metrics, conversion happens naturally.",
      quote: "Design is not just what it looks like and feels like. Design is how it works.",
      keyTakeaways: "Define target audience first\nAlign visuals with business goals\nEnsure measurable performance metrics",
    },
  ]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slug) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "")
      );
    }
  };

  const handleAddSection = () => {
    setSections([
      ...sections,
      {
        heading: "",
        paragraphs: "",
        quote: "",
        keyTakeaways: "",
      },
    ]);
  };

  const handleRemoveSection = (idx: number) => {
    setSections(sections.filter((_, i) => i !== idx));
  };

  const handleSectionChange = (idx: number, field: keyof SectionInput, val: string) => {
    const next = [...sections];
    next[idx][field] = val;
    setSections(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const formattedSections = sections.map((s) => ({
      heading: s.heading || undefined,
      paragraphs: s.paragraphs.split("\n\n").filter(Boolean),
      quote: s.quote || undefined,
      keyTakeaways: s.keyTakeaways ? s.keyTakeaways.split("\n").filter(Boolean) : undefined,
    }));

    const data = new FormData();
    data.append("title", title);
    data.append("slug", slug);
    data.append("category", category);
    data.append("read_time", readTime);
    data.append("date", date);
    data.append("excerpt", excerpt);
    const tagsArr = tags.split(",").map((t) => t.trim()).filter(Boolean);

    try {
      const supabase = createClient();
      const { error: dbError } = await supabase.from("blogs").insert({
        title, slug, category,
        read_time: readTime || "5 min read",
        date: date || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        excerpt, tags: tagsArr, sections: formattedSections, published,
      });

      if (dbError) {
        setError(`Database error (${dbError.code}): ${dbError.message}`);
        setSubmitting(false);
      } else {
        router.push("/dashboard/blogs");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to create article");
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl pb-16">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/dashboard/blogs"
            className="text-xs text-neutral-500 hover:text-white transition"
          >
            ← Back to All Articles
          </Link>
          <h1 className="text-3xl font-extrabold text-white font-display mt-1">
            Write New Blog Post
          </h1>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-950/60 border border-red-800 text-red-300 rounded-2xl text-xs font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Meta Details Card */}
        <div className="bg-[#161616] border border-[#262626] rounded-3xl p-6 sm:p-8 space-y-6">
          <h2 className="text-lg font-bold text-white font-display">
            Article Information
          </h2>

          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400">
              Article Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 5 Common Pitfalls When Building Modern Landing Pages"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full bg-[#0F0F0F] border border-[#262626] focus:border-[#FF6B35] text-white rounded-2xl p-4 text-sm outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400">
                URL Slug
              </label>
              <input
                type="text"
                required
                placeholder="5-common-pitfalls-modern-landing-pages"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full bg-[#0F0F0F] border border-[#262626] focus:border-[#FF6B35] text-white rounded-2xl p-4 text-sm outline-none font-mono text-xs"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#0F0F0F] border border-[#262626] focus:border-[#FF6B35] text-white rounded-2xl p-4 text-sm outline-none cursor-pointer"
              >
                <option value="Web Design">Web Design</option>
                <option value="Frontend Engineering">Frontend Engineering</option>
                <option value="UI/UX Systems">UI/UX Systems</option>
                <option value="AI & Tech">AI & Tech</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400">
                Read Time
              </label>
              <input
                type="text"
                placeholder="5 min read"
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                className="w-full bg-[#0F0F0F] border border-[#262626] focus:border-[#FF6B35] text-white rounded-2xl p-4 text-sm outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400">
                Publish Date
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#0F0F0F] border border-[#262626] focus:border-[#FF6B35] text-white rounded-2xl p-4 text-sm outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400">
              Short Excerpt / Preview Summary
            </label>
            <textarea
              rows={3}
              required
              placeholder="Brief summary that appears on the card preview and search engines..."
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full bg-[#0F0F0F] border border-[#262626] focus:border-[#FF6B35] text-white rounded-2xl p-4 text-sm outline-none resize-none"
            ></textarea>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400">
              Tags (Comma separated)
            </label>
            <input
              type="text"
              placeholder="Design, Frontend, Next.js, Conversion"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full bg-[#0F0F0F] border border-[#262626] focus:border-[#FF6B35] text-white rounded-2xl p-4 text-sm outline-none"
            />
          </div>
        </div>

        {/* Structured Sections Builder */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-white font-display">
              Content Sections ({sections.length})
            </h2>
            <button
              type="button"
              onClick={handleAddSection}
              className="px-4 py-2 bg-neutral-900 border border-neutral-700 hover:border-[#FF6B35] text-[#FF6B35] text-xs font-bold rounded-xl transition cursor-pointer"
            >
              + Add Section
            </button>
          </div>

          {sections.map((section, idx) => (
            <div
              key={idx}
              className="bg-[#161616] border border-[#262626] rounded-3xl p-6 sm:p-8 space-y-5 relative"
            >
              <div className="flex items-center justify-between border-b border-[#262626] pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Section #{idx + 1}
                </span>
                {sections.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveSection(idx)}
                    className="text-xs text-red-400 hover:text-red-300 transition font-bold cursor-pointer"
                  >
                    Remove Section
                  </button>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase text-neutral-400">
                  Section Subheading
                </label>
                <input
                  type="text"
                  placeholder="e.g. 1. The Power of Visual Hierarchy"
                  value={section.heading}
                  onChange={(e) => handleSectionChange(idx, "heading", e.target.value)}
                  className="w-full bg-[#0F0F0F] border border-[#262626] focus:border-[#FF6B35] text-white rounded-2xl p-3.5 text-sm outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase text-neutral-400">
                  Paragraphs (Separate paragraphs with double enter)
                </label>
                <textarea
                  rows={4}
                  placeholder="Write the content for this section..."
                  value={section.paragraphs}
                  onChange={(e) => handleSectionChange(idx, "paragraphs", e.target.value)}
                  className="w-full bg-[#0F0F0F] border border-[#262626] focus:border-[#FF6B35] text-white rounded-2xl p-3.5 text-sm outline-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase text-neutral-400">
                    Callout Pull Quote (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="An inspiring quote or callout to highlight in orange..."
                    value={section.quote}
                    onChange={(e) => handleSectionChange(idx, "quote", e.target.value)}
                    className="w-full bg-[#0F0F0F] border border-[#262626] focus:border-[#FF6B35] text-white rounded-2xl p-3 text-xs outline-none"
                  ></textarea>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase text-neutral-400">
                    Key Takeaways Bullets (One per line)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Key point 1&#10;Key point 2&#10;Key point 3"
                    value={section.keyTakeaways}
                    onChange={(e) => handleSectionChange(idx, "keyTakeaways", e.target.value)}
                    className="w-full bg-[#0F0F0F] border border-[#262626] focus:border-[#FF6B35] text-white rounded-2xl p-3 text-xs outline-none"
                  ></textarea>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Publish Options */}
        <div className="bg-[#161616] border border-[#262626] rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="published"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="w-5 h-5 rounded accent-[#FF6B35] cursor-pointer"
            />
            <label htmlFor="published" className="text-sm font-bold text-white cursor-pointer">
              Publish immediately (Make visible on `/blog`)
            </label>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-4 bg-[#FF6B35] text-neutral-950 font-black uppercase rounded-2xl text-xs tracking-wider hover:bg-[#e05a2b] transition duration-300 disabled:opacity-50 cursor-pointer shadow-lg shadow-[#FF6B35]/20 w-full sm:w-auto"
          >
            {submitting ? "Publishing..." : "Publish Article"}
          </button>
        </div>
      </form>
    </div>
  );
}
