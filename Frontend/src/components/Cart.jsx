import React from "react";
import Recommendations from "./Recommendation.jsx"; // Ensure this path matches your folder structure

const Cart = ({ cart, isOpen, closeCart, addToCart, removeFromCart, clearCart, user }) => {
  // Calculate total price dynamically
  const totalPrice = cart.reduce((total, item) => total + (item.price * item.qty), 0);

  // Checkout Logic
  const handleCheckout = async () => {
    // 1. Guard check: User must be logged in
    if (!user) {
      alert("Please log in to place an order.");
      return; 
    }

    // 2. Send data to the Flask backend
    try {
      const response = await fetch("http://127.0.0.1:5000/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id, // Pulled from the user prop
          cart: cart,
          total_price: totalPrice
        })
      });

      if (response.ok) {
        alert("Order placed successfully! 🎉");
        clearCart();  // Empty the cart UI
        closeCart();  // Close the sidebar
      } else {
        const data = await response.json();
        alert(data.error || "Failed to place order.");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("An error occurred during checkout. Is the Flask server running?");
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity" 
          onClick={closeCart}
        ></div>
      )}

      {/* Sidebar Cart */}
      <div className={`fixed top-0 right-0 h-full w-96 max-w-[90vw] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        
        {/* Header */}
        <div className="p-5 bg-gray-900 text-white flex justify-between items-center shadow-md z-10">
          <h3 className="text-lg font-bold flex items-center gap-2">🧺 Your Cart</h3>
          
          <div className="flex items-center gap-4">
            {/* Empty Cart Button (Only visible if cart has items) */}
            {cart.length > 0 && (
              <button 
                onClick={clearCart} 
                className="text-sm text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 group"
                title="Empty Cart"
              >
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear
              </button>
            )}
            
            <button 
              onClick={closeCart} 
              className="text-gray-400 hover:text-white text-3xl leading-none transition-colors"
              aria-label="Close Cart"
            >
              &times;
            </button>
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-grow overflow-y-auto p-4 flex flex-col gap-4 bg-gray-50/50">
          {cart.length === 0 ? (
            <div className="text-center text-gray-500 mt-20 flex flex-col items-center gap-3">
              <span className="text-6xl grayscale opacity-50">🛒</span>
<p className="font-bold text-xl text-gray-500 tracking-wide">Wow, want an empty cart?</p>
            </div>
          ) : (
            cart.map((item, index) => (
              <div key={index} className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 w-1/2">
                  <img src={item.image} alt={item.name} className="w-14 h-14 rounded-md object-cover border border-gray-100" />
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-800 truncate" title={item.name}>{item.name}</span>
                    <span className="text-xs text-gray-500 font-medium">₹{item.price.toFixed(2)} each</span>
                  </div>
                </div>
                
                {/* Quantity Controls & Item Total */}
                <div className="flex flex-col items-end gap-2">
                  <span className="text-sm font-extrabold text-gray-900">
                    ₹{(item.price * item.qty).toFixed(2)}
                  </span>
                  <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5 border border-gray-200">
                    <button onClick={() => removeFromCart(item.id)} className="text-gray-600 hover:text-red-600 hover:bg-white w-7 h-7 flex items-center justify-center rounded transition-all font-bold">-</button>
                    <span className="text-sm font-bold w-6 text-center">{item.qty}</span>
                    <button onClick={() => addToCart(item)} className="text-gray-600 hover:text-green-600 hover:bg-white w-7 h-7 flex items-center justify-center rounded transition-all font-bold">+</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer: Recommendations & Checkout */}
        {cart.length > 0 && (
          <div className="border-t border-gray-200 bg-white flex flex-col shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)] z-20">
            
            {/* Recommendations Section */}
            <div className="p-4 pb-2 bg-blue-50/30 border-b border-gray-100">
              <Recommendations cart={cart} addToCart={addToCart} />
            </div>

            {/* Total Price Bar */}
            <div className="px-5 py-4 flex justify-between items-center">
              <span className="text-base font-bold text-gray-600 uppercase tracking-wide">Subtotal</span>
              <span className="text-2xl font-black text-gray-900">₹{totalPrice.toFixed(2)}</span>
            </div>
            
            {/* Checkout Button */}
            <div className="px-4 pb-4">
              <button 
                onClick={handleCheckout} 
                className="w-full bg-blue-600 text-white font-bold text-lg py-3.5 rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all shadow-md flex justify-center items-center gap-2"
              >
                Proceed to Checkout 
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </button>
            </div>
            
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;