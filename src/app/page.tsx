"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
export type PortfolioCategory = "Web" | "Aplikasi" | "Prestasi" | "Student Exchange";
import { motion } from "framer-motion";
import { ExternalLink, Code, ArrowLeft, LayoutGrid } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState<PortfolioCategory | "Semua">("Semua");
  const categories: (PortfolioCategory | "Semua")[] = ["Semua", "Web", "Aplikasi", "Prestasi", "Student Exchange"];
  const [portfolioData, setPortfolioData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const q = query(
          collection(db, "portfolios"), 
          where("status", "==", "approved"),
          orderBy("date", "desc")
        );
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPortfolioData(data);
      } catch (error) {
        console.error("Error fetching portfolios:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolios();
  }, []);

  const filteredProjects = activeCategory === "Semua" 
    ? portfolioData 
    : portfolioData.filter(p => p.category === activeCategory);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-white transition-colors duration-300 flex flex-col">
      <Navbar />
      
      <section className="pt-24 md:pt-32 pb-16 relative flex-grow overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 md:w-[30rem] md:h-[30rem] bg-primary-600/10 rounded-full blur-[100px] -z-10 animate-pulse"></div>

        <div className="container mx-auto px-6 md:px-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
                Karya & <span className="text-gradient">Prestasi</span>
              </h1>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl text-lg">
                Jelajahi berbagai inovasi digital, aplikasi, prestasi, dan pengalaman internasional dari mahasiswa TPL.
              </p>
            </div>
            
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === cat 
                      ? "bg-primary-600 text-white shadow-lg" 
                      : "glass-card text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {filteredProjects.map((project, index) => {
                  const liveDemoUrl = project.liveUrl || project.link || project.demoUrl || project.url;
                  const sourceCodeUrl = project.githubUrl || project.repoUrl || project.repository || project.github;

                  return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="group flex flex-col"
                  >
                    <div className="glass-card rounded-2xl overflow-hidden flex flex-col flex-grow relative h-full hover:-translate-y-1 transition-transform duration-300">
                    {/* Project Image Placeholder */}
                    <div className={`h-56 w-full relative overflow-hidden bg-slate-200 dark:bg-slate-800 ${!loadedImages[project.id || index] ? 'animate-pulse' : ''}`}>
                      {project.imageUrl || project.image ? (
                        <Image
                          src={project.imageUrl || project.image}
                          alt={project.title}
                          fill
                          priority={index < 6}
                          onLoad={() => setLoadedImages(prev => ({...prev, [project.id || index]: true}))}
                          className={`object-cover group-hover:scale-105 transition-all duration-500 ${!loadedImages[project.id || index] ? 'opacity-0 scale-110' : 'opacity-100 scale-100'}`}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <LayoutGrid className="w-10 h-10 opacity-20" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300 z-10"></div>
                      <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-white z-20">
                        {project.category}
                      </div>
                    </div>

                    {/* Project Details */}
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 flex-grow line-clamp-3">
                        {project.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.tags?.map((tag: string, i: number) => (
                          <span key={i} className="text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-200/50 dark:bg-white/5 px-2.5 py-1 rounded-md">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-4 pt-4 border-t border-slate-200 dark:border-white/10 mt-auto relative z-20">
                        {sourceCodeUrl && (
                          <a href={sourceCodeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors" onClick={(e) => e.stopPropagation()}>
                            <Code className="w-4 h-4" />
                            Kode
                          </a>
                        )}
                        {liveDemoUrl && (
                          <a href={liveDemoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors ml-auto" onClick={(e) => e.stopPropagation()}>
                            Live Demo
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Overlay link for the entire card (moved to bottom for better z-index stacking) */}
                    <Link href={`/${project.slug}`} className="absolute inset-0 z-10">
                      <span className="sr-only">Lihat detail {project.title}</span>
                    </Link>
                    
                    </div>
                  </motion.div>
                )})}
              </div>

              {!loading && filteredProjects.length === 0 && (
                <div className="text-center py-20 text-slate-500 dark:text-slate-400">
                  Belum ada portofolio di kategori ini.
                </div>
              )}
            </>
          )}

        </div>
      </section>
      
      <Footer />
    </main>
  );
}
