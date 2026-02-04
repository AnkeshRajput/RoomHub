import { NextResponse } from "next/server";
import connect from "../../../../lib/db";
import { Room } from "../../../../models";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { latitude, longitude, radiusMeters } = body;

    // Validate input
    if (latitude === undefined || longitude === undefined) {
      return NextResponse.json(
        { error: "latitude and longitude are required" },
        { status: 400 },
      );
    }

    const radius = radiusMeters || 5000; // Default 5km

    await connect();

    // Use MongoDB geospatial query: find rooms within radius of center point
    // $near requires: center as [lng, lat], maxDistance in meters
    const rooms = await Room.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          $maxDistance: radius,
        },
      },
    }).populate("owner", "name email");

    return NextResponse.json({ ok: true, rooms });
  } catch (err: Error | unknown) {
    console.error("Search error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Server error" },
      { status: 500 },
    );
  }
}
