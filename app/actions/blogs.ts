"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { blogPosts } from "@/lib/blog-data";
import type { BlogArticle } from "@/lib/types/database.types";

const hardcodedFallback = blogPosts.map((b) => ({
  id: b.id,
  slug: b.slug,
  title: b.title,
  category: b.category,
  read_time: b.readTime,
  date: b.date,
  excerpt: b.excerpt,
  tags: b.tags,
  sections: b.sections,
  published: true,
}));

export async function getBlogs(includeUnpublished = false): Promise<BlogArticle[]> {
  try {
    const supabase = createClient();
    let query = supabase.from("blogs").select("*").order("created_at", { ascending: false });

    if (!includeUnpublished) {
      query = query.eq("published", true);
    }

    const { data, error } = await query;

    if (error) {
      console.log("[getBlogs] Supabase error:", error.message);
      return hardcodedFallback;
    }

    // Only fall back to hardcoded if data is null (e.g. table missing)
    // If data is empty [], return empty — user might have deleted all blogs
    if (data === null) return hardcodedFallback;

    // If DB has blogs, always return those (Supabase is source of truth)
    if (data.length > 0) return data as BlogArticle[];

    // DB is empty — show hardcoded until user adds their own
    return hardcodedFallback;
  } catch (err) {
    console.log("[getBlogs] Exception:", err);
    return hardcodedFallback;
  }
}

export async function getBlogBySlug(slug: string): Promise<BlogArticle | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .eq("slug", slug)
      .single();

    if (!error && data) return data as BlogArticle;

    // Fallback to hardcoded only if not in Supabase
    const fallback = blogPosts.find((b) => b.slug === slug);
    if (!fallback) return null;
    return {
      id: fallback.id, slug: fallback.slug, title: fallback.title,
      category: fallback.category, read_time: fallback.readTime,
      date: fallback.date, excerpt: fallback.excerpt, tags: fallback.tags,
      sections: fallback.sections, published: true,
    };
  } catch (err) {
    const fallback = blogPosts.find((b) => b.slug === slug);
    if (!fallback) return null;
    return {
      id: fallback.id, slug: fallback.slug, title: fallback.title,
      category: fallback.category, read_time: fallback.readTime,
      date: fallback.date, excerpt: fallback.excerpt, tags: fallback.tags,
      sections: fallback.sections, published: true,
    };
  }
}

export async function createBlog(formData: FormData) {
  try {
    const supabase = createClient();

    const title = formData.get("title") as string;
    const slug =
      (formData.get("slug") as string) ||
      title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    const category = formData.get("category") as string;
    const readTime = formData.get("read_time") as string;
    const date = formData.get("date") as string;
    const excerpt = formData.get("excerpt") as string;
    const tagsRaw = formData.get("tags") as string;
    const tags = tagsRaw ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean) : [];
    const sectionsRaw = formData.get("sections") as string;
    let sections = [];
    try { sections = JSON.parse(sectionsRaw || "[]"); } catch { sections = [{ heading: "Introduction", paragraphs: [excerpt] }]; }
    const published = formData.get("published") === "true";

    if (!title || !slug || !category || !excerpt) {
      return { error: "Title, slug, category, and excerpt are required" };
    }

    const { error } = await supabase.from("blogs").insert({
      title, slug, category,
      read_time: readTime || "5 min read",
      date: date || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      excerpt, tags, sections, published,
    });

    if (error) return { error: error.message };

    revalidatePath("/", "layout");
    revalidatePath("/blog", "layout");
    revalidatePath("/dashboard/blogs");
    return { success: true, slug };
  } catch (err: any) {
    return { error: err?.message || "Failed to create article" };
  }
}

export async function updateBlog(id: string, formData: FormData) {
  try {
    const supabase = createClient();

    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const category = formData.get("category") as string;
    const readTime = formData.get("read_time") as string;
    const date = formData.get("date") as string;
    const excerpt = formData.get("excerpt") as string;
    const tagsRaw = formData.get("tags") as string;
    const tags = tagsRaw ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean) : [];
    const sectionsRaw = formData.get("sections") as string;
    let sections = [];
    try { sections = JSON.parse(sectionsRaw || "[]"); } catch { sections = []; }
    const published = formData.get("published") === "true";

    const { error } = await supabase
      .from("blogs")
      .update({ title, slug, category, read_time: readTime, date, excerpt, tags, sections, published, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) return { error: error.message };

    revalidatePath("/", "layout");
    revalidatePath("/blog", "layout");
    revalidatePath("/dashboard/blogs");
    return { success: true };
  } catch (err: any) {
    return { error: err?.message || "Failed to update article" };
  }
}

export async function deleteBlog(id: string) {
  try {
    const supabase = createClient();
    const { error } = await supabase.from("blogs").delete().eq("id", id);
    if (error) return { error: error.message };

    revalidatePath("/", "layout");
    revalidatePath("/blog", "layout");
    revalidatePath("/dashboard/blogs");
    return { success: true };
  } catch (err: any) {
    return { error: err?.message || "Failed to delete article" };
  }
}
