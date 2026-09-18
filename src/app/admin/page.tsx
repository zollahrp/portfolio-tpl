"use client";

import { useState, useEffect } from "react";
import { signInWithPopup, signOut, User } from "firebase/auth";
import { collection, getDocs, doc, updateDoc, deleteDoc, query, where } from "firebase/firestore";
import { auth, googleProvider, db } from "@/lib/firebase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { Eye, Check, X, Edit, Trash2, Link as LinkIcon, GitBranch, Tag, ArrowLeft } from "lucide-react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{'list': 'ordered'}, {'list': 'bullet'}],
    ['link', 'clean']
  ],
};

const ADMIN_EMAIL = "zollahrp@gmail.com";

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  
  const [pendingPortfolios, setPendingPortfolios] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // Modal States
  const [selectedPortfolio, setSelectedPortfolio] = useState<any | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Edit Form States
  const [editData, setEditData] = useState<any>({});
  const [editTagInput, setEditTagInput] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoadingAuth(false);
      
      if (currentUser?.email === ADMIN_EMAIL) {
        fetchPending();
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchPending = async () => {
    setLoadingData(true);
    try {
      const q = query(collection(db, "portfolios"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPendingPortfolios(data);
    } catch (error) {
      console.error("Error fetching pending portfolios:", error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleApprove = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      await updateDoc(doc(db, "portfolios", id), { status: "approved" });
      setPendingPortfolios(prev => prev.filter(p => p.id !== id));
      if (selectedPortfolio?.id === id) closeModal();
    } catch (error) {
      console.error("Error approving:", error);
    }
  };

  const handleDelete = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!window.confirm("Yakin ingin menghapus portofolio ini secara permanen?")) return;
    try {
      await deleteDoc(doc(db, "portfolios", id));
      setPendingPortfolios(prev => prev.filter(p => p.id !== id));
      if (selectedPortfolio?.id === id) closeModal();
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  const openPreview = (portfolio: any) => {
    setSelectedPortfolio(portfolio);
    setIsEditing(false);
  };

  const openEdit = () => {
    setEditData({ ...selectedPortfolio });
    setIsEditing(true);
  };

  const closeModal = () => {
    setSelectedPortfolio(null);
    setIsEditing(false);
  };

  const handleEditChange = (e: any) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTag = editTagInput.trim().replace(",", "");
      if (newTag && !editData.tags.includes(newTag)) {
        setEditData({ ...editData, tags: [...editData.tags, newTag] });
      }
      setEditTagInput("");
    } else if (e.key === "Backspace" && editTagInput === "" && editData.tags.length > 0) {
      setEditData({ ...editData, tags: editData.tags.slice(0, -1) });
    }
  };

  const handleSaveEdit = async () => {
    try {
      await updateDoc(doc(db, "portfolios", editData.id), {
        title: editData.title,
        category: editData.category,
        description: editData.description,
        content: editData.content,
        tags: editData.tags,
        githubUrl: editData.githubUrl,
        liveUrl: editData.liveUrl,
        angkatan: editData.angkatan || "",
        contact: editData.contact || "",
        date: editData.date || new Date().toISOString().split("T")[0]
      });
      // Update local state
      setPendingPortfolios(prev => prev.map(p => p.id === editData.id ? editData : p));
      setSelectedPortfolio(editData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving edits:", error);
      alert("Gagal menyimpan perubahan.");
    }
  };

  if (loadingAuth) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-[#020617] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-white flex flex-col">
        <Navbar />
        <section className="flex-grow flex items-center justify-center p-6 mt-20">
          <div className="glass-card p-10 rounded-3xl max-w-md w-full text-center shadow-xl">
            <h1 className="text-2xl font-bold mb-2">Akses Admin</h1>
            <p className="text-slate-500 mb-8">Silakan masuk dengan akun Google Anda untuk melanjutkan.</p>
            <button 
              onClick={handleLogin}
              className="w-full bg-white dark:bg-slate-800 text-slate-800 dark:text-white border border-slate-300 dark:border-slate-700 font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Login dengan Google
            </button>
          </div>
        </section>
      </main>
    );
  }

  if (user.email !== ADMIN_EMAIL) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-white flex flex-col">
        <Navbar />
        <section className="flex-grow flex items-center justify-center p-6 mt-20">
          <div className="glass-card p-10 rounded-3xl max-w-md w-full text-center shadow-xl">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-2">Akses Ditolak</h1>
            <p className="text-slate-500 mb-6">Akun <b>{user.email}</b> tidak memiliki hak akses Super Admin.</p>
            <button onClick={handleLogout} className="text-primary-600 font-medium hover:underline">
              Ganti Akun
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-white flex flex-col relative">
      <Navbar />
      
      <section className="pt-32 pb-16 flex-grow container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Kelola Karya</h1>
            <p className="text-slate-500">Selamat datang, Admin ({user.email})</p>
          </div>
          <button 
            onClick={handleLogout}
            className="px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-medium text-sm shadow-sm"
          >
            Keluar
          </button>
        </div>

        {loadingData ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          </div>
        ) : pendingPortfolios.length === 0 ? (
          <div className="glass-card p-12 text-center rounded-3xl border border-slate-200 dark:border-slate-800">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold mb-2">Karya Kosong</h3>
            <p className="text-slate-500">Belum ada portofolio yang diunggah saat ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingPortfolios.map((portfolio) => (
              <div 
                key={portfolio.id} 
                className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300 flex flex-col"
              >
                <div className="relative aspect-video w-full bg-slate-100 dark:bg-slate-800 overflow-hidden cursor-pointer" onClick={() => openPreview(portfolio)}>
                  {portfolio.imageUrl ? (
                    <Image src={portfolio.imageUrl} alt={portfolio.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <span className="text-white text-sm font-medium flex items-center gap-1"><Eye className="w-4 h-4" /> Lihat Detail</span>
                  </div>
                  <div className="absolute top-3 left-3 bg-orange-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                    {portfolio.status}
                  </div>
                </div>
                
                <div className="p-5 flex-grow flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold leading-tight cursor-pointer hover:text-primary-600 transition-colors" onClick={() => openPreview(portfolio)}>
                      {portfolio.title}
                    </h3>
                  </div>
                  <p className="text-xs text-primary-600 dark:text-primary-400 font-medium mb-3">{portfolio.category}</p>
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2">{portfolio.description}</p>
                  
                  <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); openPreview(portfolio); openEdit(); }}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 py-2.5 rounded-xl font-medium transition-colors text-sm flex items-center justify-center gap-2"
                    >
                      <Edit className="w-4 h-4" /> Edit
                    </button>
                    <button 
                      onClick={(e) => handleDelete(portfolio.id, e)}
                      className="flex-1 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 py-2.5 rounded-xl font-medium transition-colors text-sm flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" /> Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Preview / Edit Modal */}
      {selectedPortfolio && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col anim-fade-up">
            
            {/* Header Modal */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/50">
              <h2 className="text-lg font-bold flex items-center gap-2">
                {isEditing ? (
                  <><Edit className="w-5 h-5 text-primary-500" /> Mode Edit Karya</>
                ) : (
                  <><Eye className="w-5 h-5 text-primary-500" /> Pratinjau Karya</>
                )}
              </h2>
              <button onClick={closeModal} className="p-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-full transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body Modal */}
            <div className="p-6 overflow-y-auto flex-grow custom-scrollbar">
              {isEditing ? (
                // --- EDIT MODE ---
                <div className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase">Judul</label>
                      <input 
                        type="text" name="title" value={editData.title} onChange={handleEditChange} 
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-primary-500/50 outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase">Kategori</label>
                      <select 
                        name="category" value={editData.category} onChange={handleEditChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-primary-500/50 outline-none"
                      >
                        <option value="Web">Web Development</option>
                        <option value="Aplikasi">Aplikasi</option>
                        <option value="Prestasi">Prestasi & Kompetisi</option>
                        <option value="Student Exchange">Student Exchange</option>
                        <option value="Desain UI/UX">Desain UI/UX</option>
                        <option value="Ebook">Ebook</option>
                        <option value="Desain Grafis">Desain Grafis</option>
                        <option value="Motion Grafis">Motion Grafis</option>
                        <option value="Videography">Videography</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Deskripsi Singkat</label>
                    <textarea 
                      name="description" rows={2} value={editData.description} onChange={handleEditChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-primary-500/50 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase">Tanggal Pembuatan</label>
                      <input 
                        type="date" name="date" value={editData.date || ""} onChange={handleEditChange} 
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-primary-500/50 outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase">Angkatan</label>
                      <input 
                        type="text" name="angkatan" value={editData.angkatan || ""} onChange={handleEditChange} 
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-primary-500/50 outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Kontak</label>
                    <input 
                      type="text" name="contact" value={editData.contact || ""} onChange={handleEditChange} 
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-primary-500/50 outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Cerita Proyek (Konten)</label>
                    <div className="react-quill-container border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 overflow-hidden">
                      <ReactQuill 
                        theme="snow" value={editData.content} modules={quillModules}
                        onChange={(value) => setEditData({ ...editData, content: value })}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Tags</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {editData.tags.map((t: string, i: number) => (
                        <div key={i} className="flex items-center gap-1 bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 px-3 py-1 rounded-full text-xs font-medium">
                          {t}
                          <button type="button" onClick={() => setEditData({...editData, tags: editData.tags.filter((_: any, idx: number) => idx !== i)})}><X className="w-3 h-3 hover:text-rose-500" /></button>
                        </div>
                      ))}
                    </div>
                    <input 
                      type="text" value={editTagInput} onChange={(e) => setEditTagInput(e.target.value)} onKeyDown={handleTagKeyDown}
                      placeholder="Ketik tag lalu tekan Enter"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-primary-500/50 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase">Live URL</label>
                      <input 
                        type="text" name="liveUrl" value={editData.liveUrl || ""} onChange={handleEditChange} 
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-primary-500/50 outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase">GitHub URL</label>
                      <input 
                        type="text" name="githubUrl" value={editData.githubUrl || ""} onChange={handleEditChange} 
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-primary-500/50 outline-none"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                // --- PREVIEW MODE ---
                <div className="flex flex-col gap-6">
                  {/* Thumbnail & Links */}
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-1/2">
                      <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800">
                        {selectedPortfolio.imageUrl && <Image src={selectedPortfolio.imageUrl} alt="Thumbnail" fill className="object-cover" />}
                      </div>
                    </div>
                    <div className="w-full md:w-1/2 flex flex-col gap-4">
                      <div>
                        <span className="bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2 inline-block">
                          {selectedPortfolio.category}
                        </span>
                        <h1 className="text-2xl font-black">{selectedPortfolio.title}</h1>
                        <p className="text-sm text-slate-500 mt-2">{selectedPortfolio.description}</p>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedPortfolio.tags.map((tag: string, idx: number) => (
                          <span key={idx} className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-md text-xs">
                            <Tag className="w-3 h-3" /> {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex gap-3 mt-2">
                        {selectedPortfolio.liveUrl && (
                          <a href={selectedPortfolio.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs font-medium text-white bg-slate-900 dark:bg-white dark:text-slate-900 px-3 py-1.5 rounded-lg hover:opacity-80 transition-opacity">
                            <LinkIcon className="w-3.5 h-3.5" /> Visit Site
                          </a>
                        )}
                        {selectedPortfolio.githubUrl && (
                          <a href={selectedPortfolio.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs font-medium text-slate-700 bg-slate-200 dark:bg-slate-800 dark:text-slate-300 px-3 py-1.5 rounded-lg hover:opacity-80 transition-opacity">
                            <GitBranch className="w-3.5 h-3.5" /> Repository
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Gallery */}
                  {selectedPortfolio.gallery && selectedPortfolio.gallery.length > 0 && (
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Galeri Proyek</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {selectedPortfolio.gallery.map((gImg: string, idx: number) => (
                          <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800">
                            <Image src={gImg} alt="Gallery item" fill className="object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  {selectedPortfolio.content && selectedPortfolio.content.trim() !== "" && (
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3 border-b border-slate-200 dark:border-slate-800 pb-2">Dokumentasi & Cerita Proyek</h4>
                      <div 
                        className="prose prose-sm dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800"
                        dangerouslySetInnerHTML={{ __html: selectedPortfolio.content }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer Modal */}
            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/50">
              {isEditing ? (
                <>
                  <button onClick={() => setIsEditing(false)} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Batal Edit
                  </button>
                  <button onClick={handleSaveEdit} className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium text-sm transition-colors shadow-lg shadow-primary-500/20 flex items-center gap-2">
                    <Check className="w-4 h-4" /> Simpan Perubahan
                  </button>
                </>
              ) : (
                <>
                  <button onClick={openEdit} className="flex items-center gap-2 px-4 py-2.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-medium text-sm transition-colors">
                    <Edit className="w-4 h-4" /> Edit Data
                  </button>
                  <div className="flex gap-2">
                    <button onClick={(e) => handleDelete(selectedPortfolio.id, e)} className="px-4 py-2.5 bg-rose-100 hover:bg-rose-200 dark:bg-rose-900/30 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-400 rounded-xl font-medium text-sm transition-colors flex items-center gap-2">
                      <Trash2 className="w-4 h-4" /> Hapus
                    </button>
                  </div>
                </>
              )}
            </div>
            
          </div>
        </div>
      )}
      <Footer />
    </main>
  );
}
