import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "../../../../lib/auth";
import connect from "../../../../lib/db";
import { Room } from "../../../../models";

export async function DELETE(req: Request, context: any) {
  let params = context?.params ?? {};
  if (params && typeof (params as any).then === "function") {
    params = await params;
  }
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const roomId = params.id;
    if (!roomId) {
      return NextResponse.json({ error: "Missing room id" }, { status: 400 });
    }

    await connect();

    const room = await Room.findById(roomId);
    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    // Only the owner (landlord) can delete their room
    if (String(room.owner) !== String(session.user.id)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await Room.findByIdAndDelete(roomId);

    return NextResponse.json({ ok: true, id: roomId });
  } catch (err: Error | unknown) {
    console.error("Delete room error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Server error" },
      { status: 500 },
    );
  }
}
