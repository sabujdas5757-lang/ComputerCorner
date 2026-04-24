/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Brands from './components/Brands';
import ProductGallery from './components/ProductGallery';
import Products from './components/Products';
import Services from './components/Services';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import Footer from './components/Footer';
import QuickAccess from './components/QuickAccess';
import Catalog from './components/Catalog';
import ProductDetail from './components/ProductDetail';

function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Brands />
        <Products />
        <ProductGallery />
        <Services />
        <Gallery />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-bg-dark text-white selection:bg-primary selection:text-bg-dark">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/quick-access" element={<QuickAccess />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/catalog/:categorySlug" element={<Catalog />} />
          <Route path="/product/:productId" element={<ProductDetail />} />
        </Routes>
      </div>
    </Router>
  );
}
