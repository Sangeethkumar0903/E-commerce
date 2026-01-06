import { useState, useEffect } from "react";
import api from "../api/axios";
import { useTheme } from "../context/ThemeContext"; // Import useTheme hook

export default function SellerProfile() {
  const [form, setForm] = useState({
    store_name: "",
    gst_number: "",
    pan_number: "",
    bank_account: ""
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [profileData, setProfileData] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [fetching, setFetching] = useState(true);
  const { theme } = useTheme(); // Get current theme

  // Fetch existing profile data on component mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setFetching(true);
      const response = await api.get("accounts/seller/profile/");
      const data = response.data;
      
      if (data) {
        setProfileData(data);
        setIsVerified(data.is_verified || false);
        
        // If profile exists, populate the form with existing data
        setForm({
          store_name: data.store_name || "",
          gst_number: data.gst_number || "",
          pan_number: data.pan_number || "",
          bank_account: data.bank_account || ""
        });
        
        setSubmitted(!!data.store_name);
      }
    } catch (err) {
      // If profile doesn't exist yet, that's okay - user will create one
      console.log("No existing profile found or error fetching:", err);
    } finally {
      setFetching(false);
    }
  };

  const handleInputChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    setError("");
  };

  const validateForm = () => {
    if (!form.store_name.trim()) {
      setError("Store name is required");
      return false;
    }
    if (!form.gst_number.trim()) {
      setError("GST number is required");
      return false;
    }
    if (!form.pan_number.trim()) {
      setError("PAN number is required");
      return false;
    }
    if (!form.bank_account.trim()) {
      setError("Bank account number is required");
      return false;
    }
    
    // Basic validation for PAN (should be 10 characters)
    if (form.pan_number.trim().length !== 10) {
      setError("PAN number should be 10 characters");
      return false;
    }
    
    // Basic validation for GST (should be 15 characters)
    if (form.gst_number.trim().length !== 15) {
      setError("GST number should be 15 characters");
      return false;
    }
    
    return true;
  };

  const submit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError("");
    
    try {
      await api.put("accounts/seller/profile/", form);
      setSubmitted(true);
      await fetchProfile(); // Refresh profile data after submission
      
    } catch (err) {
      const data = err.response?.data;

      if (data && typeof data === "object") {
        const firstKey = Object.keys(data)[0];
        setError(data[firstKey][0]);
      } else {
        setError("Failed to submit profile. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      maxWidth: "600px",
      margin: "0 auto",
      padding: "20px",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      backgroundColor: "var(--bg-color)",
      color: "var(--text-color)",
      minHeight: "100vh",
      transition: "background-color 0.3s ease, color 0.3s ease"
    },
    header: {
      textAlign: "center",
      marginBottom: "40px",
    },
    title: {
      fontSize: "32px",
      fontWeight: "bold",
      color: "var(--text-color)",
      margin: "0 0 8px 0",
    },
    subtitle: {
      fontSize: "16px",
      color: "var(--text-secondary)",
      margin: "0 0 20px 0",
    },
    verificationBadge: {
      backgroundColor: "rgba(39, 174, 96, 0.1)",
      border: "1px solid rgba(39, 174, 96, 0.3)",
      color: "var(--success-color)",
      padding: "16px",
      borderRadius: "8px",
      marginBottom: "24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "12px",
      fontWeight: "600",
      fontSize: "16px",
    },
    infoBox: {
      backgroundColor: "var(--category-bg)",
      border: "1px solid var(--primary-color)",
      borderRadius: "8px",
      padding: "16px",
      marginBottom: "24px",
    },
    infoTitle: {
      fontSize: "14px",
      fontWeight: "600",
      color: "var(--primary-color)",
      margin: "0 0 8px 0",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    infoText: {
      fontSize: "14px",
      color: "var(--text-color)",
      margin: 0,
      lineHeight: "1.5",
    },
    profileDetails: {
      backgroundColor: "var(--card-bg)",
      border: "1px solid var(--border-color)",
      borderRadius: "8px",
      padding: "24px",
      marginBottom: "32px",
      boxShadow: "var(--shadow)",
    },
    profileHeader: {
      fontSize: "20px",
      fontWeight: "600",
      color: "var(--text-color)",
      margin: "0 0 20px 0",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    detailRow: {
      display: "flex",
      marginBottom: "16px",
      paddingBottom: "16px",
      borderBottom: "1px solid var(--border-color)",
      flexWrap: "wrap",
    },
    detailLabel: {
      width: "200px",
      fontSize: "14px",
      fontWeight: "500",
      color: "var(--text-color)",
      minWidth: "150px",
    },
    detailValue: {
      flex: 1,
      fontSize: "14px",
      color: "var(--text-color)",
      fontWeight: "500",
      minWidth: "200px",
    },
    formContainer: {
      backgroundColor: "var(--card-bg)",
      borderRadius: "12px",
      padding: "32px",
      boxShadow: "var(--shadow)",
      border: "1px solid var(--border-color)",
    },
    errorContainer: {
      backgroundColor: "var(--error-bg)",
      border: "1px solid var(--error-color)",
      color: "var(--error-color)",
      padding: "16px",
      borderRadius: "8px",
      marginBottom: "24px",
      fontSize: "14px",
    },
    successContainer: {
      backgroundColor: "rgba(39, 174, 96, 0.1)",
      border: "1px solid rgba(39, 174, 96, 0.3)",
      color: "var(--success-color)",
      padding: "16px",
      borderRadius: "8px",
      marginBottom: "24px",
      fontSize: "14px",
      display: "flex",
      alignItems: "flex-start",
      gap: "12px",
    },
    successIcon: {
      fontSize: "18px",
    },
    formGroup: {
      marginBottom: "24px",
    },
    label: {
      display: "block",
      fontSize: "14px",
      fontWeight: "500",
      color: "var(--text-color)",
      marginBottom: "8px",
    },
    required: {
      color: "var(--error-color)",
    },
    input: {
      width: "100%",
      padding: "12px 16px",
      border: "1px solid var(--border-color)",
      borderRadius: "8px",
      fontSize: "15px",
      color: "var(--text-color)",
      backgroundColor: "var(--input-bg)",
      outline: "none",
      transition: "border-color 0.2s ease, box-shadow 0.2s ease",
      boxSizing: "border-box",
    },
    inputDisabled: {
      width: "100%",
      padding: "12px 16px",
      border: "1px solid var(--border-color)",
      borderRadius: "8px",
      fontSize: "15px",
      color: "var(--text-secondary)",
      backgroundColor: "var(--placeholder-bg)",
      outline: "none",
      boxSizing: "border-box",
    },
    inputHint: {
      fontSize: "12px",
      color: "var(--text-secondary)",
      margin: "8px 0 0 0",
      lineHeight: "1.4",
    },
    buttonContainer: {
      marginTop: "32px",
      textAlign: "center",
    },
    button: {
      backgroundColor: "var(--primary-color)",
      color: "white",
      border: "none",
      padding: "14px 40px",
      borderRadius: "8px",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s ease",
      minWidth: "240px",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
    },
    buttonDisabled: {
      backgroundColor: "var(--disabled-bg)",
      color: "var(--disabled-color)",
      cursor: "not-allowed",
      opacity: 0.7,
    },
    loadingSpinner: {
      width: "20px",
      height: "20px",
      border: "2px solid rgba(255, 255, 255, 0.3)",
      borderTop: "2px solid white",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
    },
    updateButton: {
      backgroundColor: "var(--warning-color)",
      color: "white",
      border: "none",
      padding: "10px 24px",
      borderRadius: "6px",
      fontSize: "14px",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.2s ease",
      marginTop: "16px",
    },
    loadingContainer: {
      textAlign: "center",
      padding: "60px 0",
    },
    footerNote: {
      marginTop: "32px",
      paddingTop: "20px",
      borderTop: "1px solid var(--border-color)",
      textAlign: "center",
    },
    footerText: {
      fontSize: "12px",
      color: "var(--text-secondary)",
      margin: 0,
      lineHeight: "1.6",
    }
  };

  // Helper functions for hover effects using theme variables
  const getHoverStyles = (element) => {
    const hoverStyles = {
      button: {
        onMouseEnter: (e) => {
          if (!loading && !(submitted && !isVerified)) {
            e.currentTarget.style.backgroundColor = "var(--secondary-color)";
            e.currentTarget.style.transform = "translateY(-2px)";
          }
        },
        onMouseLeave: (e) => {
          if (!loading && !(submitted && !isVerified)) {
            e.currentTarget.style.backgroundColor = "var(--primary-color)";
            e.currentTarget.style.transform = "translateY(0)";
          }
        }
      },
      updateButton: {
        onMouseEnter: (e) => {
          e.currentTarget.style.backgroundColor = "var(--warning-color)";
          e.currentTarget.style.opacity = "0.9";
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.backgroundColor = "var(--warning-color)";
          e.currentTarget.style.opacity = "1";
        }
      },
      input: {
        onFocus: (e) => {
          e.target.style.borderColor = "var(--primary-color)";
          e.target.style.boxShadow = "0 0 0 3px rgba(52, 152, 219, 0.1)";
        },
        onBlur: (e) => {
          e.target.style.borderColor = "var(--border-color)";
          e.target.style.boxShadow = "none";
        }
      }
    };
    
    return hoverStyles[element] || {};
  };

  if (fetching) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}></div>
          <p style={{ color: "var(--text-secondary)", marginTop: "16px" }}>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Seller Business Profile</h1>
        <p style={styles.subtitle}>
          {isVerified 
            ? "Your verified business profile"
            : "Complete your business details to start selling on our platform"
          }
        </p>

        {/* Verified Badge */}
        {isVerified && (
          <div style={styles.verificationBadge}>
            <span>✅</span>
            <span>Profile Verified</span>
          </div>
        )}

        {!submitted && !isVerified && (
          <div style={styles.infoBox}>
            <h4 style={styles.infoTitle}>📋 Verification Process</h4>
            <p style={styles.infoText}>
              Your information will be verified by our admin team. This usually takes 1-2 business days. 
              You'll be notified once your seller account is approved.
            </p>
          </div>
        )}
      </div>

      {/* Display verified profile details */}
      {isVerified && profileData && (
        <div style={styles.profileDetails}>
          <h3 style={styles.profileHeader}>
            <span>🏢</span>
            Business Information
          </h3>
          
          <div style={styles.detailRow}>
            <div style={styles.detailLabel}>Store Name:</div>
            <div style={styles.detailValue}>{profileData.store_name}</div>
          </div>
          
          <div style={styles.detailRow}>
            <div style={styles.detailLabel}>GST Number:</div>
            <div style={styles.detailValue}>{profileData.gst_number}</div>
          </div>
          
          <div style={styles.detailRow}>
            <div style={styles.detailLabel}>PAN Number:</div>
            <div style={styles.detailValue}>{profileData.pan_number}</div>
          </div>
          
          <div style={styles.detailRow}>
            <div style={styles.detailLabel}>Bank Account:</div>
            <div style={styles.detailValue}>••••••••{profileData.bank_account?.slice(-4) || "****"}</div>
          </div>
          
          <div style={styles.detailRow}>
            <div style={styles.detailLabel}>Verification Status:</div>
            <div style={{
              ...styles.detailValue,
              color: "var(--success-color)",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <span>✅</span>
              Verified
            </div>
          </div>
          
          <button
            onClick={() => setIsVerified(false)}
            style={styles.updateButton}
            {...getHoverStyles('updateButton')}
          >
            Update Information
          </button>
        </div>
      )}

      {/* Show form if not verified or user wants to update */}
      {(!isVerified || !submitted) && (
        <div style={styles.formContainer}>
          {error && (
            <div style={styles.errorContainer}>
              ❌ {error}
            </div>
          )}
          
          {submitted && !isVerified && (
            <div style={styles.successContainer}>
              <span style={styles.successIcon}>✅</span>
              <div>
                <strong>Profile submitted successfully!</strong>
                <p style={{ margin: "4px 0 0 0", color: "var(--text-color)" }}>
                  Your business details are now under review by our admin team. 
                  You'll receive a notification once verification is complete.
                </p>
              </div>
            </div>
          )}

          {/* Store Name */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Store Name <span style={styles.required}>*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Fashion Hub, Electronics Store"
              value={form.store_name}
              onChange={handleInputChange("store_name")}
              style={isVerified && submitted ? styles.inputDisabled : styles.input}
              {...getHoverStyles('input')}
              disabled={isVerified && submitted}
            />
            <p style={styles.inputHint}>
              This will be displayed to customers as your store name
            </p>
          </div>

          {/* GST Number */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              GST Number <span style={styles.required}>*</span>
            </label>
            <input
              type="text"
              placeholder="15-character GST number (e.g., 27ABCDE1234F1Z5)"
              value={form.gst_number}
              onChange={handleInputChange("gst_number")}
              style={isVerified && submitted ? styles.inputDisabled : styles.input}
              {...getHoverStyles('input')}
              maxLength="15"
              disabled={isVerified && submitted}
            />
            <p style={styles.inputHint}>
              Enter your 15-character GST registration number
            </p>
          </div>

          {/* PAN Number */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              PAN Number <span style={styles.required}>*</span>
            </label>
            <input
              type="text"
              placeholder="10-character PAN number (e.g., ABCDE1234F)"
              value={form.pan_number}
              onChange={handleInputChange("pan_number")}
              style={isVerified && submitted ? styles.inputDisabled : styles.input}
              {...getHoverStyles('input')}
              maxLength="10"
              disabled={isVerified && submitted}
            />
            <p style={styles.inputHint}>
              Enter your 10-character Permanent Account Number
            </p>
          </div>

          {/* Bank Account Number */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Bank Account Number <span style={styles.required}>*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., 123456789012"
              value={form.bank_account}
              onChange={handleInputChange("bank_account")}
              style={isVerified && submitted ? styles.inputDisabled : styles.input}
              {...getHoverStyles('input')}
              disabled={isVerified && submitted}
            />
            <p style={styles.inputHint}>
              This will be used for payment settlements
            </p>
          </div>

          {/* Submit/Update Button */}
          {!isVerified && (
            <div style={styles.buttonContainer}>
              <button
                onClick={submit}
                disabled={loading || (submitted && !isVerified)}
                style={{
                  ...styles.button,
                  ...(loading || (submitted && !isVerified) ? styles.buttonDisabled : {}),
                }}
                {...getHoverStyles('button')}
              >
                {loading ? (
                  <>
                    <span style={styles.loadingSpinner}></span>
                    Submitting...
                  </>
                ) : submitted && !isVerified ? (
                  "Submitted for Review"
                ) : (
                  "Submit for Verification"
                )}
              </button>
            </div>
          )}

          <div style={styles.footerNote}>
            <p style={styles.footerText}>
              ⚠️ Your information is secure and will only be used for verification purposes. 
              We comply with data protection regulations.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}