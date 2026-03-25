import { useState } from "react";
import ProductCard from "./ProductCard";
import products from "../data/products";

const Shop = ({ addToCart }) => {
  // Local state for filtering and searching
  const [veg, setVeg] = useState(true);
  const [nonveg, setNonVeg] = useState(true);
  const [nonEdible, setNonEdible] = useState(true); // <-- New state for Household items
  const [searchQuery, setSearchQuery] = useState(""); 

  // Combined Filter logic (Type + Search)
  const filtered = products.filter(p => {
    // 1. Check Types
    let typeMatch = false;
    
    // If all are checked, show everything
    if (veg && nonveg && nonEdible) {
      typeMatch = true;
    } else {
      // Otherwise, only show if the product's type matches a checked box
      if (veg && p.type === "veg") typeMatch = true;
      if (nonveg && p.type === "nonveg") typeMatch = true;
      if (nonEdible && p.type === "non-edible") typeMatch = true;
    }

    // 2. Check Search Query (Case-insensitive)
    const searchMatch = p.name.toLowerCase().includes(searchQuery.toLowerCase());

    return typeMatch && searchMatch;
  });

  return (
    <div className="max-w-7xl mx-auto p-6 animate-fade-in">
      
      {/* Controls Container (Search + Filters) */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        
        {/* Search Bar */}
        <div className="relative w-full md:w-1/3">
          <input 
            type="text" 
            placeholder="Search groceries..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
          />
          <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 bg-white p-3 rounded-lg shadow-sm border border-gray-100">
          <span className="font-semibold text-gray-700 hidden lg:block mr-2">Filters:</span>
          
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              className="accent-green-600 w-4 h-4 cursor-pointer" 
              checked={veg} 
              onChange={() => setVeg(!veg)} 
            />
            🥬 Veg
          </label>
          
          <label className="flex items-center gap-2 cursor-pointer border-l pl-4">
            <input 
              type="checkbox" 
              className="accent-red-600 w-4 h-4 cursor-pointer" 
              checked={nonveg} 
              onChange={() => setNonVeg(!nonveg)} 
            />
            🥩 Non-Veg
          </label>

          <label className="flex items-center gap-2 cursor-pointer border-l pl-4">
            <input 
              type="checkbox" 
              className="accent-gray-600 w-4 h-4 cursor-pointer" 
              checked={nonEdible} 
              onChange={() => setNonEdible(!nonEdible)} 
            />
            🧼 Household
          </label>
        </div>

      </div>

      {/* Product Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map(p => (
            <ProductCard key={p.id} product={p} addToCart={addToCart} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-500">
          <p className="text-xl font-semibold mb-2">No products found</p>
          <p>Try adjusting your search or filters.</p>
        </div>
      )}
      
    </div>
  );
};

export default Shop;