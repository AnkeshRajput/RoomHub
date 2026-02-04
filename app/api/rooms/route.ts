import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "../../../lib/auth";
import connect from "../../../lib/db";
import { Room } from "../../../models";

export async function POST(req: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only landlords can create rooms
    if (session.user?.role !== "landlord") {
      return NextResponse.json(
        { error: "Only landlords can create rooms" },
        { status: 403 },
      );
    }

    const body = await req.json();
    const {
      title,
      rent,
      address,
      description,
      images,
      location,
      contactNumber,
    } = body;

    // Validation
    if (!title || !rent || !address) {
      return NextResponse.json(
        { error: "Title, rent, and address are required" },
        { status: 400 },
      );
    }

    await connect();

    // Prepare room doc
    const roomData: any = {
      title,
      rent: Number(rent),
      address,
      description,
      images: images || [],
      contactNumber: contactNumber || undefined,
      owner: session.user?.id, // User ID from the JWT token
    };

    if (
      location &&
      location.type === "Point" &&
      Array.isArray(location.coordinates)
    ) {
      // ensure coordinates are numbers
      const coords = location.coordinates.map((c: any) => Number(c));
      if (
        coords.length === 2 &&
        coords.every((n: number) => !Number.isNaN(n))
      ) {
        roomData.location = { type: "Point", coordinates: coords };
      }
    }

    // Create room
    const room = await Room.create(roomData);

    return NextResponse.json({
      ok: true,
      room: {
        id: room._id,
        title: room.title,
        rent: room.rent,
        address: room.address,
      },
    });
  } catch (err: Error | unknown) {
    console.error("Room creation error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Server error" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    await connect();
    const rooms = await Room.find().populate("owner", "name email");
    return NextResponse.json({ ok: true, rooms });
  } catch (err: Error | unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Server error" },
      { status: 500 },
    );
  }
}
