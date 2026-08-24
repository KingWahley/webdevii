"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Profile } from "@/lib/types/database.types";

const defaultProfile: Profile = {
  id: "default",
  name: "Peter Olawale",
  title: "Software Engineer",
  bio: "I help businesses build websites that serve as powerful sales machines. Clean design, fast performance, and strategic structure.",
  full_intro:
    "I'm Peter, a developer and designer focused on creating clean, modern, and engaging digital experiences. I help businesses transform their ideas into responsive websites and applications through thoughtful design and powerful technology. When I'm not working, I stay curious through tech blogs, play football and unwind with video games.",
  avatar_url: "/profile_portrait.png",
  experience_years: "+12",
  projects_count: "+46",
  clients_count: "+20",
  instagram_url: "https://www.instagram.com/webdevii",
  github_url: "https://github.com/KingWahley",
  linkedin_url: "https://www.linkedin.com/in/olawale-peter-5898a9249/",
  email: "kingwahley@gmail.com",
};

export async function getProfile(): Promise<Profile> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .limit(1)
      .single();

    if (error) {
      console.log("[getProfile] Supabase error:", error.message);
      return defaultProfile;
    }

    return (data as Profile) || defaultProfile;
  } catch (err) {
    console.log("[getProfile] Exception:", err);
    return defaultProfile;
  }
}

export async function updateProfile(formData: FormData) {
  try {
    const supabase = createClient();
    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .limit(1)
      .single();

    const profileData: Record<string, unknown> = {
      name: formData.get("name"),
      title: formData.get("title"),
      bio: formData.get("bio"),
      full_intro: formData.get("full_intro"),
      experience_years: formData.get("experience_years"),
      projects_count: formData.get("projects_count"),
      clients_count: formData.get("clients_count"),
      instagram_url: formData.get("instagram_url"),
      github_url: formData.get("github_url"),
      linkedin_url: formData.get("linkedin_url"),
      email: formData.get("email"),
      updated_at: new Date().toISOString(),
    };

    const avatarUrl = formData.get("avatar_url") as string;
    if (avatarUrl && !avatarUrl.startsWith("/")) {
      profileData.avatar_url = avatarUrl;
    }

    let error;
    if (existing?.id) {
      ({ error } = await supabase
        .from("profiles")
        .update(profileData)
        .eq("id", existing.id));
    } else {
      // Get auth user id if available, otherwise use a placeholder
      const { data: { user } } = await supabase.auth.getUser();
      const insertId = user?.id || crypto.randomUUID();
      ({ error } = await supabase
        .from("profiles")
        .insert({ id: insertId, ...profileData }));
    }

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/", "layout");
    revalidatePath("/dashboard/profile");
    return { success: true };
  } catch (err: any) {
    return { error: err?.message || "Failed to update profile" };
  }
}

export async function uploadAvatar(formData: FormData) {
  try {
    const supabase = createClient();
    const file = formData.get("avatar") as File;
    if (!file || file.size === 0) {
      return { error: "Please select an image file" };
    }

    const fileExt = file.name.split(".").pop() || "png";
    const fileName = `avatar-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("portfolio-assets")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      return { error: uploadError.message };
    }

    const { data: { publicUrl } } = supabase.storage
      .from("portfolio-assets")
      .getPublicUrl(filePath);

    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .limit(1)
      .single();

    if (existing?.id) {
      await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl, updated_at: new Date().toISOString() })
        .eq("id", existing.id);
    }

    revalidatePath("/", "layout");
    return { success: true, avatarUrl: publicUrl };
  } catch (err: any) {
    return { error: err?.message || "Failed to upload avatar" };
  }
}
