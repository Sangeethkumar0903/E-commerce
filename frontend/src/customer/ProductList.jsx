import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import "../index.css";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState({});
  const [addedToCart, setAddedToCart] = useState({});
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { role, updateCartCount } = useContext(AuthContext);
  const { theme } = useTheme();

  useEffect(() => {
    setLoading(true);
    api.get("products/browse/")
      .then(res => {
        setProducts(res.data.results || []);
        setError("");
        
        // Only customers should have cart state
        if (role === "CUSTOMER") {
          const cart = JSON.parse(localStorage.getItem("cart") || "[]");
          const initialAddedState = {};
          cart.forEach(item => {
            initialAddedState[item.product_id] = true;
          });
          setAddedToCart(initialAddedState);
        } else {
          setAddedToCart({});
        }
      })
      .catch(() => {
        setProducts([]);
        setError("Failed to load products");
      })
      .finally(() => setLoading(false));
  }, [role]);

  const handleAddToCart = (product) => {
    // Only customers can add to cart
    if (role !== "CUSTOMER") {
      setError("Only customers can purchase products");
      return;
    }
    
    if (!role) {
      setError("Please login to add products to cart");
      navigate("/login");
      return;
    }

    if (addingToCart[product.id] || addedToCart[product.id]) return;

    setAddingToCart(prev => ({ ...prev, [product.id]: true }));
    setError("");

    setTimeout(() => {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      
      const existingItem = cart.find(item => item.product_id === product.id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({
          product_id: product.id,
          title: product.title,
          price: product.price,
          quantity: 1,
          product_image: product.image
        });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      setAddedToCart(prev => ({ ...prev, [product.id]: true }));
      updateCartCount();
      setAddingToCart(prev => ({ ...prev, [product.id]: false }));
    }, 500);
  };

  // Function to get role-specific message
  const getRoleMessage = () => {
    switch(role) {
      case "CUSTOMER":
        return "👋 Browse and add products to your cart.";
      default:
        return "👋 Welcome!";
    }
  };

  // Function to get role-specific button text
  const getButtonText = (product) => {
    if (!role) return "Login to Buy";
    if (role !== "CUSTOMER") return "View Details";
    if (addedToCart[product.id]) return "In Cart";
    if (addingToCart[product.id]) return "Adding...";
    if (product.stock_quantity === 0) return "Out of Stock";
    return "Add to Cart";
  };

  // Function to handle button click based on role
  const handleButtonClick = (product) => {
    if (!role) {
      // Navigate to login page if user is not logged in
      navigate("/login");
      return;
    }
    
    if (role === "CUSTOMER") {
      handleAddToCart(product);
    } else {
      // For sellers and admins, show product details
      navigate(`/product/${product.id}`);
    }
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner}></div>
        <p style={{color: "var(--text-color)"}}>Loading products...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div style={styles.empty}>
        <h2 style={{color: "var(--text-color)"}}>No products available</h2>
        <p style={{color: "var(--text-secondary)"}}>Check back later for new products</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Products</h1>
      <p style={styles.count}>{products.length} products</p>
      
      {/* Show role-specific message */}
      {role && (
        <div style={styles.roleMessage}>
          {getRoleMessage()}
        </div>
      )}

      {error && (
        <div style={styles.error}>
          {error}
        </div>
      )}

      <div style={styles.grid}>
        {products.map(product => (
          <div key={product.id} style={styles.card}>
            <div style={styles.imageContainer}>
              {product.image ? (
                <img 
                  src={product.image} 
                  alt={product.title}
                  style={styles.image}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'block';
                  }}
                />
              ) : null}
              <div style={styles.placeholder}>
                <span></span>
              </div>
              
              {addedToCart[product.id] && role === "CUSTOMER" && (
                <div style={styles.cartBadge}>
                  In Cart
                </div>
              )}
              
              {product.stock_quantity === 0 && (
                <div style={styles.stockBadge}>
                  Out of Stock
                </div>
              )}
              
              {/* Show seller badge if viewing own product */}
              {role === "SELLER" && product.seller_store_name && (
                <div style={styles.sellerBadge}>
                  Your Product
                </div>
              )}
            </div>

            <div style={styles.info}>
              <h3 style={styles.productTitle}>{product.title}</h3>
              
              {product.description && (
                <p style={styles.description}>
                  {product.description.length > 80 
                    ? `${product.description.substring(0, 80)}...` 
                    : product.description}
                </p>
              )}

              <div style={styles.footer}>
                <div>
                  <span style={styles.price}>₹{product.price}</span>
                  {product.stock_quantity > 0 && (
                    <div style={styles.stockInfo}>
                      Stock: {product.stock_quantity}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleButtonClick(product)}
                  disabled={
                    // Only disable for customers in specific cases
                    (role === "CUSTOMER" && (addingToCart[product.id] || addedToCart[product.id] || product.stock_quantity === 0))
                  }
                  style={{
                    ...styles.button,
                    ...((role === "CUSTOMER" && product.stock_quantity === 0) ? styles.buttonDisabled : {}),
                    ...(role && role !== "CUSTOMER" ? styles.viewButton : {}),
                    ...(role === "CUSTOMER" && addedToCart[product.id] ? styles.buttonAdded : {}),
                    ...(!role ? styles.loginButton : {}) // Special style for login button
                  }}
                >
                  {getButtonText(product)}
                </button>
              </div>

              <div style={styles.tags}>
                {product.brand && (
                  <span style={styles.tag}>
                    {product.brand}
                  </span>
                )}
                {product.category_name && (
                  <span style={styles.category}>
                    {product.category_name}
                  </span>
                )}
                {/* Show seller name for all users */}
                {product.seller_store_name && (
                  <span style={styles.sellerTag}>
                    Seller: {product.seller_store_name}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
    backgroundColor: "var(--bg-color)",
    color: "var(--text-color)",
    minHeight: "calc(100vh - 70px)",
  },
  roleMessage: {
    backgroundColor: "var(--category-bg)",
    color: "var(--category-color)",
    padding: "12px 16px",
    borderRadius: "8px",
    marginBottom: "20px",
    fontSize: "14px",
    border: "1px solid var(--border-color)",
  },
  loading: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "calc(100vh - 70px)",
    textAlign: "center",
    backgroundColor: "var(--bg-color)",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "3px solid var(--border-color)",
    borderTop: "3px solid var(--primary-color)",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: "10px",
  },
  empty: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "calc(100vh - 70px)",
    textAlign: "center",
    padding: "40px 20px",
    backgroundColor: "var(--bg-color)",
  },
  title: {
    fontSize: "24px",
    marginBottom: "5px",
    color: "var(--text-color)",
  },
  count: {
    color: "var(--text-secondary)",
    marginBottom: "20px",
    fontSize: "14px",
  },
  error: {
    backgroundColor: "var(--error-bg)",
    color: "var(--error-color)",
    padding: "10px",
    borderRadius: "4px",
    marginBottom: "20px",
    fontSize: "14px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px",
  },
  card: {
    backgroundColor: "var(--card-bg)",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "var(--shadow)",
    border: "1px solid var(--border-color)",
    transition: "all 0.3s ease",
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: "180px",
    backgroundColor: "var(--image-bg)",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  placeholder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "var(--placeholder-bg)",
    fontSize: "40px",
    color: "var(--placeholder-color)",
  },
  cartBadge: {
    position: "absolute",
    top: "10px",
    left: "10px",
    backgroundColor: "var(--success-color)",
    color: "white",
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: "500",
  },
  sellerBadge: {
    position: "absolute",
    top: "10px",
    left: "10px",
    backgroundColor: "var(--primary-color)",
    color: "white",
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: "500",
  },
  stockBadge: {
    position: "absolute",
    top: "10px",
    right: "10px",
    backgroundColor: "var(--error-color)",
    color: "white",
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: "500",
  },
  info: {
    padding: "15px",
  },
  productTitle: {
    fontSize: "16px",
    margin: "0 0 8px 0",
    color: "var(--text-color)",
    lineHeight: "1.3",
    minHeight: "40px",
  },
  description: {
    fontSize: "13px",
    color: "var(--text-secondary)",
    margin: "0 0 12px 0",
    lineHeight: "1.4",
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  price: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "var(--primary-color)",
    display: "block",
    marginBottom: "4px",
  },
  stockInfo: {
    fontSize: "12px",
    color: "var(--text-secondary)",
  },
  button: {
    backgroundColor: "var(--primary-color)",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "4px",
    fontSize: "14px",
    cursor: "pointer",
    minWidth: "100px",
    fontWeight: "500",
    transition: "all 0.2s ease",
  },
  loginButton: {
    backgroundColor: "var(--secondary-color)",
    color: "white",
    cursor: "pointer", // Keep cursor as pointer for login button
  },
  viewButton: {
    backgroundColor: "var(--secondary-color)",
    color: "white",
  },
  buttonDisabled: {
    backgroundColor: "var(--disabled-bg)",
    color: "var(--disabled-color)",
    cursor: "not-allowed",
  },
  buttonAdded: {
    backgroundColor: "var(--success-color)",
    color: "white",
    cursor: "not-allowed",
  },
  tags: {
    display: "flex",
    gap: "5px",
    flexWrap: "wrap",
    marginTop: "8px",
  },
  tag: {
    backgroundColor: "var(--tag-bg)",
    color: "var(--tag-color)",
    padding: "3px 8px",
    borderRadius: "4px",
    fontSize: "12px",
  },
  category: {
    backgroundColor: "var(--category-bg)",
    color: "var(--category-color)",
    padding: "3px 8px",
    borderRadius: "4px",
    fontSize: "12px",
  },
  sellerTag: {
    backgroundColor: "rgba(52, 152, 219, 0.1)",
    color: "var(--primary-color)",
    padding: "3px 8px",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: "500",
  },
};

// Add only essential CSS
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .product-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-hover);
    }
  `;
  document.head.appendChild(style);
}