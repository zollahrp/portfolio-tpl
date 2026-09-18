"use client";

import { motion } from "framer-motion";
import { BookOpen, Monitor, Award, Users } from "lucide-react";

export default function About() {
  const features = [
    {
      icon: <Monitor className="w-6 h-6 text-primary-400" />,
      title: "Kurikulum Industri",
      description: "Kurikulum yang disesuaikan dengan kebutuhan industri teknologi terkini, berfokus pada praktik dan project-based learning."
    },
    {
      icon: <Users className="w-6 h-6 text-indigo-400" />,
      title: "Pengajar Ahli",
      description: "Dosen dan praktisi industri yang berpengalaman siap membimbing mahasiswa menjadi talenta digital profesional."
    },
    {
      icon: <BookOpen className="w-6 h-6 text-emerald-400" />,
      title: "Fasilitas Modern",
      description: "Akses ke laboratorium komputer berstandar tinggi dengan perangkat lunak dan keras terbaru."
    },
    {
      icon: <Award className="w-6 h-6 text-amber-400" />,
      title: "Sertifikasi Kompetensi",
      description: "Lulusan dibekali dengan sertifikasi kompetensi nasional dan internasional yang diakui industri."
    }
  ];

  return (
    <section id="about" className="py-24 relative">
      <div className="container mx-auto px-6 md:px-12">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6"
          >
            Mengenal <span className="text-gradient">TPL IPB</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed"
          >
            Teknologi Rekayasa Perangkat Lunak (TPL) adalah program studi jenjang Sarjana Terapan (D4) di Sekolah Vokasi IPB University. Kami berfokus pada pengembangan perangkat lunak, kecerdasan buatan, dan solusi teknologi terintegrasi.
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-8 rounded-2xl hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="w-14 h-14 bg-slate-200/50 dark:bg-white/5 rounded-xl flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
