"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { ProjectItem } from "@/lib/types/database.types";

const defaultProjects: ProjectItem[] = [
  { id: "1", title: "Nautica beach ATV", domain: "leisuresportsatv.com", url: "https://leisuresportsatv.com", image_url: "/beach_atv_thumbnail.png", initially_hidden: false, sort_order: 1 },
  { id: "2", title: "Nautica beach soccer and paintball", domain: "Nautica.leisuresportspaintball.com", url: "https://Nautica.leisuresportspaintball.com", image_url: "/beach_soccer_thumbnail.png", initially_hidden: false, sort_order: 2 },
  { id: "3", title: "Leisure sports Nike Lake", domain: "Nike-Lake.leisuresportsatv.com", url: "https://Nike-Lake.leisuresportsatv.com", image_url: "/nike_lake_thumbnail.png", initially_hidden: false, sort_order: 3 },
  { id: "4", title: "Play Padel ikoyi", domain: "ikoyi.playpadelltd.com", url: "https://ikoyi.playpadelltd.com", image_url: "/play_padel_thumbnail.png", initially_hidden: true, sort_order: 4 },
  { id: "5", title: "Labs Pest Control", domain: "labspestcontrol.com", url: "https://www.labspestcontrol.com/", image_url: "/pest_control_thumbnail.png", initially_hidden: true, sort_order: 5 },
  { id: "6", title: "Kinknot", domain: "kinknot.com", url: "https://www.kinknot.com/", image_url: "/kinknot_thumbnail.png", initially_hidden: true, sort_order: 6 },
];

export async function getProjects(): Promise<ProjectItem[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      console.log("[getProjects] Supabase error:", error.message);
      return defaultProjects;
    }

    // Only fall back if data is null (table doesn't exist), not if empty
    if (data === null) return defaultProjects;

    // Return live data even if empty — empty means user deleted all projects
    return data as ProjectItem[];
  } catch (err) {
    console.log("[getProjects] Exception:", err);
    return defaultProjects;
  }
}

export async function createProject(formData: FormData) {
  try {
    const supabase = createClient();

    const title = formData.get("title") as string;
    const domain = formData.get("domain") as string;
    const url = formData.get("url") as string;
    let imageUrl = (formData.get("image_url") as string) || "/beach_atv_thumbnail.png";
    const initiallyHidden = formData.get("initially_hidden") === "true";
    const sortOrder = parseInt((formData.get("sort_order") as string) || "0", 10);

    const thumbnailFile = formData.get("thumbnail_file") as File | null;
    if (thumbnailFile && thumbnailFile.size > 0) {
      const fileExt = thumbnailFile.name.split(".").pop();
      const filePath = `projects/project-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("portfolio-assets")
        .upload(filePath, thumbnailFile);

      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage
          .from("portfolio-assets")
          .getPublicUrl(filePath);
        imageUrl = publicUrl;
      }
    }

    if (!title || !domain || !url) {
      return { error: "Title, domain, and URL are required" };
    }

    const { error } = await supabase.from("projects").insert({
      title, domain, url,
      image_url: imageUrl,
      initially_hidden: initiallyHidden,
      sort_order: sortOrder,
    });

    if (error) return { error: error.message };

    revalidatePath("/", "layout");
    revalidatePath("/dashboard/projects");
    return { success: true };
  } catch (err: any) {
    return { error: err?.message || "Failed to create project" };
  }
}

export async function updateProject(id: string, formData: FormData) {
  try {
    const supabase = createClient();

    const title = formData.get("title") as string;
    const domain = formData.get("domain") as string;
    const url = formData.get("url") as string;
    let imageUrl = formData.get("image_url") as string;
    const initiallyHidden = formData.get("initially_hidden") === "true";
    const sortOrder = parseInt((formData.get("sort_order") as string) || "0", 10);

    const thumbnailFile = formData.get("thumbnail_file") as File | null;
    if (thumbnailFile && thumbnailFile.size > 0) {
      const fileExt = thumbnailFile.name.split(".").pop();
      const filePath = `projects/project-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("portfolio-assets")
        .upload(filePath, thumbnailFile);

      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage
          .from("portfolio-assets")
          .getPublicUrl(filePath);
        imageUrl = publicUrl;
      }
    }

    const { error } = await supabase
      .from("projects")
      .update({ title, domain, url, image_url: imageUrl, initially_hidden: initiallyHidden, sort_order: sortOrder, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) return { error: error.message };

    revalidatePath("/", "layout");
    revalidatePath("/dashboard/projects");
    return { success: true };
  } catch (err: any) {
    return { error: err?.message || "Failed to update project" };
  }
}

export async function deleteProject(id: string) {
  try {
    const supabase = createClient();
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) return { error: error.message };

    revalidatePath("/", "layout");
    revalidatePath("/dashboard/projects");
    return { success: true };
  } catch (err: any) {
    return { error: err?.message || "Failed to delete project" };
  }
}
