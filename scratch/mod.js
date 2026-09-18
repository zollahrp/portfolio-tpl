const fs = require('fs');
const path = 'src/app/add-portfolio/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Remove gradient and use purple
content = content.replace(
  'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent',
  'text-purple-600 dark:text-purple-400'
);

// 2. Change all indigo to purple globally
content = content.replace(/indigo/g, 'purple');

// 3. Add convertToWebP function
const webpFunc = `
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
        if (!ctx) return reject(new Error("Canvas error"));
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) resolve(new File([blob], file.name.replace(/\\.[^/.]+$/, ".webp"), { type: "image/webp" }));
          else reject(new Error("Blob error"));
        }, "image/webp", 0.8);
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};

export default function AddPortfolioPage() {`;

content = content.replace('export default function AddPortfolioPage() {', webpFunc);

// 4. Update handleFileDrop
const oldDrop = `  const handleFileDrop = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else {`;

const newDrop = `  const handleFileDrop = async (file: File) => {
    if (file && file.type.startsWith("image/")) {
      try {
        const webpFile = await convertToWebP(file);
        setImageFile(webpFile);
        setImagePreview(URL.createObjectURL(webpFile));
      } catch (error) {
        console.error(error);
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
      }
    } else {`;

content = content.replace(oldDrop, newDrop);

fs.writeFileSync(path, content, 'utf8');
console.log("Done");
