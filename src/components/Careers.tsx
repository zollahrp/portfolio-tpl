"use client";

import { motion } from "framer-motion";
import { Code, Database, Layout, Smartphone } from "lucide-react";

export default function Careers() {
  const careers = [
    {
      icon: <Code className="w-8 h-8" />,
      title: "Software Engineer",
      description: "Merancang dan membangun arsitektur perangkat lunak yang scalable dan handal.",
      color: "from-primary-500 to-cyan-500"
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Mobile Developer",
      description: "Mengembangkan aplikasi mobile native maupun cross-platform berkinerja tinggi.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Layout className="w-8 h-8" />,
      title: "UI/UX Designer",
      description: "Mendesain antarmuka pengguna yang intuitif dan pengalaman digital yang luar biasa.",
      color: "from-amber-500 to-orange-500"
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: "Data Engineer",
      description: "Membangun sistem pemrosesan dan analisis data skala besar untuk kebutuhan bisnis.",
      color: "from-emerald-500 to-teal-500"
    }
  ];

  return (
    <section id="careers" className="py-24 relative bg-slate-100/50 dark:bg-slate-900/50 transition-colors duration-300">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Text Content */}
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                Siap Berkarir di <br />
                <span className="text-gradient">Industri Digital</span>
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg mb-8 leading-relaxed">
                Lulusan program studi TPL IPB dipersiapkan untuk mengisi berbagai posisi strategis di industri teknologi, startup, maupun instansi pemerintah.
              </p>
              
              <ul className="space-y-4">
                {[
                  "Peluang magang di perusahaan teknologi terkemuka",
                  "Networking dengan alumni dan praktisi",
                  "Portfolio-ready sebelum lulus"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                    <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Cards Grid */}
          <div className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {careers.map((career, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6 rounded-2xl relative overflow-hidden group"
              >
                {/* Glow effect on hover */}
                <div className={`absolute -inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br ${career.color}`}></div>
                
                <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center bg-gradient-to-br ${career.color} text-white`}>
                  {career.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{career.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {career.description}
                </p>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
