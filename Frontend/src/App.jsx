import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Components
import Navbar from "./components/Navbar.jsx";
import LandingPage from "./components/LandingPage.jsx";
import Shop from "./components/Shop.jsx";
import Cart from "./components/Cart.jsx";
import Login from "./components/Login.jsx";

function App() {
  // Global States
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // 🆕 Check localStorage on initial load to see if a user is already logged in
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("grocery_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // 🆕 Custom Login Handler to save to localStorage
  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem("grocery_user", JSON.stringify(userData));
  };

  // 🆕 Custom Logout Handler to clear localStorage
  const handleLogout = () => {
    setUser(null);
    setCart([]); // Clear cart on logout
    localStorage.removeItem("grocery_user");
  };

  // Cart Functions
  const addToCart = (product) => {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      setCart(cart.map((item) => item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    const existing = cart.find((item) => item.id === productId);
    if (existing.qty === 1) {
      setCart(cart.filter((item) => item.id !== productId));
    } else {
      setCart(cart.map((item) => item.id === productId ? { ...item, qty: item.qty - 1 } : item));
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">

        {/* Navigation */}
        <Navbar
          cartCount={cart.reduce((acc, item) => acc + item.qty, 0)}
          toggleCart={() => setIsCartOpen(!isCartOpen)}
          user={user}
          onLogout={handleLogout} // 🆕 Updated to use new logout function
        />

        {/* Page Routes */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/shop" element={<Shop addToCart={addToCart} />} />
          {/* 🆕 Pass the new handleLoginSuccess function */}
<Route path="/login" element={<Login onAuthSuccess={handleLoginSuccess} user={user} />} />
        </Routes>

        {/* Slide-out Cart Panel */}
        <Cart
          cart={cart}
          isOpen={isCartOpen}
          closeCart={() => setIsCartOpen(false)}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
          clearCart={clearCart}
          user={user}
        />

      </div>
    </Router>
  );
}

export default App;