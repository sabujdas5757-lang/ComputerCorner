import React, { useState, useEffect, useMemo } from 'react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, doc, onSnapshot, setDoc, getDocs, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { ArrowLeft, Plus, Save, Trash2, Edit2, Search, CheckSquare, Square } from 'lucide-react';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { useProducts } from '../contexts/ProductContext';

const AVAILABLE_ICONS = [
  'GraduationCap', 'Briefcase', 'Gamepad2', 'Video', 'Apple', 
  'MonitorPlay', 'Palette', 'Star', 'Sparkles', 'Wallet', 'Crown', 
  'Laptop', 'Headphones', 'Camera', 'Speaker', 'Smartphone', 'Cpu', 'Keyboard', 'Mouse',
  'Wifi', 'Server', 'Database', 'Printer', 'Watch'
];

type UsageCard = {
  id: string; // The usage id like 'student'
  title: string;
  sub: string;
  iconName: string;
  color: string;
  iconColor: string;
  iconBg: string;
  circle: string;
};

export default function AdminUsageHub() {
  const { products, updateProduct } = useProducts();
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [cards, setCards] = useState<UsageCard[]>([]);
  const [editingCard, setEditingCard] = useState<UsageCard | null>(null);
  const [managingCardId, setManagingCardId] = useState<string | null>(null);
  const [productSearch, setProductSearch] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [deletingCardId, setDeletingCardId] = useState<string | null>(null);
  
  useEffect(() => {
    // Fetch available categories
    const fetchCats = async () => {
      try {
        const snap = await getDocs(collection(db, 'categories'));
        const cats = snap.docs.map(d => ({ id: d.id, name: d.data().name }));
        setCategories(cats);
        if (cats.length > 0) setSelectedCategory(cats[0].name.toLowerCase());
      } catch (err) {
        console.error(err);
      }
    };
    fetchCats();
  }, []);

  useEffect(() => {
    if (!selectedCategory) return;
    const unsubscribe = onSnapshot(doc(db, 'usageHubs', selectedCategory), (docSnap) => {
      if (docSnap.exists()) {
        const fetchedCards = docSnap.data().cards || [];
        setCards(fetchedCards);
        if (fetchedCards.length > 0 && !managingCardId && !editingCard) {
            setManagingCardId(fetchedCards[0].id);
        }
      } else {
        setCards([]);
      }
    });
    return () => unsubscribe();
  }, [selectedCategory, managingCardId, editingCard]);

  const handleSaveCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory || !editingCard) return;
    setIsSaving(true);
    
    let updatedCards = [...cards];
    const existingIndex = updatedCards.findIndex(c => c.id === editingCard.id);
    if (existingIndex >= 0) {
      updatedCards[existingIndex] = editingCard;
    } else {
      updatedCards.push(editingCard);
    }
    
    try {
      await setDoc(doc(db, 'usageHubs', selectedCategory), {
        cards: updatedCards,
        updatedAt: serverTimestamp()
      }, { merge: true });
      setEditingCard(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCard = async (id: string) => {
    if (!selectedCategory) return;
    const updatedCards = cards.filter(c => c.id !== id);
    try {
      await setDoc(doc(db, 'usageHubs', selectedCategory), {
        cards: updatedCards,
        updatedAt: serverTimestamp()
      }, { merge: true });
      if (managingCardId === id) setManagingCardId(null);
      setDeletingCardId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateNew = () => {
    setEditingCard({
      id: '',
      title: '',
      sub: '',
      iconName: 'Star',
      color: 'bg-[#06152a]',
      iconColor: 'text-[#5ea2f0]',
      iconBg: 'bg-[#0f2a4a]',
      circle: 'bg-[#0a2347]'
    });
    setManagingCardId(null);
  };

  const handleToggleProductHub = async (productId: string, currentTags: string[] = [], tagId: string) => {
    const isAdded = currentTags.some(t => t.toLowerCase() === tagId.toLowerCase());
    let newTags = [...currentTags];
    if (isAdded) {
      newTags = newTags.filter(t => t.toLowerCase() !== tagId.toLowerCase());
    } else {
      newTags.push(tagId);
    }
    await updateProduct(productId, { usageTags: newTags });
  };

  const currentManagingCard = cards.find(c => c.id === managingCardId);

  const filteredProducts = useMemo(() => {
    if (!productSearch) return products;
    return products.filter(p => 
      p.name.toLowerCase().includes(productSearch.toLowerCase()) || 
      p.brand.toLowerCase().includes(productSearch.toLowerCase())
    );
  }, [products, productSearch]);

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/admin" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-bold">Manage Shop By Usage Hub</h1>
        </div>

        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl mb-8">
          <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Select Category Hub</label>
          <select 
            value={selectedCategory} 
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setManagingCardId(null);
              setEditingCard(null);
            }}
            className="w-full md:w-1/2 bg-black border border-white/10 rounded-xl px-4 py-3 focus:border-primary transition-colors outline-none"
          >
            <option value="default">Default (All Categories Fallback)</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.name.toLowerCase()}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Cards List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Usage Cards for {selectedCategory}</h2>
              <button onClick={handleCreateNew} className="bg-primary text-black px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-white transition-all">
                <Plus size={16} /> Add Card
              </button>
            </div>
            
            {cards.length === 0 ? (
              <div className="text-center p-8 bg-white/5 rounded-2xl text-gray-400 border border-white/10 border-dashed">
                No cards defined for this category. It will use the "default" configuration fallback in the UI.
              </div>
            ) : (
              cards.map((card) => {
                const IconComp = (Icons as any)[card.iconName] || Icons.Star;
                const isActiveManage = managingCardId === card.id;
                
                return (
                  <div key={card.id} className={`bg-white/5 border ${isActiveManage ? 'border-primary shadow-[0_0_15px_rgba(94,177,51,0.2)]' : 'border-white/10'} p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all`}>
                    <div className="flex items-center gap-4 cursor-pointer" onClick={() => { setManagingCardId(card.id); setEditingCard(null); }}>
                      <div className={`w-12 h-12 rounded-xl ${card.iconBg} flex items-center justify-center ${card.iconColor} shrink-0`}>
                        <IconComp size={20} />
                      </div>
                      <div>
                        <div className="font-bold cursor-pointer hover:text-primary transition-colors">{card.title}</div>
                        <div className="text-xs text-gray-400">{card.sub}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => {
                          if (isActiveManage) {
                            setManagingCardId(null);
                          } else {
                            setManagingCardId(card.id);
                            setEditingCard(null);
                          }
                        }} 
                        className={`px-3 py-1.5 rounded-lg font-bold text-xs uppercase tracking-widest transition-colors ${isActiveManage ? 'bg-primary text-black' : 'bg-white/10 hover:bg-white/20'}`}
                      >
                        Manage Products
                      </button>
                      <button onClick={() => { setEditingCard(card); setManagingCardId(null); setDeletingCardId(null); }} className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/40 transition-colors shrink-0">
                        <Edit2 size={16} />
                      </button>
                      {deletingCardId === card.id ? (
                        <div className="flex gap-1 animate-in fade-in slide-in-from-right-2 duration-300">
                           <button 
                            onClick={() => handleDeleteCard(card.id)}
                            className="px-3 py-1 bg-red-600 text-white text-[10px] font-bold rounded-lg hover:bg-red-700 transition-colors"
                          >
                            YES
                          </button>
                          <button 
                            onClick={() => setDeletingCardId(null)}
                            className="px-3 py-1 bg-white/10 text-white text-[10px] font-bold rounded-lg hover:bg-white/20 transition-colors"
                          >
                            NO
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => setDeletingCardId(card.id)} className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/40 transition-colors shrink-0">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="space-y-4">
            {/* Edit Form */}
            {editingCard && (
              <form onSubmit={handleSaveCard} className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  {editingCard.id ? 'Edit User Card' : 'New User Card'}
                </h2>
                
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wide">ID (URL slug, e.g. "student")</label>
                  <input required type="text" value={editingCard.id} onChange={e => setEditingCard({...editingCard, id: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 focus:border-primary transition-colors outline-none" disabled={!!cards.find(c => c.id === editingCard.id && editingCard.id !== '')} />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wide">Title (e.g. "STUDENT USAGE")</label>
                  <input required type="text" value={editingCard.title} onChange={e => setEditingCard({...editingCard, title: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 focus:border-primary transition-colors outline-none" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wide">Subtitle (use \n for newline)</label>
                  <input required type="text" value={editingCard.sub} onChange={e => setEditingCard({...editingCard, sub: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 focus:border-primary transition-colors outline-none" placeholder="LIGHTWEIGHT &\nRELIABLE" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wide">Icon</label>
                  <select value={editingCard.iconName} onChange={e => setEditingCard({...editingCard, iconName: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 focus:border-primary transition-colors outline-none">
                    {AVAILABLE_ICONS.map(icon => <option key={icon} value={icon}>{icon}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wide">Card Background</label>
                    <input required type="text" value={editingCard.color} onChange={e => setEditingCard({...editingCard, color: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 font-mono text-sm focus:border-primary transition-colors outline-none" placeholder="bg-[#06152a]" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wide">Circle Background</label>
                    <input required type="text" value={editingCard.circle} onChange={e => setEditingCard({...editingCard, circle: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 font-mono text-sm focus:border-primary transition-colors outline-none" placeholder="bg-[#0a2347]" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wide">Icon Box Background</label>
                    <input required type="text" value={editingCard.iconBg} onChange={e => setEditingCard({...editingCard, iconBg: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 font-mono text-sm focus:border-primary transition-colors outline-none" placeholder="bg-[#0f2a4a]" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wide">Icon Text Color</label>
                    <input required type="text" value={editingCard.iconColor} onChange={e => setEditingCard({...editingCard, iconColor: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 font-mono text-sm focus:border-primary transition-colors outline-none" placeholder="text-[#5ea2f0]" />
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-4 border-t border-white/10">
                  <button type="button" onClick={() => setEditingCard(null)} className="px-6 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors font-bold">Cancel</button>
                  <button type="submit" disabled={isSaving} className="px-6 py-2 bg-primary hover:bg-white text-black rounded-xl transition-all font-bold flex items-center gap-2">
                    <Save size={16} /> Save Card
                  </button>
                </div>
              </form>
            )}

            {/* Manage Products Section */}
            {currentManagingCard && !editingCard && (
              <div className="bg-white/5 border border-primary/30 p-6 rounded-2xl flex flex-col h-[600px]">
                <div className="mb-4">
                  <h2 className="text-xl font-bold mb-1"><span className="text-primary">{currentManagingCard.title}</span> Products</h2>
                  <p className="text-xs text-gray-400 mb-4">Select products that should appear in this hub.</p>
                  
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                      type="text" 
                      placeholder="Search products to add..." 
                      value={productSearch}
                      onChange={e => setProductSearch(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-xl pl-10 pr-4 py-2 focus:border-primary transition-colors outline-none text-sm"
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                  {filteredProducts.map(product => {
                    const productTags = Array.isArray(product.usageTags) ? product.usageTags.map(t => t.toLowerCase()) : [];
                    const isAdded = productTags.includes(currentManagingCard.id.toLowerCase());
                    
                    return (
                      <div 
                        key={product.id} 
                        onClick={() => handleToggleProductHub(product.id, product.usageTags || [], currentManagingCard.id)}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${isAdded ? 'bg-primary/10 border-primary/30' : 'bg-black/50 border-white/5 hover:border-white/20'}`}
                      >
                        <div className={`shrink-0 ${isAdded ? 'text-primary' : 'text-gray-500'}`}>
                          {isAdded ? <CheckSquare size={20} /> : <Square size={20} />}
                        </div>
                        <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded-md bg-white/10 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold truncate">{product.name}</p>
                          <p className="text-[10px] text-gray-400 truncate">{product.brand} • {product.category}</p>
                        </div>
                      </div>
                    );
                  })}
                  {filteredProducts.length === 0 && (
                    <div className="text-center py-8 text-gray-500 text-sm">
                      No products found.
                    </div>
                  )}
                </div>
              </div>
            )}

            {!editingCard && !currentManagingCard && (
               <div className="hidden lg:flex flex-col items-center justify-center p-12 bg-white/5 rounded-2xl border border-white/5 text-center h-[300px]">
                 <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-gray-500 mb-4">
                   <Icons.LayoutGrid size={24} />
                 </div>
                 <p className="text-gray-400 font-medium">Select "Products" on a card to manage its items,<br/>or "Edit" to modify the card itself.</p>
               </div>
            )}
          </div>

        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}} />
    </div>
  );
}

