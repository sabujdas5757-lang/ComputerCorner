import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { User, Package, LogOut, Loader2, ArrowLeft, XCircle, CheckCircle2, Truck, Clock, X } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!user) {
      navigate('/');
      return;
    }

    const q = query(
      collection(db, 'orders'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setIsLoading(false);
    }, (error) => {
      console.error(error);
      setIsLoading(false);
      handleFirestoreError(error, OperationType.GET, 'orders');
    });

    return () => unsubscribe();
  }, [user, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const cancelOrder = async (orderId: string) => {
    alert("please contact with our customer care to cancel order within 24 hoursof ordering");
    
    // Still update the status in background for admin to see
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: 'cancellation requested',
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error requesting cancellation:', error);
    }
  };

  const isCancellable = (createdAt: any) => {
    if (!createdAt) {
      console.log('No createdAt found for order, not cancellable');
      return false;
    }
    try {
      const orderDate = createdAt.toDate ? createdAt.toDate() : new Date(createdAt.seconds * 1000 || createdAt);
      const now = new Date();
      const diffInHours = (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60);
      console.log(`Order age: ${diffInHours.toFixed(2)} hours`);
      return diffInHours <= 24;
    } catch (e) {
      console.error('Error calculating isCancellable:', e);
      return false;
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-bg-dark flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-[1200px] w-[98%] mx-auto px-4 md:px-6 pt-32 pb-24">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          <span className="font-bold">Back</span>
        </button>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 mb-8">
           <div className="w-24 h-24 bg-primary text-black rounded-full flex items-center justify-center">
              <User size={40} />
           </div>
           <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-black text-white">{user.email}</h1>
              <p className="text-gray-400 mt-2">Member Profile</p>
           </div>
           <button 
             onClick={handleLogout}
             className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center gap-2"
           >
             <LogOut size={16} /> Logout
           </button>
        </div>

        <div 
          onClick={() => navigate('/quick-access')}
          className="bg-primary/10 border border-primary/20 rounded-2xl p-4 mb-12 flex items-center justify-center gap-3 animate-pulse cursor-pointer hover:bg-primary/20 transition-colors group"
        >
           <span className="text-primary text-base group-hover:scale-125 transition-transform">📞</span>
           <p className="text-primary font-black text-xs md:text-sm uppercase tracking-[0.2em] text-center">
             if any problem call our customer care
           </p>
        </div>

        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Package className="text-primary" /> Your Orders
        </h2>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-primary" size={48} />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
            <Package size={48} className="text-gray-500 mx-auto mb-4" />
            <p className="text-xl text-gray-400 mb-6">You haven't placed any orders yet.</p>
            <button 
              onClick={() => navigate('/catalog')}
              className="bg-primary text-black font-black px-8 py-3 rounded-xl hover:scale-[1.02] transition-transform uppercase tracking-widest text-sm"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => {
              const status = (order.status || 'pending').toLowerCase();
              const canCancel = status !== 'cancelled' && status !== 'delivered' && status !== 'cancellation requested';

              return (
              <div key={order.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-white/5 bg-black/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
                   <div>
                     <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Order ID: {order.id}</p>
                     <p className="text-sm font-medium text-white">
                        Placed on {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'Recently'}
                     </p>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className={`px-4 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest ${
                        status === 'cancelled' ? 'bg-red-500/20 text-red-500' :
                        status === 'cancellation requested' ? 'bg-red-500/10 text-red-400 animate-pulse' :
                        status === 'delivered' ? 'bg-green-500/20 text-green-500' :
                        status === 'shipped' ? 'bg-green-500/10 text-green-400' :
                        status === 'shipping' ? 'bg-purple-500/20 text-purple-500' :
                        status === 'confirmed' ? 'bg-blue-500/20 text-blue-500' :
                        'bg-yellow-500/20 text-yellow-500'
                      }`}>
                        {status === 'cancelled' && <XCircle size={14} />}
                        {status === 'delivered' && <CheckCircle2 size={14} className="text-green-500" />}
                        {status === 'shipped' && <CheckCircle2 size={14} />}
                        {status === 'shipping' && <Truck size={14} />}
                        {status === 'confirmed' && <CheckCircle2 size={14} />}
                        {status === 'pending' && <Clock size={14} />}
                        {status}
                      </div>
                      <div className="text-lg font-black text-white">
                        ₹{(order.cartTotal || 0).toLocaleString()}
                      </div>
                   </div>
                </div>
                <div className="p-6">
                   <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                     <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Items</h4>
                     {canCancel && (
                       <div className="flex flex-col items-start md:items-end gap-1">
                         <button
                           onClick={() => cancelOrder(order.id)}
                           className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all active:scale-95"
                         >
                           <X size={14} /> Cancel Order
                         </button>
                         <p className="text-[10px] text-gray-500 font-medium whitespace-nowrap">you can cancel order 24 hours of ordering</p>
                       </div>
                     )}
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {order.items?.map((item: any, i: number) => (
                       <div key={i} className="flex items-center gap-4 bg-black/40 p-3 rounded-lg border border-white/5">
                         <div className="flex-1">
                            <p className="text-sm font-medium text-white line-clamp-1">{item.name}</p>
                            <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                         </div>
                         <div className="text-primary font-bold text-sm">
                            ₹{(item.price * item.quantity).toLocaleString()}
                         </div>
                       </div>
                     ))}
                   </div>
                   
                   <div className="mt-6 pt-6 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                      <div>
                         <h4 className="font-bold text-gray-400 uppercase tracking-widest mb-2 text-xs">Shipping Details</h4>
                         <p className="text-white">{order.firstName} {order.lastName}</p>
                         <p className="text-gray-400">{order.houseNumber}, {order.streetAddress}</p>
                         <p className="text-gray-400">{order.city} - {order.zipCode}</p>
                      </div>
                      <div>
                         <h4 className="font-bold text-gray-400 uppercase tracking-widest mb-2 text-xs">Contact Info</h4>
                         <p className="text-white flex items-center gap-2">📞 {order.phone}</p>
                         {order.email && <p className="text-gray-400 flex items-center gap-2 mt-1">✉️ {order.email}</p>}
                      </div>
                   </div>
                </div>
              </div>
            );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
