const fs = require('fs');

const content = `import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ExternalLink, Code, Tag, LayoutGrid } from "lucide-react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const dynamic = 'force-dynamic';

export default async function PortfolioDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const q = query(collection(db, "portfolios"), where("slug", "==", slug));
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    notFound();
  }
  
  const project = querySnapshot.docs[0].data() as any;

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-white transition-colors duration-300 flex flex-col">
      <Navbar />

      <section className="pt-32 pb-16 relative flex-grow">
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-primary-600/5 rounded-full blur-[120px] -z-10 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-indigo-600/5 rounded-full blur-[100px] -z-10"></div>

        <div className="container mx-auto px-6 md:px-12 max-w-5xl">
          <Link href="/" className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-600 font-medium mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Daftar Karya
          </Link>

          {/* Header Section */}
          <div className="flex flex-col md:flex-row gap-10 items-start mb-16">
            <div className="w-full md:w-1/2 flex flex-col">
              <span className="bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6 inline-block w-max">
                {project.category}
              </span>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white mb-6 leading-tight tracking-tight">
                {project.title}
              </h1>
              
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
                {project.description}
              </p>

              {(project.liveUrl || project.githubUrl) && (
                <div className="flex flex-wrap gap-4 mt-auto">
                  {project.liveUrl && (
                    <a 
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_rgba(37,99,235,0.6)]"
                    >
                      <ExternalLink className="w-5 h-5" />
                      Kunjungi Demo
                    </a>
                  )}
                  {project.githubUrl && (
                    <a 
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border-2 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl font-semibold transition-all"
                    >
                      <Code className="w-5 h-5" />
                      Lihat Kode
                    </a>
                  )}
                </div>
              )}
            </div>

            <div className="w-full md:w-1/2">
              <div className="relative aspect-[4/3] w-full rounded-[2rem] overflow-hidden shadow-2xl border border-slate-200/50 dark:border-white/10 bg-slate-100 dark:bg-slate-900">
                {project.imageUrl ? (
                  <Image 
                    src={project.imageUrl} 
                    alt={project.title} 
                    fill 
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <LayoutGrid className="w-16 h-16 opacity-20" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-slate-200 dark:bg-white/10 mb-16"></div>

          {/* Main Content & Gallery */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              {project.content && project.content.trim() !== "" && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-4">
                    Dokumentasi & Cerita Proyek
                  </h2>
                  <div 
                    className="prose prose-lg dark:prose-invert prose-primary max-w-none text-slate-700 dark:text-slate-300 leading-loose"
                    dangerouslySetInnerHTML={{ __html: project.content }}
                  />
                </div>
              )}

              {project.gallery && project.gallery.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-4">
                    Galeri Proyek
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {project.gallery.map((imgUrl: string, idx: number) => (
                      <div key={idx} className="relative aspect-video rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 group">
                        <Image 
                          src={imgUrl} 
                          alt={\`Gallery Image \${idx + 1}\`} 
                          fill 
                          className="object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar / Meta */}
            <div className="lg:col-span-1">
              <div className="glass-card p-8 rounded-3xl sticky top-32">
                <div className="flex items-center gap-3 text-slate-900 dark:text-white font-bold text-lg mb-6">
                  <div className="p-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg">
                    <Tag className="w-5 h-5" />
                  </div>
                  Teknologi & Fitur
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {project.tags && project.tags.length > 0 ? (
                    project.tags.map((tag: string, i: number) => (
                      <span 
                        key={i} 
                        className="text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-200/60 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 px-4 py-2 rounded-xl transition-colors border border-slate-200 dark:border-slate-700"
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-500 italic text-sm">Tidak ada tagar</span>
                  )}
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </section>

      <Footer />
    </main>
  );
}
`;
fs.writeFileSync('src/app/[slug]/page.tsx', content, 'utf-8');
console.log('Saved src/app/[slug]/page.tsx');
