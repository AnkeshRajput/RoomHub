import { signOut } from "next-auth/react";
import { NextResponse } from "next/server";

export async function POST() {
  // This is a simple logout endpoint
  // Client-side will use signOut() from next-auth/react
  return NextResponse.json({ ok: true });
}
