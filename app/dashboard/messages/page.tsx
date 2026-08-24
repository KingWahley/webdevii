"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { ContactMessage } from "@/lib/types/database.types";

export const dynamic = "force-dynamic";

export default function MessagesManagerPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const loadData = async () => {
    setLoading(true);
    setDbError(null);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setDbError(`Supabase error (${error.code}): ${error.message}`);
    } else {
      setMessages((data as ContactMessage[]) ?? []);
    }
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const handleToggleRead = async (msg: ContactMessage) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("messages")
      .update({ is_read: !msg.is_read })
      .eq("id", msg.id);
    if (!error) {
      await loadData();
      if (selectedMessage?.id === msg.id) setSelectedMessage({ ...msg, is_read: !msg.is_read });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this message permanently?")) return;
    const supabase = createClient();
    const { error } = await supabase.from("messages").delete().eq("id", id);
    if (error) {
      alert(`Delete failed: ${error.message}`);
    } else {
      if (selectedMessage?.id === id) setSelectedMessage(null);
      await loadData();
    }
  };

  const filteredMessages =
    filter === "unread" ? messages.filter((m) => !m.is_read) : messages;

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white font-display">
            Inbox Messages ({messages.length})
          </h1>
          <p className="text-neutral-400 text-sm mt-1">
            Client inquiries, project proposals, and messages submitted from the contact form.
          </p>
        </div>

        {dbError && (
          <div className="bg-red-950/60 border border-red-700 text-red-300 rounded-2xl p-4 text-xs leading-relaxed">
            <span className="font-bold block mb-1">⚠ Supabase Connection Issue</span>
            {dbError}
          </div>
        )}

        <div className="flex items-center gap-2 bg-[#161616] border border-[#262626] p-1.5 rounded-2xl">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              filter === "all"
                ? "bg-neutral-800 text-white"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            All Messages ({messages.length})
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              filter === "unread"
                ? "bg-[#FF6B35] text-neutral-950 font-black"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Unread ({messages.filter((m) => !m.is_read).length})
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="md:col-span-1 bg-[#161616] border border-[#262626] rounded-3xl p-4 space-y-2 h-[600px] overflow-y-auto">
          {loading ? (
            <p className="p-4 text-xs text-neutral-500">Loading inbox...</p>
          ) : filteredMessages.length === 0 ? (
            <p className="p-4 text-xs text-neutral-500 text-center">No messages in this folder.</p>
          ) : (
            filteredMessages.map((msg) => (
              <button
                key={msg.id}
                onClick={() => {
                  setSelectedMessage(msg);
                  if (!msg.is_read) {
                    handleToggleRead(msg);
                  }
                }}
                className={`w-full text-left p-4 rounded-2xl transition duration-200 space-y-1 block cursor-pointer border ${
                  selectedMessage?.id === msg.id
                    ? "bg-[#0F0F0F] border-[#FF6B35]"
                    : msg.is_read
                    ? "bg-[#161616] border-transparent hover:bg-neutral-900"
                    : "bg-neutral-900 border-neutral-700 hover:border-[#FF6B35]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white truncate max-w-[140px]">
                    {msg.name}
                  </span>
                  {!msg.is_read && (
                    <span className="w-2 h-2 rounded-full bg-[#FF6B35]"></span>
                  )}
                </div>
                <div className="text-xs text-neutral-400 font-medium truncate">
                  {msg.subject}
                </div>
                <div className="text-[10px] text-neutral-500">
                  {new Date(msg.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </button>
            ))
          )}
        </div>

        {/* Message Detail View */}
        <div className="md:col-span-2 bg-[#161616] border border-[#262626] rounded-3xl p-6 sm:p-8 flex flex-col justify-between h-[600px]">
          {selectedMessage ? (
            <div className="space-y-6 overflow-y-auto pr-2">
              <div className="flex items-start justify-between border-b border-[#262626] pb-5">
                <div className="space-y-1">
                  <h2 className="text-xl font-extrabold text-white font-display">
                    {selectedMessage.subject}
                  </h2>
                  <div className="flex items-center gap-3 text-xs text-neutral-400">
                    <span className="font-bold text-white">{selectedMessage.name}</span>
                    <span>•</span>
                    <a
                      href={`mailto:${selectedMessage.email}`}
                      className="text-[#FF6B35] hover:underline"
                    >
                      {selectedMessage.email}
                    </a>
                  </div>
                  <div className="text-[10px] text-neutral-500">
                    Received {new Date(selectedMessage.created_at).toLocaleString()}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleRead(selectedMessage)}
                    className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-400 hover:text-white transition cursor-pointer"
                    title={selectedMessage.is_read ? "Mark as unread" : "Mark as read"}
                  >
                    {selectedMessage.is_read ? "✉️ Mark Unread" : "✓ Mark Read"}
                  </button>
                  <button
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="p-2 rounded-xl bg-red-950/40 border border-red-900/60 text-xs text-red-400 hover:text-red-300 transition cursor-pointer"
                    title="Delete message"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              {/* Message Content */}
              <div className="text-sm text-neutral-300 leading-relaxed whitespace-pre-wrap bg-[#0F0F0F] p-6 rounded-2xl border border-[#262626]">
                {selectedMessage.message}
              </div>

              {/* Quick Reply Button */}
              <div className="pt-2">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(
                    selectedMessage.subject
                  )}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF6B35] text-neutral-950 font-black uppercase rounded-xl text-xs tracking-wider hover:bg-[#e05a2b] transition duration-300 shadow-lg shadow-[#FF6B35]/20"
                >
                  <span>✉️ Reply to {selectedMessage.name}</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-2 text-neutral-500">
              <div className="text-4xl">📨</div>
              <p className="text-sm font-medium">Select a message from the left to read details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
