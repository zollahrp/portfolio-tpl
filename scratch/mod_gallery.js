const fs = require('fs');

const filePath = 'src/app/add-portfolio/page.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Add states
const stateTarget = `const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);`;
const stateReplacement = `const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [isDraggingGallery, setIsDraggingGallery] = useState(false);`;
content = content.replace(stateTarget, stateReplacement);

// 2. Add handleGalleryDrop and removeGalleryImage
const dropTarget = `  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImageFile(null);
    setImagePreview(null);
  };`;
const dropReplacement = `  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImageFile(null);
    setImagePreview(null);
  };

  const handleGalleryDrop = async (files: FileList | File[]) => {
    const newFiles = Array.from(files).filter(file => file.type.startsWith("image/"));
    
    // Process new files to WebP and previews
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
  };`;
content = content.replace(dropTarget, dropReplacement);

// 3. Add Thumbnail Hint
const thumbHintTarget = `                Thumbnail Visual <span className="text-rose-500">*</span>
              </label>

              {!imagePreview ? (`;
const thumbHintReplacement = `                Thumbnail Visual <span className="text-rose-500">*</span>
              </label>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 -mt-1 mb-1">
                Jika karya berupa web, silakan unggah screenshot web tersebut, dll. (Max: 5MB)
              </p>

              {!imagePreview ? (`;
content = content.replace(thumbHintTarget, thumbHintReplacement);

// 4. Add Gallery UI (after Thumbnail block)
const thumbEndTarget = `                </div>
              )}
            </div>

            {/* Input: Deskripsi Singkat */}`;
const thumbEndReplacement = `                </div>
              )}
            </div>

            {/* Input: Galeri Tambahan */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <ImagePlus className="w-3.5 h-3.5 text-primary-500" />
                Galeri Proyek <span className="text-slate-400">(Opsional)</span>
              </label>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 -mt-1 mb-1">
                Tambahkan foto-foto lain yang mendukung (tangkapan layar halaman lain, foto kegiatan, dsb.)
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
                className={\`relative min-h-[120px] p-4 rounded-xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center cursor-pointer overflow-hidden \${
                  isDraggingGallery 
                    ? "border-primary-500 bg-primary-50/50 dark:bg-primary-950/20 scale-[0.99]" 
                    : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 hover:border-primary-400 dark:hover:border-primary-600 hover:bg-slate-100 dark:hover:bg-slate-900/50"
                }\`}
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
                  <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3 z-10">
                    {galleryPreviews.map((preview, idx) => (
                      <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 group">
                        <Image
                          src={preview}
                          alt={\`Gallery \${idx}\`}
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
                    
                    <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-primary-500 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all cursor-pointer">
                      <ImagePlus className="w-6 h-6" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Input: Deskripsi Singkat */}`;
content = content.replace(thumbEndTarget, thumbEndReplacement);

// 5. Update submit logic to upload gallery images
const submitLogicTarget = `      if (!uploadRes.ok) throw new Error("Gagal mengunggah gambar ke server.");
      const uploadData = await uploadRes.json();
      const imageUrl = uploadData.url;

      setUploadProgress(60);

      const portfolioData = {
        title: formData.title,
        slug: generatedSlug,
        description: formData.description,
        content: formData.content,
        imageUrl: imageUrl,
        tags: tags,
        githubUrl: formData.github || null,
        liveUrl: formData.link || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        featured: false,
        views: 0,
        likes: 0
      };`;
const submitLogicReplacement = `      if (!uploadRes.ok) throw new Error("Gagal mengunggah gambar ke server.");
      const uploadData = await uploadRes.json();
      const imageUrl = uploadData.url;

      setUploadProgress(40);
      
      // Upload gallery images
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

      const portfolioData = {
        title: formData.title,
        slug: generatedSlug,
        description: formData.description,
        content: formData.content,
        imageUrl: imageUrl,
        gallery: galleryUrls,
        tags: tags,
        githubUrl: formData.github || null,
        liveUrl: formData.link || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        featured: false,
        views: 0,
        likes: 0
      };`;
content = content.replace(submitLogicTarget, submitLogicReplacement);

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Successfully updated page.tsx with gallery support.');
