import { NextRequest, NextResponse } from "next/server";
import { mkdir, readFile } from "fs/promises";
import path from "path";
import sharp from "sharp";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageUrl, zoom, rotation, flipH } = body;

    if (!imageUrl) {
      return NextResponse.json(
        { error: "No image URL provided" },
        { status: 400 }
      );
    }

    const imagePath = path.join(process.cwd(), "public", imageUrl);
    const imageBuffer = await readFile(imagePath);

    const metadata = await sharp(imageBuffer).metadata();
    const originalWidth = metadata.width || 400;
    const originalHeight = metadata.height || 400;

    let image = sharp(imageBuffer);

    if (zoom && zoom !== 100) {
      const scale = zoom / 100;
      const newWidth = Math.round(originalWidth * scale);
      const newHeight = Math.round(originalHeight * scale);
      image = image.resize(newWidth, newHeight, { fit: "fill" });
    }

    if (rotation && rotation !== 0) {
      image = image.rotate(rotation, { background: { r: 255, g: 255, b: 255, alpha: 1 } });
    }

    if (flipH) {
      image = image.flop();
    }

    const timestamp = Date.now();
    const ext = path.extname(imageUrl) || ".jpg";
    const filename = `product_edited_${timestamp}${ext}`;

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    const outputPath = path.join(uploadsDir, filename);
    await image.toFile(outputPath);

    const newImageUrl = `/uploads/${filename}`;

    return NextResponse.json({ url: newImageUrl });
  } catch (error) {
    console.error("Error processing image:", error);
    return NextResponse.json(
      { error: "Error processing image" },
      { status: 500 }
    );
  }
}
