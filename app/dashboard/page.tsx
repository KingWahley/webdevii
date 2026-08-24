import Link from "next/link";
import { getProjects } from "@/app/actions/projects";
import { getBlogs } from "@/app/actions/blogs";
import { getMessages } from "@/app/actions/messages";
import { getProfile } from "@/app/actions/profile";

export const dynamic = "force-dynamic";

export default async function DashboardOverview() {
  const [projects, blogs, messages, profile] = await Promise.all([
    getProjects(),
    getBlogs(true),
    getMessages(),
    getProfile(),
  ]);

  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <div className="space-y-10">
      {/* Welcome Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold text-white font-display tracking-tight">
          Welcome back, {profile?.name || "Peter"} 👋
        </h1>
        <p className="text-neutral-400 text-sm">
          Here is a quick overview of your portfolio content, blog posts, and client messages.
        </p>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-[#161616] border border-[#262626] rounded-3xl p-6 space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs uppercase font-bold tracking-wider">
              Projects
            </span>
            <span className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[#FF6B35]">
              📁
            </span>
          </div>
          <div className="text-4xl font-black text-white font-display">
            {projects.length}
          </div>
          <p className="text-xs text-neutral-500">Live projects showcase</p>
        </div>

        <div className="bg-[#161616] border border-[#262626] rounded-3xl p-6 space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs uppercase font-bold tracking-wider">
              Blog Articles
            </span>
            <span className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[#FF6B35]">
              ✍️
            </span>
          </div>
          <div className="text-4xl font-black text-white font-display">
            {blogs.length}
          </div>
          <p className="text-xs text-neutral-500">Published & draft posts</p>
        </div>

        <div className="bg-[#161616] border border-[#262626] rounded-3xl p-6 space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs uppercase font-bold tracking-wider">
              Inbox Messages
            </span>
            <span className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[#FF6B35]">
              📬
            </span>
          </div>
          <div className="text-4xl font-black text-white font-display">
            {unreadCount}
          </div>
          <p className="text-xs text-neutral-500">{messages.length} total messages received</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-[#161616] border border-[#262626] rounded-3xl p-6 sm:p-8 space-y-6">
        <h2 className="text-xl font-extrabold text-white font-display">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/dashboard/profile"
            className="group p-5 bg-[#0F0F0F] border border-[#262626] rounded-2xl hover:border-[#FF6B35] transition duration-300 space-y-2 block"
          >
            <div className="text-2xl">📸</div>
            <h4 className="text-sm font-bold text-white group-hover:text-[#FF6B35] transition-colors">
              Update Display Photo
            </h4>
            <p className="text-xs text-neutral-500">
              Upload a new profile avatar or edit your bio.
            </p>
          </Link>

          <Link
            href="/dashboard/projects"
            className="group p-5 bg-[#0F0F0F] border border-[#262626] rounded-2xl hover:border-[#FF6B35] transition duration-300 space-y-2 block"
          >
            <div className="text-2xl">🚀</div>
            <h4 className="text-sm font-bold text-white group-hover:text-[#FF6B35] transition-colors">
              Add New Project
            </h4>
            <p className="text-xs text-neutral-500">
              Showcase a newly completed client project.
            </p>
          </Link>

          <Link
            href="/dashboard/blogs/new"
            className="group p-5 bg-[#0F0F0F] border border-[#262626] rounded-2xl hover:border-[#FF6B35] transition duration-300 space-y-2 block"
          >
            <div className="text-2xl">📝</div>
            <h4 className="text-sm font-bold text-white group-hover:text-[#FF6B35] transition-colors">
              Write New Blog
            </h4>
            <p className="text-xs text-neutral-500">
              Draft and publish a new design/tech article.
            </p>
          </Link>

          <Link
            href="/dashboard/messages"
            className="group p-5 bg-[#0F0F0F] border border-[#262626] rounded-2xl hover:border-[#FF6B35] transition duration-300 space-y-2 block"
          >
            <div className="text-2xl">💬</div>
            <h4 className="text-sm font-bold text-white group-hover:text-[#FF6B35] transition-colors">
              View Inbox ({unreadCount})
            </h4>
            <p className="text-xs text-neutral-500">
              Read customer inquiries and proposals.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
