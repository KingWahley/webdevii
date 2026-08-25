import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    console.warn("[KEEP_ALIVE] Unauthorized keep-alive request attempt");
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const supabase = createClient();

    // Perform a lightweight read-only query to keep Supabase active
    const { error } = await supabase
      .from("projects")
      .select("id")
      .limit(1);

    if (error) {
      console.error("[KEEP_ALIVE] Supabase request failed:", error.message);
      return NextResponse.json(
        { success: false, error: "Database keep-alive query failed" },
        { status: 500 }
      );
    }

    console.log("[KEEP_ALIVE] Supabase request successful");
    return NextResponse.json(
      {
        success: true,
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("[KEEP_ALIVE] Unexpected keep-alive failure:", errorMessage);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
