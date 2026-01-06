import { useEffect, useState } from "react";
import api from "../api/axios";
import { useTheme } from "../context/ThemeContext"; // Import useTheme hook

export default function AdminVerifySeller() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState({});
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all"); // all, pending, verified
  const [search, setSearch] = useState("");
  
  const { theme } = useTheme(); // Get current theme

  useEffect(() => {
    setLoading(true);
    api.get("accounts/admin/sellers/")
      .then(res => setSellers(res.data || []))
      .catch(() => {
        setSellers([]);
        setError("Failed to load sellers");
      })
      .finally(() => setLoading(false));
  }, []);

  const verifySeller = async (id, sellerName) => {
    if (!window.confirm(`Are you sure you want to verify "${sellerName}"?`)) {
      return;
    }

    setVerifying(prev => ({ ...prev, [id]: true }));
    setError("");

    try {
      await api.post(`accounts/admin/verify-seller/${id}/`);
      
      // Update local state
      setSellers(
        sellers.map(s =>
          s.id === id ? { ...s, is_verified: true } : s
        )
      );

      // Show success feedback
      const button = document.querySelector(`#verify-btn-${id}`);
      if (button) {
        const originalText = button.textContent;
        button.textContent = "✓ Verified!";
        button.style.backgroundColor = "var(--success-color)";
        
        setTimeout(() => {
          button.textContent = originalText;
          button.style.backgroundColor = "var(--success-color)";
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to verify seller. Please try again.");
    } finally {
      setVerifying(prev => ({ ...prev, [id]: false }));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (isVerified) => {
    return isVerified ? "var(--success-color)" : "var(--warning-color)";
  };

  const getStatusText = (isVerified) => {
    return isVerified ? "Verified" : "Pending";
  };

  const getStatusIcon = (isVerified) => {
    return isVerified ? "✅" : "⏳";
  };

  // Filter sellers
  const filteredSellers = sellers.filter(seller => {
    const matchesSearch = search === "" || 
      seller.email.toLowerCase().includes(search.toLowerCase()) ||
      (seller.store_name && seller.store_name.toLowerCase().includes(search.toLowerCase()));
    
    if (filter === "all") return matchesSearch;
    if (filter === "pending") return !seller.is_verified && matchesSearch;
    if (filter === "verified") return seller.is_verified && matchesSearch;
    
    return matchesSearch;
  });

  const pendingCount = sellers.filter(s => !s.is_verified).length;
  const verifiedCount = sellers.filter(s => s.is_verified).length;

  // Helper function for hover effects using theme variables
  const getHoverStyles = (element) => {
    const hoverStyles = {
      searchInput: {
        onFocus: (e) => {
          e.target.style.borderColor = "var(--primary-color)";
          e.target.style.boxShadow = "0 0 0 3px rgba(52, 152, 219, 0.1)";
        },
        onBlur: (e) => {
          e.target.style.borderColor = "var(--border-color)";
          e.target.style.boxShadow = "none";
        }
      },
      filterButton: {
        onMouseEnter: (e) => {
          if (filter !== "all") {
            e.currentTarget.style.backgroundColor = "var(--hover-bg)";
          }
        },
        onMouseLeave: (e) => {
          if (filter !== "all") {
            e.currentTarget.style.backgroundColor = "var(--card-bg)";
          }
        }
      },
      filterButtonActive: {
        onMouseEnter: (e) => {
          e.currentTarget.style.backgroundColor = "var(--secondary-color)";
          e.currentTarget.style.transform = "translateY(-1px)";
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.backgroundColor = "var(--primary-color)";
          e.currentTarget.style.transform = "translateY(0)";
        }
      },
      verifyButton: {
        onMouseEnter: (e) => {
          if (!verifying[e.currentTarget.dataset.sellerId]) {
            e.currentTarget.style.backgroundColor = "var(--success-color)";
            e.currentTarget.style.opacity = "0.9";
            e.currentTarget.style.transform = "translateY(-1px)";
          }
        },
        onMouseLeave: (e) => {
          if (!verifying[e.currentTarget.dataset.sellerId]) {
            e.currentTarget.style.backgroundColor = "var(--success-color)";
            e.currentTarget.style.opacity = "1";
            e.currentTarget.style.transform = "translateY(0)";
          }
        }
      }
    };
    
    return hoverStyles[element] || {};
  };

  const styles = {
    container: {
      maxWidth: "1000px",
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
    header: {
      marginBottom: "30px",
    },
    title: {
      fontSize: "32px",
      fontWeight: "bold",
      color: "var(--text-color)", // ✅ Theme text color
      margin: "0 0 8px 0",
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
    },
    statsContainer: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
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
      transition: "transform 0.2s ease"
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
    filterContainer: {
      display: "flex",
      flexDirection: "column",
      gap: "16px",
      marginBottom: "30px",
    },
    searchBox: {
      position: "relative",
    },
    searchIcon: {
      position: "absolute",
      left: "14px",
      top: "50%",
      transform: "translateY(-50%)",
      fontSize: "16px",
      color: "var(--text-secondary)", // ✅ Theme secondary text
    },
    searchInput: {
      width: "100%",
      padding: "12px 16px 12px 42px",
      border: "1px solid var(--border-color)", // ✅ Theme border
      borderRadius: "8px",
      fontSize: "15px",
      color: "var(--text-color)", // ✅ Theme text color
      backgroundColor: "var(--input-bg)", // ✅ Theme input background
      outline: "none",
      transition: "border-color 0.2s ease, box-shadow 0.2s ease",
      boxSizing: "border-box",
    },
    filterButtons: {
      display: "flex",
      gap: "8px",
      flexWrap: "wrap",
    },
    filterButton: {
      backgroundColor: "var(--card-bg)", // ✅ Theme card background
      color: "var(--text-color)", // ✅ Theme text color
      border: "1px solid var(--border-color)", // ✅ Theme border
      padding: "8px 16px",
      borderRadius: "6px",
      fontSize: "14px",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    filterButtonActive: {
      backgroundColor: "var(--primary-color)", // ✅ Theme primary color
      color: "white",
      borderColor: "var(--primary-color)", // ✅ Theme primary color
    },
    sellersContainer: {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    },
    emptyContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "60px 20px",
      backgroundColor: "var(--card-bg)", // ✅ Theme card background
      borderRadius: "12px",
      border: "1px solid var(--border-color)", // ✅ Theme border
      textAlign: "center",
    },
    emptyIcon: {
      fontSize: "48px",
      marginBottom: "16px",
      opacity: 0.5,
    },
    emptyTitle: {
      fontSize: "20px",
      fontWeight: "600",
      color: "var(--text-color)", // ✅ Theme text color
      margin: "0 0 8px 0",
    },
    emptyText: {
      fontSize: "14px",
      color: "var(--text-secondary)", // ✅ Theme secondary text
      margin: 0,
    },
    sellerCard: {
      backgroundColor: "var(--card-bg)", // ✅ Theme card background
      borderRadius: "12px",
      padding: "24px",
      boxShadow: "var(--shadow)", // ✅ Theme shadow
      border: "1px solid var(--border-color)", // ✅ Theme border
      transition: "transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease, border-color 0.3s ease"
    },
    sellerHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: "20px",
      flexWrap: "wrap",
      gap: "15px"
    },
    sellerInfo: {
      flex: 1,
      minWidth: "300px"
    },
    storeName: {
      fontSize: "18px",
      fontWeight: "600",
      color: "var(--text-color)", // ✅ Theme text color
      margin: "0 0 8px 0",
    },
    sellerEmail: {
      fontSize: "14px",
      color: "var(--text-secondary)", // ✅ Theme secondary text
      margin: "0 0 12px 0",
    },
    sellerMeta: {
      display: "flex",
      gap: "16px",
      flexWrap: "wrap",
    },
    metaItem: {
      fontSize: "13px",
      color: "var(--text-secondary)", // ✅ Theme secondary text
      display: "flex",
      alignItems: "center",
      gap: "4px",
    },
    statusBadge: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      padding: "8px 16px",
      borderRadius: "20px",
      fontSize: "14px",
      fontWeight: "600",
      border: "1px solid",
      flexShrink: 0,
    },
    statusIcon: {
      fontSize: "14px",
    },
    statusText: {
      fontSize: "13px",
      letterSpacing: "0.3px",
    },
    verifiedInfo: {
      paddingTop: "20px",
      borderTop: "1px solid var(--border-color)", // ✅ Theme border
    },
    verifiedDetails: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      marginBottom: "12px",
      flexWrap: "wrap"
    },
    verifiedLabel: {
      fontSize: "13px",
      color: "var(--text-secondary)", // ✅ Theme secondary text
    },
    verifiedValue: {
      fontSize: "14px",
      color: "var(--success-color)", // ✅ Theme success color
      fontWeight: "500",
    },
    verifiedMessage: {
      fontSize: "14px",
      color: "var(--success-color)", // ✅ Theme success color
      backgroundColor: "rgba(39, 174, 96, 0.1)", // ✅ Success color with opacity
      padding: "12px",
      borderRadius: "8px",
      margin: 0,
    },
    actionSection: {
      paddingTop: "20px",
      borderTop: "1px solid var(--border-color)", // ✅ Theme border
    },
    businessInfo: {
      marginBottom: "24px",
    },
    businessTitle: {
      fontSize: "16px",
      fontWeight: "600",
      color: "var(--text-color)", // ✅ Theme text color
      margin: "0 0 16px 0",
    },
    businessGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "16px",
    },
    businessItem: {
      display: "flex",
      flexDirection: "column",
      gap: "4px",
    },
    businessLabel: {
      fontSize: "13px",
      color: "var(--text-secondary)", // ✅ Theme secondary text
    },
    businessValue: {
      fontSize: "14px",
      color: "var(--text-color)", // ✅ Theme text color
      fontWeight: "500",
    },
    verifySection: {
      display: "flex",
      alignItems: "flex-start",
      gap: "16px",
      flexWrap: "wrap"
    },
    verifyButton: {
      backgroundColor: "var(--success-color)", // ✅ Theme success color
      color: "white",
      border: "none",
      padding: "10px 24px",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s ease",
      minWidth: "140px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
    },
    verifyButtonDisabled: {
      backgroundColor: "var(--disabled-bg)", // ✅ Theme disabled background
      color: "var(--disabled-color)", // ✅ Theme disabled color
      cursor: "not-allowed",
      opacity: 0.7,
    },
    buttonLoading: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    buttonSpinner: {
      width: "16px",
      height: "16px",
      border: "2px solid rgba(255, 255, 255, 0.3)",
      borderTop: "2px solid white",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
    },
    verifyHint: {
      fontSize: "13px",
      color: "var(--text-secondary)", // ✅ Theme secondary text
      margin: 0,
      lineHeight: "1.5",
      flex: 1,
      minWidth: "200px"
    },
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Loading sellers...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Seller Verification</h1>
        <p style={styles.subtitle}>Review and verify seller accounts</p>
      </div>

      {error && (
        <div style={styles.errorContainer}>
          ❌ {error}
        </div>
      )}

      {/* Stats Cards */}
      <div style={styles.statsContainer}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>👥</div>
          <div style={styles.statContent}>
            <span style={styles.statNumber}>{sellers.length}</span>
            <span style={styles.statLabel}>Total Sellers</span>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>⏳</div>
          <div style={styles.statContent}>
            <span style={styles.statNumber}>{pendingCount}</span>
            <span style={styles.statLabel}>Pending Verification</span>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>✅</div>
          <div style={styles.statContent}>
            <span style={styles.statNumber}>{verifiedCount}</span>
            <span style={styles.statLabel}>Verified</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={styles.filterContainer}>
        <div style={styles.searchBox}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search by email or store name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
            {...getHoverStyles('searchInput')}
          />
        </div>
        
        <div style={styles.filterButtons}>
          <button
            onClick={() => setFilter("all")}
            style={{
              ...styles.filterButton,
              ...(filter === "all" ? styles.filterButtonActive : {})
            }}
            {...(filter === "all" ? getHoverStyles('filterButtonActive') : getHoverStyles('filterButton'))}
          >
            All ({sellers.length})
          </button>
          <button
            onClick={() => setFilter("pending")}
            style={{
              ...styles.filterButton,
              ...(filter === "pending" ? styles.filterButtonActive : {})
            }}
            {...(filter === "pending" ? getHoverStyles('filterButtonActive') : getHoverStyles('filterButton'))}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setFilter("verified")}
            style={{
              ...styles.filterButton,
              ...(filter === "verified" ? styles.filterButtonActive : {})
            }}
            {...(filter === "verified" ? getHoverStyles('filterButtonActive') : getHoverStyles('filterButton'))}
          >
            Verified ({verifiedCount})
          </button>
        </div>
      </div>

      {/* Sellers List */}
      <div style={styles.sellersContainer}>
        {filteredSellers.length === 0 ? (
          <div style={styles.emptyContainer}>
            <div style={styles.emptyIcon}>📝</div>
            <h3 style={styles.emptyTitle}>No sellers found</h3>
            <p style={styles.emptyText}>
              {search 
                ? "No sellers match your search criteria"
                : filter === "pending" 
                  ? "No pending verifications"
                  : "No sellers available"}
            </p>
          </div>
        ) : (
          filteredSellers.map(seller => (
            <div key={seller.id} style={styles.sellerCard}>
              <div style={styles.sellerHeader}>
                <div style={styles.sellerInfo}>
                  <h3 style={styles.storeName}>
                    {seller.store_name || "No store name"}
                  </h3>
                  <p style={styles.sellerEmail}>{seller.email}</p>
                  
                  <div style={styles.sellerMeta}>
                    {seller.created_at && (
                      <span style={styles.metaItem}>
                        Joined: {formatDate(seller.created_at)}
                      </span>
                    )}
                    {seller.gst_number && (
                      <span style={styles.metaItem}>
                        GST: {seller.gst_number}
                      </span>
                    )}
                  </div>
                </div>
                
                <div style={{
                  ...styles.statusBadge,
                  backgroundColor: getStatusColor(seller.is_verified) + "20",
                  color: getStatusColor(seller.is_verified),
                  borderColor: getStatusColor(seller.is_verified) + "40"
                }}>
                  <span style={styles.statusIcon}>
                    {getStatusIcon(seller.is_verified)}
                  </span>
                  <span style={styles.statusText}>
                    {getStatusText(seller.is_verified)}
                  </span>
                </div>
              </div>

              {seller.is_verified ? (
                <div style={styles.verifiedInfo}>
                  <div style={styles.verifiedDetails}>
                    <span style={styles.verifiedLabel}>Verified on:</span>
                    <span style={styles.verifiedValue}>
                      {seller.verified_at ? formatDate(seller.verified_at) : "Recently"}
                    </span>
                  </div>
                  <div style={styles.verifiedMessage}>
                    ✅ This seller is verified and can start selling immediately.
                  </div>
                </div>
              ) : (
                <div style={styles.actionSection}>
                  <div style={styles.businessInfo}>
                    <h4 style={styles.businessTitle}>Business Details</h4>
                    <div style={styles.businessGrid}>
                      <div style={styles.businessItem}>
                        <span style={styles.businessLabel}>PAN:</span>
                        <span style={styles.businessValue}>
                          {seller.pan_number || "Not provided"}
                        </span>
                      </div>
                      <div style={styles.businessItem}>
                        <span style={styles.businessLabel}>Bank Account:</span>
                        <span style={styles.businessValue}>
                          {seller.bank_account ? `••••${seller.bank_account.slice(-4)}` : "Not provided"}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div style={styles.verifySection}>
                    <button
                      id={`verify-btn-${seller.id}`}
                      data-seller-id={seller.id}
                      onClick={() => verifySeller(seller.id, seller.store_name || seller.email)}
                      disabled={verifying[seller.id]}
                      style={{
                        ...styles.verifyButton,
                        ...(verifying[seller.id] ? styles.verifyButtonDisabled : {})
                      }}
                      {...getHoverStyles('verifyButton')}
                    >
                      {verifying[seller.id] ? (
                        <span style={styles.buttonLoading}>
                          <span style={styles.buttonSpinner}></span>
                          Verifying...
                        </span>
                      ) : (
                        "Verify Seller"
                      )}
                    </button>
                    <p style={styles.verifyHint}>
                      Click to approve this seller's business registration
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}