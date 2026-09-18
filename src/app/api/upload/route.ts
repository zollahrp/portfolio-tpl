import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Konfigurasi Cloudinary menggunakan environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File;
    
    if (!file) {
      return NextResponse.json({ error: "Tidak ada gambar yang diunggah" }, { status: 400 });
    }

    // Ubah File menjadi format base64
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64String = `data:${file.type};base64,${buffer.toString("base64")}`;

    // Upload ke Cloudinary
    const uploadResult = await cloudinary.uploader.upload(base64String, {
      folder: "portfolio_tpl",
      fetch_format: "auto",
      quality: "auto",
    });

    return NextResponse.json({ url: uploadResult.secure_url });
  } catch (error: any) {
    console.error("Error uploading to Cloudinary:", error);
    return NextResponse.json({ error: "Gagal mengunggah gambar" }, { status: 500 });
  }
}
