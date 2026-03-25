import { useEffect, useState } from "react";
import axios from "axios";
// Ensure you have this file:
import products from "../data/products"; 
const API_URL = import.meta.env.VITE_API_URL;

const Recommendations = ({ cart, addToCart }) => {
  // 1. UPDATED: We now expect an object from the backend
  const [data, setData] = useState({
    perfect_matches: [],
    partial_matches: [],
    bestsellers: []
  });
  
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    if (cart.length === 0) {
      // Reset to empty object if cart is empty
      setData({ perfect_matches: [], partial_matches: [], bestsellers: [] });
      return;
    }

    const items = cart.map(i => i.name);

    axios.post(`${API_URL}/recommend`, { items })
      .then(res => {
        // 2. UPDATED: Directly set the object returned by the new backend
        setData(res.data);
      })
      .catch(err => console.log("Error fetching recommendations:", err));

  }, [cart]);

  const handleAddRecommendation = (itemName) => {
    const productToAdd = products.find(p => p.name.toLowerCase() === itemName.toLowerCase());
    
    if (productToAdd) {
      addToCart(productToAdd);
    } else {
      console.warn(`Could not find ${itemName} in the product database.`);
    }
  };

  const cartItemNames = cart.map(item => item.name.toLowerCase());

  // 3. NEW: Flatten the object into a single array so the rest of your UI code works
  // Note: The backend already attaches the 'type' (tier1, tier2, tier3), so we just combine them.
  const allRecommendations = [
    ...(data.perfect_matches || []),
    ...(data.partial_matches || []),
    ...(data.bestsellers || [])
  ];

  // 4. UPDATED: Filter from the newly combined array
  const missingFromCart = allRecommendations.filter(
    item => !cartItemNames.includes(item.name.toLowerCase())
  );

  const displayedRecommendations = missingFromCart.filter(item => {
    if (filterType === 'all') return true;
    return item.type === filterType;
  });

  // If there are no recommendations at all for this cart, hide the component
  if (missingFromCart.length === 0) return null;

  const getColorClasses = (type) => {
    switch (type) {
      case 'tier1':
        return "bg-green-100 text-green-800 border-green-200 hover:bg-green-200 text-green-600";
      case 'tier2':
        return "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200 text-blue-600";
      case 'tier3':
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200 text-yellow-600";
    }
  };

  return (
    <div className="mt-2">
      {/* Header and Dropdown Container */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-bold text-gray-700 uppercase flex items-center gap-2">
          🔥 Recommended
        </h3>
        
        <select 
          value={filterType} 
          onChange={(e) => setFilterType(e.target.value)}
          className="text-xs bg-white border border-gray-300 text-gray-700 py-1 px-2 rounded outline-none focus:border-blue-500 cursor-pointer shadow-sm"
        >
          <option value="all">Show All</option>
          <option value="tier1">Perfect Match</option>
          <option value="tier2">Related Items</option>
          <option value="tier3">Popular</option>
        </select>
      </div>

      {/* Recommendations List */}
      <div className="flex flex-wrap gap-2 min-h-[30px]">
        {displayedRecommendations.length > 0 ? (
          displayedRecommendations.map((item, i) => {
            const colorsClasses = getColorClasses(item.type).split(" ");
            const buttonBg = colorsClasses.slice(0, 4).join(" ");
            const plusColor = colorsClasses[4];

            return (
              <button 
                key={i} 
                onClick={() => handleAddRecommendation(item.name)}
                className={`${buttonBg} text-xs font-semibold px-3 py-1.5 rounded-full border capitalize hover:shadow-sm transition cursor-pointer flex items-center gap-1`}
                title={`Recommendation type: ${item.type}`}
              >
                <span className={`${plusColor} font-bold`}>+</span> {item.name}
              </button>
            );
          })
        ) : (
          <span className="text-xs text-gray-400 italic py-1">
            No items found for this category.
          </span>
        )}
      </div>
      
      {/* Color Legend */}
      <div className="mt-3 flex gap-3 text-[10px] text-gray-400 font-medium">
        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-400"></div> Perfect</span>
        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-400"></div> Related</span>
        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-yellow-400"></div> Popular</span>
      </div>
    </div>
  );
};

export default Recommendations;