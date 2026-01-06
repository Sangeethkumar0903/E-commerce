import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext"; // ✅ Import useTheme hook

export default function SellerProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const navigate = useNavigate();
  const { theme } = useTheme(); // ✅ Get current theme

  useEffect(() => {
    // First check seller profile
    checkSellerProfile();
  }, []);

  const checkSellerProfile = async () => {
    try {
      setProfileLoading(true);
      const response = await api.get("accounts/seller/profile/");
      const profileData = response.data;
      
      console.log("Profile data:", profileData); // Debug log
      
      if (!profileData || !profileData.is_verified) {
        // Redirect to profile setup if not verified
        navigate("/seller/profile");
        return;
      }
      
      setProfile(profileData);
      // Load products only after profile verification check
      loadProducts();
    } catch (err) {
      console.error("Error fetching profile:", err);
      // If profile doesn't exist or error, redirect to profile setup
      navigate("/seller/profile");
    } finally {
      setProfileLoading(false);
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get("products/seller/products/");
      console.log("Products API response:", response.data); // Debug log
      
      // Check if API returned an error for unverified seller
      if (response.data.error) {
        if (response.data.error.includes("verified") || 
            response.data.error.includes("verification")) {
          navigate("/seller/profile");
          return;
        }
        setError(response.data.error);
        setProducts([]);
        return;
      }
      
      // Handle both response formats
      let productsData = [];
      if (response.data.products) {
        // New format with seller_profile included
        productsData = response.data.products;
        // Update profile info if available
        if (response.data.seller_profile) {
          setProfile(prev => ({
            ...prev,
            ...response.data.seller_profile
          }));
        }
      } else if (Array.isArray(response.data)) {
        // Old format - just array of products
        productsData = response.data;
      }
      
      setProducts(productsData);
    } catch (err) {
      console.error("Error loading products:", err);
      setProducts([]);
      
      // Check if error is due to unverified seller
      if (err.response?.status === 403) {
        if (err.response.data?.error?.includes("verified") || 
            err.response.data?.error?.includes("verification")) {
          navigate("/seller/profile");
          return;
        }
      }
      
      setError(err.response?.data?.error || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const getStockColor = (stock) => {
    if (stock === 0) return "#ef4444";
    if (stock <= 10) return "#f59e0b";
    return "#10b981";
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return "Out of Stock";
    if (stock <= 10) return "Low Stock";
    return "In Stock";
  };

  const handleEditProduct = (productId) => {
    navigate(`/seller/products/${productId}/edit`);
  };

  const handleRestock = (productId) => {
    navigate(`/seller/products/${productId}/restock`);
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      await api.delete(`products/seller/products/${productId}/`);
      // Refresh products list
      setProducts(products.filter(p => p.id !== productId));
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete product");
    }
  };

  // ✅ Helper function for hover effects using theme variables
  const getHoverStyles = (element) => {
    const hoverStyles = {
      addButton: {
        onMouseEnter: (e) => {
          e.currentTarget.style.backgroundColor = "var(--secondary-color)";
          e.currentTarget.style.transform = "translateY(-2px)";
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.backgroundColor = "var(--primary-color)";
          e.currentTarget.style.transform = "translateY(0)";
        }
      },
      verifyButton: {
        onMouseEnter: (e) => {
          e.currentTarget.style.backgroundColor = "var(--secondary-color)";
          e.currentTarget.style.transform = "translateY(-2px)";
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.backgroundColor = "var(--primary-color)";
          e.currentTarget.style.transform = "translateY(0)";
        }
      },
      retryButton: {
        onMouseEnter: (e) => {
          e.currentTarget.style.backgroundColor = "var(--secondary-color)";
          e.currentTarget.style.transform = "translateY(-2px)";
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.backgroundColor = "var(--primary-color)";
          e.currentTarget.style.transform = "translateY(0)";
        }
      },
      addProductButton: {
        onMouseEnter: (e) => {
          e.currentTarget.style.backgroundColor = "var(--secondary-color)";
          e.currentTarget.style.transform = "translateY(-2px)";
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.backgroundColor = "var(--primary-color)";
          e.currentTarget.style.transform = "translateY(0)";
        }
      },
      profileButton: {
        onMouseEnter: (e) => {
          e.currentTarget.style.backgroundColor = "var(--hover-bg)";
          e.currentTarget.style.transform = "translateY(-2px)";
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.backgroundColor = "var(--card-bg)";
          e.currentTarget.style.transform = "translateY(0)";
        }
      },
      refreshButton: {
        onMouseEnter: (e) => {
          e.currentTarget.style.backgroundColor = "var(--hover-bg)";
          e.currentTarget.style.transform = "translateY(-2px)";
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.backgroundColor = "var(--card-bg)";
          e.currentTarget.style.transform = "translateY(0)";
        }
      },
      refreshButtonSmall: {
        onMouseEnter: (e) => {
          e.currentTarget.style.backgroundColor = "var(--hover-bg)";
          e.currentTarget.style.transform = "translateY(-2px)";
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.backgroundColor = "var(--card-bg)";
          e.currentTarget.style.transform = "translateY(0)";
        }
      },
      editButton: {
        onMouseEnter: (e) => {
          e.currentTarget.style.backgroundColor = "var(--secondary-color)";
          e.currentTarget.style.transform = "translateY(-1px)";
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.backgroundColor = "var(--primary-color)";
          e.currentTarget.style.transform = "translateY(0)";
        }
      },
      restockButton: {
        onMouseEnter: (e) => {
          e.currentTarget.style.backgroundColor = "var(--success-color)";
          e.currentTarget.style.opacity = "0.9";
          e.currentTarget.style.transform = "translateY(-1px)";
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.backgroundColor = "var(--success-color)";
          e.currentTarget.style.opacity = "1";
          e.currentTarget.style.transform = "translateY(0)";
        }
      },
      deleteButton: {
        onMouseEnter: (e) => {
          e.currentTarget.style.backgroundColor = "var(--error-color)";
          e.currentTarget.style.opacity = "0.9";
          e.currentTarget.style.transform = "translateY(-1px)";
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.backgroundColor = "var(--error-color)";
          e.currentTarget.style.opacity = "1";
          e.currentTarget.style.transform = "translateY(0)";
        }
      }
    };
    
    return hoverStyles[element] || {};
  };

  const styles = {
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "20px",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      backgroundColor: "var(--bg-color)", // ✅ Theme background
      color: "var(--text-color)", // ✅ Theme text color
      minHeight: "100vh",
      transition: "background-color 0.3s ease, color 0.3s ease" // ✅ Smooth transition
    },
    loadingContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "60vh",
      gap: "20px",
    },
    spinner: {
      width: "50px",
      height: "50px",
      border: "4px solid var(--border-color)", // ✅ Theme border
      borderTop: "4px solid var(--primary-color)", // ✅ Theme primary color
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
    },
    loadingText: {
      fontSize: "18px",
      color: "var(--text-secondary)", // ✅ Theme secondary text
      margin: 0,
    },
    debugInfo: {
      fontSize: "12px",
      color: "var(--text-secondary)", // ✅ Theme secondary text
      backgroundColor: "var(--card-bg)", // ✅ Theme card background
      padding: "8px 12px",
      borderRadius: "6px",
      marginTop: "10px",
      textAlign: "center",
    },
    errorPage: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "70vh",
      textAlign: "center",
      padding: "40px 20px",
    },
    errorIcon: {
      fontSize: "80px",
      marginBottom: "20px",
      color: "var(--error-color)", // ✅ Theme error color
    },
    errorTitle: {
      fontSize: "28px",
      fontWeight: "bold",
      color: "var(--text-color)", // ✅ Theme text color
      margin: "0 0 10px 0",
    },
    errorText: {
      fontSize: "16px",
      color: "var(--text-secondary)", // ✅ Theme secondary text
      margin: "0 0 30px 0",
      maxWidth: "500px",
      lineHeight: "1.5",
    },
    retryButton: {
      backgroundColor: "var(--primary-color)", // ✅ Theme primary color
      color: "white",
      border: "none",
      padding: "12px 30px",
      borderRadius: "8px",
      fontWeight: "600",
      fontSize: "16px",
      cursor: "pointer",
      transition: "all 0.2s ease",
      marginBottom: "15px",
    },
    profileLink: {
      color: "var(--primary-color)", // ✅ Theme primary color
      textDecoration: "none",
      fontSize: "14px",
    },
    verificationContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "70vh",
      textAlign: "center",
      padding: "40px 20px",
    },
    verificationIcon: {
      fontSize: "80px",
      marginBottom: "20px",
      opacity: 0.5,
    },
    verificationTitle: {
      fontSize: "28px",
      fontWeight: "bold",
      color: "var(--text-color)", // ✅ Theme text color
      margin: "0 0 10px 0",
    },
    verificationText: {
      fontSize: "16px",
      color: "var(--text-secondary)", // ✅ Theme secondary text
      margin: "0 0 30px 0",
      maxWidth: "500px",
      lineHeight: "1.5",
    },
    verifyButton: {
      backgroundColor: "var(--primary-color)", // ✅ Theme primary color
      color: "white",
      textDecoration: "none",
      padding: "12px 30px",
      borderRadius: "8px",
      fontWeight: "600",
      fontSize: "16px",
      transition: "all 0.2s ease",
    },
    verifiedHeader: {
      marginBottom: "30px",
    },
    verifiedBadge: {
      backgroundColor: "rgba(39, 174, 96, 0.1)", // ✅ Using theme success color
      border: "1px solid rgba(39, 174, 96, 0.3)",
      color: "var(--success-color)", // ✅ Theme success color
      padding: "12px 20px",
      borderRadius: "8px",
      display: "inline-flex",
      alignItems: "center",
      gap: "10px",
      fontWeight: "600",
      fontSize: "16px",
    },
    verifiedIcon: {
      fontSize: "18px",
    },
    emptyContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "60vh",
      textAlign: "center",
      padding: "40px 20px",
      backgroundColor: "var(--card-bg)", // ✅ Theme card background
      borderRadius: "12px",
      boxShadow: "var(--shadow)", // ✅ Theme shadow
      border: "1px solid var(--border-color)", // ✅ Theme border
    },
    emptyIcon: {
      fontSize: "80px",
      marginBottom: "20px",
      opacity: 0.5,
    },
    emptyTitle: {
      fontSize: "28px",
      fontWeight: "bold",
      color: "var(--text-color)", // ✅ Theme text color
      margin: "0 0 10px 0",
    },
    emptyText: {
      fontSize: "16px",
      color: "var(--text-secondary)", // ✅ Theme secondary text
      margin: "0 0 30px 0",
    },
    addButton: {
      backgroundColor: "var(--primary-color)", // ✅ Theme primary color
      color: "white",
      textDecoration: "none",
      padding: "12px 30px",
      borderRadius: "8px",
      fontWeight: "600",
      fontSize: "16px",
      transition: "all 0.2s ease",
      marginBottom: "15px",
    },
    refreshButton: {
      backgroundColor: "var(--card-bg)", // ✅ Theme card background
      color: "var(--text-color)", // ✅ Theme text color
      border: "1px solid var(--border-color)", // ✅ Theme border
      padding: "10px 20px",
      borderRadius: "8px",
      fontWeight: "600",
      fontSize: "14px",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    header: {
      marginBottom: "30px",
    },
    headerTop: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: "8px",
    },
    title: {
      fontSize: "32px",
      fontWeight: "bold",
      color: "var(--text-color)", // ✅ Theme text color
      margin: "0 0 8px 0",
    },
    storeInfo: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    storeName: {
      fontSize: "16px",
      color: "var(--text-secondary)", // ✅ Theme secondary text
    },
    verifiedTag: {
      backgroundColor: "rgba(39, 174, 96, 0.1)", // ✅ Using theme success color
      color: "var(--success-color)", // ✅ Theme success color
      padding: "4px 10px",
      borderRadius: "20px",
      fontSize: "12px",
      fontWeight: "600",
      display: "inline-flex",
      alignItems: "center",
      gap: "4px",
    },
    verifiedTagIcon: {
      fontSize: "12px",
    },
    headerActions: {
      display: "flex",
      gap: "12px",
      alignItems: "center",
    },
    addProductButton: {
      backgroundColor: "var(--primary-color)", // ✅ Theme primary color
      color: "white",
      textDecoration: "none",
      padding: "10px 20px",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: "600",
      transition: "all 0.2s ease",
    },
    profileButton: {
      backgroundColor: "var(--card-bg)", // ✅ Theme card background
      color: "var(--text-color)", // ✅ Theme text color
      textDecoration: "none",
      padding: "10px 20px",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: "600",
      transition: "all 0.2s ease",
      border: "1px solid var(--border-color)", // ✅ Theme border
    },
    refreshButtonSmall: {
      backgroundColor: "var(--card-bg)", // ✅ Theme card background
      color: "var(--text-color)", // ✅ Theme text color
      border: "1px solid var(--border-color)", // ✅ Theme border
      padding: "8px 16px",
      borderRadius: "6px",
      fontSize: "13px",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    subtitle: {
      fontSize: "16px",
      color: "var(--text-secondary)", // ✅ Theme secondary text
      margin: 0,
    },
    errorContainer: {
      backgroundColor: "var(--error-bg)", // ✅ Theme error background
      border: "1px solid var(--error-color)", // ✅ Theme error color
      color: "var(--error-color)", // ✅ Theme error color
      padding: "16px",
      borderRadius: "8px",
      marginBottom: "24px",
      fontSize: "14px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    errorContent: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    errorIconSmall: {
      fontSize: "16px",
    },
    dismissButton: {
      backgroundColor: "transparent",
      border: "1px solid var(--error-color)", // ✅ Theme error color
      color: "var(--error-color)", // ✅ Theme error color
      padding: "4px 12px",
      borderRadius: "4px",
      fontSize: "12px",
      cursor: "pointer",
    },
    statsContainer: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: "16px",
      marginBottom: "30px",
    },
    statCard: {
      backgroundColor: "var(--card-bg)", // ✅ Theme card background
      borderRadius: "12px",
      padding: "20px",
      display: "flex",
      alignItems: "center",
      gap: "16px",
      boxShadow: "var(--shadow)", // ✅ Theme shadow
      border: "1px solid var(--border-color)", // ✅ Theme border
    },
    statIcon: {
      fontSize: "32px",
      opacity: 0.8,
    },
    statContent: {
      display: "flex",
      flexDirection: "column",
    },
    statNumber: {
      fontSize: "24px",
      fontWeight: "bold",
      color: "var(--text-color)", // ✅ Theme text color
    },
    statLabel: {
      fontSize: "14px",
      color: "var(--text-secondary)", // ✅ Theme secondary text
    },
    productsContainer: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
      gap: "24px",
    },
    productCard: {
      backgroundColor: "var(--card-bg)", // ✅ Theme card background
      borderRadius: "12px",
      overflow: "hidden",
      boxShadow: "var(--shadow)", // ✅ Theme shadow
      border: "1px solid var(--border-color)", // ✅ Theme border
      transition: "transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease, border-color 0.3s ease", // ✅ Theme transitions
      display: "flex",
      flexDirection: "column",
    },
    productImageContainer: {
      position: "relative",
      width: "100%",
      height: "200px",
      backgroundColor: "var(--image-bg)", // ✅ Theme image background
      overflow: "hidden",
    },
    productImage: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      transition: "transform 0.3s ease",
    },
    imagePlaceholder: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "var(--placeholder-bg)", // ✅ Theme placeholder background
    },
    placeholderIcon: {
      fontSize: "60px",
      color: "var(--placeholder-color)", // ✅ Theme placeholder color
      opacity: 0.5,
    },
    productStatusBadge: {
      position: "absolute",
      top: "12px",
      right: "12px",
      padding: "4px 12px",
      borderRadius: "20px",
      fontSize: "12px",
      fontWeight: "600",
      border: "1px solid",
      zIndex: 1,
    },
    productInfo: {
      padding: "20px",
      flex: 1,
      display: "flex",
      flexDirection: "column",
    },
    productHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: "12px",
    },
    productTitle: {
      fontSize: "18px",
      fontWeight: "600",
      color: "var(--text-color)", // ✅ Theme text color
      margin: "0 12px 0 0",
      flex: 1,
      lineHeight: "1.4",
    },
    productId: {
      fontSize: "12px",
      color: "var(--text-secondary)", // ✅ Theme secondary text
      fontFamily: "monospace",
      backgroundColor: "var(--tag-bg)", // ✅ Theme tag background
      padding: "2px 8px",
      borderRadius: "4px",
    },
    productDescription: {
      fontSize: "14px",
      color: "var(--text-secondary)", // ✅ Theme secondary text
      lineHeight: "1.5",
      margin: "0 0 16px 0",
      flex: 1,
    },
    productMeta: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "12px",
      marginBottom: "20px",
    },
    metaItem: {
      display: "flex",
      flexDirection: "column",
      gap: "4px",
    },
    metaLabel: {
      fontSize: "12px",
      color: "var(--text-secondary)", // ✅ Theme secondary text
    },
    price: {
      fontSize: "20px",
      fontWeight: "bold",
      color: "var(--primary-color)", // ✅ Theme primary color
    },
    quantityBadge: {
      padding: "4px 10px",
      borderRadius: "12px",
      fontSize: "13px",
      fontWeight: "600",
      display: "inline-block",
    },
    brand: {
      fontSize: "14px",
      color: "var(--text-color)", // ✅ Theme text color
      fontWeight: "500",
    },
    category: {
      fontSize: "14px",
      color: "var(--text-color)", // ✅ Theme text color
      fontWeight: "500",
      backgroundColor: "var(--tag-bg)", // ✅ Theme tag background
      padding: "4px 10px",
      borderRadius: "6px",
      display: "inline-block",
    },
    productFooter: {
      marginTop: "auto",
    },
    actionButtons: {
      display: "flex",
      gap: "8px",
    },
    editButton: {
      backgroundColor: "var(--primary-color)", // ✅ Theme primary color
      color: "white",
      border: "none",
      padding: "8px 16px",
      borderRadius: "6px",
      fontSize: "13px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s ease",
      flex: 1,
    },
    restockButton: {
      backgroundColor: "var(--success-color)", // ✅ Theme success color
      color: "white",
      border: "none",
      padding: "8px 16px",
      borderRadius: "6px",
      fontSize: "13px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s ease",
      flex: 1,
    },
    deleteButton: {
      backgroundColor: "var(--error-color)", // ✅ Theme error color
      color: "white",
      border: "none",
      padding: "8px 16px",
      borderRadius: "6px",
      fontSize: "13px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s ease",
      flex: 1,
    },
  };

  // Debug view to see what's happening
  if (profileLoading || loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>
            {profileLoading ? "Checking seller status..." : "Loading your products..."}
          </p>
          <p style={styles.debugInfo}>
            Status: {profileLoading ? "Checking profile" : "Loading products"} | 
            Profile: {profile ? "Loaded" : "Not loaded"} | 
            Products: {products.length}
          </p>
        </div>
      </div>
    );
  }

  // If there's an API error that's not about verification
  if (error && !error.includes("verified") && !error.includes("verification")) {
    return (
      <div style={styles.container}>
        <div style={styles.errorPage}>
          <div style={styles.errorIcon}>❌</div>
          <h2 style={styles.errorTitle}>Error Loading Products</h2>
          <p style={styles.errorText}>{error}</p>
          <button 
            onClick={() => {
              setError("");
              loadProducts();
            }} 
            style={styles.retryButton}
            {...getHoverStyles('retryButton')}
          >
            Retry
          </button>
          <Link to="/seller/profile" style={styles.profileLink}>
            Go to Profile
          </Link>
        </div>
      </div>
    );
  }

  // Show verification required page
  if (!profile?.is_verified) {
    return (
      <div style={styles.container}>
        <div style={styles.verificationContainer}>
          <div style={styles.verificationIcon}>🔒</div>
          <h2 style={styles.verificationTitle}>Profile Verification Required</h2>
          <p style={styles.verificationText}>
            You need to complete and verify your seller profile before managing products.
          </p>
          <p style={styles.debugInfo}>
            Profile Status: {profile ? "Exists but not verified" : "Not found"} | 
            Store Name: {profile?.store_name || "Not set"}
          </p>
          <Link to="/seller/profile" style={styles.verifyButton} {...getHoverStyles('verifyButton')}>
            Complete Verification
          </Link>
        </div>
      </div>
    );
  }

  // Empty products state
  if (products.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.verifiedHeader}>
          <div style={styles.verifiedBadge}>
            <span style={styles.verifiedIcon}>✅</span>
            <span>Verified Seller: {profile?.store_name || "Your Store"}</span>
          </div>
        </div>

        <div style={styles.emptyContainer}>
          <div style={styles.emptyIcon}>📦</div>
          <h2 style={styles.emptyTitle}>No products yet</h2>
          <p style={styles.emptyText}>Start by adding your first product to your store</p>
          <Link to="/seller/add" style={styles.addButton} {...getHoverStyles('addButton')}>
            + Add Your First Product
          </Link>
          <button 
            onClick={loadProducts}
            style={styles.refreshButton}
            {...getHoverStyles('refreshButton')}
          >
            Refresh List
          </button>
        </div>
      </div>
    );
  }

  // Main products view
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <div>
            <h1 style={styles.title}>My Products</h1>
            <div style={styles.storeInfo}>
              <span style={styles.storeName}>Store: {profile?.store_name || "Your Store"}</span>
              <div style={styles.verifiedTag}>
                <span style={styles.verifiedTagIcon}>✅</span>
                <span>Verified Seller</span>
              </div>
            </div>
          </div>
          <div style={styles.headerActions}>
            <Link to="/seller/add" style={styles.addProductButton} {...getHoverStyles('addProductButton')}>
              + Add New Product
            </Link>
            <Link to="/seller/profile" style={styles.profileButton} {...getHoverStyles('profileButton')}>
              View Profile
            </Link>
            <button 
              onClick={loadProducts}
              style={styles.refreshButtonSmall}
              {...getHoverStyles('refreshButtonSmall')}
            >
              Refresh
            </button>
          </div>
        </div>
        <p style={styles.subtitle}>
          Managing {products.length} product{products.length !== 1 ? 's' : ''} in your store
        </p>
      </div>

      {error && (
        <div style={styles.errorContainer}>
          <div style={styles.errorContent}>
            <span style={styles.errorIconSmall}>❌</span>
            <span>{error}</span>
          </div>
          <button 
            onClick={() => setError("")} 
            style={styles.dismissButton}
          >
            Dismiss
          </button>
        </div>
      )}

      <div style={styles.statsContainer}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>📦</div>
          <div style={styles.statContent}>
            <span style={styles.statNumber}>{products.length}</span>
            <span style={styles.statLabel}>Total Products</span>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>✅</div>
          <div style={styles.statContent}>
            <span style={styles.statNumber}>
              {products.filter(p => p.stock_quantity > 0).length}
            </span>
            <span style={styles.statLabel}>In Stock</span>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>💰</div>
          <div style={styles.statContent}>
            <span style={styles.statNumber}>
              ₹{products.reduce((sum, p) => sum + (p.price * p.stock_quantity), 0).toLocaleString()}
            </span>
            <span style={styles.statLabel}>Inventory Value</span>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>⚠️</div>
          <div style={styles.statContent}>
            <span style={styles.statNumber}>
              {products.filter(p => p.stock_quantity === 0).length}
            </span>
            <span style={styles.statLabel}>Out of Stock</span>
          </div>
        </div>
      </div>

      <div style={styles.productsContainer}>
        {products.map(product => (
          <div key={product.id} style={styles.productCard}>
            <div style={styles.productImageContainer}>
              {product.images && product.images.length > 0 ? (
                <img 
                  src={product.images[0].image_url} 
                  alt={product.title}
                  style={styles.productImage}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
              ) : (
                <div style={styles.imagePlaceholder}>
                  <span style={styles.placeholderIcon}>📦</span>
                </div>
              )}
              
              {/* Product Status Badge */}
              <div style={{
                ...styles.productStatusBadge,
                backgroundColor: getStockColor(product.stock_quantity) + "20",
                color: getStockColor(product.stock_quantity),
                borderColor: getStockColor(product.stock_quantity) + "40"
              }}>
                {getStockStatus(product.stock_quantity)}
              </div>
            </div>

            <div style={styles.productInfo}>
              <div style={styles.productHeader}>
                <h3 style={styles.productTitle}>
                  {product.title}
                </h3>
                <div style={styles.productId}>
                  ID: #{product.id}
                </div>
              </div>

              {product.description && (
                <p style={styles.productDescription}>
                  {product.description.length > 100 
                    ? `${product.description.substring(0, 100)}...` 
                    : product.description}
                </p>
              )}

              <div style={styles.productMeta}>
                <div style={styles.metaItem}>
                  <span style={styles.metaLabel}>Price:</span>
                  <span style={styles.price}>₹{product.price}</span>
                </div>
                
                <div style={styles.metaItem}>
                  <span style={styles.metaLabel}>Stock:</span>
                  <div style={{
                    ...styles.quantityBadge,
                    backgroundColor: getStockColor(product.stock_quantity) + "30",
                    color: getStockColor(product.stock_quantity),
                  }}>
                    {product.stock_quantity} units
                  </div>
                </div>
                
                {product.brand && (
                  <div style={styles.metaItem}>
                    <span style={styles.metaLabel}>Brand:</span>
                    <span style={styles.brand}>{product.brand}</span>
                  </div>
                )}
                
                {product.category_name && (
                  <div style={styles.metaItem}>
                    <span style={styles.metaLabel}>Category:</span>
                    <span style={styles.category}>{product.category_name}</span>
                  </div>
                )}
              </div>

              <div style={styles.productFooter}>
                <div style={styles.actionButtons}>
                  
                  
                  {product.stock_quantity === 0 && (
                    <button
                      onClick={() => handleRestock(product.id)}
                      style={styles.restockButton}
                      {...getHoverStyles('restockButton')}
                    >
                      Restock
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    style={styles.deleteButton}
                    {...getHoverStyles('deleteButton')}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}