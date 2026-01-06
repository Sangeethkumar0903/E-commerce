import { useState, useEffect, useContext } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import Address from "./Address";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext"; // Import useTheme hook

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { updateCartCount } = useContext(AuthContext);
  const { theme } = useTheme(); // Get current theme

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(stored);
  }, []);

  const updateQuantity = (id, newQty) => {
    if (newQty < 1) return;
    const updated = cart.map(item => 
      item.product_id === id ? { ...item, quantity: newQty } : item
    );
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    updateCartCount();
  };

  const removeItem = (id) => {
    if (!window.confirm("Remove item?")) return;
    const updated = cart.filter(item => item.product_id !== id);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    updateCartCount();
  };

  const checkout = async () => {
    if (!selectedAddressId) return alert("Select address");
    if (cart.length === 0) return alert("Cart is empty");
    
    setLoading(true);
    try {
      await api.post("orders/checkout/", {
        address_id: selectedAddressId,
        items: cart.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity
        }))
      });
      localStorage.removeItem("cart");
      setCart([]);
      updateCartCount();
      navigate("/orders");
    } catch (err) {
      alert("Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const styles = {
    container: { 
      padding: "20px", 
      maxWidth: "1200px", 
      margin: "auto",
      backgroundColor: "var(--bg-color)",
      color: "var(--text-color)",
      minHeight: "100vh"
    },
    empty: { 
      textAlign: "center", 
      padding: "50px",
      backgroundColor: "var(--card-bg)",
      borderRadius: "8px",
      margin: "50px auto",
      maxWidth: "500px",
      boxShadow: "var(--shadow)"
    },
    content: { 
      display: "flex", 
      gap: "30px",
      flexWrap: "wrap"
    },
    items: { 
      flex: 2,
      minWidth: "300px"
    },
    item: { 
      display: "flex", 
      gap: "20px", 
      padding: "15px", 
      borderBottom: "1px solid var(--border-color)",
      marginBottom: "10px",
      backgroundColor: "var(--card-bg)",
      borderRadius: "8px",
      boxShadow: "var(--shadow)",
      transition: "all 0.3s ease"
    },
    image: { 
      width: "100px", 
      height: "100px", 
      objectFit: "cover",
      borderRadius: "4px",
      backgroundColor: "var(--image-bg)"
    },
    details: { 
      flex: 1,
      color: "var(--text-color)"
    },
    controls: { 
      display: "flex", 
      gap: "10px", 
      alignItems: "center", 
      margin: "10px 0" 
    },
    quantityButton: {
      padding: "5px 12px",
      backgroundColor: "var(--primary-color)",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontWeight: "bold"
    },
    quantitySpan: {
      padding: "5px 15px",
      backgroundColor: "var(--input-bg)",
      borderRadius: "4px",
      minWidth: "40px",
      textAlign: "center",
      border: "1px solid var(--border-color)"
    },
    removeButton: {
      padding: "5px 12px",
      backgroundColor: "var(--error-color)",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      marginLeft: "10px"
    },
    summary: { 
      flex: 1, 
      padding: "20px", 
      border: "1px solid var(--border-color)", 
      height: "fit-content",
      backgroundColor: "var(--card-bg)",
      borderRadius: "8px",
      boxShadow: "var(--shadow)",
      minWidth: "300px"
    },
    address: { 
      margin: "20px 0",
      padding: "15px",
      backgroundColor: "var(--input-bg)",
      borderRadius: "6px",
      border: "1px solid var(--border-color)"
    },
    checkout: { 
      width: "100%", 
      padding: "12px", 
      background: "var(--primary-color)", 
      color: "white", 
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "16px",
      fontWeight: "600",
      transition: "all 0.2s ease",
      marginTop: "20px"
    },
    checkoutDisabled: {
      width: "100%", 
      padding: "12px", 
      background: "var(--disabled-bg)", 
      color: "var(--disabled-color)", 
      border: "none",
      borderRadius: "6px",
      cursor: "not-allowed",
      fontSize: "16px",
      opacity: 0.7
    },
    title: {
      color: "var(--text-color)",
      marginBottom: "20px",
      fontSize: "28px"
    },
    summaryTitle: {
      color: "var(--text-color)",
      marginBottom: "15px",
      fontSize: "20px",
      borderBottom: "2px solid var(--primary-color)",
      paddingBottom: "10px"
    },
    addressTitle: {
      color: "var(--text-color)",
      marginBottom: "10px",
      fontSize: "18px"
    },
    subtotal: {
      fontSize: "18px",
      margin: "15px 0",
      padding: "10px",
      backgroundColor: "var(--input-bg)",
      borderRadius: "6px",
      border: "1px solid var(--border-color)"
    },
    total: {
      fontSize: "20px",
      fontWeight: "bold",
      margin: "20px 0",
      padding: "15px",
      backgroundColor: "var(--primary-color)",
      color: "white",
      borderRadius: "6px",
      textAlign: "center"
    },
    continueShopping: {
      padding: "12px 24px",
      backgroundColor: "var(--secondary-color)",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "16px",
      fontWeight: "600",
      marginTop: "20px"
    },
    selectedAddress: {
      color: "var(--success-color)",
      fontSize: "14px",
      marginTop: "10px",
      display: "flex",
      alignItems: "center",
      gap: "5px"
    }
  };

  if (cart.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.empty}>
          <h2 style={{color: "var(--text-color)"}}>Your cart is empty</h2>
          <p style={{color: "var(--text-secondary)", margin: "15px 0"}}>
            Add some products to your cart and they will appear here.
          </p>
          <button 
            onClick={() => navigate("/")}
            style={styles.continueShopping}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Shopping Cart ({cart.length} items)</h1>
      
      <div style={styles.content}>
        <div style={styles.items}>
          {cart.map(item => (
            <div key={item.id || item.product_id} style={styles.item}>
              <img 
                src={item.product_image} 
                alt={item.product_title}
                style={styles.image}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/100?text=No+Image";
                }}
              />
              <div style={styles.details}>
                <h3 style={{margin: "0 0 10px 0", color: "var(--text-color)"}}>
                  {item.product_title}
                </h3>
                <p style={{fontWeight: "bold", color: "var(--text-color)"}}>
                  ₹{item.price}
                </p>
                <div style={styles.controls}>
                  <button 
                    onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                    style={styles.quantityButton}
                  >
                    -
                  </button>
                  <span style={styles.quantitySpan}>{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                    style={styles.quantityButton}
                  >
                    +
                  </button>
                  <button 
                    onClick={() => removeItem(item.product_id)}
                    style={styles.removeButton}
                  >
                    Remove
                  </button>
                </div>
                <p style={{marginTop: "10px", fontWeight: "bold", color: "var(--text-color)"}}>
                  Subtotal: ₹{item.price * item.quantity}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div style={styles.summary}>
          <h3 style={styles.summaryTitle}>Order Summary</h3>
          
          <div style={styles.subtotal}>
            <div style={{display: "flex", justifyContent: "space-between", marginBottom: "5px"}}>
              <span>Subtotal:</span>
              <span>₹{total}</span>
            </div>
            <div style={{display: "flex", justifyContent: "space-between", marginBottom: "5px"}}>
              <span>Shipping:</span>
              <span>Free</span>
            </div>
            <div style={{display: "flex", justifyContent: "space-between", marginBottom: "5px"}}>
              <span>Tax:</span>
              <span>₹0</span>
            </div>
          </div>
          
          <div style={styles.total}>
            <div style={{display: "flex", justifyContent: "space-between"}}>
              <span>Total:</span>
              <span>₹{total}</span>
            </div>
          </div>

          <div style={styles.address}>
            <h4 style={styles.addressTitle}>Shipping Address</h4>
            <Address onSelect={setSelectedAddressId} />
            {selectedAddressId && (
              <p style={styles.selectedAddress}>
                <span>✓</span> Address selected
              </p>
            )}
          </div>
          
          <button 
            onClick={checkout} 
            disabled={!selectedAddressId || loading}
            style={!selectedAddressId || loading ? styles.checkoutDisabled : styles.checkout}
          >
            {loading ? "Processing..." : "Proceed to Checkout"}
          </button>
          
          <button 
            onClick={() => navigate("/")}
            style={{
              ...styles.continueShopping,
              backgroundColor: "transparent",
              color: "var(--text-color)",
              border: "1px solid var(--border-color)",
              marginTop: "10px"
            }}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}