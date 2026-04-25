"use client";

import { useState, useEffect, useMemo } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, deleteDoc, doc, updateDoc, where } from "firebase/firestore";
import { onAuthStateChanged, signOut, User, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { Package, ShoppingBasket, Trash2, Plus, Minus, AlertTriangle, LogOut, ChefHat, Sparkles, TrendingUp, ShoppingCart, ListChecks, Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES = ["Hepsi", "Buzdolabı", "Kiler", "Dondurucu", "Diğer"];

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("Adet");
  const [category, setCategory] = useState("Buzdolabı");
  const [expiryDate, setExpiryDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState<any[]>([]);
  const [isRecipeLoading, setIsRecipeLoading] = useState(false);
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);
  const [recipe, setRecipe] = useState("");
  const [filterMode, setFilterMode] = useState<"all" | "expired">("all");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setItems([]);
      return;
    }
    const q = query(collection(db, "items"), where("userId", "==", user.uid), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => {
      setItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, [user]);

  const stats = useMemo(() => {
    const totalCount = items.filter(i => i.quantity > 0).length;
    const expiredCount = items.filter(i => {
      if (!i.expiryDate) return false;
      const today = new Date();
      today.setHours(0,0,0,0);
      return new Date(i.expiryDate) <= today && i.quantity > 0;
    }).length;
    return { totalCount, expiredCount };
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [items, searchTerm]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      isRegistering ? await createUserWithEmailAndPassword(auth, email, password) : await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) { alert(error.message); }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !quantity || !user) return;
    let finalDate = expiryDate;
    if (!finalDate) {
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 7);
      finalDate = defaultDate.toISOString().split('T')[0];
    }
    try {
      await addDoc(collection(db, "items"), {
        name, quantity: Number(quantity), unit, category, expiryDate: finalDate, userId: user.uid, createdAt: serverTimestamp()
      });
      setName(""); setQuantity(""); setExpiryDate("");
    } catch (error) { console.error(error); }
  };

  const exportToExcel = () => {
    const headers = ["Urun Adi", "Kategori", "Miktar", "Birim", "SKT", "Durum"];
    const rows = items.map(item => {
      const isExpired = item.expiryDate && new Date(item.expiryDate) < new Date();
      return [item.name, item.category, item.quantity, item.unit, item.expiryDate || "Belirtilmemis", isExpired ? "Suresi Gecmis" : "Taze"];
    });
    const csvContent = [headers.join(";"), ...rows.map(row => row.join(";"))].join("\n");
    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const date = new Date().toLocaleDateString('tr-TR').replace(/\./g, '_');
    link.setAttribute("href", url);
    link.setAttribute("download", `PrepMaster_Rapor_${date}.csv`);
    link.click();
  };

  const suggestRecipe = async () => {
    const available = items.filter(i => i.quantity > 0).map(i => i.name).join(", ");
    if (!available) { alert("Mutfak boş kanka!"); return; }
    setIsRecipeLoading(true);
    try {
      const response = await fetch("/api/recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients: available }),
      });
      const data = await response.json();
      if (data.recipe) { setRecipe(data.recipe); setIsRecipeModalOpen(true); }
    } catch (error: any) { alert("Hata: " + error.message); } finally { setIsRecipeLoading(false); }
  };

  if (loading) return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-blue-500 font-black italic">PREPMASTER YÜKLENİYOR...</div>;

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#020617] p-6 relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[radial-gradient(circle_at_50%_-20%,#3b82f6,transparent_50%)]"></div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md bg-slate-900/50 backdrop-blur-2xl p-10 rounded-[3rem] border border-slate-800 z-10">
          <div className="flex flex-col items-center mb-10 text-white text-center">
            <div className="bg-blue-600 p-4 rounded-3xl mb-4"><ShoppingBasket className="w-10 h-10" /></div>
            <h1 className="text-4xl font-black italic tracking-tighter">PrepMaster</h1>
            <p className="text-slate-500 text-sm mt-2 font-medium uppercase tracking-widest">Akıllı Mutfak Yönetimi</p>
          </div>
          <form onSubmit={handleAuth} className="space-y-4 text-white">
            <input type="email" placeholder="E-posta" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-4 bg-slate-800/50 border border-slate-700 rounded-2xl outline-none" />
            <input type="password" placeholder="Şifre" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-4 bg-slate-800/50 border border-slate-700 rounded-2xl outline-none" />
            <button className="w-full bg-blue-600 text-white p-4 rounded-2xl font-bold">{isRegistering ? "Kayıt Ol" : "Giriş Yap"}</button>
          </form>
          <button onClick={() => setIsRegistering(!isRegistering)} className="w-full mt-8 text-xs text-slate-500 hover:text-white transition-colors">{isRegistering ? "Giriş yap" : "Kayıt ol"}</button>
        </motion.div>
      </main>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-[#020617] text-slate-200 pb-20 relative px-4 md:px-0 font-sans">
        <div className="absolute top-0 left-0 w-full h-96 opacity-30 pointer-events-none bg-[radial-gradient(circle_at_50%_-20%,#3b82f6,transparent_70%)]"></div>
        
        <nav className="sticky top-0 z-40 bg-slate-950/70 backdrop-blur-xl border-b border-slate-800/50 px-6 py-4">
          <div className="max-w-5xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-xl shadow-lg"><ChefHat className="text-white" size={20} /></div>
              <span className="font-black text-2xl tracking-tighter text-white italic">PrepMaster</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={exportToExcel} className="bg-emerald-600/10 border border-emerald-500/20 text-emerald-500 hover:bg-emerald-600 hover:text-white p-2 px-4 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest"><TrendingUp size={14} className="inline mr-1"/> Rapor</button>
              <button onClick={() => signOut(auth)} className="bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-400 p-2 px-4 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest"><LogOut size={14} className="inline mr-1"/> Çıkış</button>
            </div>
          </div>
        </nav>

        <div className="max-w-5xl mx-auto mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="grid grid-cols-2 gap-3">
              <div onClick={() => setFilterMode("all")} className={`cursor-pointer transition-all bg-slate-900/50 p-4 rounded-[2rem] border ${filterMode === "all" ? "border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)]" : "border-slate-800/50"}`}>
                <TrendingUp className="text-blue-500 mb-2" size={20} />
                <div className="text-3xl font-black text-white">{stats.totalCount}</div>
                <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">TÜMÜ</div>
              </div>
              <div onClick={() => setFilterMode("expired")} className={`cursor-pointer transition-all bg-slate-900/50 p-4 rounded-[2rem] border ${filterMode === "expired" ? "border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]" : "border-slate-800/50"}`}>
                <AlertTriangle className="text-red-500 mb-2" size={20} />
                <div className="text-3xl font-black text-white">{stats.expiredCount}</div>
                <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">BOZULANLAR</div>
              </div>
            </div>

            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={suggestRecipe} disabled={isRecipeLoading} className="w-full bg-gradient-to-br from-blue-600 to-indigo-700 p-5 rounded-[2rem] font-black text-xs tracking-widest flex items-center justify-center gap-3 shadow-2xl uppercase disabled:opacity-50">
              <Sparkles size={18} /> {isRecipeLoading ? "PİŞİRİLİYOR..." : "NE PİŞİRSEM?"}
            </motion.button>

            <section className="bg-slate-900/40 backdrop-blur-md p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl">
              <h2 className="text-[10px] font-black mb-6 text-blue-500 uppercase tracking-widest text-center underline italic">HIZLI VERİ GİRİŞİ</h2>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <input type="text" placeholder="Ürün adı..." value={name} onChange={(e) => setName(e.target.value)} className="w-full p-4 bg-slate-950/50 border border-slate-800 rounded-2xl text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                <div className="flex gap-2 text-white">
                  <input type="number" placeholder="Mik." value={quantity} onChange={(e) => setQuantity(e.target.value)} className="w-24 p-4 bg-slate-950/50 border border-slate-800 rounded-2xl outline-none" />
                  <select value={unit} onChange={(e) => setUnit(e.target.value)} className="flex-1 p-4 bg-slate-950/50 border border-slate-800 rounded-2xl outline-none">
                    <option className="bg-slate-900">Adet</option><option className="bg-slate-900">Kg</option><option className="bg-slate-900">Litre</option>
                  </select>
                </div>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-4 bg-slate-950/50 border border-slate-800 rounded-2xl text-white outline-none">
                  {CATEGORIES.slice(1).map(cat => <option key={cat} value={cat} className="bg-slate-900">{cat}</option>)}
                </select>
                <input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} className="w-full p-4 bg-slate-950/50 border border-slate-800 rounded-2xl text-white text-xs outline-none [&::-webkit-calendar-picker-indicator]:invert" />
                <button className="w-full bg-white text-black p-4 rounded-2xl font-black text-[10px] uppercase hover:bg-blue-600 hover:text-white transition-all tracking-widest">Envantere Ekle</button>
              </form>
            </section>
          </div>

          <div className="lg:col-span-2 space-y-12">
            {filterMode === "all" && (
              <section>
                <h2 className="text-xl font-black flex items-center gap-3 text-white mb-6 uppercase italic tracking-tighter"><ShoppingCart className="text-red-500" /> ALIŞVERİŞ LİSTESİ</h2>
                <div className="grid gap-3">
                  <AnimatePresence mode="popLayout">
                    {filteredItems.filter(i => i.quantity === 0).map(item => (
                      <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key={item.id} className="bg-red-500/[0.03] border border-red-900/10 p-5 rounded-[2rem] flex justify-between items-center group">
                        <div className="flex items-center gap-4 text-white">
                          <div className="p-3 bg-red-500/10 rounded-2xl text-red-400"><AlertTriangle size={20} /></div>
                          <span className="font-bold italic line-through uppercase text-slate-500 tracking-tight">{item.name}</span>
                        </div>
                        <button onClick={() => updateDoc(doc(db, "items", item.id), { quantity: 1 })} className="bg-emerald-500/10 text-emerald-500 p-2 px-5 rounded-2xl text-[10px] font-black uppercase border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all tracking-widest">Alındı</button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </section>
            )}

            <section>
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <h2 className="text-xl font-black flex items-center gap-3 text-white uppercase italic tracking-tighter"><ListChecks className="text-blue-500" /> ENVANTER</h2>
                <div className="relative w-full md:w-64 group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                  <input type="text" placeholder="Ürün ara..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full p-3 pl-12 bg-slate-900/50 border border-slate-800 rounded-2xl text-xs text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-600" />
                </div>
              </div>
              <div className="grid gap-4">
                <AnimatePresence mode="popLayout">
                  {filteredItems
                    .filter(i => {
                      const hasStock = i.quantity > 0;
                      if (filterMode === "expired") {
                        const today = new Date(); today.setHours(0,0,0,0);
                        const isExp = i.expiryDate && new Date(i.expiryDate) <= today;
                        return hasStock && isExp;
                      }
                      return hasStock;
                    })
                    .map((item) => {
                      const today = new Date(); today.setHours(0,0,0,0);
                      const expDate = new Date(item.expiryDate); expDate.setHours(0,0,0,0);
                      const diffDays = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                      
                      const isExpired = diffDays <= 0;
                      const isLowStock = item.quantity < 2;
                      const freshnessPercent = Math.max(0, Math.min(100, (diffDays / 30) * 100));
                      const barColor = isExpired ? "bg-red-500 shadow-[0_0_8px_#ef4444]" : diffDays < 7 ? "bg-orange-500 shadow-[0_0_8px_#f97316]" : "bg-emerald-500 shadow-[0_0_8px_#10b981]";

                      return (
                        <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key={item.id} className={`p-6 rounded-[2.5rem] bg-slate-900/30 border flex flex-col gap-4 group transition-all ${isLowStock ? "border-orange-500/40 animate-pulse shadow-[0_0_15px_rgba(249,115,22,0.1)]" : "border-slate-800/50"}`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-5">
                              <div className={`p-4 rounded-3xl transition-all ${isLowStock ? "bg-orange-500/20 text-orange-500 shadow-inner" : "bg-blue-500/10 text-blue-500"}`}><Package size={28} /></div>
                              <div>
                                <h3 className={`font-black text-lg uppercase tracking-tighter transition-colors ${isExpired ? "text-red-500" : "text-white"}`}>{item.name} {isLowStock && <span className="text-[10px] text-orange-500 ml-2 italic">! AZALDI</span>}</h3>
                                <div className="flex items-center gap-3 mt-1 uppercase text-[9px] font-black">
                                  <span className="text-blue-500/60 tracking-widest">{item.category}</span>
                                  <span className={`transition-all px-2 py-0.5 rounded-md ${isExpired ? "bg-red-500/20 text-red-500 border border-red-500/50 shadow-sm" : "text-slate-500"}`}>{item.expiryDate ? `SKT: ${item.expiryDate}` : "SÜRESİZ"}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-6">
                              <div className="flex items-center bg-black/40 rounded-2xl border border-slate-800/50 p-1">
                                <button onClick={() => updateDoc(doc(db, "items", item.id), { quantity: Math.max(0, item.quantity - 1) })} className="p-2.5 text-slate-600 hover:text-red-400 transition-colors"><Minus size={14}/></button>
                                <span className="px-4 font-black text-white text-sm min-w-[50px] text-center">{item.quantity} <span className="text-[9px] opacity-30 lowercase">{item.unit}</span></span>
                                <button onClick={() => updateDoc(doc(db, "items", item.id), { quantity: item.quantity + 1 })} className="p-2.5 text-slate-600 hover:text-emerald-400 transition-colors"><Plus size={14}/></button>
                              </div>
                              <button onClick={() => deleteDoc(doc(db, "items", item.id))} className="p-3 text-slate-800 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"><Trash2 size={18} /></button>
                            </div>
                          </div>
                          <div className="w-full h-1 bg-slate-800/50 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${freshnessPercent}%` }} className={`h-full ${barColor} transition-all duration-1000`} />
                          </div>
                        </motion.div>
                      );
                    })}
                </AnimatePresence>
              </div>
            </section>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {isRecipeModalOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4">
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="bg-[#1a1c2e] border border-white/20 p-8 rounded-[3rem] max-w-xl w-full shadow-[0_0_80px_rgba(0,0,0,0.6)] flex flex-col gap-6 relative">
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter flex items-center gap-2">👨‍🍳 Şefin Tarifi</h2>
                <button onClick={() => setIsRecipeModalOpen(false)} className="bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white p-2 rounded-xl transition-all"><X size={24} /></button>
              </div>
              <div className="text-gray-200 text-lg leading-relaxed whitespace-pre-wrap overflow-y-auto max-h-[50vh] pr-4 custom-scrollbar font-medium">{recipe}</div>
              <button onClick={() => setIsRecipeModalOpen(false)} className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-widest active:scale-95 transition-all shadow-xl shadow-blue-900/40">Eyvallah Şefim!</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}