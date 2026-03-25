import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ cartCount, toggleCart, user, onLogout }) => {
  const navigate = useNavigate();
  
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  
  // NEW: State to track which order IDs are expanded to show all items
  const [expandedOrders, setExpandedOrders] = useState({});

  const handleOrdersClick = async () => {
    if (!user) {
      alert("Please log in to view your orders.");
      navigate("/login");
      return;
    }

    setIsOrdersOpen(true);
    setLoadingOrders(true);
    
    try {
      const response = await fetch(`http://127.0.0.1:5000/orders/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  // NEW: Toggle function for expanding/collapsing individual orders
  const toggleOrderExpansion = (orderId) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <>
      <nav className="bg-gray-900 text-white p-4 shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          <Link to="/" className="text-xl font-bold tracking-wide flex items-center gap-2 hover:text-green-400 transition">
            🛒 Grocery Recommender
          </Link>
          
          <div className="flex items-center gap-6 font-medium">
            <Link to="/" className="hover:text-green-400 transition hidden sm:block">Home</Link>
            <Link to="/shop" className="hover:text-green-400 transition hidden sm:block">Shop</Link>
            
            <button 
              onClick={handleOrdersClick} 
              className="hover:text-green-400 transition hidden sm:block focus:outline-none"
            >
              Orders
            </button>
            
            <div className="flex items-center gap-3 border-l border-gray-700 pl-6 ml-2">
              {user ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-300">Hi, <b className="text-white">{user.username}</b></span>
                  <button onClick={onLogout} className="text-sm text-red-400 hover:text-red-300 transition">Logout</button>
                </div>
              ) : (
                <Link to="/login" className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-md font-bold transition shadow-sm text-sm">
                  Get Started
                </Link>
              )}
            </div>
            
            <button onClick={toggleCart} className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-full flex items-center gap-2 transition ml-2 border border-gray-700 relative">
              🧺 Cart
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border border-gray-800 shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Backdrop */}
      {isOrdersOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity" 
          onClick={() => setIsOrdersOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-screen w-96 max-w-[90vw] bg-gray-50 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isOrdersOpen ? "translate-x-0" : "translate-x-full"}`}>
        
        {/* Header */}
        <div className="p-5 bg-gray-900 text-white flex justify-between items-center shadow-md z-10 border-b border-gray-800 shrink-0">
          <h3 className="text-lg font-bold flex items-center gap-2 text-green-400">📦 Order History</h3>
          <button 
            onClick={() => setIsOrdersOpen(false)} 
            className="text-gray-400 hover:text-white text-3xl leading-none transition-colors"
          >
            &times;
          </button>
        </div>

        {/* Orders List */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 flex flex-col gap-4 
                        scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent 
                        hover:scrollbar-thumb-gray-400 [&::-webkit-scrollbar]:w-2
                        [&::-webkit-scrollbar-track]:bg-transparent
                        [&::-webkit-scrollbar-thumb]:bg-gray-300
                        [&::-webkit-scrollbar-thumb]:rounded-full
                        hover:[&::-webkit-scrollbar-thumb]:bg-gray-400">
          
          {loadingOrders ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            </div>
          ) : orders.length === 0 ? (
            
            <div className="text-center text-gray-400 mt-32 flex flex-col items-center">
              <div className="w-24 h-24 mb-4 opacity-40">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM8 10a2 2 0 100-4 2 2 0 000 4zm8 0a2 2 0 100-4 2 2 0 000 4zm-4 7c2.33 0 4.31-1.46 5.11-3.5H6.89C7.69 15.54 9.67 17 12 17z"/>
                </svg>
              </div>
              <p className="font-bold text-xl text-gray-500 tracking-wide">Wow, such empty</p>
            </div>

          ) : (
            orders.map((order) => {
              // NEW: Determine if this specific order is expanded
              const isExpanded = expandedOrders[order.id];
              // Decide which items to show based on expanded state
              const displayedItems = isExpanded ? order.items : order.items.slice(0, 2);
              const extraItemsCount = order.items.length - 2;

              return (
                <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden shrink-0">
                  
                  <div className="bg-gray-100/50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                    <div>
                      <span className="block text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-0.5">Order Placed</span>
                      <span className="text-sm font-medium text-gray-800">{formatDate(order.created_at)}</span>
                    </div>
                    <div className="text-right">
                      <span className="block text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-0.5">Total</span>
                      <span className="text-sm font-black text-green-600">₹{order.total_price.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="p-4 space-y-3">
                    {/* Render the sliced or full items array */}
                    {displayedItems.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-3 truncate pr-2">
                          <span className="bg-gray-100 text-gray-700 font-bold px-2 py-0.5 rounded text-xs border border-gray-200">
                            {item.qty}x
                          </span>
                          <div className="flex flex-col">
                             <span className="text-gray-800 font-medium truncate">{item.name}</span>
                          </div>
                        </div>
                        <span className="text-gray-600 font-medium whitespace-nowrap">
                          ₹{(item.price * item.qty).toFixed(2)}
                        </span>
                      </div>
                    ))}

                    {/* NEW: Load More / Show Less Button */}
                    {extraItemsCount > 0 && (
                      <div className="pt-2 border-t border-dashed border-gray-200 mt-2">
                        <button 
                          onClick={() => toggleOrderExpansion(order.id)}
                          className="w-full text-center text-xs font-bold text-blue-500 hover:text-blue-600 transition py-1"
                        >
                          {isExpanded ? "↑ Show Less" : `↓ +${extraItemsCount} more items`}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;