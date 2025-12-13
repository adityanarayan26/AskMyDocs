import { NextResponse } from "next/server";
import { embeddings } from "@/lib/embeddings";

export const runtime = "nodejs";

export async function GET() {
  const vector = await embeddings.embedQuery("hello world");

  return NextResponse.json({
    success: true,
    vectorLength: vector.length,
    sample: vector.slice(0, 5),
  });
}