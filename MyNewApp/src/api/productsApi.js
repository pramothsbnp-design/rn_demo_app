import { collection, getDocs, query, orderBy, limit, startAfter, where } from 'firebase/firestore';
import { db } from '../firebase';

export const fetchProducts = async (limitNum = null, lastDoc = null, category = 'All') => {
  try {
    const productsRef = collection(db, 'products');
    let q = query(productsRef);
    if (category !== 'All') {
      q = query(q, where('category', '==', category));
    }
    q = query(q, orderBy('id'));
    if (lastDoc) {
      q = query(q, startAfter(lastDoc), limit(limitNum || 15));
    } else {
      q = query(q, limit(limitNum || 15));
    }
    const querySnapshot = await getDocs(q);
    const products = querySnapshot.docs.map(doc => ({ docId: doc.id, ...doc.data() }));
    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
    return { products, lastDoc: lastVisible };
  } catch (error) {
    console.error('Firebase error:', error);
    // Return empty array instead of throwing to prevent crashes
    return { products: [], lastDoc: null };
  }
};
