"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { BlogArticle } from "@/lib/types/database.types";

export const dynamic = "force-dynamic";

export default function BlogsManagerPage() {
  const [blogs, setBlogs] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setDbError(null);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setDbError(`Supabase error (${error.code}): ${error.message}`);
    } else {
      setBlogs((data as BlogArticle[]) ?? []);
    }
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this article permanently?")) return;
    setDeleteError(null);
    const supabase = createClient();
    const { error } = await supabase.from("blogs").delete().eq("id", id);
    if (error) {
      setDeleteError(`Delete failed (${error.code}): ${error.message}`);
    } else {
      await loadData();
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white font-display">
            Blog Articles Manager
          </h1>
          <p className="text-neutral-400 text-sm mt-1">
            Publish, edit, and manage your engineering & design thoughts.
          </p>
        </div>

        <Link
          href="/dashboard/blogs/new"
          className="px-6 py-3.5 bg-[#FF6B35] text-neutral-950 font-black uppercase rounded-2xl text-xs tracking-wider hover:bg-[#e05a2b] transition duration-300 shadow-lg shadow-[#FF6B35]/20 self-start sm:self-auto block"
        >
          + Write New Article
        </Link>
      </div>

      {/* Error banners */}
      {dbError && (
        <div className="bg-red-950/60 border border-red-700 text-red-300 rounded-2xl p-4 text-xs leading-relaxed">
          <span className="font-bold block mb-1">⚠ Supabase Connection Issue</span>
          {dbError}
        </div>
      )}
      {deleteError && (
        <div className="bg-red-950/60 border border-red-700 text-red-300 rounded-2xl p-4 text-xs">{deleteError}</div>
      )}

      {/* Blogs List */}
      <div className="bg-[#161616] border border-[#262626] rounded-3xl p-6 sm:p-8 space-y-4">
        {loading ? (
          <p className="text-neutral-500 text-sm">Loading articles...</p>
        ) : blogs.length === 0 ? (
          <div className="py-8 text-center space-y-3">
            <p className="text-neutral-400 text-sm">No articles found in the database.</p>
            <Link
              href="/dashboard/blogs/new"
              className="inline-block text-xs font-bold uppercase text-[#FF6B35] hover:underline"
            >
              Click here to write your first article →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-[#262626]">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 first:pt-0 last:pb-0"
              >
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 text-[10px] text-[#FF6B35] font-bold uppercase">
                      {blog.category}
                    </span>
                    <span className="text-xs text-neutral-500">{blog.read_time}</span>
                    <span className="text-xs text-neutral-500">•</span>
                    <span className="text-xs text-neutral-500">{blog.date}</span>
                    {!blog.published && (
                      <span className="px-2 py-0.5 rounded-full bg-yellow-950 text-yellow-400 text-[10px] font-bold uppercase">
                        Draft
                      </span>
                    )}
                  </div>
                  <h3 className="font-extrabold text-white text-lg font-display">
                    {blog.title}
                  </h3>
                  <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                    {blog.excerpt}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  <Link
                    href={`/blog/${blog.slug}`}
                    target="_blank"
                    className="px-4 py-2 bg-neutral-900 border border-neutral-800 hover:text-white text-xs font-bold rounded-xl text-neutral-400 transition"
                  >
                    Preview
                  </Link>
                  <button
                    onClick={() => handleDelete(blog.id)}
                    className="px-4 py-2 bg-red-950/40 border border-red-900/60 hover:bg-red-900/60 text-xs font-bold rounded-xl text-red-300 transition cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
