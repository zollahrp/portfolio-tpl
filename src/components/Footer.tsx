import { Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer id="contact" className="bg-slate-50 dark:bg-[#020617] border-t border-slate-200 dark:border-white/5 pt-20 pb-10 transition-colors duration-300">
      <div className="container mx-auto px-6 md:px-12">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Col */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <Image src="/img/logo.jpg" alt="TPL IPB Logo" width={48} height={48} className="object-cover rounded-full" priority />
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
              Membangun masa depan digital Indonesia dengan mencetak talenta unggul di bidang rekayasa perangkat lunak.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-slate-900 dark:text-white font-semibold mb-6">Tautan Cepat</h4>
            <ul className="space-y-4">
              <li><a href="/" className="text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm">Beranda Karya</a></li>
              <li><a href="#" className="text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm">Kembali ke Atas</a></li>
            </ul>
          </div>

          {/* Admission */}
          <div>
            <h4 className="text-slate-900 dark:text-white font-semibold mb-6">Pendaftaran</h4>
            <ul className="space-y-4">
              <li><a href="https://sv.ipb.ac.id/teknologi-rekayasa-perangkat-lunak/" target="_blank" rel="noopener noreferrer" className="text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm">Informasi Pendaftaran TPL</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-slate-900 dark:text-white font-semibold mb-6">Hubungi Kami</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
                <span className="text-slate-600 dark:text-slate-400 text-sm">
                  Kampus IPB Cilibende, Jl. Kumbang No.14, RT.02/RW.06, Babakan, Kec. Bogor Tengah, Kota Bogor, Jawa Barat 16128
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary-500 shrink-0" />
                <span className="text-slate-600 dark:text-slate-400 text-sm">+62 251 8329101</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary-500 shrink-0" />
                <span className="text-slate-600 dark:text-slate-400 text-sm">sv@apps.ipb.ac.id</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-200 dark:border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm text-center md:text-left">
            &copy; {new Date().getFullYear()} Program Studi Teknologi Rekayasa Perangkat Lunak - Sekolah Vokasi IPB.
          </p>
          <div className="flex items-center gap-4">
            {/* Social Icons Placeholder */}
            <a href="#" className="w-8 h-8 rounded-full bg-slate-200 dark:bg-white/5 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-colors text-slate-700 dark:text-white text-xs font-bold">IG</a>
            <a href="#" className="w-8 h-8 rounded-full bg-slate-200 dark:bg-white/5 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-colors text-slate-700 dark:text-white text-xs font-bold">TW</a>
            <a href="#" className="w-8 h-8 rounded-full bg-slate-200 dark:bg-white/5 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-colors text-slate-700 dark:text-white text-xs font-bold">IN</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
