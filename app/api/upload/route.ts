import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "../../../lib/auth";
import cloudinary from "../../../lib/cloudinary";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const form = await req.formData();
    const file = form.get("file") as Blob | null;
    if (!file)
      return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString("base64");
    // Attempt to infer mime type from file type
    const mime = (file as { type?: string }).type || "application/octet-stream";
    const dataUri = `data:${mime};base64,${base64}`;

    const uploadRes = await cloudinary.uploader.upload(dataUri, {
      folder: "room_rental_app/rooms",
      resource_type: "image",
    });

    return NextResponse.json({
      ok: true,
      url: uploadRes.secure_url,
      public_id: uploadRes.public_id,
    });
  } catch (err: Error | unknown) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload failed" },
      { status: 500 },
    );
  }
}
