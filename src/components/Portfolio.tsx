"use client";

import { motion } from "framer-motion";
import { ExternalLink, Code, LayoutGrid } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { collection, getDocs, orderBy, query, where, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function Portfolio() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const q = query(
          collection(db, "portfolios"), 
          where("status", "==", "approved"),
          orderBy("date", "desc"),
          limit(3)
        );
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProjects(data);
      } catch (error) {
        console.error("Error fetching portfolios:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolios();
  }, []);

  return (
    <section id="portfolio" className="py-24 relative">
      <div className="container mx-auto px-6 md:px-12">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6"
          >
            Karya <span className="text-gradient">Mahasiswa</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-600 dark:text-slate-400 text-lg"
          >
            Inovasi dan solusi digital yang dibangun oleh mahasiswa TPL untuk menyelesaikan permasalahan nyata di masyarakat dan industri.
          </motion.p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => {
              const liveDemoUrl = project.liveUrl || project.link || project.demoUrl || project.url;
              const sourceCodeUrl = project.githubUrl || project.repoUrl || project.repository || project.github;

              return (
              <motion.div
                key={project.id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group flex flex-col"
              >
                <Link href={`/${project.slug}`} className="glass-card rounded-2xl overflow-hidden flex flex-col flex-grow relative h-full">
                {/* Project Image */}
                <div 
                  className={`h-48 w-full relative overflow-hidden bg-slate-200 dark:bg-slate-800 ${!loadedImages[project.id || index] ? 'animate-pulse' : ''}`}
                >
                  {project.imageUrl || project.image ? (
                    <Image
                      src={project.imageUrl || project.image}
                      alt={project.title}
                      fill
                      priority={true}
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
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 flex-grow">
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
                </Link>
              </motion.div>
            )})}
          </div>
        )}

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-3 glass-card text-slate-900 dark:text-white hover:bg-slate-200/50 dark:hover:bg-white/10 rounded-full font-medium transition-all"
          >
            Lihat Semua Karya
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
