import React from 'react';

const ProductCard = ({ title, description, price, image }) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        {/* Fondo decorativo */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-50" />
        
        {/* Imagen y contenido */}
        <div className="relative p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Contenedor de imagen con efecto hover */}
            <div className="w-full md:w-1/2 flex items-center justify-center">
              <div className="relative group-hover:scale-105 transition-transform duration-300">
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-300" />
                <img
                  src={image}
                  alt={title}
                  className="relative w-full h-48 object-contain rounded-lg"
                />
              </div>
            </div>

            {/* Contenido */}
            <div className="w-full md:w-1/2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {title}
                  </h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    {price} Turings
                  </span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {description}
                </p>
              </div>

              {/* Botón de compra */}
              <button className="mt-4 w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium py-2.5 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group">
                {/* Ícono de carrito simple con SVG */}
                <svg 
                  className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" 
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Tienda de Poder
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Adquiere objetos mágicos para tu aventura académica
        </p>
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