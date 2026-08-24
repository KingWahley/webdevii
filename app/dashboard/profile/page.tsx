"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

export const dynamic = "force-dynamic";

interface ModalState {
  isOpen: boolean;
  type: "success" | "error";
  title: string;
  message: string;
}

const DEFAULT = {
  name: "Peter Olawale",
  title: "Software Engineer",
  bio: "I help businesses build websites that serve as powerful sales machines. Clean design, fast performance, and strategic structure.",
  full_intro: "I'm Peter, a developer and designer focused on creating clean, modern, and engaging digital experiences. I help businesses transform their ideas into responsive websites and applications through thoughtful design and powerful technology. When I'm not working, I stay curious through tech blogs, play football and unwind with video games.",
  experience_years: "+12",
  projects_count: "+46",
  clients_count: "+20",
  instagram_url: "https://www.instagram.com/webdevii",
  github_url: "https://github.com/KingWahley",
  linkedin_url: "https://www.linkedin.com/in/olawale-peter-5898a9249/",
  email: "kingwahley@gmail.com",
};

export default function ProfileManagerPage() {
  const [mounted, setMounted] = useState(false);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalState>({ isOpen: false, type: "success", title: "", message: "" });
  const [avatarUrl, setAvatarUrl] = useState("/profile_portrait.png");
  const [formData, setFormData] = useState(DEFAULT);

  // ─── Load profile on mount ──────────────────────────────────────────────────
  useEffect(() => {
    setMounted(true);
    async function loadProfile() {
      const supabase = createClient();
      const { data, error } = await supabase.from("profiles").select("*").limit(1).single();

      if (error) {
        if (error.code === "PGRST116") {
          // No rows — table exists but empty; show defaults, allow save
          setDbError(null);
        } else {
          // Real error — likely table missing or key wrong
          setDbError(`Supabase read error: ${error.message} (code: ${error.code}). Check that your SQL schema has been run and your anon key is correct.`);
        }
        return;
      }

      if (data) {
        setProfileId(data.id ?? null);
        setFormData({
          name: data.name || DEFAULT.name,
          title: data.title || DEFAULT.title,
          bio: data.bio || DEFAULT.bio,
          full_intro: data.full_intro || DEFAULT.full_intro,
          experience_years: data.experience_years || DEFAULT.experience_years,
          projects_count: data.projects_count || DEFAULT.projects_count,
          clients_count: data.clients_count || DEFAULT.clients_count,
          instagram_url: data.instagram_url || DEFAULT.instagram_url,
          github_url: data.github_url || DEFAULT.github_url,
          linkedin_url: data.linkedin_url || DEFAULT.linkedin_url,
          email: data.email || DEFAULT.email,
        });
        if (data.avatar_url) setAvatarUrl(data.avatar_url);
      }
    }
    loadProfile();
  }, []);

  // ─── Avatar upload ───────────────────────────────────────────────────────────
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show instant preview
    setAvatarUrl(URL.createObjectURL(file));
    setAvatarLoading(true);

    try {
      const supabase = createClient();

      // 1. Upload to storage
      const fileExt = file.name.split(".").pop() || "png";
      const filePath = `avatars/avatar-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("portfolio-assets")
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        setAvatarUrl(avatarUrl); // revert preview
        setModal({
          isOpen: true, type: "error", title: "Upload Failed",
          message: `Storage error: ${uploadError.message}. Make sure the 'portfolio-assets' bucket exists in Supabase Storage.`,
        });
        setAvatarLoading(false);
        return;
      }

      // 2. Get public URL
      const { data: { publicUrl } } = supabase.storage.from("portfolio-assets").getPublicUrl(filePath);
      setAvatarUrl(publicUrl);

      // 3. Upsert profile with new avatar
      const saveResult = await saveToSupabase(supabase, { avatar_url: publicUrl });
      if (saveResult.error) {
        setModal({ isOpen: true, type: "error", title: "Profile Update Failed", message: saveResult.error });
      } else {
        setModal({ isOpen: true, type: "success", title: "Portrait Uploaded!", message: "Your photo is now live on your portfolio." });
      }
    } catch (err: any) {
      setModal({ isOpen: true, type: "error", title: "Upload Error", message: err?.message || "Unexpected error during upload." });
    }

    setAvatarLoading(false);
  };

  // ─── Core upsert helper ──────────────────────────────────────────────────────
  const saveToSupabase = async (supabase: ReturnType<typeof createClient>, extra?: Record<string, string>) => {
    const payload: Record<string, unknown> = {
      ...formData,
      avatar_url: avatarUrl,
      ...extra,
      updated_at: new Date().toISOString(),
    };

    let error;
    if (profileId) {
      // Update existing
      const res = await supabase.from("profiles").update(payload).eq("id", profileId);
      error = res.error;
    } else {
      // Get auth user id
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { error: "You are not logged in. Please sign in again." };
      }
      payload.id = user.id;
      const res = await supabase.from("profiles").insert(payload);
      error = res.error;
      if (!error) setProfileId(user.id);
    }

    if (error) {
      return { error: `Database error (${error.code}): ${error.message}` };
    }
    return { success: true };
  };

  // ─── Save all profile fields ─────────────────────────────────────────────────
  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();
      const result = await saveToSupabase(supabase);

      if (result.error) {
        setModal({ isOpen: true, type: "error", title: "Save Failed", message: result.error });
      } else {
        setModal({ isOpen: true, type: "success", title: "Profile Saved", message: "All changes are now live on your portfolio." });
      }
    } catch (err: any) {
      setModal({ isOpen: true, type: "error", title: "Save Error", message: err?.message || "Unexpected error." });
    }

    setLoading(false);
  };

  return (
    <div className="space-y-10 max-w-4xl pb-12">
      <div>
        <h1 className="text-3xl font-extrabold text-white font-display">Profile &amp; Display Picture</h1>
        <p className="text-neutral-400 text-sm mt-1">Update your public display photo, bio, experience counters, and contact links.</p>
      </div>

      {/* DB Error Banner */}
      {dbError && (
        <div className="bg-red-950/60 border border-red-700 text-red-300 rounded-2xl p-4 text-xs leading-relaxed">
          <span className="font-bold block mb-1">⚠ Supabase Connection Issue</span>
          {dbError}
          <br />
          <span className="text-red-400 mt-1 block">
            Go to{" "}
            <a href="https://supabase.com/dashboard/project/aoowspbujkkyyestjwwc/editor" target="_blank" rel="noreferrer" className="underline">
              Supabase SQL Editor
            </a>{" "}
            and run the contents of <code>supabase/schema.sql</code>.
          </span>
        </div>
      )}

      {/* Avatar Uploader */}
      <div className="bg-[#161616] border border-[#262626] rounded-3xl p-6 sm:p-8 space-y-6">
        <h2 className="text-lg font-bold text-white font-display">Display Photo (Avatar)</h2>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative w-36 h-44 rounded-2xl overflow-hidden bg-neutral-900 border-2 border-[#262626] shrink-0 shadow-lg">
            <Image src={avatarUrl} alt="Avatar Preview" fill className="object-cover object-top" unoptimized={avatarUrl.startsWith("blob:")} />
            {avatarLoading && (
              <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-1.5">
                <div className="w-5 h-5 border-2 border-[#FF6B35] border-t-transparent rounded-full animate-spin" />
                <span className="text-[10px] uppercase font-bold text-[#FF6B35] tracking-wider">Uploading...</span>
              </div>
            )}
          </div>
          <div className="space-y-3 flex-1 text-center sm:text-left">
            <h4 className="text-sm font-bold text-white">Upload New Portrait</h4>
            <p className="text-xs text-neutral-500 leading-relaxed max-w-md">
              Choose a photo from your device. It uploads directly to Supabase Storage and updates your live portfolio.
            </p>
            <label className="inline-flex items-center gap-2 px-5 py-3 bg-neutral-900 border border-neutral-700 hover:border-[#FF6B35] text-white hover:text-[#FF6B35] rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer">
              <span>{avatarLoading ? "Uploading..." : "Select Image File"}</span>
              <input type="file" accept="image/*" onChange={handleAvatarChange} disabled={avatarLoading} className="hidden" />
            </label>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSave} className="bg-[#161616] border border-[#262626] rounded-3xl p-6 sm:p-8 space-y-6">
        <h2 className="text-lg font-bold text-white font-display">Personal &amp; Intro Details</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            { label: "Full Name", field: "name" as const, type: "text" },
            { label: "Professional Title", field: "title" as const, type: "text" },
          ].map(({ label, field, type }) => (
            <div key={field} className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400">{label}</label>
              <input
                type={type} required value={formData[field]}
                onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                className="w-full bg-[#0F0F0F] border border-[#262626] focus:border-[#FF6B35] text-white rounded-2xl p-4 text-sm outline-none transition"
              />
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400">Short Card Bio</label>
          <textarea rows={2} value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="w-full bg-[#0F0F0F] border border-[#262626] focus:border-[#FF6B35] text-white rounded-2xl p-4 text-sm outline-none transition resize-none"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400">Full Intro Paragraph</label>
          <textarea rows={4} value={formData.full_intro}
            onChange={(e) => setFormData({ ...formData, full_intro: e.target.value })}
            className="w-full bg-[#0F0F0F] border border-[#262626] focus:border-[#FF6B35] text-white rounded-2xl p-4 text-sm outline-none transition resize-none"
          />
        </div>

        {/* Metrics */}
        <div className="border-t border-[#262626] pt-6 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400">Metrics &amp; Experience Counters</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Years of Experience (e.g. +12)", field: "experience_years" as const },
              { label: "Projects Completed (e.g. +46)", field: "projects_count" as const },
              { label: "Happy Clients (e.g. +20)", field: "clients_count" as const },
            ].map(({ label, field }) => (
              <div key={field} className="space-y-2">
                <label className="block text-xs text-neutral-500 font-bold">{label}</label>
                <input type="text" value={formData[field]}
                  onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                  className="w-full bg-[#0F0F0F] border border-[#262626] focus:border-[#FF6B35] text-white rounded-2xl p-4 text-sm outline-none transition"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Social Links */}
        <div className="border-t border-[#262626] pt-6 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400">Contact &amp; Social Links</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Email Address", field: "email" as const, type: "email" },
              { label: "Instagram URL", field: "instagram_url" as const, type: "url" },
              { label: "GitHub URL", field: "github_url" as const, type: "url" },
              { label: "LinkedIn URL", field: "linkedin_url" as const, type: "url" },
            ].map(({ label, field, type }) => (
              <div key={field} className="space-y-2">
                <label className="block text-xs text-neutral-500 font-bold">{label}</label>
                <input type={type} value={formData[field]}
                  onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                  className="w-full bg-[#0F0F0F] border border-[#262626] focus:border-[#FF6B35] text-white rounded-2xl p-4 text-sm outline-none transition"
                />
              </div>
            ))}
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="w-full bg-[#FF6B35] text-neutral-950 font-black uppercase py-4 rounded-2xl text-xs tracking-wider hover:bg-[#e05a2b] transition disabled:opacity-50 cursor-pointer shadow-lg shadow-[#FF6B35]/20">
          {loading ? "Saving Changes..." : "Save Profile Settings"}
        </button>
      </form>

      {/* Feedback Modal */}
      {mounted &&
        modal.isOpen &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setModal({ ...modal, isOpen: false })}
          >
            <div
              className="bg-[#161616] border border-[#262626] rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 text-center shadow-2xl animate-fade-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center text-3xl border border-[#262626]">
                {modal.type === "success" ? <span className="text-emerald-400">✓</span> : <span className="text-red-400">✗</span>}
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-extrabold text-white font-display">{modal.title}</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">{modal.message}</p>
              </div>
              <button type="button" onClick={() => setModal({ ...modal, isOpen: false })}
                className={`w-full py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider transition cursor-pointer ${modal.type === "success" ? "bg-[#FF6B35] text-neutral-950 hover:bg-[#e05a2b]" : "bg-neutral-800 text-white hover:bg-neutral-700"}`}>
                Continue
              </button>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
