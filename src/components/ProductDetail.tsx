/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, MessageSquare, Star, Shield, Truck, Home, Send, RotateCcw, Copy } from 'lucide-react';
import { useProducts } from '../contexts/ProductContext';
import { useAuth } from '../contexts/AuthContext';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, query, where, getDocs, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import Navbar from './Navbar';
import Footer from './Footer';
import { checkIfAdmin } from '../utils/admin';

const getNumericPrice = (priceStr: string) => {
  const match = priceStr.replace(/,/g, '').match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
};

export default function ProductDetail() {
  const { products: PRODUCTS } = useProducts();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { productId } = useParams();
  
  const isAdmin = checkIfAdmin(user?.email);
  const product = PRODUCTS.find(p => p.id === productId);
  const [activeImage, setActiveImage] = useState(product?.image || '');
  const [qty, setQty] = useState(1);
  
  const [reviews, setReviews] = useState<any[]>([]);
  const [hasOrdered, setHasOrdered] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    // Scroll to top when product ID changes
    window.scrollTo(0, 0);
  }, [productId]);

  useEffect(() => {
    if (product) {
      setActiveImage(product.image);
    }
  }, [product]);

  useEffect(() => {
    if (!productId) return;
    const q = query(collection(db, 'reviews'), where('productId', '==', productId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setReviews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      console.error(error);
    });
    return () => unsubscribe();
  }, [productId]);

  useEffect(() => {
    if (!user || !productId || !product) return;
    const checkOrder = async () => {
      try {
        const q = query(collection(db, 'orders'), where('userId', '==', user.uid));
        const snapshot = await getDocs(q);
        const ordered = snapshot.docs.some(doc => {
          const items = doc.data().items || [];
          return items.some((item: any) => item.id === productId || item.name === product.name);
        });
        setHasOrdered(ordered);
      } catch (error) {
        console.error('Failed to check order history');
      }
    };
    checkOrder();
  }, [user, productId, product]);

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !productId) return;
    
    setIsSubmittingReview(true);
    try {
      await addDoc(collection(db, 'reviews'), {
        productId,
        userId: user.uid,
        userName: user.email?.split('@')[0] || 'User',
        rating: reviewForm.rating,
        comment: reviewForm.comment,
        createdAt: serverTimestamp()
      });
      setReviewForm({ rating: 5, comment: '' });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'reviews');
      alert('Failed to submit review');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
  };

  const hasReviewed = reviews.some(r => r.userId === user?.uid);
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : product?.reviews ? '4.2' : '4.2';

  if (!product) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold mb-4">Product Not Found</h2>
          <Link to="/" className="text-[#388e3c] font-bold hover:underline mb-2 block">Back to Home</Link>
          <Link to="/catalog" className="text-gray-600 font-bold hover:underline">Back to Catalog</Link>
        </div>
      </div>
    );
  }

  const allImages = [product.image, ...(product.additionalImages || [])].filter(Boolean);
  
  // Get similar products
  const similarProducts = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 5);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </header>
      
      <main className="flex-1 pt-16 md:pt-20 pb-20">
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm text-gray-300 mb-6 flex-wrap">
            <Link to="/" className="text-gray-300 hover:text-primary transition-colors">Home</Link>
            <span className="text-gray-500">›</span>
            <Link to="/catalog" className="text-gray-300 hover:text-primary transition-colors">Products</Link>
            <span className="text-gray-500">›</span>
            <Link to={`/catalog/${product.category.toUpperCase()}`} className="text-gray-300 uppercase hover:text-primary transition-colors">{product.category}</Link>
            <span className="text-gray-500">›</span>
            <span className="text-gray-100 font-medium">{product.name}</span>
          </div>

          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-100">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Column: Images and Buttons */}
              <div className="w-full lg:w-[40%] flex flex-col gap-4">
                <div className="flex flex-col lg:flex-row gap-4 h-auto lg:h-[400px]">
                  {/* Main Image */}
                  <div className="flex-1 border border-gray-200 rounded relative flex items-center justify-center p-4 bg-white order-1 lg:order-2">
                    {activeImage && (
                      <img 
                        src={activeImage} 
                        alt={product.name} 
                        className="max-w-full max-h-[350px] object-contain mix-blend-multiply"
                      />
                    )}
                  </div>
                  
                  {/* Thumbnails */}
                  <div className="flex flex-row lg:flex-col gap-2 w-full lg:w-16 overflow-x-auto lg:overflow-y-auto lg:overflow-x-hidden no-scrollbar order-2 lg:order-1">
                    {allImages.map((img, i) => (
                      <button 
                        key={i}
                        onClick={() => setActiveImage(img)}
                        className={`w-16 h-16 rounded border p-1 shrink-0 ${
                          activeImage === img ? 'border-primary border-2 shadow-sm' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-contain" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Check Availability Button */}
                <div className="flex flex-col gap-3 mt-4">
                  <a 
                    href={`https://wa.me/917501090919?text=I'm interested in checking availability for: ${product.name}. Please let me know if it's in stock.`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-[#25D366] text-white py-4 rounded-xl font-black flex items-center justify-center gap-3 hover:bg-[#128C7E] transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98] uppercase tracking-widest text-sm"
                  >
                    <MessageSquare size={22} fill="currentColor" />
                    Check Availability on WhatsApp
                  </a>
                </div>
              </div>

              {/* Right Column: Product Info */}
              <div className="flex-1 flex flex-col relative">
                <button onClick={handleShare} className="absolute right-0 top-0 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-600 transition">
                  <Copy size={16} />
                </button>
                
                <div className="mb-2">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{product.brand}</span>
                </div>
                
                <h1 className="text-xl md:text-2xl font-normal text-black mb-3 leading-snug pr-12">
                  {product.name}
                </h1>
                
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-1 bg-[#388e3c] text-white px-2 py-0.5 rounded text-xs font-bold">
                    {averageRating} <Star size={10} className="fill-current" />
                  </div>
                  <span className="text-gray-500 font-medium text-sm">Ratings & Reviews (226)</span>
                </div>

                <div className="flex items-end gap-3 mb-4">
                  <span className="text-3xl font-medium text-black leading-none">{product.price.split(' The')[0]}</span>
                  {product.oldPrice && (
                    <span className="text-gray-500 line-through text-sm mb-1">{product.oldPrice}</span>
                  )}
                  {product.discount && (
                    <span className="text-[#388e3c] font-bold text-sm mb-1">{product.discount} off</span>
                  )}
                </div>
                
                <div className="flex items-center gap-2 text-[#388e3c] font-bold text-sm mb-6">
                  <Shield size={16} />
                  <span>In Stock (4 available)</span>
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-6 mb-8">
                  <span className="text-gray-900 font-medium text-sm">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded overflow-hidden text-black">
                    <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 py-1.5 bg-gray-50 hover:bg-gray-100 border-r border-gray-300 text-lg font-bold pb-2 transition">-</button>
                    <span className="px-6 py-1.5 bg-white font-medium min-w-[3rem] text-center">{qty}</span>
                    <button onClick={() => setQty(qty + 1)} className="px-4 py-1.5 bg-gray-50 hover:bg-gray-100 border-l border-gray-300 text-lg font-bold pb-2 transition">+</button>
                  </div>
                </div>

                {/* Available Offers */}
                <div className="border border-gray-200 rounded-lg p-5 font-sans mb-8">
                  <h3 className="font-bold text-gray-900 mb-4 text-base tracking-wide">Available Offers</h3>
                  <ul className="space-y-4 text-sm text-gray-800">
                    <li className="flex gap-3 items-start">
                       <Shield size={18} className="text-[#388e3c] shrink-0 mt-0.5" />
                       <span>1 Year Manufacturer Warranty</span>
                    </li>
                    <li className="flex gap-3 items-start">
                       <RotateCcw size={18} className="text-[#388e3c] shrink-0 mt-0.5" />
                       <span><strong>7 Days Replacement Policy</strong> (T&C Apply)</span>
                    </li>
                    <li className="flex gap-3 items-start">
                       <Truck size={18} className="text-[#388e3c] shrink-0 mt-0.5" />
                       <div>
                         <span className="block mb-1 text-black">Delivery: <span className="line-through text-gray-500">₹50</span> — Cash on Delivery Available</span>
                         <span className="text-xs text-gray-500 italic block mt-1">* Free delivery above ₹4,999 | COD available above ₹499</span>
                       </div>
                    </li>
                  </ul>
                </div>

                {/* Highlights */}
                <div className="mb-8">
                  <h3 className="font-bold text-gray-900 mb-3 text-sm">Highlights</h3>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-2 ml-1">
                    <li>Brand: <span className="font-medium text-black">{product.brand}</span></li>
                    <li>SKU: <span className="font-medium text-black">N/A</span></li>
                    <li>Category: <span className="font-medium text-black">ACCESSORIES, {product.category.toUpperCase()}</span></li>
                    {product.isHotSelling && <li><span className="font-medium text-[#388e3c]">Hot Selling Item</span></li>}
                  </ul>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-base font-bold text-gray-900 border-b border-gray-200 pb-3 mb-4 tracking-wide">Description</h3>
                  <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed max-h-16 overflow-y-auto custom-scrollbar pr-2 block">
                    {product.description}
                  </div>
                  {product.usageTags && (
                    <div className="text-sm text-gray-600 mt-6 pt-4 border-t border-gray-100 whitespace-nowrap overflow-x-auto pb-2 custom-scrollbar">
                      <span className="font-medium text-gray-900">Tags: </span>
                      {product.usageTags.join(', ')}
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>

          {/* Similar Products */}
          {similarProducts.length > 0 && (
            <div className="mt-8 mb-12">
              <div className="bg-[#ffebc2] p-4 lg:p-6 pb-8 border border-[#eab308]/20 rounded-t-lg">
                <h2 className="text-xl md:text-2xl font-bold text-black mb-1">Similar Products</h2>
                <p className="text-sm text-gray-800">Products you might also like</p>
              </div>
              <div className="bg-white p-4 lg:p-6 mb-8 rounded-b-lg border border-t-0 border-gray-200 shadow-sm">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 -mt-8 relative z-10">
                  {similarProducts.map((p) => (
                    <Link 
                      to={`/product/${p.id}`} 
                      key={p.id}
                      className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all group flex flex-col"
                    >
                      <div className="relative aspect-square p-2 border-b border-gray-100">
                        {p.discount && (
                          <div className="absolute top-2 left-2 px-2 py-1 bg-[#388e3c] text-white text-[10px] font-bold rounded z-10">
                            {p.discount} OFF
                          </div>
                        )}
                        <img 
                          src={p.image} 
                          alt={p.name} 
                          className="w-full h-full object-contain p-2 mix-blend-multiply group-hover:scale-105 transition-transform duration-500" 
                        />
                      </div>
                      <div className="p-3 flex flex-col flex-1">
                        <h3 className="text-xs sm:text-sm font-medium text-black line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                          {p.name}
                        </h3>
                        <span className="text-[10px] text-gray-500 uppercase font-medium mb-2">{p.brand}</span>
                        <div className="flex items-center gap-1.5 mt-auto">
                          <span className="font-bold text-sm sm:text-base text-black">{p.price.split(' The')[0]}</span>
                          {p.oldPrice && (
                            <span className="text-[10px] sm:text-xs text-gray-400 line-through">{p.oldPrice}</span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Customer Reviews Section */}
          <div className="mt-12 bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
              <div>
                <h2 className="text-lg font-bold tracking-wide text-black">Customer Reviews</h2>
              </div>
              <div className="flex items-center gap-1.5 bg-[#388e3c] text-white px-3 py-1 rounded text-sm font-bold">
                {averageRating} <Star size={14} className="fill-current" />
              </div>
            </div>

            {hasOrdered && !hasReviewed && (
              <div className="mb-8 p-6 bg-gray-50 border border-gray-200 rounded-lg">
                <h3 className="text-base font-bold text-black mb-4">Write a Review</h3>
                <form onSubmit={submitReview} className="space-y-4">
                  <div>
                     <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">Rating</label>
                     <div className="flex gap-1">
                       {[1, 2, 3, 4, 5].map((star) => (
                         <button
                           key={star}
                           type="button"
                           onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                           className="focus:outline-none focus:ring-2 focus:ring-primary rounded p-1"
                         >
                           <Star size={24} className={`${reviewForm.rating >= star ? 'text-[#ff9f00] fill-current' : 'text-gray-300'} transition-colors`} />
                         </button>
                       ))}
                     </div>
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">Your Review</label>
                     <textarea
                       required
                       rows={3}
                       value={reviewForm.comment}
                       onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                       placeholder="What did you like or dislike?"
                       className="w-full bg-white border border-gray-300 rounded p-3 text-black focus:border-[#388e3c] outline-none transition-colors resize-none text-sm"
                     ></textarea>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#388e3c] text-white rounded font-bold text-sm tracking-wide hover:bg-[#2e7d32] transition-colors disabled:opacity-50"
                  >
                    {isSubmittingReview ? 'Submitting...' : (
                      <>
                        <Send size={16} />
                        Submit Review
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            <div className="space-y-6">
              {reviews.length > 0 ? reviews.map((review) => (
                <div key={review.id} className="pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                       <div className="flex items-center bg-[#388e3c] text-white px-1.5 py-0.5 rounded text-[10px] font-bold">
                         {review.rating} <Star size={8} className="fill-current ml-0.5" />
                       </div>
                       <span className="font-bold text-sm text-black">{review.userName || 'Verified Customer'}</span>
                    </div>
                    <span className="text-[10px] font-medium text-gray-500 uppercase tracking-widest mt-1">
                      {review.createdAt?.toDate ? review.createdAt.toDate().toLocaleDateString() : 'Recently'}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
                </div>
              )) : (product.reviews || [
                { user: 'Verified Customer', rating: 5, comment: 'Excellent product and very friendly store staff.', date: 'Recently' }
              ]).map((review: any, i: number) => (
                <div key={i} className="pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                       <div className="flex items-center bg-[#388e3c] text-white px-1.5 py-0.5 rounded text-[10px] font-bold">
                         {review.rating} <Star size={8} className="fill-current ml-0.5" />
                       </div>
                       <span className="font-bold text-sm text-black">{review.user}</span>
                    </div>
                    <span className="text-[10px] font-medium text-gray-500 uppercase tracking-widest mt-1">{review.date}</span>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

