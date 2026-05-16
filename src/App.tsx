/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import CategoryGrid from './components/CategoryGrid';
import Hero from './components/Hero';
import Footer from './components/Footer';
import QuickAccess from './components/QuickAccess';
import Catalog from './components/Catalog';
import ProductDetail from './components/ProductDetail';
import LaptopUsageHub from './components/LaptopUsageHub';
import AdminRoute from './components/AdminRoute';
import AdminDashboard from './components/AdminDashboard';
import AdminUsageHub from './components/AdminUsageHub';
import AmazonScraper from './components/AmazonScraper';
import ScrollToTop from './components/ScrollToTop';
import Profile from './components/Profile';
import Contact from './components/Contact';
import CategoryHub from './components/CategoryHub';

import ProductSection from './components/ProductSection';
import HotSellingSection from './components/HotSellingSection';
import TopBanners from './components/TopBanners';
import CustomTopGridSection from './components/CustomTopGridSection';

import { db } from './firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

function HomePage() {
  const [featuredCategories, setFeaturedCategories] = useState<any[]>([]);
  const [hasLoadedCategories, setHasLoadedCategories] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'categories'), orderBy('sectionOrder', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const cats = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as any))
        .filter(cat => !!cat.showAsSection);
      
      setFeaturedCategories(cats);
      setHasLoadedCategories(true);
    }, (error) => {
      console.error("Error fetching categories for home page:", error);
      setHasLoadedCategories(true);
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </header>
      <main className="pt-16 md:pt-24">
        <TopBanners />
        <CategoryGrid />
        <CustomTopGridSection />
        <HotSellingSection />
        
        {hasLoadedCategories && featuredCategories.length > 0 ? (
          featuredCategories.map((cat: any) => (
            <ProductSection 
              key={cat.id} 
              title={cat.sectionTitle || cat.name} 
              category={cat.name} 
            />
          ))
        ) : (
          hasLoadedCategories && featuredCategories.length === 0 ? (
            <>
              <ProductSection title="Printers" category="Printers" />
              <ProductSection title="Premium Monitors" category="Monitors" />
              <ProductSection title="Laptops" category="Laptops" />
              <ProductSection title="CCTV" category="CCTV" />
            </>
          ) : (
            <div className="py-20 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          )
        )}
        
        <Hero />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-black text-white">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/scraper" element={<AdminRoute><AmazonScraper /></AdminRoute>} />
          <Route path="/admin/usage-hub" element={<AdminRoute><AdminUsageHub /></AdminRoute>} />
          <Route path="/quick-access" element={<QuickAccess />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/catalog/:categorySlug" element={<Catalog />} />
          <Route path="/laptops" element={<LaptopUsageHub />} />
          <Route path="/product/:productId" element={<ProductDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/category-hub/:categoryName" element={<CategoryHub />} />
        </Routes>
      </div>
    </Router>
  );
}
