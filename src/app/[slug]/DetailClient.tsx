"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ExternalLink, Code, Sparkles, LayoutGrid, Rocket, Globe } from "lucide-react";
import { motion } from "framer-motion";

function decodeHTMLEntities(text: string) {
  if (!text) return "";
  const entities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&nbsp;': ' ',
  };
  return text.replace(/&amp;|&lt;|&gt;|&quot;|&#39;|&nbsp;/g, match => entities[match] || match);
}

export default function DetailClient({ project }: { project: any }) {
  // Try to find the live URL and github URL from various possible field names
  const liveDemoUrl = project.liveUrl || project.link || project.demoUrl || project.url;
  const sourceCodeUrl = project.githubUrl || project.repoUrl || project.repository || project.github;

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#0f071a] text-slate-900 dark:text-white transition-colors duration-300 flex flex-col selection:bg-purple-500/30">
      <Navbar />

      <section className="pt-32 pb-16 relative flex-grow overflow-hidden">
        {/* Abstract Glowing Backgrounds (Ungu Tua / Dark Purple) */}
        <div className="absolute top-[-10%] right-[-5%] w-[50rem] h-[50rem] bg-gradient-to-br from-purple-800/30 to-fuchsia-700/20 rounded-full blur-[120px] -z-10 animate-pulse"></div>
        <div className="absolute bottom-[20%] left-[-10%] w-[40rem] h-[40rem] bg-indigo-900/30 rounded-full blur-[100px] -z-10"></div>
        <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[60rem] h-[20rem] bg-purple-900/20 rounded-full blur-[80px] -z-10"></div>

        <div className="container mx-auto px-6 md:px-8 max-w-7xl">
          
          {/* Top Nav & Breadcrumb */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between mb-16"
          >
            <Link href="/" className="group flex items-center gap-3 px-5 py-2.5 bg-white/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-800 backdrop-blur-md rounded-2xl border border-slate-200/50 dark:border-white/10 transition-all shadow-sm hover:shadow-md">
              <div className="p-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg group-hover:-translate-x-1 transition-transform">
                <ArrowLeft className="w-4 h-4" />
              </div>
              <span className="font-semibold text-sm text-slate-600 dark:text-slate-300 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                Kembali ke Portofolio
              </span>
            </Link>

            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-200/50 dark:bg-slate-800/50 rounded-2xl border border-slate-300/50 dark:border-slate-700/50">
              <div className="w-2 h-2 rounded-full bg-accent-500 animate-ping"></div>
              <div className="w-2 h-2 rounded-full bg-accent-500 absolute"></div>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-2">Project Showcase</span>
            </div>
          </motion.div>

          {/* Hero Content (Centered, Gradient, Premium) */}
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-700/10 to-fuchsia-700/10 border border-purple-600/30 text-purple-700 dark:text-purple-300 px-6 py-2.5 rounded-full text-sm font-bold tracking-widest uppercase shadow-inner backdrop-blur-sm">
                <Sparkles className="w-4 h-4 text-fuchsia-500" />
                {project.category}
              </div>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight"
            >
              <span className="text-slate-900 dark:text-white">{project.title}</span>
            </motion.h1>
          </div>

          {/* Cinematic Hero Image */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, type: "spring", bounce: 0.2 }}
            className="w-full mb-24 relative"
          >
            {/* Decorative corners */}
            <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-primary-500 rounded-tl-xl z-10"></div>
            <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-accent-500 rounded-br-xl z-10"></div>

            <div className="relative aspect-video lg:aspect-[21/9] w-full rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_-12px_rgba(0,0,0,0.2)] dark:shadow-[0_20px_50px_-12px_rgba(100,65,149,0.3)] border border-slate-200/50 dark:border-white/10 bg-slate-100 dark:bg-slate-900 group">
              {project.imageUrl ? (
                <Image 
                  src={project.imageUrl} 
                  alt={project.title} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-[1000ms] ease-out"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <LayoutGrid className="w-16 h-16 opacity-20" />
                </div>
              )}
              {/* Glass Reflection Overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/20 dark:from-white/0 dark:via-white/5 dark:to-white/10 pointer-events-none"></div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 xl:gap-16">
            
            {/* Left Column (Main Article) */}
            <div className="xl:col-span-8">
              {/* Article Content */}
              {project.content && project.content.trim() !== "" && (
                <motion.article 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="mb-20 glass-card p-8 md:p-12 rounded-[3rem] border border-slate-200/60 dark:border-white/10"
                >
                  <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white shadow-lg">
                      <LayoutGrid className="w-6 h-6" />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                      Detail Proyek
                    </h2>
                  </div>
                  
                  <div 
                    className="prose prose-lg dark:prose-invert prose-primary max-w-none text-slate-600 dark:text-slate-300 leading-relaxed
                      prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-white
                      prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:tracking-tight
                      prose-h3:text-xl prose-h3:mt-10 prose-h3:mb-4
                      prose-p:mb-6 prose-p:leading-relaxed prose-p:text-base
                      prose-a:text-purple-600 dark:prose-a:text-purple-400 prose-a:no-underline hover:prose-a:underline prose-a:font-semibold
                      prose-strong:text-slate-900 dark:prose-strong:text-white prose-strong:font-bold
                      prose-ul:list-none prose-ul:pl-0 prose-ul:mb-8 prose-ul:space-y-4
                      prose-li:flex prose-li:items-start prose-li:gap-4
                      prose-li:before:content-[''] prose-li:before:w-2 prose-li:before:h-2 prose-li:before:bg-gradient-to-r prose-li:before:from-purple-600 prose-li:before:to-fuchsia-500 prose-li:before:rounded-sm prose-li:before:mt-2.5 prose-li:before:shrink-0
                      prose-img:rounded-3xl prose-img:shadow-2xl prose-img:border prose-img:border-slate-200/50 dark:prose-img:border-white/10"
                    dangerouslySetInnerHTML={{ __html: decodeHTMLEntities(project.content) }}
                  />
                </motion.article>
              )}

              {/* Gallery */}
              {project.gallery && project.gallery.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="mb-16"
                >
                  <div className="flex items-center gap-4 mb-8">
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                      Galeri Desain
                    </h2>
                    <div className="h-px flex-grow bg-gradient-to-r from-slate-200 dark:from-slate-800 to-transparent"></div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {project.gallery.map((imgUrl: string, idx: number) => (
                      <motion.div 
                        key={idx} 
                        whileHover={{ y: -8, scale: 1.02 }}
                        className="relative aspect-[4/3] rounded-[2rem] overflow-hidden shadow-lg border border-slate-200/50 dark:border-white/5 group bg-slate-100 dark:bg-slate-900"
                      >
                        <Image 
                          src={imgUrl} 
                          alt={`Gallery Image ${idx + 1}`} 
                          fill 
                          className="object-cover transition-transform duration-700 ease-in-out" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right Column (Sidebar - Bento Grid Style) */}
            <div className="xl:col-span-4 relative">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="sticky top-32 flex flex-col gap-6"
              >
                {/* Live Demo & Github - Bento Card 1 */}
                {(liveDemoUrl || sourceCodeUrl) && (
                  <div className="glass-card p-2 rounded-[2rem] shadow-xl border border-slate-200/60 dark:border-white/10 flex flex-col gap-2">
                    {liveDemoUrl && (
                      <a 
                        href={liveDemoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative overflow-hidden w-full flex items-center justify-between p-6 bg-gradient-to-r from-purple-700 to-indigo-800 hover:from-purple-600 hover:to-indigo-700 text-white rounded-[1.5rem] font-bold transition-all shadow-[0_0_20px_rgba(107,33,168,0.4)]"
                      >
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                        <div className="relative z-10 flex items-center gap-4">
                          <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                            <Globe className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex flex-col text-left">
                            <span className="text-xs text-purple-200 uppercase tracking-widest">Kunjungi</span>
                            <span className="text-lg">Live Website</span>
                          </div>
                        </div>
                        <ExternalLink className="w-6 h-6 text-white/50 group-hover:text-white transition-colors relative z-10 group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </a>
                    )}

                    {sourceCodeUrl && (
                      <a 
                        href={sourceCodeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group w-full flex items-center justify-between p-6 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white rounded-[1.5rem] font-bold transition-all border border-slate-200/50 dark:border-white/5"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center shadow-sm">
                            <Code className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                          </div>
                          <div className="flex flex-col text-left">
                            <span className="text-xs text-slate-500 uppercase tracking-widest">Repository</span>
                            <span className="text-lg">Source Code</span>
                          </div>
                        </div>
                        <ArrowLeft className="w-5 h-5 text-slate-400 rotate-[135deg] group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
                      </a>
                    )}
                  </div>
                )}

                {/* Tech Stack - Bento Card 2 */}
                <div className="glass-card p-8 rounded-[2.5rem] shadow-xl border border-slate-200/60 dark:border-white/10">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-slate-900 dark:text-white font-bold text-xl">
                      Teknologi
                    </h3>
                    <div className="p-2 bg-accent-100 dark:bg-accent-900/30 text-accent-600 rounded-xl">
                      <Rocket className="w-5 h-5" />
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    {project.tags && project.tags.length > 0 ? (
                      project.tags.map((tag: string, i: number) => (
                        <span 
                          key={i} 
                          className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800/80 hover:bg-purple-50 dark:hover:bg-purple-900/40 px-4 py-2.5 rounded-2xl transition-all border border-slate-200/80 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-purple-300 dark:hover:border-purple-700 hover:-translate-y-0.5"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 group-hover:bg-purple-500 transition-colors"></div>
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-500 italic text-sm">Tidak ada info teknologi</span>
                    )}
                  </div>
                </div>

                {/* Kreator Info - Bento Card 3 */}
                {(project.angkatan || project.contact) && (
                  <div className="glass-card p-8 rounded-[2.5rem] shadow-xl border border-slate-200/60 dark:border-white/10">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-slate-900 dark:text-white font-bold text-xl">
                        Info Kreator
                      </h3>
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl">
                        <Sparkles className="w-5 h-5" />
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-4">
                      {project.angkatan && (
                        <div>
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Angkatan</p>
                          <p className="font-semibold text-slate-800 dark:text-slate-200">{project.angkatan}</p>
                        </div>
                      )}
                      
                      {project.contact && (
                        <div>
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Kontak</p>
                          <p className="font-semibold text-slate-800 dark:text-slate-200 break-words">{project.contact}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

              </motion.div>
            </div>
            
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
