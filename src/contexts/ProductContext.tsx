import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { PRODUCTS as initialProducts, Product } from '../constants';

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, data: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  loading: boolean;
}

const ProductContext = createContext<ProductContextType>({
  products: initialProducts,
  addProduct: async () => {},
  updateProduct: async () => {},
  deleteProduct: async () => {},
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
      console.error("Error fetching products", error);
      if (error.code === 'permission-denied') {
        alert("Firestore Permission Denied.\n\nPlease go to Firebase Console -> Firestore Database -> Rules and update them to allow read/write access. For development, you can use:\n\nmatch /{document=**} {\n  allow read, write: if true;\n}");
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const addProduct = async (product: Omit<Product, 'id'>) => {
    await addDoc(collection(db, 'products'), product);
  };

  const updateProduct = async (id: string, data: Partial<Product>) => {
    const isInitial = initialProducts.find(p => p.id === id);
    const inFirestore = firestoreProducts.find(p => p.id === id);
    
    if (isInitial && !inFirestore) {
      await setDoc(doc(db, 'products', id), { ...isInitial, ...data });
    } else {
      await updateDoc(doc(db, 'products', id), data);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const isInitial = initialProducts.find(p => p.id === id);
      const inFirestore = firestoreProducts.find(p => p.id === id);
      
      if (isInitial && !inFirestore) {
        // Create full object tombstone to bypass strict database validation rules
        await setDoc(doc(db, 'products', id), { ...isInitial, deleted: true });
      } else if (isInitial && inFirestore) {
        await updateDoc(doc(db, 'products', id), { deleted: true });
      } else {
        try {
          await deleteDoc(doc(db, 'products', id));
        } catch (deleteError: any) {
          if (deleteError.code === 'permission-denied') {
            // Fallback to soft delete if hard delete is restricted by rules
            await updateDoc(doc(db, 'products', id), { deleted: true });
          } else {
            throw deleteError;
          }
        }
      }
    } catch (error: any) {
      console.error("Delete failed", error);
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
    <ProductContext.Provider value={{ products: allProducts, addProduct, updateProduct, deleteProduct, loading }}>
      {children}
    </ProductContext.Provider>
  );
}

export const useProducts = () => useContext(ProductContext);
