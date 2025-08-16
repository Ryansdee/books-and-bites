import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("image") as File;

  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const savePath = path.join(process.cwd(), "public/images", file.name);
  fs.writeFileSync(savePath, buffer);

  return NextResponse.json({ filename: file.name }, { status: 200 });
}
