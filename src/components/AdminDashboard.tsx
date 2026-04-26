import React, { useState, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useProducts } from '../contexts/ProductContext';
import { Trash2, Edit2, Image as ImageIcon, Plus, Save, Search, Upload } from 'lucide-react';
import { PRODUCT_CATEGORIES } from '../constants';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';

const USAGE_OPTIONS = ['Student Usage', 'Gaming', 'Editing', 'Office Usage', 'Macbook'];

export default function AdminDashboard() {
  const { logout } = useAuth();
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json: any[] = XLSX.utils.sheet_to_json(worksheet);

      let successCount = 0;
      let errorCount = 0;

      for (const row of json) {
        // Helper to find value despite potentially different casing
        const getValue = (keys: string[]) => {
          for (const k of keys) {
            if (row[k] !== undefined) return row[k];
          }
          return undefined;
        };

        try {
          const product = {
            name: getValue(['name', 'Name', 'NAME']) || 'Unnamed Product',
            brand: getValue(['brand', 'Brand', 'BRAND']) || 'Unknown',
            category: getValue(['category', 'Category', 'CATEGORY']) || 'Laptops',
            description: getValue(['description', 'Description', 'DESCRIPTION']) || '',
            price: String(getValue(['price', 'Price', 'PRICE']) || '0'),
            oldPrice: String(getValue(['oldPrice', 'OldPrice', 'oldprice', 'OLDPRICE']) || ''),
            discount: String(getValue(['discount', 'Discount', 'DISCOUNT']) || ''),
            usageTags: getValue(['usageTags', 'UsageTags', 'usage_tags', 'USAGE_TAGS']) 
              ? String(getValue(['usageTags', 'UsageTags', 'usage_tags', 'USAGE_TAGS'])).split(',').map(tag => tag.trim()) 
              : [],
            image: getValue(['image', 'Image', 'IMAGE']) || 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800',
            specifications: {}
          };
          await addProduct(product);
          successCount++;
        } catch (err) {
          console.error("Error adding product row:", row, err);
          errorCount++;
        }
      }
      
      if (errorCount > 0) {
        showFeedback(`Added ${successCount} products, but ${errorCount} failed. Check console for details.`);
      } else {
        showFeedback(`Successfully added ${successCount} products!`);
      }
    } catch (err: any) {
      showFeedback(`Error uploading bulk products: ${err.message}`);
    } finally {
      setLoading(false);
      // Reset input
      e.target.value = '';
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      setDeletingId(null);
      showFeedback('Product deleted successfully');
    } catch (e: any) {
      showFeedback(`Save failed: ${e.message}`);
    }
  };

  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: 'Laptops',
    description: '',
    price: '',
    oldPrice: '',
    discount: '',
    usageTags: [] as string[]
  });

  const [specs, setSpecs] = useState<{ key: string; value: string }[]>([]);

  const handleAddSpec = () => {
    setSpecs([...specs, { key: '', value: '' }]);
  };

  const handleRemoveSpec = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  const handleSpecChange = (index: number, field: 'key' | 'value', value: string) => {
    const newSpecs = [...specs];
    newSpecs[index][field] = value;
    setSpecs(newSpecs);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleEdit = (product: any) => {
    console.log("Editing product:", product);
    setEditingId(product.id);
    setFormData({
      name: product.name,
      brand: product.brand,
      category: product.category,
      description: product.description,
      price: product.price,
      oldPrice: product.oldPrice || '',
      discount: product.discount || '',
      usageTags: Array.isArray(product.usageTags) ? product.usageTags : []
    });

    if (product.specifications) {
      setSpecs(Object.entries(product.specifications).map(([key, value]) => ({ key, value: String(value) })));
    } else {
      setSpecs([]);
    }

    setImageFile(null); // Clear any pending new image
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      name: '',
      brand: '',
      category: 'Laptops',
      description: '',
      price: '',
      oldPrice: '',
      discount: '',
      usageTags: []
    });
    setSpecs([]);
    setImageFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting form, editingId:", editingId);
    setLoading(true);
    try {
      let imageUrl = '';
      if (imageFile) {
        console.log("Uploading file to Cloudinary:", imageFile.name);
        const formDataUpload = new FormData();
        formDataUpload.append('file', imageFile);
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formDataUpload
        });
        const data = await response.json();
        if (data.secure_url) {
          imageUrl = data.secure_url;
          console.log("Image URL:", imageUrl);
        } else {
          throw new Error(data.error?.message || 'Failed to upload image');
        }
      }
      console.log("imageUrl:", imageUrl);

      const formattedSpecs = specs.reduce((acc, curr) => {
        if (curr.key.trim()) {
          acc[curr.key.trim()] = curr.value.trim();
        }
        return acc;
      }, {} as Record<string, string>);

      if (editingId) {
        // Update product
        const updateData: any = {
          ...formData,
          category: formData.category as any,
          specifications: formattedSpecs
        };
        if (imageUrl) {
          updateData.image = imageUrl; // Only update image if a new one was uploaded
        }
        await updateProduct(editingId, updateData);
        showFeedback('Product updated successfully!');
      } else {
        // Add product
        await addProduct({
          ...formData,
          category: formData.category as any,
          image: imageUrl || 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800',
          specifications: formattedSpecs
        });
        showFeedback('Product added successfully!');
      }

      handleCancelEdit();
    } catch (err: any) {
      showFeedback(`Error saving product: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product => 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  return (
    <div className="min-h-screen bg-bg-dark text-white p-6 md:p-12">
      {feedbackMsg && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-primary text-bg-dark px-6 py-3 rounded-full font-bold shadow-lg animate-in slide-in-from-top-4">
          {feedbackMsg}
        </div>
      )}
      <div className="max-w-7xl mx-auto pt-24">
        <div className="flex justify-between items-center mb-12 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-4xl font-bold">Admin Portal</h1>
            <p className="text-gray-400 mt-2">Manage products and inventory</p>
          </div>
          <div className="flex gap-4">
            <Link to="/" className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
              Back to Home
            </Link>
            <button 
              onClick={logout}
              className="px-6 py-2 bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500/30 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Add/Edit Product Form */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 h-fit">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                {editingId ? <Edit2 size={24} className="text-primary" /> : <Plus size={24} className="text-primary" />} 
                {editingId ? 'Edit Product' : 'Add New Product'}
              </h2>
              <div className="flex gap-2">
                {!editingId && (
                  <label className="text-sm bg-white/5 border border-white/10 px-3 py-2 rounded-lg cursor-pointer hover:bg-white/10 transition-colors flex items-center gap-2">
                    <Upload size={16} className="text-primary" />
                    <span>Bulk Upload</span>
                    <input type="file" accept=".xlsx, .xls, .csv" onChange={handleBulkUpload} className="hidden" />
                  </label>
                )}
                {editingId && (
                  <button onClick={handleCancelEdit} className="text-sm text-gray-400 hover:text-white transition-colors">
                    Cancel
                  </button>
                )}
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Product Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-bg-dark border border-white/10 rounded-xl px-4 py-3 focus:border-primary transition-colors outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Brand</label>
                  <input required type="text" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} className="w-full bg-bg-dark border border-white/10 rounded-xl px-4 py-3 focus:border-primary transition-colors outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Category</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-bg-dark border border-white/10 rounded-xl px-4 py-3 focus:border-primary transition-colors outline-none appearance-none">
                    {PRODUCT_CATEGORIES.map(c => (
                      <option key={c.title} value={c.title}>{c.title}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Description</label>
                <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} className="w-full bg-bg-dark border border-white/10 rounded-xl px-4 py-3 focus:border-primary transition-colors outline-none resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Price</label>
                  <input required type="text" placeholder="₹45,000" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-bg-dark border border-white/10 rounded-xl px-4 py-3 focus:border-primary transition-colors outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Old Price (Optional)</label>
                  <input type="text" placeholder="₹50,000" value={formData.oldPrice} onChange={e => setFormData({...formData, oldPrice: e.target.value})} className="w-full bg-bg-dark border border-white/10 rounded-xl px-4 py-3 focus:border-primary transition-colors outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Discount/Badge (Optional)</label>
                <input type="text" placeholder="e.g. Best Seller" value={formData.discount} onChange={e => setFormData({...formData, discount: e.target.value})} className="w-full bg-bg-dark border border-white/10 rounded-xl px-4 py-3 focus:border-primary transition-colors outline-none" />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Usage Tags</label>
                <div className="grid grid-cols-2 gap-2">
                  {USAGE_OPTIONS.map(tag => (
                    <label key={tag} className="flex items-center gap-2 cursor-pointer text-sm">
                      <input 
                        type="checkbox" 
                        checked={formData.usageTags.some(t => t.toLowerCase() === tag.toLowerCase())}
                        onChange={(e) => {
                          const newTags = e.target.checked 
                            ? [...formData.usageTags, tag]
                            : formData.usageTags.filter(t => t.toLowerCase() !== tag.toLowerCase());
                          setFormData({...formData, usageTags: newTags});
                        }}
                        className="rounded border-white/10 text-primary focus:ring-primary bg-bg-dark"
                      />
                      {tag}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Product Image {editingId && '(Optional to keep current)'}</label>
                <label className="flex items-center gap-3 w-full bg-bg-dark border border-dashed border-white/20 rounded-xl px-4 py-6 cursor-pointer hover:border-primary transition-colors">
                  <ImageIcon size={24} className="text-gray-500" />
                  <span className="text-gray-400 text-sm">
                    {imageFile ? imageFile.name : (editingId ? 'Click to upload new image' : 'Click to upload preview image')}
                  </span>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </div>

              {/* Specifications Section */}
              <div className="space-y-4 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-gray-400">Specifications</label>
                  <button 
                    type="button"
                    onClick={handleAddSpec}
                    className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-lg hover:bg-primary/20 transition-colors"
                  >
                    + Add Field
                  </button>
                </div>
                
                <div className="space-y-3">
                  {specs.map((spec, index) => (
                    <div key={index} className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Key (e.g. RAM)"
                        value={spec.key}
                        onChange={(e) => handleSpecChange(index, 'key', e.target.value)}
                        className="flex-1 bg-bg-dark border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-primary outline-none"
                      />
                      <input 
                        type="text" 
                        placeholder="Value (e.g. 16GB)"
                        value={spec.value}
                        onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                        className="flex-1 bg-bg-dark border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-primary outline-none"
                      />
                      <button 
                        type="button"
                        onClick={() => handleRemoveSpec(index)}
                        className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  {specs.length === 0 && (
                    <p className="text-xs text-gray-500 italic text-center py-2">No specifications added</p>
                  )}
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-primary text-bg-dark font-bold py-4 rounded-xl mt-4 hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? 'Saving...' : (editingId ? <><Save size={20} /> Update Product</> : <><Plus size={20} /> Add Product</>)}
              </button>
            </form>
          </div>

          {/* Product List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                Inventory ({filteredProducts.length})
              </h2>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 focus:border-primary transition-colors outline-none"
                />
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
              <div className="max-h-[600px] overflow-y-auto p-4 space-y-4 scrollbar-hide">
                {filteredProducts.map(product => (
                  <div key={product.id} className={`flex items-center gap-4 p-4 bg-bg-dark border rounded-2xl transition-all ${editingId === product.id ? 'border-primary ring-1 ring-primary' : 'border-white/5'}`}>
                    <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-xl bg-white/5" />
                    <div className="flex-1">
                      <h3 className="font-bold line-clamp-1">{product.name}</h3>
                      <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">{product.category} • {product.brand}</p>
                      <p className="text-primary font-bold text-sm mt-1">{product.price}</p>
                    </div>
                    <div className="flex items-center gap-2">
                       <button 
                        onClick={() => handleEdit(product)}
                        className="p-3 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
                        title="Edit Product"
                      >
                        <Edit2 size={20} />
                      </button>
                      {deletingId === product.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => setDeletingId(null)}
                            className="px-3 py-1 bg-gray-500 text-white rounded-lg text-sm hover:bg-gray-600"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => setDeletingId(product.id)}
                          className="p-3 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                          title="Delete Product"
                        >
                          <Trash2 size={20} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
