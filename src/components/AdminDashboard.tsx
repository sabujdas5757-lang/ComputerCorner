import React, { useState, useMemo, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useProducts } from '../contexts/ProductContext';
import { Trash2, Edit2, Plus, Save, Search, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import { PRODUCT_CATEGORIES } from '../constants';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';

const USAGE_OPTIONS = ['Student Usage', 'Gaming', 'Editing', 'Office Usage', 'Macbook'];

export default function AdminDashboard() {
  const { logout } = useAuth();
  const { products, addProduct, updateProduct, deleteProduct, deleteMultipleProducts } = useProducts();
  const [loading, setLoading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
    return products.filter(product => 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  const [scrapeUrl, setScrapeUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [confirmingBulkDelete, setConfirmingBulkDelete] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const [scrapingStatus, setScrapingStatus] = useState<string | null>(null);

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

  const clientSideScrape = async (url: string) => {
    let html = '';
    const encodedUrl = encodeURIComponent(url);

    // Try multiple proxy services. Amazon is notoriously hard to scrape from free proxies.
    const getProxyRequests = [
      {
        name: 'Proxy A (AllOrigins)',
        fn: async () => {
          const res = await fetch(`https://api.allorigins.win/get?url=${encodedUrl}`);
          if (!res.ok) throw new Error("AllOrigins failed");
          const data = await safeJson(res);
          if (!data || !data.contents) throw new Error("Empty AllOrigins content");
          return data.contents;
        }
      },
      {
        name: 'Proxy B (Codetabs)',
        fn: async () => {
          const res = await fetch(`https://api.codetabs.com/v1/proxy?quest=${encodedUrl}`);
          if (!res.ok) throw new Error("Codetabs failed");
          return await res.text();
        }
      },
      {
        name: 'Proxy C (CorsProxy)',
        fn: async () => {
          const res = await fetch(`https://corsproxy.io/?${encodedUrl}`);
          if (!res.ok) throw new Error("Corsproxy failed");
          return await res.text();
        }
      }
    ];

    for (const proxy of getProxyRequests) {
      try {
        setScrapingStatus(`Trying ${proxy.name}...`);
        html = await proxy.fn();
        
        // Super basic validation that we actually got HTML and not an anti-bot captcha page
        if (html && 
            html.includes('<html') && 
            !html.includes('api.allorigins.win') && 
            !html.includes('503 - Service Unavailable') &&
            !html.includes('503 Service Unavailable') &&
            !html.includes('Robot Check') &&
            !html.includes('Bot Check') &&
            !html.includes('captcha')) {
           break;
        } else {
           console.warn(`${proxy.name} returned blocked content.`);
           html = ''; // Reset html if it hit a bot check
        }
      } catch (e) {
        console.warn(`${proxy.name} failed:`, e);
      }
    }
    
    if (!html || !html.includes('<html')) {
      throw new Error("Target website blocked all requests (Anti-bot protection). Please manually add the product details below.");
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const name = doc.querySelector('meta[property="og:title"]')?.getAttribute('content') || 
                 doc.querySelector('title')?.textContent ||
                 doc.querySelector('h1')?.textContent?.trim() ||
                 'Unknown Product';
    
    const priceEl = doc.querySelector('meta[property="product:price:amount"]') || 
                    doc.querySelector('[itemprop="price"]') || 
                    doc.querySelector('.price, .product-price, .amount, .a-price-whole');
    
    const priceText = priceEl?.getAttribute('content') || priceEl?.textContent || '0';
    let cleanedPrice = String(priceText).replace(/[^0-9.]/g, '');
    if (cleanedPrice && !cleanedPrice.startsWith('₹') && cleanedPrice !== '0') {
      cleanedPrice = `₹${cleanedPrice}`;
    }

    const oldPriceEl = doc.querySelector('.old-price, .a-text-strike, del');
    const oldPriceText = oldPriceEl?.textContent || '';
    let oldPrice = String(oldPriceText).replace(/[^0-9.]/g, '');
    if (oldPrice && !oldPrice.startsWith('₹')) {
      oldPrice = `₹${oldPrice}`;
    }

    const image = doc.querySelector('meta[property="og:image"]')?.getAttribute('content') || 
                  doc.querySelector('meta[name="twitter:image"]')?.getAttribute('content') ||
                  doc.querySelector('img[itemprop="image"]')?.getAttribute('src') ||
                  doc.querySelector('#landingImage, #imgBlkFront')?.getAttribute('src') || '';

    const additionalImages: string[] = [];
    const imageElements = Array.from(doc.querySelectorAll('#altImages img, .a-dynamic-image, .product-image-gallery img, .thumbnail img'));
    imageElements.forEach(el => {
      let src = el.getAttribute('src') || el.getAttribute('data-old-hires') || el.getAttribute('data-src');
      if (src) {
        if (src.includes('amazon.com') || src.includes('images-amazon.com')) {
          src = src.replace(/\._[A-Z0-9_]+_\./, '.');
        }
        if (src !== image && !additionalImages.includes(src) && src.startsWith('http')) {
          additionalImages.push(src);
        }
      }
    });

    if (additionalImages.length === 0) {
      const scriptMatch = html.match(/'colorImages':\s*({.+?}),/);
      if (scriptMatch && scriptMatch[1]) {
        try {
          const data = JSON.parse(scriptMatch[1].replace(/'/g, '"'));
          if (data.initial && Array.isArray(data.initial)) {
            data.initial.forEach((imgObj: any) => {
              if (imgObj.hiRes && imgObj.hiRes !== image && !additionalImages.includes(imgObj.hiRes)) {
                additionalImages.push(imgObj.hiRes);
              } else if (imgObj.large && imgObj.large !== image && !additionalImages.includes(imgObj.large)) {
                additionalImages.push(imgObj.large);
              }
            });
          }
        } catch (e) {}
      }
    }

    const description = doc.querySelector('meta[property="og:description"]')?.getAttribute('content') || 
                        doc.querySelector('meta[name="description"]')?.getAttribute('content') ||
                        doc.querySelector('.description, .product-description, #feature-bullets')?.textContent?.trim() || '';

    const brandEl = doc.querySelector('meta[property="product:brand"]') || doc.querySelector('[itemprop="brand"] [itemprop="name"]') || doc.querySelector('[itemprop="brand"]') || doc.querySelector('#bylineInfo');
    let brand = brandEl?.getAttribute('content') || brandEl?.textContent?.trim() || '';
    if (brand) {
      if (brand.toLowerCase().startsWith('visit the ')) {
        brand = brand.replace(/visit the /i, '').replace(/ store/i, '').trim();
      }
      if (brand.toLowerCase().startsWith('brand: ')) {
        brand = brand.replace(/brand: /i, '').trim();
      }
    } else {
      brand = 'Unknown';
    }

    const category = doc.querySelector('meta[property="product:category"]')?.getAttribute('content') || 
                     doc.querySelector('[itemprop="category"]')?.getAttribute('content') || 
                     doc.querySelector('.nav-a-content')?.textContent?.trim() || '';

    let discount = '';
    const discountEl = doc.querySelector('.savingsPercentage, .discount, .badge');
    if (discountEl) {
      discount = discountEl.textContent?.trim() || '';
    }

    const specifications: Record<string, string> = {};
    
    // Amazon and generic tables
    const specRows = Array.from(doc.querySelectorAll('#productDetails_techSpec_section_1 tr, #productDetails_techSpec_section_2 tr, table.spec-table tr, table._14cfVK tr, table.a-keyvalue tr, #productOverview_feature_div tr'));
    specRows.forEach(row => {
      const key = (row.querySelector('th')?.textContent || row.querySelector('td:first-child')?.textContent || '').trim();
      const value = (row.querySelector('td:not(:first-child)')?.textContent || row.querySelector('td:last-child')?.textContent || '').trim();
      
      if (key && value && !key.toLowerCase().includes('customer reviews') && !key.toLowerCase().includes('sellers')) {
        // Clean up common Amazon weird chars (ZWSP, Zero-width space)
        const cleanKey = key.replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
        const cleanVal = value.replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
        if (cleanKey && cleanVal) {
          specifications[cleanKey] = cleanVal;
        }
      }
    });

    const poRows = Array.from(doc.querySelectorAll('.po-row'));
    poRows.forEach(row => {
      const key = row.querySelector('.a-span3')?.textContent?.replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
      const value = row.querySelector('.a-span9')?.textContent?.replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
      if (key && value) {
        specifications[key] = value;
      }
    });

    let featureCount = 1;
    const bulletItems = Array.from(doc.querySelectorAll('#feature-bullets ul li:not(.a-hidden) span.a-list-item'));
    bulletItems.forEach(item => {
      const text = item.textContent?.trim();
      if (text && !text.includes('Hide') && !text.includes('Show more')) {
        specifications[`Feature ${featureCount++}`] = text;
      }
    });

    if ((!brand || brand === 'Unknown') && specifications['Brand']) {
      brand = specifications['Brand'];
    }

    return { name, price: cleanedPrice, oldPrice, image, additionalImages, description, brand, category, discount, specifications };
  };

  const handleScrapeProduct = async () => {
    if (!scrapeUrl) return;
    setIsImporting(true);
    setScrapingStatus('Connecting to backend...');
    try {
      // First, check backend health
      try {
        const healthRes = await fetch('/api/health');
        if (!healthRes.ok) {
           console.warn("Backend health check failed:", healthRes.status);
        }
      } catch (healthErr) {
        console.error("Backend health check error:", healthErr);
      }

      let productData;
      try {
        setScrapingStatus('Querying smart backend engine...');
        const response = await fetch('/api/scrape-product', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: scrapeUrl })
        });
        
        if (response.status === 405) {
          throw new Error("405 Method Not Allowed: The server is misconfigured or using a static host. Fallback triggered.");
        }

        const contentType = response.headers.get("content-type");
        const bodyText = await response.text();
        
        if (!contentType || !contentType.includes("application/json") || !bodyText) {
          console.error("Invalid response from backend:", bodyText.substring(0, 100));
          throw new Error(`Server returned a non-JSON or empty response (Status: ${response.status}). Fallback triggered.`);
        }

        try {
          productData = JSON.parse(bodyText);
        } catch (parseE) {
          throw new Error("Failed to parse backend JSON. Fallback triggered.");
        }

        if (!response.ok) throw new Error(productData?.error || 'Failed to scrape');

        // AUTOMATIC STORAGE: Upload the scraped image to Vercel Blob immediately
        if (productData.image && productData.image.startsWith('http')) {
          try {
            setScrapingStatus('Saving primary image to Vercel storage...');
            const uploadRes = await fetch('/api/upload-from-url', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ url: productData.image })
            });
            if (uploadRes.ok) {
              const uploadData = await safeJson(uploadRes);
              if (uploadData?.secure_url) {
                productData.image = uploadData.secure_url;
              }
            }
          } catch (uploadErr) {
            console.warn("Failed to auto-upload scraped image:", uploadErr);
          }
        }

        // Also try to upload additional images if there are a few
        if (productData.additionalImages && Array.isArray(productData.additionalImages)) {
          const topImages = productData.additionalImages.slice(0, 3); // Just the first few to save time/quota
          const savedImages: string[] = [];
          
          for (const imgUrl of topImages) {
            try {
              const uploadRes = await fetch('/api/upload-from-url', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: imgUrl })
              });
              if (uploadRes.ok) {
                const uploadData = await safeJson(uploadRes);
                if (uploadData?.secure_url) {
                  savedImages.push(uploadData.secure_url);
                } else {
                  savedImages.push(imgUrl);
                }
              } else {
                savedImages.push(imgUrl);
              }
            } catch (e) {
              savedImages.push(imgUrl);
            }
          }
          productData.additionalImages = [...savedImages, ...productData.additionalImages.slice(3)];
        }
      } catch (backendError: any) {
        console.warn("Backend scrape failed or unavailable, falling back to client-side proxy...", backendError.message);
        setScrapingStatus(`Backend check: ${backendError.message.substring(0, 30)}... Falling back to browser-proxies.`);
        productData = await clientSideScrape(scrapeUrl);
      }

      const product = {
        name: productData.name || '',
        brand: productData.brand && productData.brand.toLowerCase() !== 'unknown' ? productData.brand : '',
        category: (productData.category || 'Laptops') as any,
        description: productData.description || '',
        price: productData.price || '',
        oldPrice: productData.oldPrice || '',
        discount: productData.discount || '',
        usageTags: [],
        image: productData.image || '',
        additionalImages: productData.additionalImages || []
      };
      
      setFormData(product);
      
      const newSpecs: {key: string, value: string}[] = [];
      if (productData.specifications) {
         Object.entries(productData.specifications).forEach(([k, v]) => {
           newSpecs.push({key: k, value: String(v)});
         });
      }
      setSpecs(newSpecs);
      
      showFeedback('Product details imported to form. Review and click "Add Product".');
      setScrapeUrl('');

      // Scroll to form after import
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err: any) {
      showFeedback(`Error scraping/adding product: ${err.message}`);
    } finally {
      setIsImporting(false);
      setScrapingStatus(null);
    }
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
              let pPrice = String(getValue(['price', 'Price', 'PRICE']) || '0');
              if (pPrice && !pPrice.startsWith('₹') && pPrice !== '0') pPrice = `₹${pPrice}`;
              let pOldPrice = String(getValue(['oldPrice', 'OldPrice', 'oldprice', 'OLDPRICE']) || '');
              if (pOldPrice && !pOldPrice.startsWith('₹')) pOldPrice = `₹${pOldPrice}`;

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

              const product = {
                name: getValue(['name', 'Name', 'NAME']) || 'Unnamed Product',
                brand: getValue(['brand', 'Brand', 'BRAND']) || 'Unknown',
                category: (getValue(['category', 'Category', 'CATEGORY']) || 'Laptops') as any,
                description: getValue(['description', 'Description', 'DESCRIPTION']) || '',
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
              await addProduct({
                name: file.name.split('.')[0].replace(/[_-]/g, ' '),
                brand: 'Unknown',
                category: 'Laptops' as any,
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
    image: '',
    additionalImages: [] as string[]
  });

  const [specs, setSpecs] = useState<{ key: string; value: string }[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [addUrlInput, setAddUrlInput] = useState('');

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
      name: product.name,
      brand: product.brand,
      category: product.category,
      description: product.description,
      price: product.price,
      oldPrice: product.oldPrice || '',
      discount: product.discount || '',
      usageTags: Array.isArray(product.usageTags) ? product.usageTags : [],
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

      let finalPrice = formData.price.trim();
      if (finalPrice && !finalPrice.startsWith('₹') && finalPrice !== '0') {
        finalPrice = '₹' + finalPrice;
      }

      let finalOldPrice = formData.oldPrice.trim();
      if (finalOldPrice && !finalOldPrice.startsWith('₹')) {
        finalOldPrice = '₹' + finalOldPrice;
      }

      if (editingId) {
        const updateData: any = {
          ...formData,
          price: finalPrice,
          oldPrice: finalOldPrice,
          image: mainImageUrl,
          additionalImages: newAdditionalImages,
          category: formData.category as any,
          specifications: formattedSpecs
        };
        await updateProduct(editingId, updateData);
        showFeedback('Product updated successfully!');
      } else {
        await addProduct({
          ...formData,
          price: finalPrice,
          oldPrice: finalOldPrice,
          image: mainImageUrl || 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800',
          additionalImages: newAdditionalImages,
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
          <div ref={formRef} className="bg-white/5 border border-white/10 rounded-3xl p-8 h-fit">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                {editingId ? <Edit2 size={24} className="text-primary" /> : <Plus size={24} className="text-primary" />} 
                {editingId ? 'Edit Product' : 'Add New Product'}
              </h2>
              <div className="flex gap-2">
                {!editingId && (
                  <label className="text-sm bg-white/5 border border-white/10 px-3 py-2 rounded-lg cursor-pointer hover:bg-white/10 transition-colors flex items-center gap-2 text-primary whitespace-nowrap">
                    <Upload size={16} />
                    <span>Bulk Upload (.xlsx, .jpg)</span>
                    <input type="file" multiple accept=".xlsx, .xls, .csv, .jpg, .jpeg, .png" onChange={handleBulkUpload} className="hidden" />
                  </label>
                )}
                {editingId && (
                  <button onClick={handleCancelEdit} className="text-sm text-gray-400 hover:text-white transition-colors">
                    Cancel
                  </button>
                )}
              </div>
            </div>
            
            {/* Scrapper tool */}
            {!editingId && (
              <div className="mb-6 p-4 bg-white/5 border border-white/10 rounded-xl space-y-2">
                <p className="text-sm text-gray-400">Import from URL</p>
                <div className="flex gap-2">
                  <input type="text" value={scrapeUrl} onChange={e => setScrapeUrl(e.target.value)} placeholder="Enter product URL..." className="flex-1 bg-bg-dark border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-primary outline-none" />
                  <button 
                    type="button" 
                    onClick={handleScrapeProduct} 
                    disabled={isImporting}
                    className="bg-primary/20 text-primary px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isImporting ? <Loader2 size={16} className="animate-spin" /> : null}
                    {isImporting ? 'Importing...' : 'Import'}
                  </button>
                </div>
                {scrapingStatus && (
                  <p className="text-xs text-primary mt-2 animate-pulse flex items-center gap-1">
                    <Loader2 size={12} className="animate-spin" />
                    {scrapingStatus}
                  </p>
                )}
              </div>
            )}

            {/* Form */}
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
                <label className="block text-sm text-gray-400 mb-1">Product Description</label>
                <textarea 
                  value={formData.description} 
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
                        value={formData.image} 
                        onChange={e => setFormData({...formData, image: e.target.value})} 
                        className="w-full bg-bg-dark border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary transition-colors outline-none cursor-text disabled:cursor-not-allowed" 
                      />
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          placeholder="Additional URL..."
                          value={addUrlInput} 
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
                  {selectedIds.size > 0 && !confirmingBulkDelete && (
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
                </div>
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search products..." 
                    value={searchQuery}
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
