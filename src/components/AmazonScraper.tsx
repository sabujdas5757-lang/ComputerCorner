import React, { useState, useEffect } from 'react';
import { Search, Loader2, Database, ExternalLink, Cpu, Zap, ShoppingCart, Info, AlertTriangle, ChevronRight, Check, X, Tag, Pocket } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { useProducts } from '../contexts/ProductContext';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, onSnapshot, query, serverTimestamp } from 'firebase/firestore';

export default function AmazonScraper() {
  const { addProduct } = useProducts();
  const [query_term, setQueryTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  
  // For adding to catalog
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const [addForm, setAddForm] = useState({
    category: '',
    brand: '',
    isHotSelling: false,
    showInHomeGrid: true
  });

  useEffect(() => {
    // Fetch categories and brands for the selector
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

  const handleScrape = async () => {
    if (!query_term.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setResults([]);
    setLogs([]);
    addLog(`Initiating Scrapy-node spider for: "${query_term}"`);
    addLog(`User-Agent rotation enabled...`);
    addLog(`Target: amazon.in`);

    try {
      addLog(`Requesting server-side proxy...`);
      const response = await fetch('/api/scrape-amazon-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query_term })
      });

      let data;
      const contentType = response.headers.get("content-type");
      
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error("Non-JSON response received:", text.substring(0, 500));
        
        if (text.includes("Starting Server") || text.includes("Please wait while your application starts")) {
          throw new Error("The backend server is currently initializing or warming up. This is normal during site updates. Please wait about 10-15 seconds and try again.");
        }
        
        if (text.includes("503") || text.includes("Service Temporarily Unavailable")) {
          throw new Error("The scraping infrastructure is temporarily overloaded. Please try again in 30 seconds.");
        }

        throw new Error("Received an unexpected response from the server. This can happen if the scraping request takes too long. Please try a simpler search term.");
      }

      if (!response.ok) {
        throw new Error(data.error || 'Scraping failed');
      }

      const found = data.results || [];
      setResults(found);
      addLog(`SUCCESS: Found ${found.length} items.`);
      if (found.length === 0) {
        addLog("WARNING: No results were found on the page.");
        setError("No products found for this term. Try a more specific search.");
      }
    } catch (err: any) {
      addLog(`CRITICAL ERROR: ${err.message}`);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const openAddModal = (product: any) => {
    setSelectedProduct(product);
    setShowAddModal(true);
    setSaveSuccess(null);
  };

  const handleAddToCatalog = async () => {
    if (!selectedProduct || !addForm.category || !addForm.brand) {
      alert("Please select both category and brand");
      return;
    }

    setSaveLoading(true);
    let fullDetails = null;

    try {
      addLog(`Fetching comprehensive details for ${selectedProduct.asin}...`);
      const response = await fetch('/api/scrape-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: selectedProduct.url })
      });
      
      if (response.ok) {
        fullDetails = await response.json();
        addLog(`SUCCESS: Extracted full specs, images & pricing.`);
      } else {
        const errData = await response.json().catch(() => ({}));
        addLog(`WARNING: Deep scrape failed (${errData?.error || 'Unknown'}). Using basic data.`);
      }
    } catch (err: any) {
      addLog(`WARNING: Deep scrape error: ${err.message}. Using basic data.`);
    }

    try {
      const finalPrice = fullDetails?.price || selectedProduct.price;
      const finalName = fullDetails?.name || selectedProduct.title;
      const finalBrand = (fullDetails?.brand && fullDetails.brand !== 'Unknown') ? fullDetails.brand : addForm.brand;
      const finalCategory = addForm.category;
      const finalDescription = fullDetails?.description || `Source: Amazon (ASIN: ${selectedProduct.asin})\nRating: ${selectedProduct.rating}\nReviews: ${selectedProduct.reviews}`;
      const finalImage = fullDetails?.image || selectedProduct.image;
      
      const newProduct = {
        name: finalName,
        brand: finalBrand,
        category: finalCategory,
        price: finalPrice,
        oldPrice: fullDetails?.oldPrice || '',
        discount: fullDetails?.discount || '',
        image: finalImage,
        additionalImages: fullDetails?.additionalImages || [],
        specifications: fullDetails?.specifications || {},
        description: finalDescription,
        isHotSelling: addForm.isHotSelling,
        showInHomeGrid: addForm.showInHomeGrid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await addProduct(newProduct);
      setSaveSuccess(selectedProduct.asin);
      addLog(`SUCCESS: Added "${finalName}" to catalog.`);
      
      setTimeout(() => {
        setShowAddModal(false);
        setSelectedProduct(null);
      }, 1500);
    } catch (err: any) {
      alert("Failed to save product: " + err.message);
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#00ff41] font-mono p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter flex items-center gap-2 text-white">
            <Cpu className="text-[#00ff41]" /> SCRAPY_DASHBOARD <span className="text-xs bg-[#00ff41] text-black px-2 py-0.5 rounded ml-2">v2.0_BETA</span>
          </h1>
          <p className="text-[#00ff41]/50 text-xs mt-1 uppercase tracking-widest">Advanced Amazon Data Extraction Interface</p>
        </div>
        <Link to="/admin" className="text-xs border border-[#00ff41]/30 px-4 py-2 hover:bg-[#00ff41]/10 transition-all">
          EXIT_TO_ADMIN_DASHBOARD
        </Link>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar: Control Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="border border-[#00ff41]/20 bg-[#0a0a0a] p-6 rounded-sm shadow-[0_0_20px_rgba(0,255,65,0.05)]">
            <h2 className="text-sm font-bold mb-4 flex items-center gap-2 border-b border-[#00ff41]/10 pb-2">
              <Zap size={14} /> SPIDER_CONTROLS
            </h2>
            <div className="space-y-4">
                <div>
                <label className="text-[10px] text-[#00ff41]/60 block mb-2 tracking-tighter uppercase">_target_query</label>
                <input 
                  type="text"
                  value={query_term}
                  onChange={(e) => setQueryTerm(e.target.value)}
                  placeholder="e.g. RTX 4080 Laptop"
                  onKeyDown={(e) => e.key === 'Enter' && handleScrape()}
                  className="w-full bg-black border border-[#00ff41]/30 rounded p-3 text-sm focus:border-[#00ff41] outline-none transition-all placeholder:opacity-20 text-[#00ff41]"
                />
              </div>
              <button 
                onClick={handleScrape}
                disabled={isLoading}
                className="w-full bg-[#00ff41] text-black py-4 font-black uppercase text-xs tracking-[0.2em] hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> RUNNING...
                  </>
                ) : (
                  <>
                    <Database size={16} /> INITIALIZE_SPIDER
                  </>
                )}
              </button>
            </div>

            <div className="mt-8 p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-sm italic">
                <p className="text-[10px] text-yellow-500 flex items-center gap-2">
                   <AlertTriangle size={12} /> NOTICE: Amazon uses advanced bot detection. Browsing might be throttled.
                </p>
            </div>
          </div>

          {/* Console Output */}
          <div className="border border-[#00ff41]/10 bg-[#0a0a0a] rounded-sm overflow-hidden h-80 flex flex-col">
            <div className="bg-[#00ff41]/10 px-4 py-2 text-[10px] border-b border-[#00ff41]/10 flex justify-between">
               <span>SYSTEM_LOGS</span>
               <span className="animate-pulse">ONLINE</span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-1 text-[10px] leading-tight">
               {logs.map((log, i) => (
                 <div key={i} className={log.includes('ERROR') ? 'text-red-500' : 'text-[#00ff41]/70'}>
                   {log}
                 </div>
               ))}
               {!logs.length && <div className="text-[#00ff41]/20">_AWAITING_INPUT...</div>}
            </div>
          </div>
        </div>

        {/* Main Content: Results Grid */}
        <div className="lg:col-span-3">
          <div className="border border-[#00ff41]/20 bg-[#0a0a0a] min-h-[600px] rounded-sm flex flex-col">
            <div className="p-4 border-b border-[#00ff41]/10 flex justify-between items-center bg-[#00ff41]/5">
              <h2 className="text-sm font-bold tracking-widest uppercase">_extracted_data_stream</h2>
              {results.length > 0 && (
                <span className="text-[10px] bg-[#00ff41] text-black px-2 py-0.5 rounded font-black">
                  {results.length} OBJECTS
                </span>
              )}
            </div>

            <div className="flex-1 p-6 overflow-y-auto">
               <AnimatePresence mode="popLayout">
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-8 border border-red-500/30 bg-red-500/5 text-red-500 text-center rounded-sm"
                  >
                    <AlertTriangle className="mx-auto mb-4 w-12 h-12 opacity-50" />
                    <h3 className="font-bold uppercase tracking-widest mb-2">Extraction_Failure</h3>
                    <p className="text-xs opacity-70 font-mono">{error}</p>
                    <button 
                       onClick={handleScrape}
                       className="mt-6 px-6 py-2 border border-red-500/50 hover:bg-red-500 text-[10px] font-bold transition-all hover:text-white"
                    >
                      RETRY_STREAMS
                    </button>
                  </motion.div>
                )}

                {!error && results.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {results.map((item, idx) => (
                      <motion.div 
                        key={idx}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        className="group border border-[#00ff41]/10 hover:border-[#00ff41] bg-black/40 p-4 transition-all"
                      >
                        <div className="aspect-square bg-white p-4 mb-4 relative overflow-hidden flex items-center justify-center">
                          <img 
                            src={item.image} 
                            alt="" 
                            className="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500" 
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute top-2 right-2 text-black text-[8px] font-black bg-[#00ff41] px-1">
                             ASIN: {item.asin}
                          </div>
                        </div>
                        <div className="space-y-3">
                           <h4 className="text-[11px] font-bold leading-tight line-clamp-2 h-8 group-hover:text-white transition-colors uppercase tracking-tight">{item.title}</h4>
                           <div className="flex justify-between items-end">
                              <div>
                                <p className="text-[9px] text-[#00ff41]/50 tracking-tighter mb-1 uppercase">{item.reviews || 'NO_REVIEWS'}</p>
                                <p className="text-lg font-black text-[#00ff41]">{item.price}</p>
                              </div>
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => openAddModal(item)}
                                  className="w-8 h-8 flex items-center justify-center border border-[#00ff41]/20 hover:bg-[#00ff41] hover:text-black transition-all"
                                  title="Add to Catalog"
                                >
                                  <Pocket size={14} />
                                </button>
                                <a 
                                  href={item.url} 
                                  target="_blank" 
                                  className="w-8 h-8 flex items-center justify-center border border-[#00ff41]/20 hover:bg-[#00ff41] hover:text-black transition-all"
                                  title="Open in Amazon"
                                >
                                  <ExternalLink size={14} />
                                </a>
                              </div>
                           </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {!isLoading && !error && results.length === 0 && (
                   <div className="h-full flex flex-col items-center justify-center opacity-20 py-20">
                      <Database size={64} className="mb-6 animate-pulse" />
                      <p className="text-sm tracking-[0.5em] font-black italic">AWAITING_INPUT</p>
                   </div>
                )}
               </AnimatePresence>
            </div>

            <div className="p-2 border-t border-[#00ff41]/10 bg-black flex justify-between px-6 text-[8px] text-[#00ff41]/30 uppercase tracking-[0.3em]">
               <span>SYS_NODE_SC_READY</span>
               <span>RT_SIGNAL_STRENGTH: 0.982ms</span>
            </div>
          </div>
        </div>
      </div>

      {/* Add to Catalog Modal */}
      <AnimatePresence>
        {showAddModal && selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0a0a0a] border border-[#00ff41]/30 w-full max-w-lg rounded-sm overflow-hidden shadow-[0_0_50px_rgba(0,255,65,0.1)]"
            >
              <div className="p-4 border-b border-[#00ff41]/10 flex justify-between items-center bg-[#00ff41]/5">
                <h3 className="text-sm font-bold tracking-widest flex items-center gap-2">
                  <Database size={14} /> CATALOG_INSERTION
                </h3>
                <button onClick={() => setShowAddModal(false)} className="hover:text-white">
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex gap-4 p-3 bg-black/50 border border-[#00ff41]/10">
                  <img src={selectedProduct.image} className="w-16 h-16 object-contain bg-white rounded-sm" alt="" />
                  <div>
                    <p className="text-[10px] font-bold text-white line-clamp-1">{selectedProduct.title}</p>
                    <p className="text-sm font-black text-[#00ff41] mt-1">{selectedProduct.price}</p>
                    <p className="text-[8px] opacity-50 mt-1 uppercase">ASIN: {selectedProduct.asin}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-tighter text-[#00ff41]/60">Select Category</label>
                    <select 
                      className="w-full bg-black border border-[#00ff41]/20 rounded p-2 text-xs focus:border-[#00ff41] outline-none"
                      value={addForm.category}
                      onChange={(e) => setAddForm(prev => ({ ...prev, category: e.target.value }))}
                    >
                      <option value="">-- Choose --</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-tighter text-[#00ff41]/60">Select Brand</label>
                    <select 
                      className="w-full bg-black border border-[#00ff41]/20 rounded p-2 text-xs focus:border-[#00ff41] outline-none"
                      value={addForm.brand}
                      onChange={(e) => setAddForm(prev => ({ ...prev, brand: e.target.value }))}
                    >
                      <option value="">-- Choose --</option>
                      {brands.map(brand => (
                        <option key={brand.id} value={brand.name}>{brand.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className={`w-4 h-4 border ${addForm.isHotSelling ? 'bg-[#00ff41] border-[#00ff41]' : 'border-[#00ff41]/30'} rounded-sm flex items-center justify-center transition-all`}>
                      {addForm.isHotSelling && <Check size={10} className="text-black" />}
                    </div>
                    <input 
                      type="checkbox" 
                      className="hidden" 
                      checked={addForm.isHotSelling}
                      onChange={(e) => setAddForm(prev => ({ ...prev, isHotSelling: e.target.checked }))}
                    />
                    <span className="text-[10px] uppercase tracking-widest select-none group-hover:text-white transition-colors">Hot Selling</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className={`w-4 h-4 border ${addForm.showInHomeGrid ? 'bg-[#00ff41] border-[#00ff41]' : 'border-[#00ff41]/30'} rounded-sm flex items-center justify-center transition-all`}>
                      {addForm.showInHomeGrid && <Check size={10} className="text-black" />}
                    </div>
                    <input 
                      type="checkbox" 
                      className="hidden" 
                      checked={addForm.showInHomeGrid}
                      onChange={(e) => setAddForm(prev => ({ ...prev, showInHomeGrid: e.target.checked }))}
                    />
                    <span className="text-[10px] uppercase tracking-widest select-none group-hover:text-white transition-colors">Home Grid</span>
                  </label>
                </div>

                <button 
                  onClick={handleAddToCatalog}
                  disabled={saveLoading || !addForm.category || !addForm.brand || saveSuccess !== null}
                  className="w-full bg-[#00ff41] text-black py-4 font-black uppercase text-xs tracking-[0.2em] hover:brightness-110 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 overflow-hidden relative"
                >
                  {saveLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> EXECUTING_INSERT...
                    </>
                  ) : saveSuccess ? (
                    <>
                      <Check size={16} /> INSERTION_COMPLETE
                    </>
                  ) : (
                    <>
                      <Tag size={16} /> CONFIRM_ADD_TO_CATALOG
                    </>
                  )}
                  {saveSuccess && (
                     <motion.div 
                        initial={{ left: '-100%' }}
                        animate={{ left: '100%' }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                        className="absolute h-full w-20 bg-white/30 skew-x-12"
                     />
                  )}
                </button>
              </div>

              <div className="p-2 border-t border-[#00ff41]/10 bg-black text-[8px] text-[#00ff41]/30 uppercase text-center tracking-[0.2em]">
                VERIFYING_SCHEMA_CONSISTENCY...
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
