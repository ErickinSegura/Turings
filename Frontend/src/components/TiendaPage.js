import React from 'react';

const ProductCard = ({ title, description, price, image }) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-black hover:shadow-lg transition-all duration-300 relative">
      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Contenedor de imagen */}
          <div className="w-full md:w-1/2 flex items-center justify-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-white-50 rounded-xl transition-opacity duration-300 opacity-0 group-hover:opacity-100" />
              <img
                src={image}
                alt={title}
                className="relative w-full h-48 object-contain rounded-xl transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          </div>

          {/* Contenido */}
          <div className="w-full md:w-1/2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-semibold text-gray-800">
                  {title}
                </h3>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-50 text-gray-700">
                  {price} Turings
                </span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                {description}
              </p>
            </div>

            {/* Botón de compra */}
            <button className="mt-4 w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-2.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group">
              <svg 
                className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <span>Comprar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Tienda de Turings
            </h1>
            <p className="text-gray-500 text-lg">
              Gasta sabiamente, no hay devoluciones.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
    </div>
  );
};

export default TiendaPage;