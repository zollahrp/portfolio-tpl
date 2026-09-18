"use client";

import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  UploadCloud,
  ImagePlus,
  X,
  Sparkles,
  Code2,
  Globe,
  FileText,
  Layers,
  Heading1,
  ChevronDown
} from "lucide-react";
import Image from "next/image";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

const MySwal = withReactContent(Swal);

const convertToWebP = (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas context is not available"));
          return;
        }
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const newFile = new File([blob], file.name.replace(/.[^/.]+$/, ".webp"), {
                type: "image/webp",
              });
              resolve(newFile);
            } else {
              reject(new Error("Canvas toBlob failed"));
            }
          },
          "image/webp",
          0.8
        );
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};

const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{'list': 'ordered'}, {'list': 'bullet'}],
    ['link', 'clean']
  ],
};

export default function AddPortfolioPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [formData, setFormData] = useState({
    title: "",
    category: "Web",
    description: "",
    content: "",
    github: "",
    link: ""
  });

  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [isDraggingGallery, setIsDraggingGallery] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileDrop = async (file: File) => {
    if (file && file.type.startsWith("image/")) {
      try {
        const webpFile = await convertToWebP(file);
        setImageFile(webpFile);
        setImagePreview(URL.createObjectURL(webpFile));
      } catch (error) {
        console.error("Gagal mengonversi gambar", error);
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
      }
    } else {
      MySwal.fire({
        title: "Format Tidak Sesuai",
        text: "Silakan unggah berkas gambar seperti JPG, PNG, atau WEBP.",
        icon: "warning",
        confirmButtonColor: "#6366f1"
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileDrop(file);
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleGalleryDrop = async (files: FileList | File[]) => {
    const newFiles = Array.from(files).filter(file => file.type.startsWith("image/"));
    if (galleryFiles.length + newFiles.length > 5) {
      MySwal.fire({
        title: "Batas Gambar Tercapai",
        text: "Maksimal 5 foto galeri diperbolehkan.",
        icon: "warning",
        confirmButtonColor: "#6366f1"
      });
      return;
    }
    
    const processedFiles: File[] = [];
    const previewUrls: string[] = [];
    
    for (const file of newFiles) {
      try {
        const webpFile = await convertToWebP(file);
        processedFiles.push(webpFile);
        
        const previewUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(webpFile);
        });
        previewUrls.push(previewUrl);
      } catch (err) {
        console.error("Gagal memproses gambar galeri:", err);
      }
    }
    
    setGalleryFiles(prev => [...prev, ...processedFiles]);
    setGalleryPreviews(prev => [...prev, ...previewUrls]);
  };

  const removeGalleryImage = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setGalleryFiles(prev => prev.filter((_, i) => i !== index));
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTag = tagInput.trim().replace(",", "");
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput("");
    } else if (e.key === "Backspace" && tagInput === "" && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };

  const removeTag = (indexToRemove: number) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageFile) {
      MySwal.fire({
        title: "Gambar Diperlukan",
        text: "Silakan pilih thumbnail gambar untuk karya ini.",
        icon: "error",
        confirmButtonColor: "#6366f1"
      });
      return;
    }

    if (tags.length === 0) {
      MySwal.fire({
        title: "Tag Diperlukan",
        text: "Tambahkan setidaknya 1 tag teknologi.",
        icon: "error",
        confirmButtonColor: "#6366f1"
      });
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(20);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append("image", imageFile);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData
      });

      if (!uploadRes.ok) throw new Error("Gagal mengunggah gambar ke server.");
      const uploadData = await uploadRes.json();
      const imageUrl = uploadData.url;

      setUploadProgress(40);

      const galleryUrls: string[] = [];
      if (galleryFiles.length > 0) {
        let galProgress = 0;
        for (const galFile of galleryFiles) {
          const galFormData = new FormData();
          galFormData.append("image", galFile);
          
          const galRes = await fetch("/api/upload", {
            method: "POST",
            body: galFormData
          });
          
          if (galRes.ok) {
            const galData = await galRes.json();
            galleryUrls.push(galData.url);
          }
          galProgress += 1;
          setUploadProgress(40 + Math.floor((galProgress / galleryFiles.length) * 30));
        }
      } else {
        setUploadProgress(70);
      }

      const generatedSlug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

      const currentDate = new Date().toISOString().split("T")[0];

      await addDoc(collection(db, "portfolios"), {
        ...formData,
        date: currentDate,
        tags: tags,
        slug: generatedSlug,
        imageUrl: imageUrl,
        gallery: galleryUrls,
        status: "pending",
        createdAt: serverTimestamp()
      });

      setUploadProgress(100);
      setIsSubmitting(false);

      MySwal.fire({
        title: "Karya Terkirim!",
        text: "Karya Anda berhasil diunggah dan sedang menunggu verifikasi.",
        icon: "success",
        confirmButtonColor: "#6366f1",
        background: document.documentElement.classList.contains("dark") ? "#0f172a" : "#ffffff",
        color: document.documentElement.classList.contains("dark") ? "#f8fafc" : "#0f172a"
      });

      setFormData({
        title: "",
        description: "",
        content: "",
        category: "Web",
        github: "",
        link: ""
      });
      setTags([]);
      setImageFile(null);
      setImagePreview(null);
      setTimeout(() => setUploadProgress(0), 1000);
    } catch (error: unknown) {
      console.error("Error: ", error);
      setIsSubmitting(false);
      setUploadProgress(0);
      MySwal.fire({
        title: "Gagal Mengirim",
        text: error instanceof Error ? error.message : "Terjadi kesalahan saat memproses data.",
        icon: "error",
        confirmButtonColor: "#ef4444"
      });
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#030712] text-slate-900 dark:text-slate-100 flex flex-col selection:bg-primary-500 selection:text-white relative overflow-hidden">

      {/* Custom CSS Animation Keyframes */}
      <style jsx global>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes popIn {
          0% {
            opacity: 0;
            transform: scale(0.85);
          }
          70% {
            transform: scale(1.05);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes floatSlow {
          0%, 100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-12px) scale(1.02);
          }
        }

        .anim-fade-down {
          animation: fadeInDown 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .anim-fade-up {
          animation: fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .anim-pop {
          animation: popIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .anim-float-1 {
          animation: floatSlow 8s ease-in-out infinite;
        }

        .anim-float-2 {
          animation: floatSlow 10s ease-in-out infinite 2s;
        }
      `}</style>

      {/* Background Ambient Glows */}
      <div className="absolute top-20 -left-32 w-80 h-80 bg-primary-500/15 dark:bg-primary-500/10 rounded-full blur-3xl pointer-events-none -z-10 anim-float-1" />
      <div className="absolute top-64 -right-32 w-80 h-80 bg-primary-500/15 dark:bg-primary-500/10 rounded-full blur-3xl pointer-events-none -z-10 anim-float-2" />

      <Navbar />

      <section className="pt-32 pb-24 relative flex-grow">
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl">

          {/* Header Section */}
          <div className="text-center mb-10 space-y-3 anim-fade-down">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-primary-50 dark:bg-primary-950/70 text-primary-600 dark:text-primary-400 border border-primary-200/80 dark:border-primary-800/60 shadow-sm transition-transform hover:scale-105 duration-200 cursor-default">
              <Sparkles className="w-3.5 h-3.5 text-primary-500" />
              <span>Showcase & Submission</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
              Publikasikan <span className="text-primary-600 dark:text-primary-400">Karya Hebatmu</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Pamerkan aplikasi, eksperimen UI, atau pencapaian terbaikmu. Proyek akan ditinjau kurator sebelum terbit secara publik.
            </p>
          </div>

          {/* Form Card */}
          <form
            onSubmit={handleSubmit}
            className="anim-fade-up bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-slate-200/50 dark:shadow-black/40 flex flex-col gap-6 transition-all duration-300 hover:shadow-primary-500/5"
          >
            {/* Input: Judul */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Heading1 className="w-3.5 h-3.5 text-primary-500" />
                Judul Karya / Proyek / Achievement <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 focus:bg-white dark:focus:bg-slate-900 focus:border-primary-500 dark:focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all duration-200 text-sm"
                placeholder="Contoh: Juara 1, Student Exchange bla bla"
              />
              <p className="text-[11px] text-slate-400 dark:text-slate-500">Slug URL akan dibentuk secara otomatis dari judul ini.</p>
            </div>

            {/* Input: Thumbnail Visual */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <ImagePlus className="w-3.5 h-3.5 text-primary-500" />
                Thumbnail Visual (SS Web) <span className="text-rose-500">*</span>
              </label>

              {!imagePreview ? (
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    if (e.dataTransfer.files?.[0]) handleFileDrop(e.dataTransfer.files[0]);
                  }}
                  className={`relative group border-2 border-dashed rounded-2xl p-6 transition-all duration-300 flex flex-col items-center justify-center text-center aspect-video cursor-pointer ${isDragging
                    ? "border-primary-500 bg-primary-50/50 dark:bg-primary-950/20 scale-[0.99]"
                    : "border-slate-300 dark:border-slate-800 hover:border-primary-400 dark:hover:border-primary-600 bg-slate-50/30 dark:bg-slate-950/30"
                    }`}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="w-12 h-12 bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400 rounded-2xl flex items-center justify-center mb-3 shadow-inner group-hover:scale-110 transition-transform duration-300">
                    <UploadCloud className="w-6 h-6 group-hover:-translate-y-0.5 transition-transform duration-300" />
                  </div>
                  <h4 className="font-semibold text-sm text-slate-700 dark:text-slate-200">
                    Tarik file ke sini atau <span className="text-primary-600 dark:text-primary-400 underline decoration-primary-400/40 underline-offset-2">pilih dokumen</span>
                  </h4>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Mendukung format PNG, JPG, WEBP (Maks rasio 16:9)</p>
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden aspect-video border border-slate-200 dark:border-slate-800 group shadow-md anim-pop">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={clearImage}
                      className="bg-white/20 hover:bg-rose-600 text-white p-2.5 rounded-full backdrop-blur-md transition-all duration-200 shadow-lg hover:scale-110 active:scale-95"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Input: Galeri Tambahan */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <ImagePlus className="w-3.5 h-3.5 text-primary-500" />
                Galeri Proyek <span className="text-slate-400">(Opsional, Maks 5 Foto)</span>
              </label>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 -mt-1 mb-1">
                Tambahkan foto pendukung (tangkapan layar fitur lain, dokumentasi lomba, dsb.)
              </p>

              <div
                onDragOver={(e) => { e.preventDefault(); setIsDraggingGallery(true); }}
                onDragLeave={() => setIsDraggingGallery(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDraggingGallery(false);
                  if (e.dataTransfer.files?.length > 0) handleGalleryDrop(e.dataTransfer.files);
                }}
                onClick={() => document.getElementById("gallery-upload")?.click()}
                className={`relative min-h-[120px] p-4 rounded-xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center cursor-pointer overflow-hidden ${
                  isDraggingGallery 
                    ? "border-primary-500 bg-primary-50/50 dark:bg-primary-950/20 scale-[0.99]" 
                    : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 hover:border-primary-400 dark:hover:border-primary-600 hover:bg-slate-100 dark:hover:bg-slate-900/50"
                }`}
              >
                <input
                  id="gallery-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.length) handleGalleryDrop(e.target.files);
                  }}
                />
                
                {galleryPreviews.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-3 text-slate-400 dark:text-slate-500 pointer-events-none">
                    <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center border border-slate-100 dark:border-slate-700">
                      <ImagePlus className="w-5 h-5 text-primary-500" />
                    </div>
                    <p className="text-sm font-medium">
                      Drag & drop atau <span className="text-primary-500">Pilih Beberapa Gambar</span>
                    </p>
                  </div>
                ) : (
                  <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3 z-10" onClick={(e) => e.stopPropagation()}>
                    {galleryPreviews.map((preview, idx) => (
                      <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 group">
                        <Image
                          src={preview}
                          alt={`Gallery ${idx}`}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                          <button
                            type="button"
                            onClick={(e) => removeGalleryImage(idx, e)}
                            className="bg-white/20 hover:bg-rose-600 text-white p-2 rounded-full backdrop-blur-md transition-all duration-200 shadow-lg hover:scale-110 active:scale-95"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    {galleryPreviews.length < 5 && (
                      <div 
                        onClick={() => document.getElementById("gallery-upload")?.click()}
                        className="relative aspect-video rounded-lg overflow-hidden border-2 border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-primary-500 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all cursor-pointer"
                      >
                        <ImagePlus className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Input: Kategori */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-primary-500" />
                Kategori <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 focus:bg-white dark:focus:bg-slate-900 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all text-sm appearance-none cursor-pointer"
                >
                  <option value="Web">Web Development</option>
                  <option value="Aplikasi">Mobile App</option>
                  <option value="Prestasi">Prestasi & Kompetisi</option>
                  <option value="Student Exchange">Student Exchange</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
            </div>

            {/* Input: Deskripsi Singkat */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-primary-500" />
                Ringkasan Intro <span className="text-rose-500">*</span>
              </label>
              <textarea
                name="description"
                required
                rows={2}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 focus:bg-white dark:focus:bg-slate-900 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all resize-none text-sm leading-relaxed"
                placeholder="Hook singkat yang memikat untuk tampilan kartu..."
              />
            </div>

            {/* Input: Konten Lengkap */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-primary-500" />
                Dokumentasi & Cerita Proyek <span className="text-slate-400">(Opsional)</span>
              </label>
              <div className="react-quill-container border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-950/50 overflow-hidden focus-within:border-primary-500 focus-within:ring-4 focus-within:ring-primary-500/10 transition-all">
                <ReactQuill 
                  theme="snow"
                  modules={quillModules}
                  value={formData.content}
                  onChange={(value) => setFormData({ ...formData, content: value })}
                  placeholder="Jelaskan arsitektur teknis, solusi inovatif, dan proses pembuatannya..."
                  className="text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            {/* Input: Tags */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-primary-500" />
                Tech Stack / Tagar <span className="text-rose-500">*</span>
              </label>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 -mt-1">
                Contoh: Next.js, Juara 1, Pertukaran Pelajar Jepang, Lomba AI, dsb. Tekan <kbd className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-primary-600 dark:text-primary-400">Enter</kbd> setelah mengetik.
              </p>

              <div
                onClick={() => document.getElementById("tag-input")?.focus()}
                className="w-full min-h-[52px] p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 focus-within:border-primary-500 focus-within:ring-4 focus-within:ring-primary-500/10 flex flex-wrap items-center gap-2 transition-all cursor-text"
              >
                {tags.map((tag, index) => (
                  <span
                    key={tag}
                    className="anim-pop inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-500/20"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeTag(index); }}
                      className="hover:text-rose-500 hover:scale-110 transition-all"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
                <input
                  id="tag-input"
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  className="flex-1 min-w-[130px] bg-transparent outline-none px-2 text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
                  placeholder={tags.length === 0 ? "Ketik nama stack lalu tekan Enter..." : "Tambah lagi..."}
                />
              </div>
            </div>

            {/* Input: GitHub & Live Demo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-primary-500" />
                  Link Publikasi (Opsional)
                </label>
                <input
                  type="url"
                  name="github"
                  value={formData.github}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 focus:bg-white dark:focus:bg-slate-900 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all text-sm"
                  placeholder="https://github.com/username/repo"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-primary-500" />
                  Demo URL / Github (Opsional)
                </label>
                <input
                  type="url"
                  name="link"
                  value={formData.link}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 focus:bg-white dark:focus:bg-slate-900 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all text-sm"
                  placeholder="https://proyek-kamu.com"
                />
              </div>
            </div>

            {/* Tombol Submit & Progress Bar */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full relative overflow-hidden group px-5 py-2.5 text-sm font-medium bg-primary-600 hover:bg-primary-700 text-white rounded-full transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)] disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {/* Visual Progress Bar */}
                {isSubmitting && (
                  <div
                    className="absolute left-0 top-0 bottom-0 bg-white/20 transition-all duration-500 ease-out"
                    style={{ width: `${uploadProgress}%` }}
                  />
                )}

                {isSubmitting ? (
                  <div className="flex items-center gap-2 z-10">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Mengirim Proyek ({uploadProgress}%)...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 z-10 transition-transform duration-200 group-hover:translate-x-1 cursor-pointer">
                    <UploadCloud className="w-4 h-4" />
                    <span>Terbitkan Portofolio</span>
                  </div>
                )}
              </button>
            </div>

          </form>
        </div>
      </section>

      <Footer />
    </main>
  );
}
