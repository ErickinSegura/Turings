import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, ShoppingBag, History } from 'lucide-react';
import useGroupShop from "../../hooks/UseGroupShop";
import useShopTransactions from "../../hooks/UseShopTransactions";
import { useAuth } from "../../context/authContext";

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-semibold">{title}</h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            ×
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
                         onPurchase
                     }) => {
    const [showPurchaseModal, setShowPurchaseModal] = useState(false);
    const [purchaseError, setPurchaseError] = useState("");
    const { user } = useAuth();

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

    if (isEditing) {
        return (
            <div className="bg-white rounded-2xl overflow-hidden border border-black hover:shadow-lg transition-all duration-300 relative p-4 sm:p-6">
                <form className="space-y-4">
                    <div className="flex flex-col items-center mb-4">
                        <div className="w-36 h-36 sm:w-48 sm:h-48 relative group mb-2">
                            {(editingProduct.image || product.image) && (
                                <img
                                    src={editingProduct.image || product.image}
                                    alt="Preview"
                                    className="w-full h-full object-cover rounded-xl"
                                />
                            )}
                        </div>
                    </div>

                    <input
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200"
                        placeholder="URL de la imagen"
                        value={editingProduct.image}
                        onChange={(e) => setEditingProduct(prev => ({
                            ...prev,
                            image: e.target.value
                        }))}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200"
                            placeholder="Nombre del producto"
                            value={editingProduct.name}
                            onChange={(e) => setEditingProduct(prev => ({
                                ...prev,
                                name: e.target.value
                            }))}
                        />
                        <input
                            type="number"
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200"
                            placeholder="Precio en Turings"
                            value={editingProduct.price}
                            onChange={(e) => setEditingProduct(prev => ({
                                ...prev,
                                price: e.target.value
                            }))}
                        />
                    </div>
                    <textarea
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200"
                        placeholder="Descripción"
                        rows="3"
                        value={editingProduct.description}
                        onChange={(e) => setEditingProduct(prev => ({
                            ...prev,
                            description: e.target.value
                        }))}
                    />
                    <input
                        type="number"
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200"
                        placeholder="Stock"
                        value={editingProduct.stock}
                        onChange={(e) => setEditingProduct(prev => ({
                            ...prev,
                            stock: e.target.value
                        }))}
                    />
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => onUpdate(product?.id)}
                            className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-medium py-2.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            Guardar
                        </button>
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 bg-gray-100 text-gray-800 font-medium py-2.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl overflow-hidden border border-black hover:shadow-lg transition-all duration-300 relative">
            <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
                    <div className="w-full sm:w-1/2 flex items-center justify-center">
                        <div className="relative group">
                            <div className="absolute inset-0 rounded-xl"/>
                            <div className="relative w-36 h-36 sm:w-48 sm:h-48 flex items-center justify-center rounded-xl">
                                {product.image ? (
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="relative w-full h-full object-contain rounded-xl transition-transform duration-300 group-hover:scale-105"
                                    />
                                ) : (
                                    <ShoppingBag className="w-12 h-12 text-gray-400"/>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="w-full sm:w-1/2 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                                    {product.name}
                                </h3>
                                <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-50 text-gray-700">
                                    {product.price} Turings
                                </span>
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed mb-2">
                                {product.description}
                            </p>
                            <p className="text-sm text-gray-500">
                                Stock disponible: <span className="font-semibold">{product.stock}</span>
                            </p>
                        </div>

                        {isTeacher ? (
                            <div className="flex gap-2 mt-4">
                                <button
                                    onClick={() => onEdit(product)}
                                    className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-medium py-2.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    <Edit2 className="w-4 h-4"/>
                                    <span className="hidden sm:inline">Editar</span>
                                </button>
                                <button
                                    onClick={() => onDelete(product.id)}
                                    className="flex-1 bg-red-50 text-red-600 font-medium py-2.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    <Trash2 className="w-4 h-4"/>
                                    <span className="hidden sm:inline">Eliminar</span>
                                </button>
                            </div>
                        ) : (
                            <>
                                <button
                                    className="mt-4 w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-2.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group"
                                    onClick={() => setShowPurchaseModal(true)}
                                    disabled={product.stock < 1}
                                >
                                    <ShoppingBag className="w-5 h-5 transition-transform duration-300 group-hover:scale-110"/>
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
                                        <p className="text-gray-600">Precio: <span className="font-semibold">{product.price} Turings</span></p>
                                        <p className="text-gray-600">Tu balance: <span className="font-semibold">{user?.turingBalance || 0} Turings</span></p>

                                        {purchaseError && (
                                            <div className="p-3 bg-red-50 text-red-600 rounded-xl">
                                                {purchaseError}
                                            </div>
                                        )}

                                        <div className="flex justify-end gap-3 mt-6">
                                            <button
                                                onClick={() => {
                                                    setShowPurchaseModal(false);
                                                    setPurchaseError("");
                                                }}
                                                className="px-4 py-2 bg-gray-100 text-gray-800 rounded-xl hover:bg-gray-200 transition-colors"
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                onClick={handlePurchase}
                                                className="px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors"
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

const TransactionCard = ({ transaction }) => (
    <div className="bg-white rounded-2xl overflow-hidden border border-black hover:shadow-lg transition-all duration-300 p-4 sm:p-6">
        <div className="flex justify-between items-start mb-4">
            <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800">{transaction.productName}</h3>
                <p className="text-sm text-gray-500">
                    {new Date(transaction.timestamp?.toDate()).toLocaleDateString()}
                </p>
            </div>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-50 text-gray-700">
                {transaction.totalPrice} Turings
            </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between text-gray-600 gap-2">
            <p className="text-sm">Estudiante: <span className="font-medium">{transaction.studentName}</span></p>
            <p className="text-sm">Cantidad: <span className="font-medium">{transaction.quantity}</span></p>
        </div>
    </div>
);

const Shop = ({ groupId }) => {    const {
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
        setTransactions(transactionsData);
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
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-lg text-gray-600">Cargando productos...</div>
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
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 sm:mb-12">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
                            Tienda de Turings
                        </h1>
                        <p className="text-gray-500 text-base sm:text-lg">
                            {isTeacher ? 'Gestiona el inventario de la tienda' : `Gasta sabiamente... No hay devoluciones`}
                        </p>
                    </div>
                    {isTeacher && (
                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={() => setShowTransactionsModal(true)}
                                className="bg-gray-100 text-gray-800 font-medium py-2.5 px-4 sm:px-6 rounded-xl transition-all duration-300 flex items-center gap-2 hover:bg-gray-200"
                            >
                                <History className="w-5 h-5"/>
                                <span className="hidden sm:inline">Ver Transacciones</span>
                            </button>
                            <button
                                onClick={() => setIsAddingProduct(true)}
                                className="bg-gray-900 hover:bg-gray-800 text-white font-medium py-2.5 px-4 sm:px-6 rounded-xl transition-all duration-300 flex items-center gap-2"
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
                    <div className="space-y-4">
                        <div className="hidden sm:block">
                            <div className="max-h-[60vh] overflow-y-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 sticky top-0">
                                    <tr>
                                        <th className="text-left p-3 text-sm font-medium text-gray-500">Fecha</th>
                                        <th className="text-left p-3 text-sm font-medium text-gray-500">Estudiante</th>
                                        <th className="text-left p-3 text-sm font-medium text-gray-500">Producto</th>
                                        <th className="text-right p-3 text-sm font-medium text-gray-500">Total</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                    {transactions.map(transaction => (
                                        <tr key={transaction.id} className="hover:bg-gray-50">
                                            <td className="p-3 text-sm text-gray-600">
                                                {new Date(transaction.timestamp?.toDate()).toLocaleDateString()}
                                            </td>
                                            <td className="p-3 text-sm text-gray-600">{transaction.studentName}</td>
                                            <td className="p-3 text-sm text-gray-600">{transaction.productName}</td>
                                            <td className="p-3 text-sm text-gray-600 text-right">{transaction.totalPrice} T</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Mobile view for transactions */}
                        <div className="sm:hidden space-y-4">
                            {transactions.map(transaction => (
                                <TransactionCard key={transaction.id} transaction={transaction} />
                            ))}
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default Shop;