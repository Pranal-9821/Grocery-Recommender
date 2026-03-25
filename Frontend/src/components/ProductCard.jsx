import React from 'react';

// 1. Extracted Badge Configuration for cleaner JSX and easy scaling
const BADGE_CONFIG = {
  veg: { wrapper: "bg-green-100 text-green-700", dot: "bg-green-500", label: "Veg" },
  nonveg: { wrapper: "bg-red-100 text-red-700", dot: "bg-red-500", label: "Non-Veg" },
  "non-edible": { wrapper: "bg-gray-200 text-gray-700", dot: "bg-gray-500", label: "Household" }
};

const ProductCard = ({ product, addToCart }) => {
  const badge = BADGE_CONFIG[product.type];

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 ease-out flex flex-col h-full group transform hover:-translate-y-1">
      
      {/* Product Image Container */}
      <div className="relative h-48 w-full bg-gray-50 overflow-hidden">
        {/* Subtle gradient overlay ensures badges are readable on light images */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent z-10 pointer-events-none" />
        
        <img 
          src={product.image} 
          alt={product.name} 
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
        />
        
        {/* Dynamic Type Badge */}
        {badge && (
          <div className="absolute top-3 left-3 z-20">
            <span className={`${badge.wrapper} px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm backdrop-blur-sm bg-opacity-90`}>
              <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`}></span> 
              {badge.label}
            </span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1.5 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>
        
        <p className="text-sm text-gray-500 mb-5 line-clamp-2 flex-grow leading-relaxed">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">Price</span>
            <span className="text-xl font-extrabold text-gray-900">
              ₹{product.price}
            </span>
          </div>
          
          <button 
            onClick={() => addToCart(product)}
            aria-label={`Add ${product.name} to cart`}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white px-4 py-2.5 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm hover:shadow-blue-500/30"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path>
            </svg>
            <span className="font-semibold text-sm">Add</span>
          </button>
        </div>
      </div>
      
    </div>
  );
};

export default ProductCard;