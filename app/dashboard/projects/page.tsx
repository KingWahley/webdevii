"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type { ProjectItem } from "@/lib/types/database.types";

export const dynamic = "force-dynamic";

export default function ProjectsManagerPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    domain: "",
    url: "",
    image_url: "/beach_atv_thumbnail.png",
    initially_hidden: false,
    sort_order: 0,
  });
  const [submitting, setSubmitting] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // ─── Load from Supabase ──────────────────────────────────────────────────────
  const loadData = async () => {
    setLoading(true);
    setDbError(null);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      setDbError(`Supabase error (${error.code}): ${error.message}`);
      setLoading(false);
      return;
    }

    const sortedData = ((data as ProjectItem[]) ?? []).sort(
      (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
    );
    setProjects(sortedData);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // ─── Persist New Sort Order to Supabase ──────────────────────────────────────
  const persistOrder = async (updatedProjects: ProjectItem[]) => {
    setReordering(true);
    try {
      const supabase = createClient();

      // Assign sequential sort_order (1, 2, 3, ...)
      const reindexed = updatedProjects.map((p, idx) => ({
        ...p,
        sort_order: idx + 1,
      }));
      setProjects(reindexed);

      // Batch update sort_order in Supabase
      const updatePromises = reindexed.map((p) =>
        supabase
          .from("projects")
          .update({ sort_order: p.sort_order, updated_at: new Date().toISOString() })
          .eq("id", p.id)
      );

      const results = await Promise.all(updatePromises);
      const hasError = results.some((r) => r.error);

      if (hasError) {
        setMessage({
          type: "error",
          text: "Some project order updates could not be saved to Supabase.",
        });
      } else {
        setMessage({
          type: "success",
          text: "Project arrangement updated and live on your website! ✓",
        });
      }
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err?.message || "Failed to save project order.",
      });
    }
    setReordering(false);
  };

  // ─── Move Item Up ────────────────────────────────────────────────────────────
  const moveUp = (index: number) => {
    if (index <= 0 || reordering) return;
    const newItems = [...projects];
    const temp = newItems[index];
    newItems[index] = newItems[index - 1];
    newItems[index - 1] = temp;
    persistOrder(newItems);
  };

  // ─── Move Item Down ──────────────────────────────────────────────────────────
  const moveDown = (index: number) => {
    if (index >= projects.length - 1 || reordering) return;
    const newItems = [...projects];
    const temp = newItems[index];
    newItems[index] = newItems[index + 1];
    newItems[index + 1] = temp;
    persistOrder(newItems);
  };

  // ─── Drag and Drop Handlers ─────────────────────────────────────────────────
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (dropIndex: number) => {
    if (draggedIndex === null || draggedIndex === dropIndex || reordering) return;
    const newItems = [...projects];
    const [draggedItem] = newItems.splice(draggedIndex, 1);
    newItems.splice(dropIndex, 0, draggedItem);
    setDraggedIndex(null);
    persistOrder(newItems);
  };

  // ─── Modal Openers ──────────────────────────────────────────────────────────
  const handleOpenAdd = () => {
    setEditingProject(null);
    setFormData({
      title: "",
      domain: "",
      url: "",
      image_url: "/beach_atv_thumbnail.png",
      initially_hidden: false,
      sort_order: (projects.length || 0) + 1,
    });
    setThumbnailFile(null);
    setThumbnailPreview(null);
    setMessage(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: ProjectItem) => {
    setEditingProject(p);
    setFormData({
      title: p.title,
      domain: p.domain,
      url: p.url,
      image_url: p.image_url,
      initially_hidden: p.initially_hidden,
      sort_order: p.sort_order ?? 0,
    });
    setThumbnailFile(null);
    setThumbnailPreview(null);
    setMessage(null);
    setIsModalOpen(true);
  };

  const handleThumbnailSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setThumbnailFile(file);
    if (file) setThumbnailPreview(URL.createObjectURL(file));
    else setThumbnailPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const supabase = createClient();
      let imageUrl = formData.image_url;

      // Upload thumbnail if selected
      if (thumbnailFile && thumbnailFile.size > 0) {
        const ext = thumbnailFile.name.split(".").pop() || "png";
        const filePath = `projects/project-${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("portfolio-assets")
          .upload(filePath, thumbnailFile, { upsert: true });

        if (uploadError) {
          setMessage({
            type: "error",
            text: `Thumbnail upload failed: ${uploadError.message}`,
          });
          setSubmitting(false);
          return;
        }
        const {
          data: { publicUrl },
        } = supabase.storage.from("portfolio-assets").getPublicUrl(filePath);
        imageUrl = publicUrl;
      }

      const payload = {
        title: formData.title,
        domain: formData.domain,
        url: formData.url,
        image_url: imageUrl,
        initially_hidden: formData.initially_hidden,
        sort_order: Number(formData.sort_order) || projects.length + 1,
        updated_at: new Date().toISOString(),
      };

      let dbError;
      if (editingProject) {
        const res = await supabase
          .from("projects")
          .update(payload)
          .eq("id", editingProject.id);
        dbError = res.error;
      } else {
        const res = await supabase.from("projects").insert(payload);
        dbError = res.error;
      }

      if (dbError) {
        setMessage({
          type: "error",
          text: `Database error (${dbError.code}): ${dbError.message}`,
        });
      } else {
        setIsModalOpen(false);
        await loadData();
        setMessage({
          type: "success",
          text: editingProject
            ? "Project updated successfully!"
            : "Project added successfully!",
        });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err?.message || "Unexpected error" });
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project permanently?")) return;
    const supabase = createClient();
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) {
      alert(`Delete failed (${error.code}): ${error.message}`);
    } else {
      await loadData();
    }
  };

  return (
    <div className="space-y-8 max-w-5xl pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white font-display">
            Projects Manager
          </h1>
          <p className="text-neutral-400 text-sm mt-1">
            Arrange the order of projects using the arrow buttons or drag & drop. Changes instantly reflect on your live website.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          type="button"
          className="px-6 py-3.5 bg-[#FF6B35] text-neutral-950 font-black uppercase rounded-2xl text-xs tracking-wider hover:bg-[#e05a2b] transition shadow-lg shadow-[#FF6B35]/20 cursor-pointer self-start sm:self-auto shrink-0"
        >
          + Add New Project
        </button>
      </div>

      {/* DB Error Banner */}
      {dbError && (
        <div className="bg-red-950/60 border border-red-700 text-red-300 rounded-2xl p-4 text-xs leading-relaxed">
          <span className="font-bold block mb-1">⚠ Supabase Connection Issue</span>
          {dbError}
          <span className="text-red-400 mt-1 block">
            Make sure you have run <code>supabase/fix-permissions.sql</code> in your Supabase SQL editor.
          </span>
        </div>
      )}

      {/* Notification Toast */}
      {message && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex items-center justify-between gap-3 animate-fade-in ${
            message.type === "success"
              ? "bg-emerald-950/60 border border-emerald-800 text-emerald-300"
              : "bg-red-950/60 border border-red-800 text-red-300"
          }`}
        >
          <span>{message.text}</span>
          <button
            onClick={() => setMessage(null)}
            className="text-neutral-400 hover:text-white text-sm"
          >
            ✕
          </button>
        </div>
      )}

      {/* Reordering Indicator */}
      {reordering && (
        <div className="flex items-center gap-2 text-xs font-bold text-[#FF6B35] bg-[#161616] border border-[#262626] p-3 rounded-2xl animate-pulse">
          <div className="w-4 h-4 border-2 border-[#FF6B35] border-t-transparent rounded-full animate-spin"></div>
          <span>Saving project arrangement to live site...</span>
        </div>
      )}

      {/* Projects List with Reordering */}
      <div className="bg-[#161616] border border-[#262626] rounded-3xl p-4 sm:p-8 space-y-4">
        <div className="flex items-center justify-between border-b border-[#262626] pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-extrabold tracking-wider text-neutral-400">
              Live Display Order ({projects.length} Total)
            </span>
          </div>
          <span className="text-xs text-neutral-500 hidden sm:inline">
            💡 Top 5 shown directly; 6+ revealed by &ldquo;View More Projects&rdquo;
          </span>
        </div>

        {loading ? (
          <p className="text-neutral-500 text-sm py-6">Loading projects...</p>
        ) : projects.length === 0 ? (
          <p className="text-neutral-500 text-sm py-6">
            {dbError
              ? "Could not load projects."
              : "No projects yet. Add your first project above!"}
          </p>
        ) : (
          <div className="space-y-3">
            {projects.map((project, index) => (
              <div key={project.id} className="space-y-3">
                {/* Visual fold indicator after item #5 */}
                {index === 5 && (
                  <div className="flex items-center gap-3 py-2">
                    <div className="flex-1 border-t border-dashed border-[#FF6B35]/40"></div>
                    <span className="text-[11px] font-bold text-[#FF6B35] uppercase tracking-wider bg-neutral-900 border border-[#FF6B35]/30 px-3 py-1 rounded-full">
                      Projects below revealed by &ldquo;View More Projects&rdquo; button
                    </span>
                    <div className="flex-1 border-t border-dashed border-[#FF6B35]/40"></div>
                  </div>
                )}

                <div
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(index)}
                  className={`p-4 bg-[#0F0F0F] border rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-200 ${
                    draggedIndex === index
                      ? "opacity-40 border-[#FF6B35] scale-[0.99]"
                      : "border-[#262626] hover:border-neutral-700"
                  }`}
                >
                  {/* Left: Drag handle, Order Number, Thumbnail, Info */}
                  <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                    {/* Drag Handle & Order Number */}
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className="cursor-grab active:cursor-grabbing text-neutral-500 hover:text-white text-base select-none px-1"
                        title="Drag to rearrange"
                      >
                        ⠿
                      </span>
                      <div className="w-8 h-8 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-xs font-black text-[#FF6B35]">
                        #{index + 1}
                      </div>
                    </div>

                    {/* Thumbnail Image */}
                    <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 shrink-0">
                      <Image
                        src={project.image_url}
                        alt={project.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>

                    {/* Project Info */}
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-extrabold text-white text-sm sm:text-base font-display truncate">
                          {project.title}
                        </h3>
                        {index >= 5 && (
                          <span className="px-2 py-0.5 rounded-full bg-neutral-800 text-[10px] text-neutral-400 font-bold uppercase shrink-0">
                            Revealed on Click
                          </span>
                        )}
                      </div>
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-neutral-500 hover:text-[#FF6B35] transition-colors truncate block"
                      >
                        {project.domain} ↗
                      </a>
                    </div>
                  </div>

                  {/* Right: Reorder Controls (Up/Down) + Edit / Delete */}
                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 pt-2 sm:pt-0 border-t border-neutral-900 sm:border-0 w-full sm:w-auto justify-between sm:justify-end">
                    {/* Up / Down Arrows */}
                    <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 rounded-xl p-1">
                      <button
                        type="button"
                        onClick={() => moveUp(index)}
                        disabled={index === 0 || reordering}
                        title="Move Up"
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-xs text-neutral-300 hover:bg-neutral-800 hover:text-[#FF6B35] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-neutral-300 transition cursor-pointer"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        onClick={() => moveDown(index)}
                        disabled={index === projects.length - 1 || reordering}
                        title="Move Down"
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-xs text-neutral-300 hover:bg-neutral-800 hover:text-[#FF6B35] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-neutral-300 transition cursor-pointer"
                      >
                        ▼
                      </button>
                    </div>

                    {/* Edit / Delete Buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEdit(project)}
                        className="px-3.5 py-1.5 bg-neutral-900 border border-neutral-700 hover:border-[#FF6B35] hover:text-[#FF6B35] text-xs font-bold rounded-xl text-neutral-300 transition cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="px-3.5 py-1.5 bg-red-950/40 border border-red-900/60 hover:bg-red-900/60 text-xs font-bold rounded-xl text-red-300 transition cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#161616] border border-[#262626] rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-white font-display">
                {editingProject ? "Edit Project" : "Add New Project"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-500 hover:text-white text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {message && (
              <div
                className={`p-3 rounded-xl text-xs font-medium ${
                  message.type === "error"
                    ? "bg-red-950/60 border border-red-800 text-red-300"
                    : "bg-emerald-950/60 border border-emerald-800 text-emerald-300"
                }`}
              >
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                {
                  label: "Project Title",
                  field: "title" as const,
                  type: "text",
                  placeholder: "e.g. Nautica beach ATV",
                },
                {
                  label: "Display Domain Name",
                  field: "domain" as const,
                  type: "text",
                  placeholder: "e.g. leisuresportsatv.com",
                },
                {
                  label: "Live Project URL",
                  field: "url" as const,
                  type: "url",
                  placeholder: "https://example.com",
                },
              ].map(({ label, field, type, placeholder }) => (
                <div key={field} className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase text-neutral-400">
                    {label}
                  </label>
                  <input
                    type={type}
                    required
                    placeholder={placeholder}
                    value={formData[field] as string}
                    onChange={(e) =>
                      setFormData({ ...formData, [field]: e.target.value })
                    }
                    className="w-full bg-[#0F0F0F] border border-[#262626] focus:border-[#FF6B35] text-white rounded-2xl p-3.5 text-sm outline-none"
                  />
                </div>
              ))}

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase text-neutral-400">
                  Sort Order Number (1 = Top of list)
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.sort_order}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sort_order: parseInt(e.target.value, 10) || 1,
                    })
                  }
                  className="w-full bg-[#0F0F0F] border border-[#262626] focus:border-[#FF6B35] text-white rounded-2xl p-3.5 text-sm outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase text-neutral-400">
                  Thumbnail Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailSelect}
                  className="w-full bg-[#0F0F0F] border border-[#262626] text-xs text-neutral-400 rounded-2xl p-3 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-neutral-800 file:text-white hover:file:bg-[#FF6B35] hover:file:text-neutral-950 file:transition"
                />
                {thumbnailPreview && (
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-neutral-700">
                    <Image
                      src={thumbnailPreview}
                      alt="Preview"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}
                <input
                  type="text"
                  placeholder="/beach_atv_thumbnail.png or leave for uploaded file"
                  value={formData.image_url}
                  onChange={(e) =>
                    setFormData({ ...formData, image_url: e.target.value })
                  }
                  className="w-full bg-[#0F0F0F] border border-[#262626] focus:border-[#FF6B35] text-white rounded-2xl p-3 text-xs outline-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-3 rounded-xl border border-neutral-800 text-neutral-400 text-xs font-bold uppercase hover:text-white transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3 rounded-xl bg-[#FF6B35] text-neutral-950 text-xs font-black uppercase hover:bg-[#e05a2b] transition disabled:opacity-50 cursor-pointer"
                >
                  {submitting
                    ? "Saving..."
                    : editingProject
                    ? "Update Project"
                    : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
