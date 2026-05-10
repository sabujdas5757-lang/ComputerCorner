import React, { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { Image as ImageIcon, Plus, Edit2, Trash2, Loader2, AlertCircle } from 'lucide-react';

export default function BannersAdminSection() {
  const [banners, setBanners] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any | null>(null);
  const [form, setForm] = useState({ title: '', subtitle: '', image: '', link: '', active: true, order: 0 });
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    const q = query(collection(db, 'banners'), orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setBanners(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setIsLoading(false);
    }, (error) => {
      setIsLoading(false);
      handleFirestoreError(error, OperationType.GET, 'banners');
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.image) return;
    
    try {
      if (editingBanner) {
        await updateDoc(doc(db, 'banners', editingBanner.id), {
          ...form,
          updatedAt: serverTimestamp()
        });
      } else {
        await addDoc(collection(db, 'banners'), {
          ...form,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
      setEditingBanner(null);
      setForm({ title: '', subtitle: '', image: '', link: '', active: true, order: banners.length });
    } catch (error) {
      handleFirestoreError(error, editingBanner ? OperationType.UPDATE : OperationType.CREATE, 'banners');
    }
  };

  const handleEdit = (banner: any) => {
    setEditingBanner(banner);
    setForm({
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      image: banner.image || '',
      link: banner.link || '',
      active: banner.active ?? true,
      order: banner.order || 0
    });
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteDoc(doc(db, 'banners', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'banners');
    }
    setDeletingId(null);
  };

  return (
    <div className="mb-16 bg-white/5 border border-white/10 rounded-3xl p-8">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <ImageIcon size={24} className="text-blue-400" />
        Home Banner & Ads
      </h2>
      <p className="text-xs text-gray-500 mb-6 uppercase tracking-widest">
        Manage large hero banners that appear at the very top of the home page.
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-8 bg-black/40 p-6 rounded-2xl border border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Image URL *</label>
            <div className="flex gap-4">
              <input 
                type="url" required
                value={form.image}
                onChange={e => setForm({...form, image: e.target.value})}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-blue-400 outline-none"
                placeholder="https://..."
              />
              {form.image && (
                <img src={form.image} alt="Preview" className="w-[100px] h-[50px] object-cover rounded border border-white/10" />
              )}
            </div>
          </div>
          <div>
             <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Title (Optional)</label>
             <input type="text"
               value={form.title}
               onChange={e => setForm({...form, title: e.target.value})}
               className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-blue-400 outline-none"
             />
          </div>
          <div>
             <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Subtitle (Optional)</label>
             <input type="text"
               value={form.subtitle}
               onChange={e => setForm({...form, subtitle: e.target.value})}
               className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-blue-400 outline-none"
             />
          </div>
          <div>
             <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Link (Optional)</label>
             <input type="url"
               value={form.link}
               onChange={e => setForm({...form, link: e.target.value})}
               className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-blue-400 outline-none"
             />
          </div>
          <div className="flex items-center gap-4">
            <div>
               <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Order</label>
               <input type="number"
                 value={form.order}
                 onChange={e => setForm({...form, order: parseInt(e.target.value) || 0})}
                 className="w-24 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-blue-400 outline-none"
               />
            </div>
            <label className="flex items-center gap-2 mt-4 cursor-pointer">
               <input type="checkbox"
                 checked={form.active}
                 onChange={e => setForm({...form, active: e.target.checked})}
                 className="w-5 h-5 rounded border-white/10 bg-white/5 text-blue-400 focus:ring-blue-400"
               />
               <span className="text-sm font-bold text-gray-300">Active</span>
            </label>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button type="submit" className="flex items-center gap-2 bg-blue-500 text-white font-bold px-6 py-3 rounded-xl uppercase tracking-widest text-xs hover:bg-blue-400 transition-colors">
            <Plus size={16} />
            {editingBanner ? 'Update Banner' : 'Add Banner'}
          </button>
          {editingBanner && (
            <button type="button" onClick={() => { setEditingBanner(null); setForm({ title: '', subtitle: '', image: '', link: '', active: true, order: banners.length }); }}
              className="flex items-center gap-2 bg-white/10 text-white font-bold px-6 py-3 rounded-xl uppercase tracking-widest text-xs hover:bg-white/20 transition-colors">
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         {isLoading ? (
           <div className="col-span-2 py-8 flex justify-center"><Loader2 className="animate-spin text-blue-400" size={32} /></div>
         ) : banners.length === 0 ? (
           <div className="col-span-2 py-8 text-center text-gray-500 border border-dashed border-white/10 rounded-xl">No banners added yet.</div>
         ) : (
           banners.map(banner => (
             <div key={banner.id} className={`flex flex-col border rounded-xl overflow-hidden ${banner.active ? 'border-white/10' : 'border-red-500/30 opacity-50'}`}>
                <div className="aspect-[21/9] bg-black">
                  <img src={banner.image} alt="Banner" className="w-full h-full object-cover" />
                </div>
                <div className="p-4 bg-black/40 flex-1 flex flex-col">
                  <div className="flex-1 pb-3">
                    <p className="font-bold text-white text-sm">{banner.title || 'No Title'}</p>
                    <p className="text-xs text-gray-400 mt-1">{banner.subtitle}</p>
                    <p className="text-[10px] text-gray-500 mt-2 font-mono truncate">{banner.link}</p>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-white/5">
                    <div className="text-[10px] uppercase font-bold text-blue-400 tracking-widest gap-2 flex">
                      <span>Order: {banner.order}</span>
                      <span>{banner.active ? 'Active' : 'Inactive'}</span>
                    </div>
                    <div className="flex gap-2">
                       <button onClick={() => handleEdit(banner)} className="p-1.5 bg-white/5 hover:bg-blue-500 rounded transition-colors">
                         <Edit2 size={12} />
                       </button>
                       <button onClick={() => handleDelete(banner.id)} disabled={deletingId === banner.id} className="p-1.5 bg-white/5 hover:bg-red-500 rounded transition-colors disabled:opacity-50">
                         {deletingId === banner.id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                       </button>
                    </div>
                  </div>
                </div>
             </div>
           ))
         )}
      </div>
    </div>
  );
}
