"use client";

import { motion } from "framer-motion";
import { ArrowRight, Terminal } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-slate-50 dark:bg-[#020617] -z-20 transition-colors duration-300"></div>
      
      {/* Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[40rem] h-[40rem] bg-primary-600/20 rounded-full blur-[120px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-indigo-600/20 rounded-full blur-[100px] -z-10"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50rem] h-[50rem] bg-sky-500/10 rounded-full blur-[120px] -z-10"></div>

      <div className="container mx-auto px-6 md:px-12 text-center flex flex-col items-center">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-primary-400 text-sm font-medium mb-8"
        >
          <Terminal className="w-4 h-4" />
          <span>Teknologi Rekayasa Perangkat Lunak (D4)</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6 leading-tight max-w-4xl transition-colors duration-300"
        >
          Membangun Masa Depan <br className="hidden md:block" />
          <span className="text-gradient">Digital Indonesia</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mb-10 transition-colors duration-300"
        >
          Program Sarjana Terapan Sekolah Vokasi IPB University. Kami mencetak Software Engineer berkualitas tinggi yang siap bersaing di industri global.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <a
            href="#about"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-full font-semibold transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)]"
          >
            Pelajari Lebih Lanjut
          </a>
          <Link
            href="/portfolio-tpl"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 glass-card text-slate-900 dark:text-white hover:bg-slate-200/50 dark:hover:bg-white/10 rounded-full font-semibold transition-all"
          >
            Lihat Karya Kami
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
