"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import Image from "next/image";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Karya", href: "/" },
  ];
  
  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "glass-nav py-4 bg-white/70 dark:bg-[#020617]/70" : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Image src="/img/logo.jpg" alt="TPL IPB Logo" width={48} height={48} className="object-cover rounded-full" priority />
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              {link.name}
            </a>
          ))}
          <ThemeToggle />
          <a
            href="https://sv.ipb.ac.id/teknologi-rekayasa-perangkat-lunak/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 text-sm font-medium bg-primary-600 hover:bg-primary-700 text-white rounded-full transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)]"
          >
            Lihat Detail
          </a>
        </nav>

        {/* Mobile Menu Toggle */}
        <div className="flex md:hidden items-center gap-4">
          <ThemeToggle />
          <button
            className="text-slate-900 dark:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 w-full glass-nav bg-white/90 dark:bg-[#020617]/90 flex flex-col py-4 px-6 gap-4 md:hidden border-t border-slate-200 dark:border-white/10 shadow-lg"
        >
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <a
            href="https://sv.ipb.ac.id/teknologi-rekayasa-perangkat-lunak/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-center px-5 py-2.5 text-sm font-medium bg-primary-600 text-white rounded-lg shadow-md"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Lihat Detail
          </a>
        </motion.div>
      )}
    </header>
  );
}
