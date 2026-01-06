import { useEffect, useState } from "react";
import api from "../api/axios";

export default function SellerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    api.get("orders/seller-orders/")
      .then(res => setOrders(res.data || []))
      .catch(() => {
        setOrders([]);
        setError("Failed to load orders");
      })
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    if (!window.confirm(`Are you sure you want to mark this order as ${status.toLowerCase()}?`)) {
      return;
    }

    setUpdatingStatus(prev => ({ ...prev, [id]: true }));
    setError("");

    try {
      await api.put(`orders/seller/update-status/${id}/`, { status });
      
      // Update the order status locally
      setOrders(prevOrders => 
        prevOrders.map(item => 
          item.id === id ? { ...item, status } : item
        )
      );
      
      // Show success feedback
      const button = document.querySelector(`#status-btn-${id}`);
      if (button) {
        const originalText = button.textContent;
        button.textContent = "✓ Updated!";
        button.style.backgroundColor = "#10b981";
        
        setTimeout(() => {
          button.textContent = originalText;
          button.style.backgroundColor = "";
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status. Please try again.");
    } finally {
      setUpdatingStatus(prev => ({ ...prev, [id]: false }));
    }
  };

  const getStatusColor = (status) => {
    const statusColors = {
      "PLACED": "#3b82f6",
      "SHIPPED": "#f59e0b",
      "DELIVERED": "#10b981",
      "CANCELLED": "#ef4444",
      "PROCESSING": "#8b5cf6"
    };
    return statusColors[status] || "#6b7280";
  };

  const getStatusIcon = (status) => {
    const statusIcons = {
      "PLACED": "📦",
      "SHIPPED": "🚚",
      "DELIVERED": "✅",
      "CANCELLED": "❌",
      "PROCESSING": "⚙️"
    };
    return statusIcons[status] || "📋";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateTotal = (item) => {
    return (item.price_at_time || 0) * (item.quantity || 0);
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div style={styles.emptyContainer}>
        <div style={styles.emptyIcon}>📦</div>
        <h2 style={styles.emptyTitle}>No orders yet</h2>
        <p style={styles.emptyText}>Orders from customers will appear here</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Seller Orders</h1>
        <p style={styles.subtitle}>{orders.length} order{orders.length !== 1 ? 's' : ''} pending</p>
      </div>

      {error && (
        <div style={styles.errorContainer}>
          ❌ {error}
        </div>
      )}

      <div style={styles.statsContainer}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>📦</div>
          <div style={styles.statContent}>
            <span style={styles.statNumber}>
              {orders.filter(o => o.status === "PLACED").length}
            </span>
            <span style={styles.statLabel}>Placed</span>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>🚚</div>
          <div style={styles.statContent}>
            <span style={styles.statNumber}>
              {orders.filter(o => o.status === "SHIPPED").length}
            </span>
            <span style={styles.statLabel}>Shipped</span>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>✅</div>
          <div style={styles.statContent}>
            <span style={styles.statNumber}>
              {orders.filter(o => o.status === "DELIVERED").length}
            </span>
            <span style={styles.statLabel}>Delivered</span>
          </div>
        </div>
      </div>

      <div style={styles.ordersContainer}>
        {orders.map(item => (
          <div key={item.id} style={styles.orderCard}>
            <div style={styles.orderHeader}>
              <div style={styles.orderInfo}>
                <h3 style={styles.productTitle}>{item.product_title}</h3>
                <p style={styles.orderMeta}>
                  Order ID: <span style={styles.orderId}>#{item.order_id || item.id}</span>
                  {item.created_at && (
                    <>
                      <span style={styles.separator}>•</span>
                      Ordered on {formatDate(item.created_at)}
                    </>
                  )}
                </p>
              </div>
              
              <div style={{
                ...styles.statusBadge,
                backgroundColor: getStatusColor(item.status) + "20",
                color: getStatusColor(item.status),
                borderColor: getStatusColor(item.status) + "40"
              }}>
                <span style={styles.statusIcon}>
                  {getStatusIcon(item.status)}
                </span>
                <span style={styles.statusText}>{item.status}</span>
              </div>
            </div>

            <div style={styles.orderDetails}>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Quantity:</span>
                <span style={styles.detailValue}>
                  <span style={styles.quantityBadge}>{item.quantity}</span> units
                </span>
              </div>
              
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Price per unit:</span>
                <span style={styles.detailValue}>₹{item.price_at_time}</span>
              </div>
              
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Total amount:</span>
                <span style={styles.totalAmount}>₹{calculateTotal(item)}</span>
              </div>
              
              {item.customer_name && (
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Customer:</span>
                  <span style={styles.detailValue}>{item.customer_name}</span>
                </div>
              )}
            </div>

            <div style={styles.actionContainer}>
              {item.status === "PLACED" && (
                <button
                  id={`status-btn-${item.id}`}
                  onClick={() => updateStatus(item.id, "SHIPPED")}
                  disabled={updatingStatus[item.id]}
                  style={{
                    ...styles.actionButton,
                    ...(updatingStatus[item.id] ? styles.actionButtonDisabled : {}),
                    backgroundColor: "#f59e0b",
                  }}
                  onMouseEnter={(e) => {
                    if (!updatingStatus[item.id] && e.target.textContent !== "✓ Updated!") {
                      e.target.style.backgroundColor = "#d97706";
                      e.target.style.transform = "translateY(-1px)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!updatingStatus[item.id] && e.target.textContent !== "✓ Updated!") {
                      e.target.style.backgroundColor = "#f59e0b";
                      e.target.style.transform = "translateY(0)";
                    }
                  }}
                >
                  {updatingStatus[item.id] ? (
                    <span style={styles.buttonLoading}>
                      <span style={styles.buttonSpinner}></span>
                      Updating...
                    </span>
                  ) : (
                    "Mark as Shipped"
                  )}
                </button>
              )}

              {item.status === "SHIPPED" && (
                <button
                  id={`status-btn-${item.id}`}
                  onClick={() => updateStatus(item.id, "DELIVERED")}
                  disabled={updatingStatus[item.id]}
                  style={{
                    ...styles.actionButton,
                    ...(updatingStatus[item.id] ? styles.actionButtonDisabled : {}),
                    backgroundColor: "#10b981",
                  }}
                  onMouseEnter={(e) => {
                    if (!updatingStatus[item.id] && e.target.textContent !== "✓ Updated!") {
                      e.target.style.backgroundColor = "#059669";
                      e.target.style.transform = "translateY(-1px)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!updatingStatus[item.id] && e.target.textContent !== "✓ Updated!") {
                      e.target.style.backgroundColor = "#10b981";
                      e.target.style.transform = "translateY(0)";
                    }
                  }}
                >
                  {updatingStatus[item.id] ? (
                    <span style={styles.buttonLoading}>
                      <span style={styles.buttonSpinner}></span>
                      Updating...
                    </span>
                  ) : (
                    "Mark as Delivered"
                  )}
                </button>
              )}

              {item.status === "DELIVERED" && (
                <div style={styles.completedBadge}>
                  <span style={styles.completedIcon}>✅</span>
                  <span style={styles.completedText}>Order Completed</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
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
    border: "4px solid #f3f3f3",
    borderTop: "4px solid #3b82f6",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  loadingText: {
    fontSize: "18px",
    color: "#6b7280",
    margin: 0,
  },
  emptyContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "70vh",
    textAlign: "center",
    padding: "40px 20px",
  },
  emptyIcon: {
    fontSize: "80px",
    marginBottom: "20px",
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#374151",
    margin: "0 0 10px 0",
  },
  emptyText: {
    fontSize: "16px",
    color: "#6b7280",
    margin: 0,
  },
  header: {
    marginBottom: "30px",
  },
  title: {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#111827",
    margin: "0 0 8px 0",
  },
  subtitle: {
    fontSize: "16px",
    color: "#6b7280",
    margin: 0,
  },
  errorContainer: {
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#7f1d1d",
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
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "20px",
    display: "flex",
    alignItems: "center",
    gap: "16px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
    border: "1px solid #e5e7eb",
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
    color: "#111827",
  },
  statLabel: {
    fontSize: "14px",
    color: "#6b7280",
  },
  ordersContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  orderCard: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
    border: "1px solid #e5e7eb",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },
  orderHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "20px",
  },
  orderInfo: {
    flex: 1,
  },
  productTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#111827",
    margin: "0 0 8px 0",
  },
  orderMeta: {
    fontSize: "14px",
    color: "#6b7280",
    margin: 0,
  },
  orderId: {
    fontWeight: "600",
    color: "#3b82f6",
  },
  separator: {
    margin: "0 8px",
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
    textTransform: "uppercase",
    fontSize: "12px",
    letterSpacing: "0.5px",
  },
  orderDetails: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
    marginBottom: "24px",
    paddingBottom: "24px",
    borderBottom: "1px solid #f3f4f6",
  },
  detailItem: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  detailLabel: {
    fontSize: "13px",
    color: "#6b7280",
  },
  detailValue: {
    fontSize: "15px",
    color: "#111827",
    fontWeight: "500",
  },
  quantityBadge: {
    backgroundColor: "#3b82f6",
    color: "white",
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "13px",
    fontWeight: "600",
    marginRight: "6px",
  },
  totalAmount: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#10b981",
  },
  actionContainer: {
    display: "flex",
    justifyContent: "flex-end",
  },
  actionButton: {
    color: "white",
    border: "none",
    padding: "10px 24px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    minWidth: "160px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  actionButtonDisabled: {
    opacity: 0.7,
    cursor: "not-allowed",
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
  completedBadge: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#d1fae5",
    color: "#065f46",
    padding: "10px 20px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
  },
  completedIcon: {
    fontSize: "16px",
  },
  completedText: {
    fontSize: "14px",
  },
};

// Add CSS animation
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .order-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    }
  `;
  document.head.appendChild(style);
}