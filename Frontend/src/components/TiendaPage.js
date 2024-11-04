import React from 'react';

// Componente para la tarjeta de producto individual
const ProductCard = ({ title, description, price, image }) => {
  return (
    <div className="bg-white rounded-xl p-8 shadow-sm border border-black">
      <div className="flex flex-col h-full">
        <div className="flex mb-6">
          <div className="w-1/2 flex items-center justify-center"> {/* Añadido flex items-center justify-center */}
            <img
              src={image}
              alt={title}
              className="w-full h-48 object-contain"
            />
          </div>
          <div className="w-1/2 pl-6">
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-gray-600 mb-4">{description}</p>
            <div className="mt-auto">
              <p className="text-sm text-gray-600">Precio</p>
              <p className="text-xl font-semibold mb-4">{price} Turings</p>
              <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center">
                <svg
                  className="w-5 h-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Comprar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente de la página de tienda
const TiendaPage = () => {
  const products = [
    {
      id: 1,
      title: "Escudo Hyliano",
      description: "Extender por 5 días hábiles la entrega del reto 1.",
      price: 15,
      image: "/images/shield.png"
    },
    {
      id: 2,
      title: "Ocarina del Tiempo",
      description: "Extender por 5 días hábiles la entrega de una tarea.",
      price: 10,
      image: "/images/ocarina.png"
    },
    {
      id: 3,
      title: "Corazón",
      description: "Cubrir la ausencia en un quiz (no aplica en exámenes) para poder presentarlos después.",
      price: 20,
      image: "/images/heart.png"
    },
    {
      id: 4,
      title: "Espada Maestra",
      description: "Sin este coco no es posible abrir el juego. INDISPENSABLE",
      price: 100,
      image: "/images/sword.png"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            title={product.title}
            description={product.description}
            price={product.price}
            image={product.image}
          />
        ))}
      </div>
    </div>
  );
};

export default TiendaPage;