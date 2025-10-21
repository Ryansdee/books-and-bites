export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { adminStorage } from "../../../../lib/firebaseAdmin";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filename = `${Date.now()}-${file.name}`;
    const fileUpload = adminStorage.file(filename);

    await fileUpload.save(buffer, {
      metadata: { contentType: file.type },
    });

    // Générer une URL signée (longue expiration)
    const [url] = await fileUpload.getSignedUrl({
      action: "read",
      expires: "03-09-2491",
    });

    return NextResponse.json({ url }, { status: 200 });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
