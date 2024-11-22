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
            const productRef = doc(db, 'products', productId);
            const studentRef = doc(db, 'users', studentId);
            const transactionsRef = collection(db, 'transactions');

            const result = await runTransaction(db, async (transaction) => {
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

                if (product.stock < quantity) {
                    throw new Error('Stock insuficiente');
                }

                const totalCost = product.price * quantity;
                if (student.turingBalance < totalCost) {
                    throw new Error('Balance insuficiente');
                }

                const transactionData = {
                    type: 'purchase',
                    productId,
                    productName: product.name,
                    studentId,
                    studentName: student.name,
                    groupId,
                    quantity,
                    pricePerUnit: product.price,
                    totalPrice: -totalCost, // Negativo porque es un gasto
                    timestamp: serverTimestamp(),
                    status: 'completed'
                };

                transaction.update(productRef, {
                    stock: product.stock - quantity
                });

                transaction.update(studentRef, {
                    turingBalance: student.turingBalance - totalCost
                });

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

    const recordActivityCompletion = async (activityId, studentId, activityData, reward) => {
        setLoading(true);
        setError(null);

        try {
            const studentRef = doc(db, 'users', studentId);
            const transactionsRef = collection(db, 'transactions');

            const result = await runTransaction(db, async (transaction) => {
                const studentSnap = await transaction.get(studentRef);

                if (!studentSnap.exists()) {
                    throw new Error('Estudiante no encontrado');
                }

                const student = studentSnap.data();

                // Crear registro de transacción para la actividad
                const transactionData = {
                    type: 'activity',
                    activityId,
                    description: `Actividad: ${activityData.title || 'Completada'}`,
                    studentId,
                    studentName: student.name,
                    groupId,
                    totalPrice: reward, // Positivo porque es una ganancia
                    timestamp: serverTimestamp(),
                    status: 'completed'
                };

                // Actualizar balance del estudiante
                transaction.update(studentRef, {
                    turingBalance: (student.turingBalance || 0) + reward,
                    completedActivities: [...(student.completedActivities || []), activityId]
                });

                // Crear registro de transacción
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
        recordActivityCompletion,
        getStudentTransactions,
        getGroupTransactions,
        loading,
        error
    };
};

export default useShopTransactions;