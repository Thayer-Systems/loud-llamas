import { NextResponse } from "next/server";
import { getFounderCount } from "@/lib/founder-count";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const result = await getFounderCount();
  return NextResponse.json(result, {
    headers: {
      // Cache at the edge for 60s to keep DB load down without showing stale numbers for long.
      "Cache-Control": "s-maxage=60, stale-while-revalidate=120",
    },
  });
}
