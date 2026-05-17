import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { Package, ArrowLeft, Loader2, CheckCircle2, Truck, Home, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { checkIfAdmin } from '../utils/admin';

export default function AdminOrders() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const showFeedback = (message: string, type: 'success' | 'error' = 'success') => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback(null), 3000);
  };

  // Check admin rights
  if (!checkIfAdmin(user?.email)) {
    navigate('/');
    return null;
  }

  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setIsLoading(false);
    }, (error) => {
      console.error(error);
      setIsLoading(false);
      handleFirestoreError(error, OperationType.GET, 'orders');
    });

    return () => unsubscribe();
  }, []);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setStatusUpdatingId(orderId);
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: newStatus,
        updatedAt: serverTimestamp()
      });
      showFeedback(`Status updated to ${newStatus}`);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`);
      showFeedback('Failed to update status', 'error');
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const deleteOrder = async (orderId: string) => {
    setStatusUpdatingId(orderId);
    try {
      await deleteDoc(doc(db, 'orders', orderId));
      showFeedback('Order deleted successfully');
      setDeletingId(null);
    } catch (error) {
      console.error('Error in deleteOrder:', error);
      showFeedback('Failed to delete order', 'error');
      handleFirestoreError(error, OperationType.DELETE, `orders/${orderId}`);
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-500';
      case 'confirmed': return 'bg-blue-500/20 text-blue-500';
      case 'shipping': return 'bg-purple-500/20 text-purple-500';
      case 'shipped': return 'bg-green-500/20 text-green-500';
      case 'delivered': return 'bg-green-500 text-black';
      case 'cancelled': return 'bg-red-500/20 text-red-500';
      case 'cancellation requested': return 'bg-red-600/20 text-red-400 animate-pulse border border-red-500/30';
      case 'cancellation declined': return 'bg-orange-500/20 text-orange-500';
      default: return 'bg-gray-500/20 text-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-bg-dark flex flex-col">
      <Navbar />

        {/* Feedback Message */}
        {feedback && (
          <div className={`fixed top-24 right-4 z-[100] animate-in fade-in slide-in-from-top px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 border ${
            feedback.type === 'success' 
              ? 'bg-green-500/10 border-green-500/50 text-green-500' 
              : 'bg-red-500/10 border-red-500/50 text-red-500'
          }`}>
            <span className="font-bold">{feedback.message}</span>
          </div>
        )}

      <main className="flex-1 max-w-[1700px] w-[98%] mx-auto px-4 md:px-6 pt-32 pb-24">
        <div className="flex items-center justify-between mb-8">
          <Link to="/admin" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft size={20} />
            <span className="font-bold">Back to Admin Panel</span>
          </Link>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <Package className="text-primary" size={32} />
            Manage Orders
          </h1>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-primary" size={48} />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
            <Package size={48} className="text-gray-500 mx-auto mb-4" />
            <p className="text-xl text-gray-400">No orders found.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-white/5 bg-black/40 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                   <div className="flex flex-col md:flex-row gap-6 md:items-center">
                     <div>
                       <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Order ID</p>
                       <p className="text-sm font-mono text-white bg-white/5 px-2 py-1 rounded">{order.id}</p>
                     </div>
                     <div>
                       <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Date</p>
                       <p className="text-sm font-medium text-white">
                          {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleString() : 'Recently'}
                       </p>
                     </div>
                     <div>
                       <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Total</p>
                       <div className="text-xl font-black text-primary">
                         ₹{(order.cartTotal || 0).toLocaleString()}
                       </div>
                     </div>
                   </div>

                   <div className="flex flex-col sm:flex-row items-center gap-4">
                      <div className={`px-4 py-2 flex items-center gap-2 rounded-full text-xs font-bold uppercase tracking-widest ${getStatusColor(order.status || 'pending')}`}>
                        {statusUpdatingId === order.id ? <Loader2 size={14} className="animate-spin" /> : <div className="w-2 h-2 rounded-full bg-current animate-pulse" />}
                        {(order.status || 'Pending').charAt(0).toUpperCase() + (order.status || 'Pending').slice(1)}
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {order.status === 'cancellation requested' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => updateOrderStatus(order.id, 'cancelled')}
                              disabled={statusUpdatingId === order.id}
                              className="px-4 py-2 bg-red-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-600 transition-all active:scale-95 shadow-lg shadow-red-500/20"
                            >
                              Accept Cancellation
                            </button>
                            <button
                              onClick={() => updateOrderStatus(order.id, 'cancellation declined')}
                              disabled={statusUpdatingId === order.id}
                              className="px-4 py-2 bg-orange-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-orange-600 transition-all active:scale-95 shadow-lg shadow-orange-500/20"
                            >
                              Decline Cancellation
                            </button>
                          </div>
                        )}
                        {['pending', 'confirmed', 'shipping', 'shipped', 'delivered', 'cancelled'].map(status => (
                          <button
                            key={status}
                            onClick={() => updateOrderStatus(order.id, status)}
                            disabled={statusUpdatingId === order.id || order.status === status}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors ${
                              order.status === status 
                                ? 'bg-primary text-black opacity-50 cursor-not-allowed' 
                                : status === 'delivered' 
                                  ? 'bg-green-500/20 text-green-500 hover:bg-green-500 hover:text-black'
                                  : 'bg-white/10 text-white hover:bg-primary hover:text-black'
                            }`}
                          >
                            {status === 'delivered' ? 'Success' : `Mark ${status}`}
                          </button>
                        ))}
                      </div>

                      {deletingId === order.id ? (
                        <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right duration-200">
                          <span className="text-[10px] uppercase font-black text-red-500 tracking-tighter">Are you sure?</span>
                          <button
                            onClick={(e) => { e.stopPropagation(); deleteOrder(order.id); }}
                            className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-[10px] font-black uppercase hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
                          >
                            Delete
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setDeletingId(null); }}
                            className="px-3 py-1.5 bg-white/10 text-white rounded-lg text-[10px] font-black uppercase hover:bg-white/20 transition-all"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeletingId(order.id);
                          }}
                          disabled={statusUpdatingId === order.id}
                          className="flex items-center gap-2 p-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-all border border-red-500/20 active:scale-95 disabled:opacity-50 disabled:pointer-events-none group"
                          title="Delete Order"
                        >
                          <Trash2 size={20} className="group-hover:scale-110 transition-transform" />
                          <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline">Delete</span>
                        </button>
                      )}
                   </div>
                </div>

                <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                   <div className="lg:col-span-2">
                     <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Order Items</h4>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       {order.items?.map((item: any, i: number) => (
                         <div key={i} className="flex items-center gap-4 bg-black/40 p-4 rounded-xl border border-white/5">
                           <div className="flex-1">
                              <p className="text-sm font-bold text-white line-clamp-2">{item.name}</p>
                              <div className="flex justify-between items-center mt-2">
                                <p className="text-xs text-gray-500 uppercase tracking-widest">Qty: <span className="font-bold text-white">{item.quantity}</span></p>
                                <div className="text-primary font-bold text-sm">
                                   ₹{(item.price * item.quantity).toLocaleString()}
                                </div>
                              </div>
                           </div>
                         </div>
                       ))}
                     </div>
                   </div>
                   
                   <div className="space-y-6 bg-black/20 p-6 rounded-2xl border border-white/5">
                      <div>
                         <h4 className="font-bold text-gray-500 flex items-center gap-2 uppercase tracking-widest mb-3 text-xs">
                           <Home size={14} /> Shipping Address
                         </h4>
                         <div className="bg-white/5 p-4 rounded-xl">
                           <p className="text-white font-bold text-sm mb-1">{order.firstName} {order.lastName}</p>
                           <p className="text-gray-400 text-sm whitespace-pre-wrap leading-relaxed">
                             {order.houseNumber}, {order.streetAddress}<br />
                             {order.city} - {order.zipCode}
                           </p>
                         </div>
                      </div>
                      
                      <div>
                         <h4 className="font-bold text-gray-500 uppercase tracking-widest mb-3 text-xs">Customer Details</h4>
                         <div className="bg-white/5 p-4 rounded-xl space-y-2">
                           <div className="flex justify-between items-center pb-2 border-b border-white/10">
                              <span className="text-xs text-gray-400 uppercase tracking-widest">Phone</span>
                              <span className="text-sm font-bold text-white">{order.phone}</span>
                           </div>
                           <div className="flex justify-between items-center pb-2 border-b border-white/10">
                              <span className="text-xs text-gray-400 uppercase tracking-widest">Email</span>
                              <span className="text-sm font-medium text-white line-clamp-1">{order.email || order.userId || 'N/A'}</span>
                           </div>
                           <div className="flex justify-between items-center pb-2 border-b border-white/10">
                              <span className="text-xs text-gray-400 uppercase tracking-widest">Payment TXN</span>
                              <span className="text-[10px] font-mono text-primary bg-primary/10 px-2 py-1 rounded border border-primary/20">{order.transactionId || 'N/A'}</span>
                           </div>
                           <div className="flex justify-between items-center pt-1">
                              <span className="text-xs text-gray-400 uppercase tracking-widest">User ID</span>
                              <span className="text-[10px] font-mono text-gray-500 bg-black/50 px-2 py-1 rounded">{order.userId || 'Guest'}</span>
                           </div>
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
