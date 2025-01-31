import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';

const useGroupShop = (groupId) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!groupId) {
            setError('ID de grupo no proporcionado');
            setLoading(false);
            return;
        }

        const loadGroupProducts = async () => {
            try {
                setLoading(true);

                const groupRef = doc(db, 'groups', groupId);
                const groupDoc = await getDoc(groupRef);

                if (!groupDoc.exists()) {
                    setError('Grupo no encontrado');
                    return;
                }

                const productsQuery = query(
                    collection(db, 'products'),
                    where('groupId', '==', groupId)
                );

                const productsSnapshot = await getDocs(productsQuery);
                const productsData = productsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setProducts(productsData);
                setError(null);
            } catch (err) {
                console.error('Error cargando productos:', err);
                setError('Error al cargar los productos');
            } finally {
                setLoading(false);
            }
        };

        loadGroupProducts();
    }, [groupId]);

    const addProduct = async (productData) => {
        try {
            const newProduct = {
                ...productData,
                groupId,
                createdAt: new Date().toISOString()
            };

            const docRef = await addDoc(collection(db, 'products'), newProduct);
            setProducts(prev => [...prev, { id: docRef.id, ...newProduct }]);
            return { success: true, id: docRef.id };
        } catch (err) {
            console.error('Error agregando producto:', err);
            return { success: false, error: err.message };
        }
    };

    const updateProduct = async (productId, updates) => {
        try {
            const productRef = doc(db, 'products', productId);
            await updateDoc(productRef, updates);

            setProducts(prev =>
                prev.map(product =>
                    product.id === productId
                        ? { ...product, ...updates }
                        : product
                )
            );
            return { success: true };
        } catch (err) {
            console.error('Error actualizando producto:', err);
            return { success: false, error: err.message };
        }
    };

    const deleteProduct = async (productId) => {
        try {
            await deleteDoc(doc(db, 'products', productId));
            setProducts(prev => prev.filter(product => product.id !== productId));
            return { success: true };
        } catch (err) {
            console.error('Error eliminando producto:', err);
            return { success: false, error: err.message };
        }
    };

    return {
        products,
        loading,
        error,
        addProduct,
        updateProduct,
        deleteProduct
    };
};

export default useGroupShop;