import React, { useState, useEffect } from 'react';
import { Search, Loader2, Database, ShoppingCart, Info, AlertTriangle, X, Check, Globe, Zap, Pocket, Bug, Filter, Star, Tag, MousePointer2, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useProducts } from '../contexts/ProductContext';
import { db } from '../firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';

type Store = 'Flipkart' | 'Asus' | 'Amazon';
type Mode = 'link' | 'spider';

export default function StoreScraperPanel() {
  const { addProduct } = useProducts();
  const [mode, setMode] = useState<Mode>('link');
  const [productUrl, setProductUrl] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStore, setSelectedStore] = useState<Store>('Flipkart');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [scrapedData, setScrapedData] = useState<any | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const [addForm, setAddForm] = useState({
    category: '',
    brand: '',
    isHotSelling: false,
    showInHomeGrid: true
  });

  useEffect(() => {
    const qCats = query(collection(db, 'categories'));
    const unsubscribeCats = onSnapshot(qCats, (snapshot) => {
      setCategories(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const qBrands = query(collection(db, 'brands'));
    const unsubscribeBrands = onSnapshot(qBrands, (snapshot) => {
      setBrands(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubscribeCats();
      unsubscribeBrands();
    };
  }, []);

  const addLog = (msg: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 50));
  };

  const handleUrlFetch = async (targetUrl?: string) => {
    const url = targetUrl || productUrl;
    if (!url.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setScrapedData(null);
    addLog(`Initiating deep extraction for: ${url.substring(0, 40)}...`);

    try {
      const response = await fetch('/api/scrape-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Deep extraction failed');
      }

      const data = await response.json();
      setScrapedData({ ...data, sourceUrl: url });
      addLog(`SUCCESS: Extracted full metadata for "${data.name}"`);
      setShowConfirmModal(true);
      
      // Auto-prefill brand
      if (url.includes('asus.com')) {
        setAddForm(prev => ({ ...prev, brand: 'ASUS' }));
      } else if (data.brand && data.brand !== 'Unknown') {
        const matchedBrand = brands.find(b => b.name.toLowerCase() === data.brand.toLowerCase());
        if (matchedBrand) setAddForm(prev => ({ ...prev, brand: matchedBrand.name }));
      }

    } catch (err: any) {
      addLog(`EXTRACTION FAILED: ${err.message}`);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpiderSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsLoading(true);
    setError(null);
    setSearchResults([]);
    addLog(`Spider deploying to ${selectedStore} for "${searchQuery}"...`);

    try {
      const endpoint = selectedStore === 'Flipkart' 
        ? '/api/scrape-flipkart-search' 
        : selectedStore === 'Asus' 
          ? '/api/scrape-asus-search'
          : '/api/scrape-amazon-search';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery })
      });

      if (!response.ok) throw new Error("Search spider returned empty results");

      const data = await response.json();
      setSearchResults(data.results);
      addLog(`SPIDER RETURNED: ${data.results.length} potentials found.`);
      if (data.results.length === 0) setError("Spider found no matching results.");
    } catch (err: any) {
      addLog(`SPIDER ERROR: ${err.message}`);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCatalog = async () => {
    if (!scrapedData || !addForm.category || !addForm.brand) {
      alert("Please select both category and brand");
      return;
    }

    setSaveLoading(true);
    addLog("Commencing catalog ingestion...");

    try {
      let finalImageUrl = scrapedData.image;
      if (finalImageUrl && finalImageUrl.startsWith('http')) {
         try {
           const uploadRes = await fetch('/api/upload-from-url', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ url: finalImageUrl })
           });
           if (uploadRes.ok) {
             const uploadData = await uploadRes.json();
             if (uploadData.secure_url) finalImageUrl = uploadData.secure_url;
           }
         } catch (e) {
           console.warn("Image persistence failed, using direct link", e);
         }
      }
      
      const newProduct = {
        name: scrapedData.name || 'Unnamed Product',
        brand: String(addForm.brand || 'Unknown'),
        category: String(addForm.category || 'General'),
        price: String(scrapedData.price || '₹0'),
        oldPrice: String(scrapedData.oldPrice || ''),
        discount: String(scrapedData.discount || ''),
        image: String(finalImageUrl || ''),
        additionalImages: Array.isArray(scrapedData.additionalImages) ? scrapedData.additionalImages : [],
        specifications: scrapedData.specifications || {},
        description: String(scrapedData.description || `Source: ${scrapedData.sourceUrl}`),
        isHotSelling: Boolean(addForm.isHotSelling),
        showInHomeGrid: Boolean(addForm.showInHomeGrid),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await addProduct(newProduct);
      addLog(`DATABASE SYNC COMPLETE: "${scrapedData.name}" added.`);
      
      setTimeout(() => {
        setShowConfirmModal(false);
        setScrapedData(null);
        setProductUrl('');
      }, 1000);
    } catch (err: any) {
      alert("Sync Failed: " + err.message);
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 mb-8 overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
        <Bug size={140} />
      </div>

      <div className="relative z-10">
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-black flex items-center gap-4 italic uppercase tracking-tighter">
              <span className="p-3 bg-primary text-bg-dark rounded-2xl shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)]">
                <Globe size={28} />
              </span>
              Product Acquisition Hub
            </h2>
            <p className="text-gray-500 text-xs mt-2 uppercase tracking-[0.3em] font-bold">Flipkart & Asus Store Integrator</p>
          </div>

          <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5">
            <button 
              onClick={() => setMode('spider')}
              className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${mode === 'spider' ? 'bg-primary text-bg-dark shadow-lg' : 'text-gray-500 hover:text-white'}`}
            >
              <Bug size={14} /> Smart Spider
            </button>
            <button 
              onClick={() => setMode('link')}
              className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${mode === 'link' ? 'bg-primary text-bg-dark shadow-lg' : 'text-gray-500 hover:text-white'}`}
            >
              <Globe size={14} /> Direct URL
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <AnimatePresence mode="wait">
              {mode === 'spider' ? (
                <motion.div 
                  key="spider"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col md:flex-row gap-4">
                    <select 
                      className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:border-primary transition-all md:w-48 appearance-none"
                      value={selectedStore}
                      onChange={(e) => setSelectedStore(e.target.value as Store)}
                    >
                      <option value="Flipkart">Flipkart</option>
                      <option value="Asus">Asus Store</option>
                      <option value="Amazon">Amazon.in</option>
                    </select>
                    
                    <div className="flex-1 relative group">
                      <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-gray-500">
                        <Search size={20} />
                      </div>
                      <input 
                        type="text"
                        placeholder="Search for laptops, monitors, components..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSpiderSearch()}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-4 py-4 focus:border-primary outline-none transition-all placeholder:text-gray-700 text-sm font-medium"
                      />
                      <button 
                        onClick={handleSpiderSearch}
                        disabled={isLoading || !searchQuery.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-bg-dark px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white disabled:opacity-30 transition-all"
                      >
                        {isLoading ? 'Hunting...' : 'Launch Spider'}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 h-[400px] overflow-y-auto pr-2 no-scrollbar">
                    {searchResults.map((item, i) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        key={i} 
                        className="bg-black/60 border border-white/5 rounded-2xl p-4 flex flex-col gap-4 group hover:border-primary/50 transition-colors cursor-pointer"
                        onClick={() => handleUrlFetch(item.url)}
                      >
                        <div className="aspect-square bg-white rounded-xl p-4 flex items-center justify-center relative overflow-hidden">
                           <img src={item.image} className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform" alt="" />
                           <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <MousePointer2 className="text-bg-dark animate-pulse" />
                           </div>
                        </div>
                        <div className="space-y-2">
                           <p className="text-[10px] text-primary font-black uppercase tracking-widest">{item.store}</p>
                           <h4 className="text-xs font-bold leading-tight line-clamp-2">{item.title}</h4>
                           <div className="flex items-center justify-between mt-auto">
                              <p className="text-lg font-black tracking-tighter">{item.price}</p>
                              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-500">
                                <Plus size={16} />
                              </div>
                           </div>
                        </div>
                      </motion.div>
                    ))}
                    {!searchResults.length && !isLoading && (
                      <div className="col-span-full flex flex-col items-center justify-center text-gray-700 py-20 border-2 border-dashed border-white/5 rounded-3xl">
                         <Filter size={48} className="mb-4 opacity-20" />
                         <p className="text-xs font-bold uppercase tracking-[0.2em]">Spider idle. Waiting for target parameters...</p>
                      </div>
                    )}
                    {isLoading && (
                       <div className="col-span-full flex flex-col items-center justify-center py-20">
                          <Loader2 className="animate-spin text-primary mb-4" size={40} />
                          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary animate-pulse">Infiltrating Store Infrastructure...</p>
                       </div>
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="link"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-gray-500">
                      <Globe size={22} />
                    </div>
                    <input 
                      type="text"
                      placeholder="Paste Flipkart or Asus Shop URL directly..."
                      value={productUrl}
                      onChange={(e) => setProductUrl(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleUrlFetch()}
                      className="w-full bg-white/5 border border-white/10 rounded-[2rem] pl-14 pr-4 py-8 focus:border-primary outline-none transition-all placeholder:text-gray-700 text-lg font-medium shadow-inner"
                    />
                    <button 
                      onClick={() => handleUrlFetch()}
                      disabled={isLoading || !productUrl.trim()}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-primary text-bg-dark px-10 py-4 rounded-[1.5rem] font-black uppercase text-xs tracking-widest hover:bg-white disabled:opacity-30 transition-all shadow-xl"
                    >
                      {isLoading ? 'Decoding...' : 'Import Now'}
                    </button>
                  </div>
                  
                  <div className="p-8 bg-blue-500/5 border border-blue-500/10 rounded-3xl flex gap-6 items-start">
                    <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
                      <Zap size={24} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold mb-1">Deep Metadata Extraction</h4>
                      <p className="text-gray-500 text-xs leading-relaxed">
                        Our scraper will automatically fetch full descriptions, complete technical specifications, 
                        high-resolution images, and current market pricing. Simply paste the link and we'll do the rest.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-4 text-red-400 text-xs font-bold"
              >
                <AlertTriangle size={18} />
                {error}
              </motion.div>
            )}
          </div>

          <div className="lg:col-span-1">
             <div className="bg-black/60 border border-white/5 rounded-[2rem] p-6 h-full flex flex-col">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
                   <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                     <Database size={12} /> System Status
                   </h3>
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                </div>
                <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 font-mono text-[9px]">
                   {logs.map((log, i) => (
                     <div key={i} className={`pb-2 border-b border-white/[0.02] ${log.includes('SUCCESS') ? 'text-green-400' : log.includes('FAILED') ? 'text-red-400' : 'text-primary/60'}`}>
                       {log}
                     </div>
                   ))}
                   {!logs.length && <div className="text-gray-800 italic">Listening for network events...</div>}
                </div>
             </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showConfirmModal && scrapedData && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-bg-dark border border-white/10 w-full max-w-4xl max-h-[90vh] rounded-[3rem] overflow-hidden shadow-2xl flex flex-col"
            >
               <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5 shrink-0">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary text-bg-dark rounded-2xl">
                      <Pocket size={24} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black italic uppercase tracking-tighter">Acquisition Verified</h3>
                      <p className="text-gray-500 text-[10px] uppercase font-bold tracking-[0.3em] mt-1">Cross-Check parsed metadata before sync</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowConfirmModal(false)}
                    className="p-3 hover:bg-white/10 rounded-full transition-colors text-gray-500"
                  ><X size={24} /></button>
               </div>
               
               <div className="flex-1 overflow-y-auto p-12 no-scrollbar">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-4 space-y-6">
                      <div className="aspect-square bg-white rounded-[2rem] p-8 flex items-center justify-center shadow-2xl group relative overflow-hidden">
                        <img src={scrapedData.image} className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-700" alt="" />
                        <div className="absolute top-4 right-4 px-3 py-1 bg-primary text-bg-dark text-[10px] font-black uppercase tracking-widest rounded-lg">PRIMARY ASSET</div>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-2">
                        {scrapedData.additionalImages?.map((img: string, i: number) => (
                          <div key={i} className="aspect-square bg-white rounded-xl p-1 overflow-hidden">
                             <img src={img} className="w-full h-full object-contain" alt="" />
                          </div>
                        ))}
                      </div>

                      <div className="p-6 bg-black/40 rounded-3xl border border-white/5 space-y-4">
                        <div className="flex justify-between items-end">
                           <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Market Price</span>
                           <span className="text-primary font-black text-3xl tracking-tighter">{scrapedData.price}</span>
                        </div>
                        {scrapedData.oldPrice && (
                          <div className="flex justify-between items-center text-xs">
                             <span className="text-gray-600">Old Listing</span>
                             <span className="text-gray-500 line-through">{scrapedData.oldPrice}</span>
                          </div>
                        )}
                        {scrapedData.discount && (
                          <div className="pt-4 mt-4 border-t border-white/5 flex justify-between items-center">
                             <span className="text-[10px] text-green-400 font-bold uppercase tracking-widest">Saving Opportunity</span>
                             <span className="px-2 py-0.5 bg-green-500/10 text-green-400 text-[10px] font-bold rounded-lg">{scrapedData.discount}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="lg:col-span-8 space-y-10">
                      <div>
                        <h4 className="text-2xl font-black leading-tight mb-4 tracking-tight">{scrapedData.name}</h4>
                        <div className="flex flex-wrap gap-2">
                           <div className="px-4 py-1.5 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                             <Tag size={10} /> Brand: {scrapedData.brand || 'Auto-Detected'}
                           </div>
                           <div className="px-4 py-1.5 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                             <Globe size={10} /> Source: {scrapedData.sourceUrl?.includes('flipkart') ? 'Flipkart' : 'Asus'}
                           </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                           <label className="text-[10px] uppercase font-black text-gray-500 tracking-[0.3em] flex items-center gap-2">
                             <Filter size={12} /> Target Catalog
                           </label>
                           <select 
                             className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold focus:border-primary outline-none transition-all appearance-none"
                             value={addForm.category}
                             onChange={(e) => setAddForm(prev => ({ ...prev, category: e.target.value }))}
                           >
                              <option value="">Select Category</option>
                              {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                           </select>
                        </div>
                        <div className="space-y-3">
                           <label className="text-[10px] uppercase font-black text-gray-500 tracking-[0.3em] flex items-center gap-2">
                             <Database size={12} /> Entity Identity
                           </label>
                           <select 
                             className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold focus:border-primary outline-none transition-all appearance-none"
                             value={addForm.brand}
                             onChange={(e) => setAddForm(prev => ({ ...prev, brand: e.target.value }))}
                           >
                              <option value="">Select Brand</option>
                              {brands.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
                           </select>
                        </div>
                      </div>

                      <div className="flex gap-10 py-8 border-y border-white/5">
                        <label className="flex items-center gap-4 cursor-pointer group">
                           <div className={`w-12 h-7 rounded-full transition-all relative p-1 ${addForm.isHotSelling ? 'bg-primary' : 'bg-white/10'}`}>
                              <input 
                                type="checkbox" 
                                className="hidden" 
                                checked={addForm.isHotSelling}
                                onChange={(e) => setAddForm(prev => ({ ...prev, isHotSelling: e.target.checked }))}
                              />
                              <div className={`w-5 h-5 rounded-full bg-white transition-all shadow-xl ${addForm.isHotSelling ? 'translate-x-5' : 'translate-x-0'}`} />
                           </div>
                           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 group-hover:text-white transition-colors">Hot Velocity Item</span>
                        </label>

                        <label className="flex items-center gap-4 cursor-pointer group">
                           <div className={`w-12 h-7 rounded-full transition-all relative p-1 ${addForm.showInHomeGrid ? 'bg-primary' : 'bg-white/10'}`}>
                              <input 
                                type="checkbox" 
                                className="hidden" 
                                checked={addForm.showInHomeGrid}
                                onChange={(e) => setAddForm(prev => ({ ...prev, showInHomeGrid: e.target.checked }))}
                              />
                              <div className={`w-5 h-5 rounded-full bg-white transition-all shadow-xl ${addForm.showInHomeGrid ? 'translate-x-5' : 'translate-x-0'}`} />
                           </div>
                           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 group-hover:text-white transition-colors">Showcase on Nexus</span>
                        </label>
                      </div>

                      <div className="space-y-4">
                        <h5 className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                          <Info size={12} /> Technical Specifications
                        </h5>
                        <div className="h-48 overflow-y-auto no-scrollbar grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 pr-4">
                           {Object.entries(scrapedData.specifications || {}).map(([key, val], idx) => (
                             <div key={idx} className="flex flex-col pb-2 border-b border-white/[0.03]">
                                <span className="text-[8px] uppercase font-bold text-gray-600 mb-1">{key}</span>
                                <span className="text-[10px] font-medium text-gray-300 line-clamp-1">{String(val)}</span>
                             </div>
                           ))}
                           {Object.keys(scrapedData.specifications || {}).length === 0 && <p className="text-gray-700 italic text-xs">No specifications detected.</p>}
                        </div>
                      </div>
                    </div>
                  </div>
               </div>

               <div className="p-8 bg-black/40 border-t border-white/5 flex gap-4 shrink-0">
                  <button 
                    onClick={() => setShowConfirmModal(false)}
                    className="flex-1 px-8 py-5 rounded-2xl font-black uppercase text-xs tracking-widest border border-white/5 hover:bg-white/5 transition-all text-gray-400"
                  >
                    Discard Changes
                  </button>
                  <button 
                     onClick={handleAddToCatalog}
                     disabled={saveLoading || !addForm.category || !addForm.brand}
                     className="flex-[2] bg-primary text-bg-dark py-5 rounded-2xl font-black uppercase text-xs tracking-[0.3em] hover:bg-white transition-all disabled:opacity-30 flex items-center justify-center gap-4 shadow-[0_15px_30px_rgba(var(--primary-rgb),0.3)]"
                   >
                     {saveLoading ? <Loader2 className="animate-spin" /> : <Database size={20} />}
                     {saveLoading ? 'Synchronizing State...' : 'Commit to Database'}
                   </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
