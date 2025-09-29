import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file" }, { status: 400 });
    }

    // Vérifier la taille (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Dossier de destination
    const uploadDir = path.join(process.cwd(), "public/images");

    // Crée le dossier s’il n’existe pas
    await fs.mkdir(uploadDir, { recursive: true });

    // Nom unique
    const filename = `${Date.now()}-${file.name}`;
    const savePath = path.join(uploadDir, filename);

    await fs.writeFile(savePath, buffer);

    return NextResponse.json({ filename }, { status: 200 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
