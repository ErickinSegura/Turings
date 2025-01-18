import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, ShoppingBag, History, Coins } from 'lucide-react';
import useGroupShop from "../../hooks/UseGroupShop";
import useShopTransactions from "../../hooks/UseShopTransactions";
import { useAuth } from "../../context/authContext";
import {useGroupDetails} from "../../hooks/UseGroupDetails";

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-black border border-black dark:border-white rounded-2xl w-full max-w-2xl">
                <div className="p-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-gray-800 dark:text-gray-50 font-black text-xl">{title}</h3>
                        <button
                            onClick={ onClose }
                            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-50
                                                    dark:bg-gray-50 dark:hover:bg-white dark:text-gray-800
                            font-medium rounded-xl transition-all"
                        >
                            X
                        </button>
                    </div>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

const ProductCard = ({
                         product,
                         isTeacher = false,
                         onEdit,
                         onDelete,
                         isEditing,
                         editingProduct,
                         setEditingProduct,
                         onUpdate,
                         onCancel,
                         onPurchase,
                         groupId
                     }) => {
    const [showPurchaseModal, setShowPurchaseModal] = useState(false);
    const [purchaseError, setPurchaseError] = useState("");
    const { user } = useAuth();
    const { group, loading: groupLoading } = useGroupDetails(groupId);

    // Si estamos editando y el grupo está cargando, mostramos un estado de carga
    if (isEditing && groupLoading) {
        return (
            <div className="bg-white dark:bg-black border-black dark:border-gray-50 rounded-2xl overflow-hidden border p-4 sm:p-6">
                <div className="animate-pulse flex flex-col gap-4">
                    <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
                    <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded-xl w-3/4"></div>
                    <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
                    <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
                </div>
            </div>
        );
    }

    const handlePurchase = () => {
        if (product.price > user?.turingBalance) {
            setPurchaseError("No tienes suficientes Turings para realizar esta compra");
            return;
        }
        if (product.stock < 1) {
            setPurchaseError("No hay stock disponible de este producto");
            return;
        }
        onPurchase(product.id, 1);
        setShowPurchaseModal(false);
        setPurchaseError("");
    };

    const handleNumberInput = (e, field) => {
        const value = parseInt(e.target.value) || 0;

        if (field === 'stock' || field === 'price') {
            if (value < 1) {
                setEditingProduct(prev => ({
                    ...prev,
                    [field]: 1
                }));
                return;
            }
        }

        setEditingProduct(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const setStockToStudentsCount = () => {
        if (group?.students?.length) {
            setEditingProduct(prev => ({
                ...prev,
                stock: group.students.length
            }));
        }
    };

    if (isEditing) {
        return (
            <div className="bg-white dark:bg-black border-black dark:border-gray-50 rounded-2xl overflow-hidden border hover:shadow-lg transition-all duration-300 relative p-4 sm:p-6">
                <form className="space-y-6">
                    <div className="flex flex-col items-center mb-4">
                        <div className="w-36 h-36 sm:w-48 sm:h-48 relative group mb-2">
                            {(editingProduct.image || product.image) && (
                                <img
                                    src={editingProduct.image || product.image}
                                    alt="Preview"
                                    className="w-full h-full object-cover rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-50 dark:text-gray-800"
                                />
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-800 dark:text-gray-50">
                            URL de la imagen
                        </label>
                        <input
                            className="w-full px-4 py-2 bg-white dark:bg-black border border-gray-300 dark:border-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700 text-gray-900 dark:text-gray-100"
                            placeholder="https://ejemplo.com/imagen.jpg"
                            value={editingProduct.image}
                            onChange={(e) => setEditingProduct(prev => ({
                                ...prev,
                                image: e.target.value
                            }))}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-800 dark:text-gray-50">
                                Nombre del producto
                            </label>
                            <input
                                className="w-full px-4 py-2 bg-white dark:bg-black border border-gray-300 dark:border-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700 text-gray-900 dark:text-gray-100"
                                placeholder="Nombre"
                                value={editingProduct.name}
                                onChange={(e) => setEditingProduct(prev => ({
                                    ...prev,
                                    name: e.target.value
                                }))}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-800 dark:text-gray-50">
                                Precio en Turings
                            </label>
                            <input
                                type="number"
                                min="1"
                                className="w-full px-4 py-2 bg-white dark:bg-black border border-gray-300 dark:border-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700 text-gray-900 dark:text-gray-100"
                                placeholder="1"
                                value={editingProduct.price}
                                onChange={(e) => handleNumberInput(e, 'price')}
                            />
                            {editingProduct.price < 1 && (
                                <p className="text-red-500 text-sm mt-1">El precio debe ser al menos 1 Turing</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-800 dark:text-gray-50">
                            Descripción
                        </label>
                        <textarea
                            className="w-full px-4 py-2 bg-white dark:bg-black border border-gray-300 dark:border-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700 text-gray-900 dark:text-gray-100"
                            placeholder="Describe el producto"
                            rows="3"
                            value={editingProduct.description}
                            onChange={(e) => setEditingProduct(prev => ({
                                ...prev,
                                description: e.target.value
                            }))}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-800 dark:text-gray-50">
                            Stock disponible
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                min="1"
                                className="flex-1 px-4 py-2 bg-white dark:bg-black border border-gray-300 dark:border-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700 text-gray-900 dark:text-gray-100"
                                placeholder="1"
                                value={editingProduct.stock}
                                onChange={(e) => handleNumberInput(e, 'stock')}
                            />
                            {/*
                            <button
                                type="button"
                                onClick={setStockToStudentsCount}
                                disabled={groupLoading}
                                className="px-4 py-2 bg-gray-800 text-gray-50 border border-gray-800 hover:bg-gray-50 hover:text-gray-800
                     dark:bg-gray-50 dark:text-gray-800 dark:hover:bg-black dark:hover:text-gray-50
                     rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Establecer stock igual al número de estudiantes"
                            >
                                {groupLoading ? (
                                    <span className="flex items-center gap-2">
                    <div
                        className="w-4 h-4 border-2 border-gray-50 dark:border-gray-800 border-t-transparent rounded-full animate-spin"></div>
                    Cargando...
                </span>
                                ) : (
                                    `${group?.students?.length || 0} estudiantes`
                                )}
                            </button>
                            */}

                        </div>
                        {editingProduct.stock < 1 && (
                            <p className="text-red-500 text-sm mt-1">El stock debe ser al menos 1 unidad</p>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => onUpdate(product?.id)}
                            className="flex-1 bg-gray-800 text-gray-50 border border-gray-800 hover:bg-gray-50 hover:text-gray-800 hover:border hover:border-black
                                    dark:bg-gray-50 dark:text-gray-800 dark:border dark:border-black dark:hover:border-gray-50 dark:hover:bg-black dark:hover:text-gray-50
                                    font-medium py-2.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                            disabled={editingProduct.stock < 1 || editingProduct.price < 1}
                        >
                            Guardar
                        </button>
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 bg-white text-gray-800 border border-black hover:bg-gray-800 hover:text-gray-50 hover:border hover:border-gray-800
                                    dark:bg-black dark:text-gray-50 dark:border dark:border-gray-50  dark:hover:border-black dark:hover:bg-gray-50 dark:hover:text-gray-800
                                    font-medium py-2.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div
            className="bg-white border-black dark:bg-black dark:border-white rounded-2xl overflow-hidden border hover:shadow-lg transition-all duration-300 relative">
            <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
                    <div className="w-full sm:w-1/2 flex items-center justify-center">
                        <div className="relative group w-48 h-48">
                            <div className="absolute inset-0 rounded-xl"/>
                            <div
                                className="relative w-full h-full flex items-center justify-center rounded-xl bg-gray-50 dark:bg-gray-800">
                                {product.image ? (
                                    <div className="w-full h-full relative">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="absolute inset-0 w-full h-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-105 text-gray-50 dark:text-gray-800"
                                        />
                                    </div>
                                ) : (
                                    <ShoppingBag className="w-12 h-12 text-gray-400"/>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="w-full sm:w-1/2 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-50">
                                    {product.name}
                                </h3>
                                <span
                                    className="px-3 py-1 rounded-full text-sm font-medium bg-gray-800 text-gray-50 dark:bg-gray-50 dark:text-gray-800 flex items-center">
                                    <Coins className="w-4 h-4 text-gray-50 dark:text-gray-800 mr-2"/> {product.price} τ
                                </span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-500 text-sm leading-relaxed mb-2">
                                {product.description}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Stock disponible: <span className="font-semibold">{product.stock}</span>
                            </p>
                        </div>

                        {isTeacher ? (
                            <div className="flex gap-2 mt-4">
                                <button
                                    onClick={() => onEdit(product)}
                                    className="flex-1 bg-gray-800 text-gray-50 border border-gray-800 hover:bg-gray-50 hover:text-gray-800 hover:border hover:border-black
                                                                dark:bg-gray-50 dark:text-gray-800 dark:border dark:border-black dark:hover:border-gray-50 dark:hover:bg-black dark:hover:text-gray-50
                                                                 font-medium py-2.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    <Edit2 className="w-4 h-4"/>
                                    <span className="hidden sm:inline">Editar</span>
                                </button>
                                <button
                                    onClick={() => onDelete(product.id)}
                                    className="flex-1           bg-red-50 text-red-600 border border-red-600 hover:bg-red-600 hover:text-red-50
                                                                dark:bg-red-600 dark:text-red-50 dark:border dark:border-red-600 dark:hover:border-red-50 dark:hover:bg-red-50 dark:hover:text-red-600
                                                                  font-medium py-2.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    <Trash2 className="w-4 h-4"/>
                                    <span className="hidden sm:inline">Eliminar</span>
                                </button>
                            </div>
                        ) : (
                            <>
                                <button
                                    className="mt-4 w-full bg-gray-800 hover:bg-gray-700 text-gray-50 dark:bg-gray-50 dark:hover:bg-gray-100 dark:text-gray-800 font-medium py-2.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group"
                                    onClick={() => setShowPurchaseModal(true)}
                                    disabled={product.stock < 1}
                                >
                                    <ShoppingBag
                                        className="w-5 h-5 transition-transform duration-300 group-hover:scale-110"/>
                                    <span>{product.stock < 1 ? 'Sin stock' : 'Comprar'}</span>
                                </button>

                                <Modal
                                    isOpen={showPurchaseModal}
                                    onClose={() => {
                                        setShowPurchaseModal(false);
                                        setPurchaseError("");
                                    }}
                                    title={`Comprar ${product.name}`}
                                >
                                    <div className="space-y-4">
                                        <p className="text-gray-500 dark:text-gray-400">Precio: <span
                                            className="font-semibold">{product.price} Turings</span></p>
                                        <p className="text-gray-600 dark:text-gray-500">Tu balance: <span
                                            className="font-semibold">{user?.turingBalance || 0} Turings</span></p>

                                        {purchaseError && (
                                            <div className="p-3 bg-red-50 text-red-600 rounded-xl">
                                                {purchaseError}
                                            </div>
                                        )}

                                        <div className="flex justify-end gap-3 mt-6">
                                            <button
                                                onClick={handlePurchase}
                                                className="px-4 py-2 bg-gray-800 text-gray-50 hover:bg-gray-700 dark:bg-gray-50 dark:text-gray-800 dark:hover:bg-white rounded-xl transition-colors"
                                            >
                                                Confirmar Compra
                                            </button>
                                        </div>
                                    </div>
                                </Modal>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const TransactionCard = ({transaction}) => (
    <div
        className="bg-white rounded-2xl overflow-hidden border border-black hover:shadow-lg transition-all duration-300 p-4 sm:p-6">
        <div className="flex justify-between items-start mb-4">
            <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800">{transaction.productName}</h3>
                <p className="text-sm text-gray-500">
                    {new Date(transaction.timestamp?.toDate()).toLocaleDateString()}
                </p>
            </div>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-50 text-gray-800">
                {transaction.totalPrice} Turings
            </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between text-gray-600 gap-2">
            <p className="text-sm">Estudiante: <span className="font-medium">{transaction.studentName}</span></p>
            <p className="text-sm">Cantidad: <span className="font-medium">{transaction.quantity}</span></p>
        </div>
    </div>
);

const Shop = ({groupId}) => {
    const {
        products,
        loading: productsLoading,
        error: productsError,
        addProduct,
        updateProduct,
        deleteProduct
    } = useGroupShop(groupId);

    const {
        purchaseProduct,
        getGroupTransactions,
    } = useShopTransactions(groupId);

    const { user } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [showTransactionsModal, setShowTransactionsModal] = useState(false);
    const [isAddingProduct, setIsAddingProduct] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [purchaseStatus, setPurchaseStatus] = useState({ message: '', type: '' });
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: '',
        description: '',
        stock: '',
        image: ''
    });
    const isTeacher = user?.role === 'teacher';

    useEffect(() => {
        if (isTeacher) {
            loadTransactions();
        }
    }, [isTeacher]);

    const loadTransactions = async () => {
        const transactionsData = await getGroupTransactions();
        const sortedTransactions = transactionsData
            .filter(transaction => transaction.totalPrice < 0)
            .sort((a, b) => b.timestamp.toDate() - a.timestamp.toDate()); // Orden descendente (más reciente primero)
        setTransactions(sortedTransactions);
    };

    const handlePurchase = async (productId, quantity) => {
        try {
            const result = await purchaseProduct(productId, user.uid, quantity);
            if (result.success) {
                setPurchaseStatus({
                    message: '¡Compra realizada con éxito!',
                    type: 'success'
                });
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else {
                setPurchaseStatus({
                    message: result.error || 'Error al realizar la compra',
                    type: 'error'
                });
            }
        } catch (error) {
            setPurchaseStatus({
                message: 'Error al procesar la compra',
                type: 'error'
            });
        }
    };

    const handleAddProduct = async () => {
        await addProduct(newProduct);
        setIsAddingProduct(false);
        setNewProduct({
            name: '',
            price: '',
            description: '',
            stock: '',
            image: ''
        });
    };

    const handleUpdateProduct = async (productId) => {
        await updateProduct(productId, editingProduct);
        setEditingProduct(null);
    };

    const handleCancel = () => {
        setEditingProduct(null);
    };

    if (productsLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
                <div className="text-xl text-gray-500 dark:text-gray-400">Cargando productos...</div>
            </div>
        );
    }

    if (productsError) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-lg text-red-500">{productsError}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 sm:mb-12">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-50 mb-2 sm:mb-3">
                            Tienda de Turings
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg">
                            {isTeacher ? 'Gestiona el inventario de la tienda' : `Gasta sabiamente... No hay devoluciones`}
                        </p>
                    </div>
                    {isTeacher && (
                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={() => setShowTransactionsModal(true)}
                                className="bg-gray-800 text-gray-50 border border-gray-800 hover:bg-gray-50 hover:text-gray-800 hover:border hover:border-black
                                                                dark:bg-gray-50 dark:text-gray-800 dark:border dark:border-black dark:hover:border-gray-50 dark:hover:bg-black dark:hover:text-gray-50
                                                                 font-medium py-2.5 px-4 sm:px-6 rounded-xl transition-all duration-300 flex items-center gap-2"
                            >
                                <History className="w-5 h-5"/>
                                <span className="hidden sm:inline">Ver Transacciones</span>
                            </button>
                            <button
                                onClick={() => setIsAddingProduct(true)}
                                className="bg-gray-800 text-gray-50 border border-gray-800 hover:bg-gray-50 hover:text-gray-800 hover:border hover:border-black
                                            dark:bg-gray-50 dark:text-gray-800 dark:border dark:border-black dark:hover:border-gray-50 dark:hover:bg-black dark:hover:text-gray-50
                                                                 font-medium py-2.5 px-4 sm:px-6 rounded-xl transition-all duration-300 flex items-center gap-2"
                            >
                                <Plus className="w-5 h-5"/>
                                <span className="hidden sm:inline">Nuevo Producto</span>
                            </button>
                        </div>
                    )}
                </div>

                {purchaseStatus.message && (
                    <div className={`mb-6 p-4 rounded-xl ${
                        purchaseStatus.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    }`}>
                        {purchaseStatus.message}
                    </div>
                )}

                {isTeacher && isAddingProduct && (
                    <div className="mb-8">
                        <ProductCard
                            product={{}}
                            isTeacher={true}
                            isEditing={true}
                            editingProduct={newProduct}
                            setEditingProduct={setNewProduct}
                            onUpdate={handleAddProduct}
                            onCancel={() => {
                                setIsAddingProduct(false);
                                setNewProduct({
                                    name: '',
                                    price: '',
                                    description: '',
                                    stock: '',
                                    image: ''
                                });
                            }}
                        />
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            isTeacher={isTeacher}
                            onEdit={setEditingProduct}
                            onDelete={deleteProduct}
                            onPurchase={handlePurchase}
                            isEditing={editingProduct?.id === product.id}
                            editingProduct={editingProduct}
                            setEditingProduct={setEditingProduct}
                            onUpdate={handleUpdateProduct}
                            onCancel={handleCancel}
                        />
                    ))}
                </div>

                <Modal
                    isOpen={showTransactionsModal}
                    onClose={() => setShowTransactionsModal(false)}
                    title="Historial de Transacciones"
                >
                    <div className="bg-white dark:bg-black">
                        <div className="overflow-y-auto max-h-96">
                            <table className="w-full table-auto border-collapse">
                                <thead className="bg-gray-800 dark:bg-gray-50 sticky top-0">
                                <tr>
                                    <th className="p-4 text-sm font-medium text-gray-50 dark:text-gray-800 text-left">Fecha</th>
                                    <th className="p-4 text-sm font-medium text-gray-50 dark:text-gray-800 text-left">Estudiante</th>
                                    <th className="p-4 text-sm font-medium text-gray-50 dark:text-gray-800 text-left">Producto</th>
                                    <th className="p-4 text-sm font-medium text-gray-50 dark:text-gray-800 text-right">Total</th>
                                </tr>
                                </thead>
                                <tbody>
                                {transactions.map(transaction => (
                                    <tr key={transaction.id}>
                                        <td className="p-4 text-sm text-gray-800 dark:text-gray-50">{new Date(transaction.timestamp?.toDate()).toLocaleDateString()}</td>
                                        <td className="p-4 text-sm text-gray-800 dark:text-gray-50">{transaction.studentName}</td>
                                        <td className="p-4 text-sm text-gray-800 dark:text-gray-50">{transaction.productName}</td>
                                        <td className="p-4 text-sm text-gray-800 dark:text-gray-50 text-right">
                                            <span className="text-red-600 font-semibold">{transaction.totalPrice} T</span>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                        {transactions.length === 0 && (
                            <div className="text-center text-gray-500 dark:text-gray-400 mt-6">
                                No hay transacciones para mostrar.
                            </div>
                        )}
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default Shop;