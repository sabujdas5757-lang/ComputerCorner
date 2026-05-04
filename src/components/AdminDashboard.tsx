import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useProducts } from '../contexts/ProductContext';
import { Trash2, Edit2, Plus, Save, Search, Upload, Image as ImageIcon, Loader2, AlertCircle, Database } from 'lucide-react';
import { PRODUCT_CATEGORIES } from '../constants';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, serverTimestamp } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';

const USAGE_OPTIONS = ['Student Usage', 'Gaming', 'Editing', 'Office Usage', 'MacBook'];

const formatPrice = (value: string) => {
  if (!value || value === '0') return '₹0.00';
  let numeric = value.replace(/[^0-9.]/g, '');
  if (!numeric || numeric === '0' || numeric === '.') return '₹0.00';
  
  const num = parseFloat(numeric);
  if (isNaN(num)) return value;
  
  return '₹' + num.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

export default function AdminDashboard() {
  const { logout } = useAuth();
  const { products, addProduct, updateProduct, deleteProduct, deleteMultipleProducts } = useProducts();
  const [loading, setLoading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [homeGridSearchQuery, setHomeGridSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
    return products.filter(product => 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  // Save to localStorage when changed
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [confirmingBulkDelete, setConfirmingBulkDelete] = useState(false);
  const [confirmingAllDelete, setConfirmingAllDelete] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const [storageStatus, setStorageStatus] = useState<{configured: boolean, message: string} | null>(null);

  const [categories, setCategories] = useState<{id: string, name: string, img: string}[]>([]);
  const [editingCategory, setEditingCategory] = useState<{id: string, name: string, img: string} | null>(null);
  const [brands, setBrands] = useState<{id: string, name: string, img: string}[]>([]);
  const [editingBrand, setEditingBrand] = useState<{id: string, name: string, img: string} | null>(null);
  const [categoryForm, setCategoryForm] = useState({ name: '', img: '', showAsSection: false, sectionTitle: '', sectionOrder: 0 });
  const [brandForm, setBrandForm] = useState({ name: '', img: '' });
  const [isCategoryLoading, setIsCategoryLoading] = useState(false);
  const [isBrandLoading, setIsBrandLoading] = useState(false);
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);
  const [deletingBrandId, setDeletingBrandId] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'categories'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const cats = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      setCategories(cats);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'categories');
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'brands'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const b = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      setBrands(b);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'brands');
    });
    return () => unsubscribe();
  }, []);

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCategoryLoading(true);
    const normalizedName = categoryForm.name.trim();
    try {
      if (editingCategory) {
        await updateDoc(doc(db, 'categories', editingCategory.id), {
          ...categoryForm,
          name: normalizedName,
          updatedAt: serverTimestamp()
        });
        showFeedback('Category updated!');
      } else {
        await addDoc(collection(db, 'categories'), {
          ...categoryForm,
          name: normalizedName,
          createdAt: serverTimestamp()
        });
        showFeedback('Category added!');
      }
      setCategoryForm({ name: '', img: '', showAsSection: false, sectionTitle: '', sectionOrder: 0 });
      setEditingCategory(null);
    } catch (err: any) {
      handleFirestoreError(err, editingCategory ? OperationType.UPDATE : OperationType.CREATE, 'categories');
    } finally {
      setIsCategoryLoading(false);
    }
  };

  const handleBrandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsBrandLoading(true);
    const normalizedName = brandForm.name.trim();
    
    // Check if brand already exists (case-insensitive) to avoid duplicates
    const alreadyExists = brands.some(b => 
      b.name.toLowerCase() === normalizedName.toLowerCase() && 
      (!editingBrand || b.id !== editingBrand.id)
    );

    if (alreadyExists && !editingBrand) {
      showFeedback('This brand already exists!');
      setIsBrandLoading(false);
      return;
    }

    try {
      if (editingBrand) {
        await updateDoc(doc(db, 'brands', editingBrand.id), {
          ...brandForm,
          name: normalizedName,
          updatedAt: serverTimestamp()
        });
        showFeedback('Brand updated!');
      } else {
        await addDoc(collection(db, 'brands'), {
          ...brandForm,
          name: normalizedName,
          createdAt: serverTimestamp()
        });
        showFeedback('Brand added!');
      }
      setBrandForm({ name: '', img: '' });
      setEditingBrand(null);
    } catch (err: any) {
      handleFirestoreError(err, editingBrand ? OperationType.UPDATE : OperationType.CREATE, 'brands');
    } finally {
      setIsBrandLoading(false);
    }
  };

  const handleEditCategory = (cat: any) => {
    setEditingCategory(cat);
    setCategoryForm({ 
      name: cat.name, 
      img: cat.img, 
      showAsSection: !!cat.showAsSection,
      sectionTitle: cat.sectionTitle || '',
      sectionOrder: cat.sectionOrder || 0
    });
  };

  const handleEditBrand = (brand: any) => {
    setEditingBrand(brand);
    setBrandForm({ name: brand.name, img: brand.img });
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'categories', id));
      showFeedback('Category deleted');
      setDeletingCategoryId(null);
    } catch (err: any) {
      handleFirestoreError(err, OperationType.DELETE, `categories/${id}`);
    }
  };

  const handleDeleteBrand = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'brands', id));
      showFeedback('Brand deleted');
      setDeletingBrandId(null);
    } catch (err: any) {
      handleFirestoreError(err, OperationType.DELETE, `brands/${id}`);
    }
  };

  useEffect(() => {
    const checkStorage = async () => {
      try {
        const res = await fetch('/api/storage-status');
        const data = await safeJson(res);
        if (data && !data.error) {
          setStorageStatus(data);
        } else {
          const errorMsg = data?.error || `Server returned status ${res.status}`;
          console.error("Storage status check error:", errorMsg);
          setStorageStatus({configured: false, message: "Storage status check failed: " + errorMsg});
        }
      } catch (err: any) {
        console.error("Storage status check failed:", err.message);
        setStorageStatus({configured: false, message: "Storage status check failed: " + err.message});
      }
    };
    checkStorage();
  }, []);

  const safeJson = async (response: Response) => {
    try {
      const text = await response.text();
      if (!text || text.trim() === '') {
        if (!response.ok) {
           return { error: `Server returned status ${response.status} with empty body.` };
        }
        return null;
      }
      try {
        return JSON.parse(text);
      } catch (e) {
        console.error("JSON parse error:", e, "Raw text:", text.substring(0, 500));
        return { error: `Invalid JSON response (Status ${response.status}). The server might be misconfigured or down.` };
      }
    } catch (e) {
      console.error("SafeJSON reading error:", e);
      return { error: "Failed to read response from server." };
    }
  };

  const showFeedback = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const detectCategory = (scrapedCat: string, name: string, description: string) => {
    const text = (scrapedCat + ' ' + name + ' ' + description).toLowerCase();
    
    // Priority 1: Direct matches with existing categories
    for (const cat of categories) {
      const catName = cat.name.toLowerCase();
      if (text.includes(catName)) return cat.name;
    }

    // Priority 2: Keyword mapping
    const keywordMap: Record<string, string[]> = {
      'Laptops': ['laptop', 'notebook', 'ultrabook', 'macbook', 'chromebook', 'yoga', 'thinkpad', 'zenbook', 'vivobook', 'rog', 'tuf', 'pavilion', 'inspiron', 'latitude', 'precision', 'vostro'],
      'Gaming': ['gaming', 'rog', 'tuf', 'victus', 'omen', 'legion', 'alienware', 'razer', 'rtx', 'gtx'],
      'Monitors': ['monitor', 'display', 'screen', 'panel', 'ips', 'va', 'curved monitor', 'hz'],
      'Desktop': ['desktop', 'tower', 'pc', 'gaming pc', 'workstation', 'mini pc', 'all-in-one', 'aio'],
      'Components': ['motherboard', 'processor', 'cpu', 'graphics card', 'gpu', 'ram', 'memory', 'ssd', 'hdd', 'psu', 'power supply', 'chassis', 'case', 'cooler', 'fan'],
      'Accessories': ['keyboard', 'mouse', 'mousepad', 'headphones', 'earphones', 'mic', 'microphone', 'webcam', 'headset', 'speaker'],
      'Networking': ['router', 'switch', 'modem', 'wifi', 'adapter', 'access point', 'tp-link', 'd-link', 'netgear', 'tenda', 'mercusys'],
      'UPS': ['ups', 'battery backup', 'voltage stabilizer', 'voltage regulator', 'apc', 'luminous', 'microtek'],
      'Antivirus': ['antivirus', 'total security', 'internet security', 'quick heal', 'kaspersky', 'mcafee', 'eset'],
      'Biometric': ['biometric', 'fingerprint', 'scanner', 'time attendance', 'zkteco', 'realtime'],
      'Printers': ['printer', 'scanner', 'copier', 'laserjet', 'inkjet', 'ink tank', 'ecotank', 'canon', 'epson', 'hp printer', 'brother printer'],
      'CCTV': ['cctv', 'camera', 'ip camera', 'dvr', 'nvr', 'security camera', 'hikvision', 'dahua', 'cp plus', 'ezviz']
    };

    for (const [catName, keywords] of Object.entries(keywordMap)) {
      if (keywords.some(k => text.includes(k))) {
        // Find if this category exists in our database
        const existingCat = categories.find(c => c.name.toLowerCase() === catName.toLowerCase());
        if (existingCat) return existingCat.name;
        
        // If not, but it's a strongly matched keyword and fits "Laptops" which is a default
        if (catName === 'Laptops') return 'Laptops';
      }
    }

    return categories.length > 0 ? categories[0].name : 'Laptops';
  };

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setLoading(true);
    try {
      let successCount = 0;
      let errorCount = 0;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop()?.toLowerCase();

        if (['xlsx', 'xls', 'csv'].includes(fileExt || '')) {
          const data = await file.arrayBuffer();
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const json: any[] = XLSX.utils.sheet_to_json(worksheet);

          for (const row of json) {
            const getValue = (keys: string[]) => {
              for (const k of keys) {
                if (row[k] !== undefined) return row[k];
              }
              return undefined;
            };

            try {
              const pPrice = formatPrice(String(getValue(['price', 'Price', 'PRICE']) || '0'));
              const pOldPrice = getValue(['oldPrice', 'OldPrice', 'oldprice', 'OLDPRICE']) 
                ? formatPrice(String(getValue(['oldPrice', 'OldPrice', 'oldprice', 'OLDPRICE']))) 
                : '';

              let finalImageUrl = getValue(['image', 'Image', 'IMAGE']) || 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800';
              
              if (finalImageUrl.startsWith('http') && !finalImageUrl.includes('vercel-storage.com') && !finalImageUrl.includes('localhost')) {
                try {
                  const uploadRes = await fetch('/api/upload-from-url', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url: finalImageUrl })
                  });
                  if (uploadRes.ok) {
                    const uploadData = await safeJson(uploadRes);
                    if (uploadData?.secure_url) {
                      finalImageUrl = uploadData.secure_url;
                    }
                  }
                } catch (e) {
                  console.warn("Bulk upload auto-image upload failed:", e);
                }
              }

              const pName = getValue(['name', 'Name', 'NAME']) || 'Unnamed Product';
              const pDesc = getValue(['description', 'Description', 'DESCRIPTION']) || '';
              const pCatRaw = getValue(['category', 'Category', 'CATEGORY']) || '';
              
              const product = {
                name: pName,
                brand: getValue(['brand', 'Brand', 'BRAND']) || 'Unknown',
                category: detectCategory(pCatRaw, pName, pDesc),
                description: pDesc,
                price: pPrice,
                oldPrice: pOldPrice,
                discount: String(getValue(['discount', 'Discount', 'DISCOUNT']) || ''),
                usageTags: getValue(['usageTags', 'UsageTags', 'usage_tags', 'USAGE_TAGS']) 
                  ? String(getValue(['usageTags', 'UsageTags', 'usage_tags', 'USAGE_TAGS'])).split(',').map(tag => tag.trim()) 
                  : [],
                image: finalImageUrl,
                specifications: {}
              };
              await addProduct(product);
              successCount++;
            } catch (err) {
              console.error("Error adding product row:", row, err);
              errorCount++;
            }
          }
        } else if (['jpg', 'jpeg', 'png', 'webp'].includes(fileExt || '')) {
          try {
            const uploadFormData = new FormData();
            uploadFormData.append('file', file);
            const res = await fetch('/api/upload-file', { method: 'POST', body: uploadFormData });
            const uploadData = await safeJson(res);
            
            if (uploadData?.secure_url) {
              const pName = file.name.split('.')[0].replace(/[_-]/g, ' ');
              await addProduct({
                name: pName,
                brand: 'Unknown',
                category: detectCategory('', pName, ''),
                description: '',
                price: '₹0',
                oldPrice: '',
                discount: '',
                usageTags: [],
                image: uploadData.secure_url,
                specifications: {}
              });
              successCount++;
            } else {
              throw new Error(uploadData?.error || 'Image upload failed. It might be due to server configuration or quota limits.');
            }
          } catch (err) {
            console.error("Error bulk uploading image:", file.name, err);
            errorCount++;
          }
        }
      }
      
      if (errorCount > 0) {
        showFeedback(`Processed ${successCount} items, but ${errorCount} failed.`);
      } else {
        showFeedback(`Successfully added ${successCount} items!`);
      }
    } catch (err: any) {
      showFeedback(`Error uploading: ${err.message}`);
    } finally {
      setLoading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      setDeletingId(null);
      setSelectedIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      showFeedback('Product deleted successfully');
    } catch (e: any) {
      showFeedback(`Save failed: ${e.message}`);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) return;

    setLoading(true);
    const idsToDelete = Array.from(selectedIds);
    console.log("Starting atomic batch delete for IDs:", idsToDelete);
    
    try {
      await deleteMultipleProducts(idsToDelete);
      setSelectedIds(new Set());
      setConfirmingBulkDelete(false);
      showFeedback(`Successfully deleted ${idsToDelete.length} products`);
    } catch (err: any) {
      console.error("Batch delete error:", err);
      showFeedback(`Error during deletion: ${err.message}`);
    } finally {
      setLoading(false);
      console.log("Batch delete process finished");
    }
  };

  const handleDeleteAll = async () => {
    if (products.length === 0) return;
    setLoading(true);
    const idsToDelete = products.map(p => p.id);
    try {
      await deleteMultipleProducts(idsToDelete);
      setSelectedIds(new Set());
      setConfirmingAllDelete(false);
      showFeedback(`Successfully removed all ${idsToDelete.length} products`);
    } catch (err: any) {
      showFeedback(`Error clearing products: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelectProduct = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const isAllSelected = filteredProducts.length > 0 && filteredProducts.every(p => selectedIds.has(p.id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds(prev => {
        const next = new Set(prev);
        filteredProducts.forEach(p => next.delete(p.id));
        return next;
      });
    } else {
      setSelectedIds(prev => {
        const next = new Set(prev);
        filteredProducts.forEach(p => next.add(p.id));
        return next;
      });
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
    usageTags: [] as string[],
    isHotSelling: false,
    showInHomeGrid: false,
    image: '',
    additionalImages: [] as string[]
  });

  const [specs, setSpecs] = useState<{ key: string; value: string }[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [addUrlInput, setAddUrlInput] = useState('');
  const [useFirecrawl, setUseFirecrawl] = useState(true);

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

  const handleEdit = (product: any) => {
    console.log("Editing product:", product);
    setEditingId(product.id);
    setFormData({
      name: product.name || '',
      brand: product.brand || '',
      category: product.category || 'Laptops',
      description: product.description || '',
      price: product.price || '',
      oldPrice: product.oldPrice || '',
      discount: product.discount || '',
      usageTags: Array.isArray(product.usageTags) ? product.usageTags : [],
      isHotSelling: !!product.isHotSelling,
      showInHomeGrid: !!product.showInHomeGrid,
      image: product.image || '',
      additionalImages: product.additionalImages || []
    });

    if (product.specifications) {
      setSpecs(Object.entries(product.specifications).map(([key, value]) => ({ key, value: String(value) })));
    } else {
      setSpecs([]);
    }
    setImageFiles([]);
    setImagePreviews([]);
    setImageFile(null); // Keep backward compatibility for single image if needed, or remove later
    setImagePreview(null);
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
      usageTags: [],
      isHotSelling: false,
      showInHomeGrid: false,
      image: '',
      additionalImages: []
    });
    setSpecs([]);
    setImageFile(null);
    setImagePreview(null);
    setImageFiles([]);
    setImagePreviews([]);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    if (files.length > 0) {
      setImageFiles(prev => [...prev, ...files]);
      
      files.forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeSelectedImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };
  
  const removeExistingImage = (index: number) => {
     setFormData(prev => ({
       ...prev,
       additionalImages: prev.additionalImages.filter((_, i) => i !== index)
     }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting form, editingId:", editingId);
    setLoading(true);
    try {
      let mainImageUrl = formData.image;
      let newAdditionalImages = [...formData.additionalImages];

      // If the primary image is an external URL, upload it to Vercel Blob automatically
      if (mainImageUrl && mainImageUrl.startsWith('http') && !mainImageUrl.includes('vercel-storage.com') && !mainImageUrl.includes('localhost')) {
        try {
          const res = await fetch('/api/upload-from-url', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: mainImageUrl })
          });
          if (res.ok) {
            const data = await safeJson(res);
            if (data?.secure_url) {
              mainImageUrl = data.secure_url;
            }
          }
        } catch (e) {
          console.warn("Failed to auto-upload external URL image:", e);
        }
      }

      // Upload all newly selected files
      if (imageFiles.length > 0) {
        for (let i = 0; i < imageFiles.length; i++) {
          const uploadFormData = new FormData();
          uploadFormData.append('file', imageFiles[i]);
          const res = await fetch('/api/upload-file', { method: 'POST', body: uploadFormData });
          const uploadData = await safeJson(res);
          if (uploadData?.secure_url) {
            // If primary image is empty, make first uploaded image the primary
            if (!mainImageUrl && i === 0 && !formData.image) {
               mainImageUrl = uploadData.secure_url;
            } else {
               newAdditionalImages.push(uploadData.secure_url);
            }
          } else {
            throw new Error(uploadData?.error || 'Image upload failed');
          }
        }
      }

      const formattedSpecs = specs.reduce((acc, curr) => {
        if (curr.key.trim()) {
          acc[curr.key.trim()] = curr.value.trim();
        }
        return acc;
      }, {} as Record<string, string>);

      const finalPrice = formatPrice(formData.price.trim());
      const finalOldPrice = formData.oldPrice.trim() ? formatPrice(formData.oldPrice.trim()) : '';

      let finalBrand = formData.brand.trim();
      // Try to find matching brand in normalized list for consistency
      const matchingBrand = brands.find(b => b.name.toLowerCase() === finalBrand.toLowerCase());
      if (matchingBrand) {
        finalBrand = matchingBrand.name;
      }

      if (editingId) {
        const updateData: any = {
          ...formData,
          brand: finalBrand,
          price: finalPrice,
          oldPrice: finalOldPrice,
          image: mainImageUrl,
          additionalImages: newAdditionalImages,
          isHotSelling: !!formData.isHotSelling,
          showInHomeGrid: !!formData.showInHomeGrid,
          category: formData.category as any,
          specifications: formattedSpecs
        };
        await updateProduct(editingId, updateData);
        showFeedback('Product updated successfully!');
      } else {
        await addProduct({
          ...formData,
          brand: finalBrand,
          price: finalPrice,
          oldPrice: finalOldPrice,
          image: mainImageUrl || 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800',
          additionalImages: newAdditionalImages,
          isHotSelling: !!formData.isHotSelling,
          showInHomeGrid: !!formData.showInHomeGrid,
          category: formData.category as any,
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
          {storageStatus && !storageStatus.configured && (
            <div className="flex-1 max-w-md bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-xl flex items-center gap-3 text-red-500">
              <AlertCircle size={20} className="flex-shrink-0" />
              <div className="text-xs">
                <p className="font-bold">Storage Missing</p>
                <p className="opacity-80">Images will not be saved permanently. Please set tokens.</p>
              </div>
            </div>
          )}
          <div className="flex flex-wrap gap-4" id="admin-header-actions">
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

        {/* Home Page Layout Management */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Category Management Section */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <ImageIcon size={24} className="text-primary" />
              Manage Categories (Home Page Grid)
            </h2>
            
            <form onSubmit={handleCategorySubmit} className="grid grid-cols-1 gap-6 mb-8 bg-black/40 p-6 rounded-2xl border border-white/5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Category Name</label>
                  <input
                    type="text"
                    required
                    value={categoryForm.name || ''}
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary"
                    placeholder="e.g. Laptops"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Image URL</label>
                  <input
                    type="text"
                    required
                    value={categoryForm.img || ''}
                    onChange={(e) => setCategoryForm({ ...categoryForm, img: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
                <div className="flex items-center gap-4 mb-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={!!categoryForm.showAsSection}
                      onChange={(e) => setCategoryForm({ ...categoryForm, showAsSection: e.target.checked, sectionTitle: e.target.checked && !categoryForm.sectionTitle ? categoryForm.name : categoryForm.sectionTitle })}
                      className="rounded border-white/10 text-primary focus:ring-primary bg-bg-dark"
                    />
                    <span className="text-sm font-bold text-primary uppercase tracking-widest">Show as Featured Section on Home</span>
                  </label>
                </div>

                {categoryForm.showAsSection && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Section Display Title</label>
                      <input
                        type="text"
                        value={categoryForm.sectionTitle || ''}
                        onChange={(e) => setCategoryForm({ ...categoryForm, sectionTitle: e.target.value })}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary"
                        placeholder="e.g. Premium Printers"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Display Order (Higher = First)</label>
                      <input
                        type="number"
                        value={categoryForm.sectionOrder ?? 0}
                        onChange={(e) => setCategoryForm({ ...categoryForm, sectionOrder: parseInt(e.target.value) || 0 })}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-end gap-2">
                <button
                  type="submit"
                  disabled={isCategoryLoading}
                  className="flex-1 bg-primary text-bg-dark h-[50px] rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-white transition-all disabled:opacity-50"
                >
                  {isCategoryLoading ? <Loader2 className="animate-spin" size={18} /> : (editingCategory ? 'Update' : 'Add Category')}
                </button>
                {editingCategory && (
                  <button
                    type="button"
                    onClick={() => { setEditingCategory(null); setCategoryForm({ name: '', img: '', showAsSection: false, sectionTitle: '', sectionOrder: 0 }); }}
                    className="bg-white/10 text-white h-[50px] px-6 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-white/20 transition-all transition-all"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <div className="flex items-start gap-4 overflow-x-auto no-scrollbar pb-4 scroll-smooth">
              {categories.map((cat) => (
                <div key={cat.id} className={`group relative bg-black/40 border ${editingCategory?.id === cat.id ? 'border-primary' : 'border-white/5'} rounded-2xl p-4 flex flex-col items-center gap-3 hover:border-primary/50 transition-all min-w-[150px] shrink-0`}>
                  <div className="w-16 h-16 rounded-full overflow-hidden border border-white/10">
                    <img src={cat.img} alt={cat.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-center truncate w-full">{cat.name}</span>
                  {cat.showAsSection && (
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[8px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">Section Active</span>
                      <span className="text-[9px] text-gray-500 font-bold uppercase tracking-tight">
                        {products.filter(p => p.category === cat.name && p.showInHomeGrid).length} Featured
                      </span>
                    </div>
                  )}
                  
                  <div className="flex gap-1">
                    <button onClick={() => handleEditCategory(cat)} className="p-1.5 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/40 transition-all">
                      <Edit2 size={12} />
                    </button>
                    {deletingCategoryId === cat.id ? (
                      <div className="flex gap-1">
                        <button 
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="px-2 py-1 bg-red-500 text-white text-[10px] font-bold rounded-lg hover:bg-red-600 transition-all"
                        >
                          Confirm
                        </button>
                        <button 
                          onClick={() => setDeletingCategoryId(null)}
                          className="px-2 py-1 bg-white/10 text-white text-[10px] font-bold rounded-lg hover:bg-white/20 transition-all"
                        >
                          X
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => setDeletingCategoryId(cat.id)} className="p-1.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/40 transition-all">
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Home Grid Featured Products Summary */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Save size={24} className="text-blue-500" />
              Home Grid Products
            </h2>
            
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold" size={16} />
                <input 
                  type="text"
                  placeholder="Search home grid featured products..."
                  value={homeGridSearchQuery}
                  onChange={(e) => setHomeGridSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && setHomeGridSearchQuery((e.target as any).value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 focus:border-primary transition-all outline-none text-sm placeholder:text-gray-500"
                />
              </div>
              <button 
                onClick={() => setHomeGridSearchQuery(homeGridSearchQuery)}
                className="bg-primary text-bg-dark px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-white transition-all flex items-center justify-center gap-2"
              >
                <Search size={16} />
                Search
              </button>
              {homeGridSearchQuery && (
                <button 
                  onClick={() => setHomeGridSearchQuery('')}
                  className="px-4 py-3 text-gray-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest border border-white/10 rounded-xl"
                >
                  Clear Results
                </button>
              )}
            </div>

            <p className="text-xs text-gray-500 mb-6 uppercase tracking-widest">
              These products will appear at the start of their respective category sections on the home page.
            </p>
            <div className="flex items-start gap-4 overflow-x-auto no-scrollbar pb-6 scroll-smooth">
              {(() => {
                const featuredCategoryNames = categories
                  .filter(c => !!c.showAsSection)
                  .map(c => c.name.toLowerCase().trim());

                const homeGridFiltered = products.filter(p => {
                  const isExplicitlyFeatured = !!p.showInHomeGrid;
                  const productCat = (p.category || '').toLowerCase().trim();
                  
                  // Include if explicitly marked OR if it belongs to a featured section
                  const isInFeaturedSection = featuredCategoryNames.some(featCat => 
                    productCat === featCat || 
                    productCat === featCat + 's' || 
                    productCat + 's' === featCat
                  );

                  const search = homeGridSearchQuery.toLowerCase();
                  const matchesSearch = p.name.toLowerCase().includes(search) ||
                                        p.category.toLowerCase().includes(search) ||
                                        p.brand.toLowerCase().includes(search);

                  return (isExplicitlyFeatured || isInFeaturedSection) && matchesSearch;
                });

                if (homeGridFiltered.length === 0) {
                  return (
                    <div className="w-full text-center py-20 text-gray-500 italic text-sm border border-dashed border-white/10 rounded-2xl">
                      {homeGridSearchQuery ? "No matching products found." : "No featured products. Mark categories or products as 'Home Grid' to see them here."} <br />
                      {!homeGridSearchQuery && <span className="text-[10px] mt-2 block opacity-60">Try ticking \"Home Grid\" on a product or \"Show as Featured\" on a category.</span>}
                    </div>
                  );
                }

                return homeGridFiltered.map(p => (
                  <div key={p.id} className="min-w-[280px] max-w-[280px] bg-black/40 border border-white/5 rounded-2xl p-4 flex flex-col gap-3 group hover:border-primary/50 transition-all shrink-0">
                    <div className="relative aspect-video bg-white rounded-xl overflow-hidden p-2">
                      <img src={p.image} className="w-full h-full object-contain" alt="" />
                      <div className="absolute top-2 right-2 bg-blue-500 text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-full shadow-lg">
                        Home Grid
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span className="text-[8px] text-primary font-black uppercase tracking-widest bg-primary/10 px-1.5 py-0.5 rounded">{p.category}</span>
                        <span className="text-[8px] text-gray-400 font-bold uppercase">{p.brand}</span>
                      </div>
                      <p className="text-xs font-bold text-white line-clamp-2 min-h-[32px] leading-relaxed">{p.name}</p>
                    </div>
                    <div className="flex gap-2 mt-auto">
                      <button 
                        onClick={() => handleEdit(p)}
                        className="flex-1 py-2 bg-white/5 text-white hover:bg-primary hover:text-bg-dark transition-all rounded-lg font-bold uppercase tracking-widest text-[9px] flex items-center justify-center gap-2"
                      >
                        <Edit2 size={12} />
                        Edit Product
                      </button>
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>

        {/* Brand Management Section */}
        <div className="mb-16 bg-white/5 border border-white/10 rounded-3xl p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <ImageIcon size={24} className="text-primary" />
            Manage Brands (Catalog Filter)
          </h2>
          
          <form onSubmit={handleBrandSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 bg-black/40 p-6 rounded-2xl border border-white/5">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Brand Name</label>
              <input
                type="text"
                required
                value={brandForm.name || ''}
                onChange={(e) => setBrandForm({ ...brandForm, name: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary"
                placeholder="e.g. ASUS"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Brand Image URL (Optional)</label>
              <input
                type="text"
                value={brandForm.img || ''}
                onChange={(e) => setBrandForm({ ...brandForm, img: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary"
                placeholder="https://..."
              />
            </div>
            <div className="flex items-end gap-2">
              <button
                type="submit"
                disabled={isBrandLoading}
                className="flex-1 bg-primary text-bg-dark h-[50px] rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-white transition-all disabled:opacity-50"
              >
                {isBrandLoading ? <Loader2 className="animate-spin" size={18} /> : (editingBrand ? 'Update' : 'Add Brand')}
              </button>
              {editingBrand && (
                <button
                  type="button"
                  onClick={() => { setEditingBrand(null); setBrandForm({ name: '', img: '' }); }}
                  className="bg-white/10 text-white h-[50px] px-6 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-white/20 transition-all"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="flex items-start gap-4 overflow-x-auto no-scrollbar pb-4 scroll-smooth">
            {brands.map((b) => (
              <div key={b.id} className="group relative bg-black/40 border border-white/5 rounded-2xl p-4 flex flex-col items-center gap-3 hover:border-primary/50 transition-all min-w-[150px] shrink-0">
                <div className="w-16 h-16 rounded-full overflow-hidden border border-white/10 flex items-center justify-center">
                  {b.img ? (
                    <img src={b.img} alt={b.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs font-bold text-gray-500 uppercase">{b.name.substring(0, 2)}</span>
                  )}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-center truncate w-full">{b.name}</span>
                
                <div className="flex gap-1">
                  <button onClick={() => handleEditBrand(b)} className="p-1.5 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/40 transition-all">
                    <Edit2 size={12} />
                  </button>
                  {deletingBrandId === b.id ? (
                    <div className="flex gap-1">
                      <button 
                        onClick={() => handleDeleteBrand(b.id)}
                        className="px-2 py-1 bg-red-500 text-white text-[10px] font-bold rounded-lg hover:bg-red-600 transition-all"
                      >
                        Confirm
                      </button>
                      <button 
                        onClick={() => setDeletingBrandId(null)}
                        className="px-2 py-1 bg-white/10 text-white text-[10px] font-bold rounded-lg hover:bg-white/20 transition-all"
                      >
                        X
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => setDeletingBrandId(b.id)} className="p-1.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/40 transition-all">
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Add/Edit Product Form */}
          <div ref={formRef} className="bg-white/5 border border-white/10 rounded-3xl p-8 h-fit">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                {editingId ? <Edit2 size={24} className="text-primary" /> : <Plus size={24} className="text-primary" />} 
                {editingId ? 'Edit Product' : 'Add New Product'}
              </h2>
              <div className="flex gap-2">
                {!editingId && (
                  <div className="flex gap-2">
                    <label className="text-sm bg-white/5 border border-white/10 px-3 py-2 rounded-lg cursor-pointer hover:bg-white/10 transition-colors flex items-center gap-2 text-primary whitespace-nowrap">
                      <Upload size={16} />
                      <span>Bulk Upload (.xlsx, .jpg)</span>
                      <input type="file" multiple accept=".xlsx, .xls, .csv, .jpg, .jpeg, .png" onChange={handleBulkUpload} className="hidden" />
                    </label>
                  </div>
                )}
                {editingId && (
                  <button onClick={handleCancelEdit} className="text-sm text-gray-400 hover:text-white transition-colors">
                    Cancel
                  </button>
                )}
              </div>
            </div>
            
            
            {/* Scrape Tool */}
            <div className="mb-6 p-6 bg-black/40 border border-white/5 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white">Fetch Product Data from URL</h2>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={useFirecrawl}
                    onChange={(e) => setUseFirecrawl(e.target.checked)}
                    className="peer h-4 w-4 rounded border-white/20 bg-bg-dark checked:bg-primary transition-all"
                  />
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest peer-checked:text-primary transition-colors">Use Firecrawl (AI)</span>
                </label>
              </div>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={addUrlInput}
                  onChange={(e) => setAddUrlInput(e.target.value)}
                  placeholder="Paste Amazon, Flipkart, or Asus product URL..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-white"
                />
                <button
                  onClick={async () => {
                    if (!addUrlInput) return;
                    setLoading(true);
                    try {
                      const endpoint = useFirecrawl ? '/api/firecrawl-scrape' : '/api/scrape-product';
                      const res = await fetch(endpoint, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ url: addUrlInput })
                      });
                      const data = await safeJson(res);
                      if (!data || data.error) throw new Error(data?.error || "Unknown scrape error");
                      
                      setFormData(prev => ({
                        ...prev,
                        name: data.name || '',
                        brand: data.brand || '',
                        description: data.description || '',
                        price: data.price || '',
                        image: data.image || '',
                        category: data.category || prev.category,
                        additionalImages: data.additionalImages || []
                      }));
                      
                      const extractedSpecs = Object.entries(data.specifications || {}).map(([key, value]) => ({ key, value: String(value) }));
                      if (data.modelNumber) extractedSpecs.push({ key: 'Model Number', value: data.modelNumber });
                      if (data.sku) extractedSpecs.push({ key: 'SKU', value: data.sku });
                      
                      setSpecs(extractedSpecs);
                      showFeedback(`Scraped successfully using ${useFirecrawl ? 'Firecrawl' : 'standard scraper'}!`);
                      setAddUrlInput('');
                    } catch (err: any) {
                      showFeedback(`Scrape error: ${err.message}`);
                    } finally {
                      setLoading(false);
                    }
                  }}
                  className="px-6 py-3 bg-primary text-bg-dark font-bold rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <Database size={18} />}
                  Fetch Data
                </button>
              </div>
            </div>

            {/* Form */}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Product Name</label>
                <input required type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-bg-dark border border-white/10 rounded-xl px-4 py-3 focus:border-primary transition-colors outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Brand</label>
                  <input required type="text" value={formData.brand || ''} onChange={e => setFormData({...formData, brand: e.target.value})} className="w-full bg-bg-dark border border-white/10 rounded-xl px-4 py-3 focus:border-primary transition-colors outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Category</label>
                  <select value={formData.category || 'Laptops'} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-bg-dark border border-white/10 rounded-xl px-4 py-3 focus:border-primary transition-colors outline-none appearance-none">
                    {categories.length > 0 ? (
                      categories.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))
                    ) : (
                      PRODUCT_CATEGORIES.map(c => (
                        <option key={c.title} value={c.title}>{c.title}</option>
                      ))
                    )}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Product Description</label>
                <textarea 
                  value={formData.description || ''} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                  placeholder="Enter detailed description..."
                  rows={3} 
                  className="w-full bg-bg-dark border border-white/10 rounded-xl px-4 py-3 focus:border-primary transition-colors outline-none resize-none" 
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Product Media</label>
                <div className="space-y-4">
                  {/* File Upload Option */}
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/10 rounded-2xl cursor-pointer hover:border-primary hover:bg-white/5 transition-all group overflow-hidden relative">
                    <div className="flex flex-col items-center justify-center p-4 text-center">
                      <Upload className="w-8 h-8 text-gray-500 mb-2 group-hover:text-primary transition-colors" />
                      <p className="text-xs text-gray-400 group-hover:text-white transition-colors font-medium">Click to upload product image(s)</p>
                      <p className="text-[10px] text-gray-600 mt-1 uppercase tracking-widest font-black">JPG, JPEG, PNG, WEBP</p>
                    </div>
                    <input type="file" multiple className="hidden" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={handleImageChange} />
                  </label>
                  
                  {/* Gallery Previews */}
                  <div className="flex flex-wrap gap-4">
                    {/* Primary URL display (if not overridden by file preview) */}
                    {(imagePreview || formData.image) && (
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-white/20">
                        <img src={imagePreview || formData.image} alt="Primary" className="w-full h-full object-cover" />
                        <div className="absolute top-0 right-0 bg-primary text-black text-[10px] font-bold px-1 m-1 rounded shadow">Primary</div>
                      </div>
                    )}
                    
                    {/* Existing Additional URL Images */}
                    {formData.additionalImages.map((imgUrl, i) => (
                      <div key={`exist-${i}`} className="relative w-24 h-24 rounded-lg overflow-hidden border border-white/10 group">
                        <img src={imgUrl} alt={`Additional ${i}`} className="w-full h-full object-cover opacity-80" />
                        <button type="button" onClick={() => removeExistingImage(i)} className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-lg">
                           <Trash2 size={16} />
                        </button>
                      </div>
                    ))}

                    {/* New Upload Previews */}
                    {imagePreviews.map((preview, i) => (
                      <div key={`new-${i}`} className="relative w-24 h-24 rounded-lg overflow-hidden border border-primary/50 group">
                        <img src={preview} alt={`Upload ${i}`} className="w-full h-full object-cover" />
                        <div className="absolute top-0 left-0 bg-blue-500 text-white text-[10px] px-1 m-1 rounded font-bold shadow">New</div>
                        <button type="button" onClick={() => removeSelectedImage(i)} className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-lg">
                           <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* URL Paste Option */}
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-1">
                      <ImageIcon size={14} className="text-gray-500" />
                      <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Image URLs</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <input 
                        type="text" 
                        placeholder="Primary URL: https://images.unsplash.com/..."
                        value={formData.image || ''} 
                        onChange={e => setFormData({...formData, image: e.target.value})} 
                        className="w-full bg-bg-dark border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary transition-colors outline-none cursor-text disabled:cursor-not-allowed" 
                      />
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          placeholder="Additional URL..."
                          value={addUrlInput || ''} 
                          onChange={e => setAddUrlInput(e.target.value)} 
                          onKeyDown={e => {
                            if (e.key === 'Enter' && addUrlInput) {
                              e.preventDefault();
                              setFormData(prev => ({...prev, additionalImages: [...prev.additionalImages, addUrlInput]}));
                              setAddUrlInput('');
                            }
                          }}
                          className="flex-1 bg-bg-dark border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary transition-colors outline-none" 
                        />
                        <button 
                          type="button" 
                          onClick={() => {
                            if (addUrlInput) {
                              setFormData(prev => ({...prev, additionalImages: [...prev.additionalImages, addUrlInput]}));
                              setAddUrlInput('');
                            }
                          }}
                          className="px-4 bg-primary/20 text-primary border border-primary/30 rounded-xl hover:bg-primary/30 transition-colors flex items-center justify-center font-bold"
                          title="Add additional image"
                        >
                           <Plus size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Price</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="₹45,000" 
                    value={formData.price || ''} 
                    onChange={e => setFormData({...formData, price: e.target.value})} 
                    onBlur={() => setFormData(prev => ({...prev, price: formatPrice(prev.price)}))}
                    className="w-full bg-bg-dark border border-white/10 rounded-xl px-4 py-3 focus:border-primary transition-colors outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Old Price (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="₹50,000" 
                    value={formData.oldPrice || ''} 
                    onChange={e => setFormData({...formData, oldPrice: e.target.value})} 
                    onBlur={() => {
                        if (formData.oldPrice.trim()) {
                            setFormData(prev => ({...prev, oldPrice: formatPrice(prev.oldPrice)}));
                        }
                    }}
                    className="w-full bg-bg-dark border border-white/10 rounded-xl px-4 py-3 focus:border-primary transition-colors outline-none" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Discount/Badge (Optional)</label>
                <input type="text" placeholder="e.g. Best Seller" value={formData.discount || ''} onChange={e => setFormData({...formData, discount: e.target.value})} className="w-full bg-bg-dark border border-white/10 rounded-xl px-4 py-3 focus:border-primary transition-colors outline-none" />
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
                        value={spec.key || ''}
                        onChange={(e) => handleSpecChange(index, 'key', e.target.value)}
                        className="flex-1 bg-bg-dark border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-primary outline-none"
                      />
                      <input 
                        type="text" 
                        placeholder="Value (e.g. 16GB)"
                        value={spec.value || ''}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2 p-3 bg-primary/5 border border-primary/20 rounded-xl mb-4">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center">
                        <input 
                          type="checkbox" 
                          checked={!!formData.isHotSelling}
                          onChange={(e) => setFormData({...formData, isHotSelling: e.target.checked})}
                        className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-white/20 bg-bg-dark checked:border-primary checked:bg-primary transition-all"
                      />
                      <Plus size={14} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-bg-dark opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-primary group-hover:text-white transition-colors uppercase tracking-widest">Hot Selling</span>
                      <span className="text-[10px] text-gray-500 font-medium">Show in Hot Selling section</span>
                    </div>
                  </label>
                </div>

                <div className="flex flex-col gap-2 p-3 bg-blue-500/5 border border-blue-500/20 rounded-xl mb-4">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center">
                        <input 
                          type="checkbox" 
                          checked={!!formData.showInHomeGrid}
                          onChange={(e) => setFormData({...formData, showInHomeGrid: e.target.checked})}
                        className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-white/20 bg-bg-dark checked:border-blue-500 checked:bg-blue-500 transition-all"
                      />
                      <Plus size={14} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-blue-400 group-hover:text-white transition-colors uppercase tracking-widest">Home Grid</span>
                      <span className="text-[10px] text-gray-500 font-medium">Feature in Home Category Grid</span>
                    </div>
                  </label>
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
            <div className="sticky top-[88px] z-20 bg-bg-dark/80 backdrop-blur-md py-4 -mt-4 mb-2 border-b border-white/5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    Inventory ({filteredProducts.length})
                  </h2>
                  {filteredProducts.length > 0 && (
                    <label className="flex items-center gap-2 cursor-pointer bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                      <input 
                        type="checkbox" 
                        checked={isAllSelected}
                        onChange={toggleSelectAll}
                        className="rounded border-white/10 text-primary focus:ring-primary bg-bg-dark cursor-pointer"
                      />
                      <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Select All</span>
                    </label>
                  )}
                  {selectedIds.size > 0 && !confirmingBulkDelete && !confirmingAllDelete && (
                    <button 
                      onClick={() => setConfirmingBulkDelete(true)}
                      disabled={loading}
                      className="flex items-center gap-2 px-4 py-1.5 bg-red-500/10 text-red-500 border border-red-500/30 rounded-lg hover:bg-red-500 hover:text-white transition-all text-sm font-bold shadow-lg shadow-red-500/10"
                    >
                      <Trash2 size={16} />
                      Delete {selectedIds.size}
                    </button>
                  )}
                  {confirmingBulkDelete && (
                    <div className="flex items-center gap-2">
                       <span className="text-sm font-bold text-red-400">Sure?</span>
                       <button
                         onClick={handleDeleteSelected}
                         disabled={loading}
                         className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm font-bold hover:bg-red-600 transition-colors"
                       >
                         Yes, delete
                       </button>
                       <button
                         onClick={() => setConfirmingBulkDelete(false)}
                         disabled={loading}
                         className="px-3 py-1.5 bg-gray-500 text-white rounded-lg text-sm font-bold hover:bg-gray-600 transition-colors"
                       >
                         Cancel
                       </button>
                    </div>
                  )}
                  {products.length > 0 && !confirmingAllDelete && !confirmingBulkDelete && (
                    <button 
                      onClick={() => setConfirmingAllDelete(true)}
                      disabled={loading}
                      className="flex items-center gap-2 px-4 py-1.5 bg-red-600/20 text-red-500 border border-red-600/40 rounded-lg hover:bg-red-600 hover:text-white transition-all text-sm font-bold"
                    >
                      <Trash2 size={16} />
                      Delete All Items
                    </button>
                  )}
                  {confirmingAllDelete && (
                    <div className="flex items-center gap-2 bg-red-500/10 p-2 rounded-xl border border-red-500/20 animate-in fade-in zoom-in-95">
                       <span className="text-xs font-bold text-red-400 uppercase tracking-widest px-2">Wipe everything?</span>
                       <button
                         onClick={handleDeleteAll}
                         disabled={loading}
                         className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-black uppercase tracking-widest hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20"
                       >
                         Confirm Wipe
                       </button>
                       <button
                         onClick={() => setConfirmingAllDelete(false)}
                         disabled={loading}
                         className="px-3 py-1.5 bg-white/10 text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-white/20 transition-colors"
                       >
                         Cancel
                       </button>
                    </div>
                  )}
                </div>
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search products..." 
                    value={searchQuery || ''}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 focus:border-primary transition-colors outline-none text-sm"
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
              <div className="max-h-[600px] overflow-y-auto p-4 space-y-4 scrollbar-hide">
                {filteredProducts.map(product => (
                  <div key={product.id} className={`flex items-center gap-4 p-4 bg-bg-dark border rounded-2xl transition-all ${editingId === product.id ? 'border-primary ring-1 ring-primary' : 'border-white/5'} ${selectedIds.has(product.id) ? 'bg-primary/5 border-primary/20' : ''}`}>
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        checked={selectedIds.has(product.id)}
                        onChange={() => toggleSelectProduct(product.id)}
                        className="w-5 h-5 rounded border-white/10 text-primary focus:ring-primary bg-bg-dark cursor-pointer"
                      />
                    </div>
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
