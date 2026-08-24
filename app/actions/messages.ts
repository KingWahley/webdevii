"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { ContactMessage } from "@/lib/types/database.types";

export async function getMessages(): Promise<ContactMessage[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.log("[getMessages] Supabase error:", error.message);
      return [];
    }

    return (data as ContactMessage[]) || [];
  } catch (err) {
    console.log("[getMessages] Exception:", err);
    return [];
  }
}

export async function submitContactMessage(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const subject = formData.get("subject") as string;
    const message = formData.get("message") as string;

    if (!name || !email || !message) {
      return { error: "Name, email, and message are required" };
    }

    const supabase = createClient();
    const { error } = await supabase.from("messages").insert({
      name,
      email,
      subject: subject || "General Inquiry",
      message,
      is_read: false,
    });

    if (error) {
      return { error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { error: err?.message || "Failed to submit message" };
  }
}

export async function markMessageRead(id: string, isRead = true) {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from("messages")
      .update({ is_read: isRead })
      .eq("id", id);

    if (error) return { error: error.message };

    revalidatePath("/dashboard/messages");
    return { success: true };
  } catch (err: any) {
    return { error: err?.message || "Failed to mark message" };
  }
}

export async function deleteMessage(id: string) {
  try {
    const supabase = createClient();
    const { error } = await supabase.from("messages").delete().eq("id", id);

    if (error) return { error: error.message };

    revalidatePath("/dashboard/messages");
    return { success: true };
  } catch (err: any) {
    return { error: err?.message || "Failed to delete message" };
  }
}
