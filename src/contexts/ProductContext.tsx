import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, setDoc, onSnapshot, writeBatch } from 'firebase/firestore';
import { db } from '../firebase';
import { PRODUCTS as initialProducts, Product } from '../constants';

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, data: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  deleteMultipleProducts: (ids: string[]) => Promise<void>;
  loading: boolean;
}

const ProductContext = createContext<ProductContextType>({
  products: initialProducts,
  addProduct: async () => {},
  updateProduct: async () => {},
  deleteProduct: async () => {},
  deleteMultipleProducts: async () => {},
  loading: true,
});

export function ProductProvider({ children }: { children: ReactNode }) {
  const [firestoreProducts, setFirestoreProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
      const prods: Product[] = [];
      snapshot.forEach((docSnap) => {
        prods.push({ id: docSnap.id, ...docSnap.data() } as Product);
      });
      setFirestoreProducts(prods);
      setLoading(false);
    }, (error: any) => {
      console.error("Firestore error onSnapshot:", error);
      if (error.code === 'permission-denied') {
        alert("Firestore Permission Denied.\n\nPlease go to Firebase Console -> Firestore Database -> Rules and update them to allow read/write access.");
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const addProduct = async (product: Omit<Product, 'id'>) => {
    try {
      await addDoc(collection(db, 'products'), product);
    } catch (error: any) {
      console.error("Firestore addDoc error:", error);
      throw error;
    }
  };

  const updateProduct = async (id: string, data: Partial<Product>) => {
    try {
      const isInitial = initialProducts.find(p => p.id === id);
      const inFirestore = firestoreProducts.find(p => p.id === id);
      
      if (isInitial && !inFirestore) {
        await setDoc(doc(db, 'products', id), { ...isInitial, ...data });
      } else {
        await updateDoc(doc(db, 'products', id), data);
      }
    } catch (error: any) {
      console.error("Firestore updateDoc error:", error);
      throw error;
    }
  };

  const deleteProduct = async (id: string) => {
    const previousProducts = [...firestoreProducts];
    
    // Optimistic UI update
    setFirestoreProducts(prev => {
      const isInitial = initialProducts.find(p => p.id === id);
      const index = prev.findIndex(p => p.id === id);
      const next = [...prev];
      
      if (index > -1) {
        next[index] = { ...next[index], deleted: true } as Product;
      } else if (isInitial) {
        next.push({ ...isInitial, deleted: true } as Product);
      }
      return next;
    });

    try {
      const isInitial = initialProducts.find(p => p.id === id);
      const inFirestore = firestoreProducts.find(p => p.id === id);
      
      const docRef = doc(db, 'products', id);

      if (isInitial) {
        // Initial products need a tombstone in Firestore
        await setDoc(docRef, { ...isInitial, deleted: true }, { merge: true });
      } else {
        try {
          await deleteDoc(docRef);
        } catch (deleteError: any) {
          if (deleteError.code === 'permission-denied') {
            // Fallback to soft delete if hard delete is restricted by rules
            await updateDoc(docRef, { deleted: true });
          } else {
            throw deleteError;
          }
        }
      }
    } catch (error: any) {
      console.error("Delete failed, reverting state", error);
      setFirestoreProducts(previousProducts);
      if (error.code === 'permission-denied') {
        throw new Error("Firestore Permission Denied. Please check your Firestore rules.");
      }
      throw error;
    }
  };

  const deleteMultipleProducts = async (ids: string[]) => {
    const previousProducts = [...firestoreProducts];

    // Optimistic UI update: Mark as deleted in local state immediately
    setFirestoreProducts(prev => {
      const next = [...prev];
      for (const id of ids) {
        const isInitial = initialProducts.find(p => p.id === id);
        const index = next.findIndex(p => p.id === id);
        
        if (index > -1) {
          next[index] = { ...next[index], deleted: true } as Product;
        } else if (isInitial) {
          next.push({ ...isInitial, deleted: true } as Product);
        }
      }
      return next;
    });

    try {
      const batch = writeBatch(db);
      
      for (const id of ids) {
        const isInitial = initialProducts.find(p => p.id === id);
        const docRef = doc(db, 'products', id);
        
        if (isInitial) {
          // Initial products need a tombstone in Firestore to be hidden because they are hardcoded in the app
          batch.set(docRef, { ...isInitial, deleted: true }, { merge: true });
        } else {
          // New products can be hard-deleted from Firestore
          batch.delete(docRef);
        }
      }
      
      await batch.commit();
    } catch (error: any) {
      console.error("Batch delete failed, reverting state", error);
      setFirestoreProducts(previousProducts);
      if (error.code === 'permission-denied') {
        throw new Error("Firestore Permission Denied. Please check your Firestore rules.");
      }
      throw error;
    }
  };

  const allProducts = [
    ...initialProducts.filter(ip => !firestoreProducts.some(fp => fp.id === ip.id)),
    ...firestoreProducts
  ].filter(p => !(p as any).deleted); // filter out tombstones

  return (
    <ProductContext.Provider value={{ products: allProducts, addProduct, updateProduct, deleteProduct, deleteMultipleProducts, loading }}>
      {children}
    </ProductContext.Provider>
  );
}

export const useProducts = () => useContext(ProductContext);
