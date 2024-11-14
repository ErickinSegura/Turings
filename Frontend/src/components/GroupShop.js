import React, { useState } from 'react';
import useGroupShop from '../hooks/UseGroupShop';
import { Plus, Edit2, Trash2, ShoppingBag } from 'lucide-react';

const ProductCard = ({ product, onEdit, onDelete, isEditing, editingProduct, setEditingProduct, onUpdate, onCancel }) => {
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
                        step="0.01"
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200"
                        placeholder="Precio"
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
                            <div
                                className="absolute inset-0 bg-gray-50 rounded-xl transition-opacity duration-300 opacity-0 group-hover:opacity-100"/>
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
                                    ${product.price?.toFixed(2)}
                                </span>
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed mb-2">
                                {product.description}
                            </p>
                            <p className="text-sm text-gray-500">
                                Stock disponible: <span className="font-semibold">{product.stock}</span>
                            </p>
                        </div>

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
                    </div>
                </div>
            </div>
        </div>
    );
};

const GroupShop = ({groupId}) => {
    const {
        products,
        loading,
        error,
        addProduct,
        updateProduct,
        deleteProduct
    } = useGroupShop(groupId);

    const [newProduct, setNewProduct] = useState({
        name: '',
        price: '',
        description: '',
        stock: '',
        image: ''
    });

    const [editingProduct, setEditingProduct] = useState(null);
    const [isAddingProduct, setIsAddingProduct] = useState(false);

    const handleAddProduct = async () => {
        const result = await addProduct({
            ...newProduct,
            price: parseFloat(newProduct.price),
            stock: parseInt(newProduct.stock)
        });

        if (result.success) {
            setNewProduct({
                name: '',
                price: '',
                description: '',
                stock: '',
                image: ''
            });
            setIsAddingProduct(false);
        }
    };


    const handleUpdateProduct = async (productId) => {
        const result = await updateProduct(productId, {
            ...editingProduct,
            price: parseFloat(editingProduct.price),
            stock: parseInt(editingProduct.stock)
        });

        if (result.success) {
            setEditingProduct(null);
        }
    };

    const handleCancel = () => {
        if (isAddingProduct) {
            setIsAddingProduct(false);
            setNewProduct({
                name: '',
                price: '',
                description: '',
                stock: '',
                image: ''
            });
        } else {
            setEditingProduct(null);
        }
    };

    if (loading) return <div className="flex justify-center p-4">Cargando productos...</div>;
    if (error) return <div className="text-red-500 p-4">{error}</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-3">
                            Administrar Productos
                        </h1>
                        <p className="text-gray-500 text-lg">
                            Gestiona el inventario de tu tienda
                        </p>
                    </div>
                    <button
                        onClick={() => handleAddProduct()} // Evitar pasar e explícitamente.
                        className="bg-gray-900 hover:bg-gray-800 text-white font-medium py-2.5 px-6 rounded-xl transition-all duration-300 flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5"/>
                        <span>Nuevo Producto</span>
                    </button>

                </div>

                {isAddingProduct && (
                    <div className="mb-8">
                        <ProductCard
                            product={{}}
                            isEditing={true}
                            editingProduct={newProduct}
                            setEditingProduct={setNewProduct}
                            onUpdate={handleAddProduct}
                            onCancel={handleCancel}
                        />
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onEdit={setEditingProduct}
                            onDelete={deleteProduct}
                            isEditing={editingProduct?.id === product.id}
                            editingProduct={editingProduct}
                            setEditingProduct={setEditingProduct}
                            onUpdate={handleUpdateProduct}
                            onCancel={handleCancel}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GroupShop;