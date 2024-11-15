import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, ShoppingBag, History } from 'lucide-react';
import useGroupShop from "../hooks/UseGroupShop";
import useShopTransactions from "../hooks/UseShopTransactions";
import { useAuth } from "../context/authContext";

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
    const [quantity, setQuantity] = useState(1);
    const { user } = useAuth();

    const handlePurchase = () => {
        onPurchase(product.id, quantity);
        setShowPurchaseModal(false);
        setQuantity(1);
    };

    if (isEditing) {
        return (
            <div className="bg-white rounded-2xl overflow-hidden border border-black hover:shadow-lg transition-all duration-300 relative p-6">
                <form className="space-y-4">
                    <div className="flex flex-col items-center mb-4">
                        <div className="w-48 h-48 relative group mb-2">
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
                    <input
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200"
                        placeholder="Descripción"
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
            <div className="p-6">
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="w-full md:w-1/2 flex items-center justify-center">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gray-50 rounded-xl transition-opacity duration-300 opacity-0 group-hover:opacity-100"/>
                            <div className="relative w-48 h-48 flex items-center justify-center rounded-xl bg-gray-50">
                                {product.image ? (
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover rounded-xl"
                                    />
                                ) : (
                                    <ShoppingBag className="w-12 h-12 text-gray-400"/>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="w-full md:w-1/2 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-xl font-semibold text-gray-800">
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
                                    <span>Editar</span>
                                </button>
                                <button
                                    onClick={() => onDelete(product.id)}
                                    className="flex-1 bg-red-50 text-red-600 font-medium py-2.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    <Trash2 className="w-4 h-4"/>
                                    <span>Eliminar</span>
                                </button>
                            </div>
                        ) : (
                            <>
                                <button
                                    className="mt-4 w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-2.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group"
                                    onClick={() => setShowPurchaseModal(true)}
                                >
                                    <ShoppingBag className="w-5 h-5 transition-transform duration-300 group-hover:scale-110"/>
                                    <span>Comprar</span>
                                </button>

                                <Modal
                                    isOpen={showPurchaseModal}
                                    onClose={() => setShowPurchaseModal(false)}
                                    title={`Comprar ${product.name}`}
                                >
                                    <div className="space-y-4">
                                        <p className="text-gray-600">Precio: <span className="font-semibold">{product.price} Turings</span></p>
                                        <p className="text-gray-600">Tu balance: <span className="font-semibold">{user?.turingBalance || 0} Turings</span></p>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Cantidad:
                                            </label>
                                            <input
                                                type="number"
                                                min="1"
                                                max={product.stock}
                                                value={quantity}
                                                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200"
                                            />
                                        </div>
                                        <p className="text-lg font-semibold">
                                            Total: {product.price * quantity} Turings
                                        </p>
                                        <div className="flex justify-end gap-3 mt-6">
                                            <button
                                                onClick={() => setShowPurchaseModal(false)}
                                                className="px-4 py-2 bg-gray-100 text-gray-800 rounded-xl hover:bg-gray-200 transition-colors"
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                onClick={handlePurchase}
                                                className="px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors"
                                                disabled={quantity > product.stock || product.price * quantity > user?.turingBalance}
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

const Shop = ({ isTeacher = false, groupId }) => {
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
        loading: transactionsLoading,
        error: transactionsError
    } = useShopTransactions(groupId);

    const { user } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [showTransactionsModal, setShowTransactionsModal] = useState(false);
    const [isAddingProduct, setIsAddingProduct] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: '',
        description: '',
        stock: '',
        image: ''
    });

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
        const result = await purchaseProduct(productId, user.uid, quantity);
        if (result.success) {
            window.location.reload();
        } else {
            alert(result.error);
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

    if (productsLoading) return <div className="flex justify-center p-4">Cargando productos...</div>;
    if (productsError) return <div className="text-red-500 p-4">{productsError}</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-3">
                            Tienda de Turings
                        </h1>
                        <p className="text-gray-500 text-lg">
                            {isTeacher ? 'Gestiona el inventario de la tienda' : `Tu balance: ${user?.turingBalance || 0} Turings`}
                        </p>
                    </div>
                    {isTeacher && (
                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowTransactionsModal(true)}
                                className="bg-gray-100 text-gray-800 font-medium py-2.5 px-6 rounded-xl transition-all duration-300 flex items-center gap-2"
                            >
                                <History className="w-5 h-5"/>
                                <span>Ver Transacciones</span>
                            </button>
                            <button
                                onClick={() => setIsAddingProduct(true)}
                                className="bg-gray-900 hover:bg-gray-800 text-white font-medium py-2.5 px-6 rounded-xl transition-all duration-300 flex items-center gap-2"
                            >
                                <Plus className="w-5 h-5"/>
                                <span>Nuevo Producto</span>
                            </button>
                        </div>
                    )}
                </div>

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
                            }
                            }
                        />
                    </div>
                )}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                    <div className="max-h-[60vh] overflow-y-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left p-3 text-sm font-medium text-gray-500">Fecha</th>
                                <th className="text-left p-3 text-sm font-medium text-gray-500">Estudiante</th>
                                <th className="text-left p-3 text-sm font-medium text-gray-500">Producto</th>
                                <th className="text-right p-3 text-sm font-medium text-gray-500">Cantidad</th>
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
                                    <td className="p-3 text-sm text-gray-600 text-right">{transaction.quantity}</td>
                                    <td className="p-3 text-sm text-gray-600 text-right">{transaction.totalPrice} T</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default Shop;
