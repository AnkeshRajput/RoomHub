import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Placeholder for location endpoint
    // TODO: Implement location capture from client
    return NextResponse.json({ ok: true });
  } catch (err: Error | unknown) {
    console.error("Location error:", err);
    return NextResponse.json({ error: "Location error" }, { status: 500 });
  }
}
