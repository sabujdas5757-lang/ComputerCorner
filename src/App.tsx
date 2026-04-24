/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Brands from './components/Brands';
import ProductGallery from './components/ProductGallery';
import Products from './components/Products';
import Services from './components/Services';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-bg-dark text-white selection:bg-primary selection:text-bg-dark">
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
    </div>
  );
}
