import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [cartItemCount, setCartItemCount] = useState(0);

  // Initialize cart count from localStorage on app start
  useEffect(() => {
    updateCartCount();
  }, []);

  // Function to update cart count from localStorage
  const updateCartCount = () => {
    try {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartItemCount(cart.length);
    } catch (error) {
      console.error("Error reading cart:", error);
      setCartItemCount(0);
    }
  };

  const login = (token, role) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    setRole(role);
    updateCartCount(); // Update cart count on login
  };

  const logout = () => {
    // Clear localStorage
    localStorage.clear();
    
    // Reset all states
    setRole(null);
    setCartItemCount(0);
    
    // Clear cart from localStorage
    localStorage.removeItem("cart");
  };

  return (
    <AuthContext.Provider value={{ 
      role, 
      login, 
      logout, 
      cartItemCount,
      updateCartCount
    }}>
      {children}
    </AuthContext.Provider>
  );
}