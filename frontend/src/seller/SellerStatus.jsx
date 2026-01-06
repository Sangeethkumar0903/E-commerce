import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

export default function SellerStatus() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    api.get("accounts/seller/status/")
      .then(res => {
        setStatus(res.data);
        setError("");
      })
      .catch(() => {
        setError("Failed to load verification status");
        setStatus(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const getStatusColor = (isVerified) => {
    return isVerified ? "#10b981" : "#f59e0b";
  };

  const getStatusText = (isVerified) => {
    return isVerified ? "Verified" : "Pending Verification";
  };

  const getStatusIcon = (isVerified) => {
    return isVerified ? "✅" : "⏳";
  };

  const getStatusDescription = (isVerified) => {
    return isVerified 
      ? "Your seller account is verified and ready to use."
      : "Your verification request is under review by our admin team.";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading verification status...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <div style={styles.errorIcon}>❌</div>
        <h2 style={styles.errorTitle}>Unable to Load Status</h2>
        <p style={styles.errorText}>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          style={styles.retryButton}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Seller Verification Status</h1>
        <p style={styles.subtitle}>Track your seller account verification progress</p>
      </div>

      <div style={styles.statusCard}>
        {/* Status Header */}
        <div style={styles.statusHeader}>
          <div style={{
            ...styles.statusBadge,
            backgroundColor: getStatusColor(status.is_verified) + "20",
            color: getStatusColor(status.is_verified),
            borderColor: getStatusColor(status.is_verified) + "40"
          }}>
            <span style={styles.statusIcon}>
              {getStatusIcon(status.is_verified)}
            </span>
            <span style={styles.statusText}>
              {getStatusText(status.is_verified)}
            </span>
          </div>
          
          {status.is_verified && status.verified_at && (
            <p style={styles.verifiedDate}>
              Verified on {formatDate(status.verified_at)}
            </p>
          )}
        </div>

        {/* Status Description */}
        <p style={styles.statusDescription}>
          {getStatusDescription(status.is_verified)}
        </p>

        {/* Store Information */}
        <div style={styles.infoSection}>
          <h3 style={styles.infoTitle}>Business Information</h3>
          <div style={styles.infoGrid}>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Store Name</span>
              <span style={styles.infoValue}>
                {status.store_name || "Not submitted"}
              </span>
            </div>
            
            {status.gst_number && (
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>GST Number</span>
                <span style={styles.infoValue}>{status.gst_number}</span>
              </div>
            )}
            
            {status.pan_number && (
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>PAN Number</span>
                <span style={styles.infoValue}>{status.pan_number}</span>
              </div>
            )}
            
            {status.bank_account && (
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Bank Account</span>
                <span style={styles.infoValue}>••••{status.bank_account.slice(-4)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Section */}
        <div style={styles.actionSection}>
          {status.is_verified ? (
            <>
              <div style={styles.successMessage}>
                <div style={styles.successIcon}>🎉</div>
                <div>
                  <h4 style={styles.successTitle}>Congratulations!</h4>
                  <p style={styles.successText}>
                    Your seller account is now active. You can start adding products to your store.
                  </p>
                </div>
              </div>
              
              <div style={styles.actionButtons}>
                <Link 
                  to="/seller/add" 
                  style={styles.primaryButton}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#2563eb";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#3b82f6";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  + Add Your First Product
                </Link>
                <Link 
                  to="/seller/products" 
                  style={styles.secondaryButton}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#f3f4f6";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "white";
                  }}
                >
                  View Your Products
                </Link>
              </div>
            </>
          ) : (
            <>
              <div style={styles.pendingMessage}>
                <div style={styles.pendingIcon}>⏳</div>
                <div>
                  <h4 style={styles.pendingTitle}>Verification in Progress</h4>
                  <p style={styles.pendingText}>
                    Our admin team is reviewing your business information. 
                    This process usually takes 1-2 business days.
                  </p>
                </div>
              </div>
              
              <div style={styles.actionButtons}>
                {!status.store_name ? (
                  <Link 
                    to="/seller/profile" 
                    style={styles.primaryButton}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#2563eb";
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#3b82f6";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    Complete Business Profile
                  </Link>
                ) : (
                  <div style={styles.waitingMessage}>
                    <p style={styles.waitingText}>
                      Your profile has been submitted. Please wait for admin approval.
                    </p>
                    <button 
                      onClick={() => window.location.reload()} 
                      style={styles.refreshButton}
                    >
                      Refresh Status
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Verification Steps */}
        <div style={styles.stepsContainer}>
          <h3 style={styles.stepsTitle}>Verification Process</h3>
          <div style={styles.steps}>
            <div style={{
              ...styles.step,
              ...(status.store_name ? styles.stepCompleted : {})
            }}>
              <div style={styles.stepNumber}>
                {status.store_name ? "✓" : "1"}
              </div>
              <div style={styles.stepContent}>
                <h4 style={styles.stepTitle}>Business Profile</h4>
                <p style={styles.stepDescription}>
                  {status.store_name ? "Completed" : "Submit business details"}
                </p>
              </div>
            </div>
            
            <div style={styles.stepDivider}></div>
            
            <div style={{
              ...styles.step,
              ...(status.is_verified ? styles.stepCompleted : {})
            }}>
              <div style={styles.stepNumber}>
                {status.is_verified ? "✓" : "2"}
              </div>
              <div style={styles.stepContent}>
                <h4 style={styles.stepTitle}>Admin Review</h4>
                <p style={styles.stepDescription}>
                  {status.is_verified ? "Verified" : "Under review"}
                </p>
              </div>
            </div>
            
            <div style={styles.stepDivider}></div>
            
            <div style={styles.step}>
              <div style={styles.stepNumber}>3</div>
              <div style={styles.stepContent}>
                <h4 style={styles.stepTitle}>Start Selling</h4>
                <p style={styles.stepDescription}>
                  Add products to your store
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "800px",
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
  errorContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "60vh",
    textAlign: "center",
    padding: "40px 20px",
  },
  errorIcon: {
    fontSize: "60px",
    marginBottom: "20px",
  },
  errorTitle: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#111827",
    margin: "0 0 10px 0",
  },
  errorText: {
    fontSize: "16px",
    color: "#6b7280",
    margin: "0 0 30px 0",
    maxWidth: "400px",
  },
  retryButton: {
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    padding: "10px 24px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
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
  statusCard: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "32px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
    border: "1px solid #e5e7eb",
  },
  statusHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  statusBadge: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 20px",
    borderRadius: "20px",
    fontSize: "16px",
    fontWeight: "600",
    border: "1px solid",
  },
  statusIcon: {
    fontSize: "18px",
  },
  statusText: {
    fontSize: "15px",
    letterSpacing: "0.3px",
  },
  verifiedDate: {
    fontSize: "14px",
    color: "#6b7280",
    margin: 0,
  },
  statusDescription: {
    fontSize: "16px",
    color: "#374151",
    lineHeight: "1.6",
    margin: "0 0 32px 0",
  },
  infoSection: {
    marginBottom: "32px",
    paddingBottom: "32px",
    borderBottom: "1px solid #e5e7eb",
  },
  infoTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#111827",
    margin: "0 0 20px 0",
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
  },
  infoItem: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  infoLabel: {
    fontSize: "13px",
    color: "#6b7280",
  },
  infoValue: {
    fontSize: "15px",
    color: "#111827",
    fontWeight: "500",
  },
  actionSection: {
    marginBottom: "32px",
  },
  successMessage: {
    display: "flex",
    gap: "16px",
    backgroundColor: "#d1fae5",
    padding: "20px",
    borderRadius: "8px",
    marginBottom: "24px",
  },
  successIcon: {
    fontSize: "32px",
  },
  successTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#065f46",
    margin: "0 0 4px 0",
  },
  successText: {
    fontSize: "14px",
    color: "#065f46",
    margin: 0,
    lineHeight: "1.5",
  },
  pendingMessage: {
    display: "flex",
    gap: "16px",
    backgroundColor: "#fef3c7",
    padding: "20px",
    borderRadius: "8px",
    marginBottom: "24px",
  },
  pendingIcon: {
    fontSize: "32px",
  },
  pendingTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#92400e",
    margin: "0 0 4px 0",
  },
  pendingText: {
    fontSize: "14px",
    color: "#92400e",
    margin: 0,
    lineHeight: "1.5",
  },
  actionButtons: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  primaryButton: {
    backgroundColor: "#3b82f6",
    color: "white",
    textDecoration: "none",
    padding: "14px 24px",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    textAlign: "center",
    transition: "all 0.2s ease",
  },
  secondaryButton: {
    backgroundColor: "white",
    color: "#374151",
    textDecoration: "none",
    padding: "14px 24px",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    textAlign: "center",
    border: "1px solid #d1d5db",
    transition: "all 0.2s ease",
  },
  waitingMessage: {
    textAlign: "center",
  },
  waitingText: {
    fontSize: "15px",
    color: "#6b7280",
    margin: "0 0 16px 0",
  },
  refreshButton: {
    backgroundColor: "#f3f4f6",
    color: "#374151",
    border: "1px solid #d1d5db",
    padding: "10px 20px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  stepsContainer: {
    marginTop: "32px",
    paddingTop: "32px",
    borderTop: "1px solid #e5e7eb",
  },
  stepsTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#111827",
    margin: "0 0 24px 0",
  },
  steps: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
  },
  step: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
    flex: 1,
  },
  stepCompleted: {
    opacity: 1,
  },
  stepNumber: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#3b82f6",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    fontWeight: "600",
    zIndex: 1,
  },
  stepContent: {
    textAlign: "center",
  },
  stepTitle: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#111827",
    margin: "0 0 4px 0",
  },
  stepDescription: {
    fontSize: "13px",
    color: "#6b7280",
    margin: 0,
  },
  stepDivider: {
    flex: 1,
    height: "2px",
    backgroundColor: "#e5e7eb",
    margin: "0 8px",
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
    
    .primary-button:hover {
      background-color: #2563eb;
      transform: translateY(-2px);
    }
    
    .secondary-button:hover {
      background-color: #f3f4f6;
    }
    
    .refresh-button:hover {
      background-color: #e5e7eb;
    }
    
    .retry-button:hover {
      background-color: #2563eb;
      transform: translateY(-1px);
    }
    
    .step-completed .step-number {
      background-color: #10b981;
    }
  `;
  document.head.appendChild(style);
}