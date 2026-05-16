import React from 'react';
import { X, Minus, Plus, ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showLoginMsg, setShowLoginMsg] = React.useState(false);

  const handleCheckout = () => {
    if (!user) {
      setShowLoginMsg(true);
      setTimeout(() => setShowLoginMsg(false), 3000);
      return;
    }
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/60 z-[200] backdrop-blur-sm"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 right-0 h-full w-[90%] md:w-[400px] bg-[#0a0a0a] border-l border-white/10 z-[201] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <ShoppingCart className="text-primary" />
                Your Cart
              </h2>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-400 hover:text-white" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
                  <ShoppingCart size={48} className="text-gray-700" />
                  <p>Your cart is empty.</p>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="text-primary font-bold hover:underline"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex gap-4 bg-white/5 rounded-xl p-4 border border-white/5 relative">
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="absolute top-2 right-2 text-gray-500 hover:text-red-500 transition-colors"
                    >
                      <X size={16} />
                    </button>
                    <div className="w-20 h-20 bg-white p-2 rounded-lg shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex flex-col justify-between py-1">
                      <div>
                        <h4 className="text-sm font-bold text-white line-clamp-2">{item.name}</h4>
                        <p className="text-primary font-bold mt-1 text-sm">₹{item.price.toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-3 mt-3">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors text-white"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-white text-sm font-bold">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors text-white"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-black/50">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-400 font-medium">Subtotal</span>
                  <span className="text-2xl font-black text-white">₹{cartTotal.toLocaleString()}</span>
                </div>
                {showLoginMsg && (
                  <div className="mb-4 text-red-500 font-bold text-center text-sm bg-red-500/10 py-2 rounded-lg">
                    Please login first to checkout.
                  </div>
                )}
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-primary hover:bg-primary/90 text-black font-black py-4 rounded-xl transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
                >
                  <ShoppingCart size={18} />
                  Checkout Now
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
