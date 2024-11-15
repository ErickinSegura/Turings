import { useState } from 'react';
import {
    collection,
    doc,
    getDocs,
    query,
    where,
    serverTimestamp,
    runTransaction
} from 'firebase/firestore';
import { db } from '../firebase';

const useShopTransactions = (groupId) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const purchaseProduct = async (productId, studentId, quantity = 1) => {
        setLoading(true);
        setError(null);

        try {
            // Get references
            const productRef = doc(db, 'products', productId);
            const studentRef = doc(db, 'users', studentId);
            const transactionsRef = collection(db, 'transactions');

            const result = await runTransaction(db, async (transaction) => {
                // 1. Get product and student data in transaction
                const productSnap = await transaction.get(productRef);
                const studentSnap = await transaction.get(studentRef);

                if (!productSnap.exists()) {
                    throw new Error('Producto no encontrado');
                }
                if (!studentSnap.exists()) {
                    throw new Error('Estudiante no encontrado');
                }

                const product = productSnap.data();
                const student = studentSnap.data();

                // 2. Verify stock
                if (product.stock < quantity) {
                    throw new Error('Stock insuficiente');
                }

                // 3. Verify balance
                const totalCost = product.price * quantity;
                if (student.turingBalance < totalCost) {
                    throw new Error('Balance insuficiente');
                }

                // 4. Create transaction record
                const transactionData = {
                    productId,
                    productName: product.name,
                    studentId,
                    studentName: student.name,
                    groupId,
                    quantity,
                    pricePerUnit: product.price,
                    totalPrice: totalCost,
                    timestamp: serverTimestamp(),
                    status: 'completed'
                };

                // 5. Update product stock
                transaction.update(productRef, {
                    stock: product.stock - quantity
                });

                // 6. Update student balance
                transaction.update(studentRef, {
                    turingBalance: student.turingBalance - totalCost
                });

                // 7. Create transaction record
                const newTransactionRef = doc(transactionsRef);
                transaction.set(newTransactionRef, transactionData);

                return { success: true };
            });

            return result;
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    const getStudentTransactions = async (studentId) => {
        try {
            const transactionsQuery = query(
                collection(db, 'transactions'),
                where('studentId', '==', studentId),
                where('groupId', '==', groupId)
            );

            const snapshot = await getDocs(transactionsQuery);
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (err) {
            setError(err.message);
            return [];
        }
    };

    const getGroupTransactions = async () => {
        try {
            const transactionsQuery = query(
                collection(db, 'transactions'),
                where('groupId', '==', groupId)
            );

            const snapshot = await getDocs(transactionsQuery);
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (err) {
            setError(err.message);
            return [];
        }
    };

    return {
        purchaseProduct,
        getStudentTransactions,
        getGroupTransactions,
        loading,
        error
    };
};

export default useShopTransactions;