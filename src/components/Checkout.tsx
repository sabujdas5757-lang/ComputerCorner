import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, addDoc, serverTimestamp, doc, onSnapshot } from 'firebase/firestore';
import { ShoppingCart, ArrowLeft, Send, CheckCircle2, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    houseNumber: '',
    streetAddress: '',
    city: '',
    zipCode: '',
    transactionId: '',
  });

  const [paymentSettings, setPaymentSettings] = useState({ upiId: '7501090919@ybl' });

  React.useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'settings', 'payment'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setPaymentSettings({
          upiId: data.upiId || '7501090919@ybl'
        });
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'settings/payment');
    });
    return () => unsubscribe();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setIsSubmitting(true);
    try {
      // 1. Save to Firestore
      const orderData = {
        ...form,
        cartTotal,
        userId: user?.uid || null,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        createdAt: serverTimestamp(),
        status: 'pending'
      };

      await addDoc(collection(db, 'orders'), orderData);

      setIsSuccess(true);
      clearCart();
      // Literal popup message as requested
      setTimeout(() => {
        alert('our team call you shortly to confirm your order');
      }, 500);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'orders');
      alert('There was a problem submitting your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-bg-dark flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-6 mt-20">
          <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-3xl p-8 text-center">
            <CheckCircle2 size={64} className="text-primary mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">Order Placed Successfully!</h2>
            <p className="text-gray-400 mb-8 font-medium leading-relaxed">
              our team call you shortly to confirm your order. <br />
              We have saved your details and will verify your payment shortly.
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-primary hover:bg-primary/90 text-black font-black py-4 px-8 rounded-xl uppercase tracking-widest text-sm transition-all"
            >
              Back to Home
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-dark flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-[1700px] w-[98%] mx-auto px-4 md:px-6 pt-32 pb-24">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          <span className="font-bold">Back</span>
        </button>

        <h1 className="text-3xl md:text-5xl font-black text-white mb-12 uppercase tracking-tight">Checkout</h1>

        {cart.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
            <ShoppingCart size={48} className="text-gray-500 mx-auto mb-4" />
            <p className="text-xl text-gray-400 mb-6">Your cart is empty</p>
            <button 
              onClick={() => navigate('/')}
              className="bg-primary text-black font-black px-8 py-3 rounded-xl hover:scale-[1.02] transition-transform uppercase tracking-widest text-sm"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Form Section */}
            <div className="lg:col-span-7 xl:col-span-8">
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-primary text-black flex items-center justify-center text-sm">1</span>
                  Delivery Details
                </h2>
                
                <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">First Name *</label>
                      <input 
                        type="text" name="firstName" required
                        value={form.firstName} onChange={handleChange}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Last Name</label>
                      <input 
                        type="text" name="lastName"
                        value={form.lastName} onChange={handleChange}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Phone Number *</label>
                      <input 
                        type="tel" name="phone" required
                        value={form.phone} onChange={handleChange}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
                      <input 
                        type="email" name="email"
                        value={form.email} onChange={handleChange}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-6 mt-6">
                    <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-widest">Shipping Address</h3>
                    <div className="space-y-6">
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                         <div className="md:col-span-1">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">House N.O. *</label>
                            <input 
                              type="text" name="houseNumber" required
                              value={form.houseNumber} onChange={handleChange}
                              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none transition-colors"
                            />
                         </div>
                         <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Street Address *</label>
                            <input 
                              type="text" name="streetAddress" required
                              value={form.streetAddress} onChange={handleChange}
                              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none transition-colors"
                            />
                         </div>
                       </div>
                       
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">City *</label>
                            <input 
                              type="text" name="city" required
                              value={form.city} onChange={handleChange}
                              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none transition-colors"
                            />
                         </div>
                         <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Zip / Postal Code *</label>
                            <input 
                              type="text" name="zipCode" required
                              value={form.zipCode} onChange={handleChange}
                              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none transition-colors"
                            />
                         </div>
                       </div>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-6 mt-8">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-primary text-black flex items-center justify-center text-sm">2</span>
                      Payment Details
                    </h2>

                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 text-center mb-6">
                       <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-widest">Scan to Pay via UPI</h3>
                       <div className="bg-white p-4 rounded-xl inline-block mb-4">
                         <QRCodeSVG 
                           value={`upi://pay?pa=${paymentSettings.upiId}&pn=Computer%20Corner&am=${cartTotal}&cu=INR`} 
                           size={180} 
                           level="H"
                         />
                       </div>
                       <p className="text-gray-400 text-sm font-bold">UPI ID: {paymentSettings.upiId}</p>
                       <p className="text-gray-500 text-xs mt-2">Open any UPI app (GPay, PhonePe, Paytm) and scan the QR code to pay <span className="text-white font-bold">₹{cartTotal.toLocaleString()}</span></p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Transaction ID / UTR *</label>
                      <input 
                        type="text" name="transactionId" required
                        value={form.transactionId} onChange={handleChange}
                        placeholder="Enter the 12-digit UTR or Transaction ID here"
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none transition-colors"
                      />
                      <p className="text-[10px] text-primary mt-2 uppercase tracking-widest">Please complete the payment first, then enter the reference number.</p>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-5 xl:col-span-4">
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 sticky top-32">
                <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                  {cart.map(item => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-16 h-16 bg-white p-2 rounded-lg shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1 py-1">
                        <h4 className="text-xs font-bold text-white line-clamp-2">{item.name}</h4>
                        <div className="flex justify-between items-center mt-2">
                           <span className="text-gray-400 text-xs">Qty: {item.quantity}</span>
                           <span className="text-primary font-bold text-sm">₹{(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/10 pt-6 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="font-bold text-white">₹{cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Shipping</span>
                    <span className="font-bold text-primary">Free</span>
                  </div>
                  <div className="border-t border-white/5 pt-4 flex justify-between items-center">
                    <span className="text-lg font-bold text-white">Total</span>
                    <span className="text-2xl font-black text-primary">₹{cartTotal.toLocaleString()}</span>
                  </div>
                </div>

                <button 
                  type="submit"
                  form="checkout-form"
                  disabled={isSubmitting}
                  className="w-full mt-8 bg-primary hover:bg-primary/90 text-black font-black py-4 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest text-sm disabled:opacity-50 disabled:pointer-events-none"
                >
                  {isSubmitting ? 'Processing...' : (
                    <>
                      <Send size={18} />
                      Place Order
                    </>
                  )}
                </button>
                <p className="text-[10px] text-gray-500 text-center mt-4 uppercase tracking-widest">
                  Secure checkout. Payments are handled separately.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
