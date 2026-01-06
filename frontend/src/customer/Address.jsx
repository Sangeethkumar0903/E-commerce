import { useEffect, useState } from "react";
import api from "../api/axios";
import { useTheme } from "../context/ThemeContext"; // Import useTheme hook

export default function Address({ onSelect }) {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [error, setError] = useState("");
  
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    address_line: "",
    city: "",
    state: "",
    pincode: "",
    is_default: false
  });

  const { theme } = useTheme(); // Get current theme

  useEffect(() => {
    setLoading(true);
    api.get("accounts/addresses/")
      .then(res => {
        const addressesData = res.data || [];
        setAddresses(addressesData);
        setError("");

        // auto-select default address
        const defaultAddr = addressesData.find(a => a.is_default);
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr.id);
          onSelect(defaultAddr.id);
        }
      })
      .catch(err => {
        setError("Failed to load addresses. Please try again.");
        console.error("Failed to load addresses", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [onSelect]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    setError("");
  };

  const handleSelectAddress = (addrId) => {
    setSelectedAddressId(addrId);
    onSelect(addrId);
  };

  const validateForm = () => {
    if (!form.full_name.trim()) {
      setError("Full name is required");
      return false;
    }
    if (!form.phone.trim()) {
      setError("Phone number is required");
      return false;
    }
    if (!form.address_line.trim()) {
      setError("Address is required");
      return false;
    }
    if (!form.city.trim()) {
      setError("City is required");
      return false;
    }
    if (!form.state.trim()) {
      setError("State is required");
      return false;
    }
    if (!form.pincode.trim()) {
      setError("Pincode is required");
      return false;
    }
    return true;
  };

  const addAddress = async () => {
    if (!validateForm()) return;

    setAdding(true);
    setError("");
    
    try {
      const res = await api.post("accounts/addresses/", form);
      setAddresses(prev => [...prev, res.data]);
      
      // Select the new address if it's default or first address
      if (form.is_default || addresses.length === 0) {
        handleSelectAddress(res.data.id);
      }
      
      // Reset form and hide it
      setForm({
        full_name: "",
        phone: "",
        address_line: "",
        city: "",
        state: "",
        pincode: "",
        is_default: false
      });
      setShowAddForm(false);
    } catch (err) {
      setError("Failed to add address. Please try again.");
    } finally {
      setAdding(false);
    }
  };

  // Helper function for hover effects using theme variables
  const getHoverStyles = (element) => {
    const hoverStyles = {
      addButton: {
        onMouseEnter: (e) => {
          e.currentTarget.style.backgroundColor = "var(--secondary-color)";
          e.currentTarget.style.transform = "translateY(-1px)";
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.backgroundColor = "var(--primary-color)";
          e.currentTarget.style.transform = "translateY(0)";
        }
      },
      cancelButton: {
        onMouseEnter: (e) => {
          e.currentTarget.style.backgroundColor = "var(--hover-bg)";
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.backgroundColor = "var(--input-bg)";
        }
      },
      submitButton: {
        onMouseEnter: (e) => {
          if (!adding) {
            e.currentTarget.style.backgroundColor = "var(--success-color)";
            e.currentTarget.style.opacity = "0.9";
            e.currentTarget.style.transform = "translateY(-1px)";
          }
        },
        onMouseLeave: (e) => {
          if (!adding) {
            e.currentTarget.style.backgroundColor = "var(--success-color)";
            e.currentTarget.style.opacity = "1";
            e.currentTarget.style.transform = "translateY(0)";
          }
        }
      },
      closeButton: {
        onMouseEnter: (e) => {
          e.currentTarget.style.backgroundColor = "var(--hover-bg)";
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.backgroundColor = "transparent";
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
      },
      textarea: {
        onFocus: (e) => {
          e.target.style.borderColor = "var(--primary-color)";
          e.target.style.boxShadow = "0 0 0 3px rgba(52, 152, 219, 0.1)";
        },
        onBlur: (e) => {
          e.target.style.borderColor = "var(--border-color)";
          e.target.style.boxShadow = "none";
        }
      },
      addressCard: {
        onMouseEnter: (e) => {
          if (selectedAddressId !== parseInt(e.currentTarget.dataset.addressId)) {
            e.currentTarget.style.borderColor = "var(--primary-color)";
            e.currentTarget.style.transform = "translateY(-1px)";
          }
        },
        onMouseLeave: (e) => {
          if (selectedAddressId !== parseInt(e.currentTarget.dataset.addressId)) {
            e.currentTarget.style.borderColor = "var(--border-color)";
            e.currentTarget.style.transform = "translateY(0)";
          }
        }
      }
    };
    
    return hoverStyles[element] || {};
  };

  const styles = {
    container: {
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      backgroundColor: "var(--bg-color)",
      color: "var(--text-color)",
      borderRadius: "8px",
      padding: "20px",
      transition: "background-color 0.3s ease, color 0.3s ease"
    },
    loadingContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 20px",
      backgroundColor: "var(--bg-color)",
      color: "var(--text-color)",
    },
    spinner: {
      width: "40px",
      height: "40px",
      border: "3px solid var(--border-color)",
      borderTop: "3px solid var(--primary-color)",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
    },
    loadingText: {
      fontSize: "16px",
      color: "var(--text-secondary)",
      margin: "16px 0 0 0",
    },
    header: {
      marginBottom: "24px",
    },
    title: {
      fontSize: "20px",
      fontWeight: "600",
      color: "var(--text-color)",
      margin: "0 0 8px 0",
    },
    subtitle: {
      fontSize: "14px",
      color: "var(--text-secondary)",
      margin: 0,
    },
    errorContainer: {
      backgroundColor: "var(--error-bg)",
      border: "1px solid var(--error-color)",
      color: "var(--error-color)",
      padding: "12px 16px",
      borderRadius: "8px",
      marginBottom: "20px",
      fontSize: "14px",
    },
    addressList: {
      marginBottom: "24px",
    },
    emptyAddress: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 20px",
      backgroundColor: "var(--card-bg)",
      borderRadius: "8px",
      border: "1px dashed var(--border-color)",
      textAlign: "center",
    },
    emptyIcon: {
      fontSize: "40px",
      marginBottom: "12px",
      opacity: 0.5,
    },
    emptyTitle: {
      fontSize: "16px",
      fontWeight: "600",
      color: "var(--text-color)",
      margin: "0 0 4px 0",
    },
    emptyText: {
      fontSize: "14px",
      color: "var(--text-secondary)",
      margin: 0,
    },
    addressCard: {
      display: "flex",
      alignItems: "flex-start",
      gap: "16px",
      padding: "20px",
      backgroundColor: "var(--card-bg)",
      borderRadius: "8px",
      border: "1px solid var(--border-color)",
      marginBottom: "12px",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    addressCardSelected: {
      borderColor: "var(--primary-color)",
      backgroundColor: "var(--category-bg)",
      boxShadow: "0 0 0 3px rgba(52, 152, 219, 0.1)",
    },
    addressRadio: {
      paddingTop: "4px",
    },
    radioCircle: {
      width: "20px",
      height: "20px",
      borderRadius: "50%",
      border: "2px solid var(--border-color)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.2s ease",
    },
    radioCircleSelected: {
      borderColor: "var(--primary-color)",
      backgroundColor: "var(--primary-color)",
    },
    radioInner: {
      width: "8px",
      height: "8px",
      borderRadius: "50%",
      backgroundColor: "white",
    },
    addressContent: {
      flex: 1,
    },
    addressHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: "8px",
      flexWrap: "wrap",
      gap: "10px"
    },
    addressName: {
      fontSize: "16px",
      fontWeight: "600",
      color: "var(--text-color)",
      margin: 0,
    },
    addressPhone: {
      fontSize: "14px",
      color: "var(--text-secondary)",
    },
    addressText: {
      fontSize: "14px",
      color: "var(--text-color)",
      lineHeight: "1.5",
      margin: "0 0 12px 0",
    },
    defaultBadge: {
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      backgroundColor: "rgba(39, 174, 96, 0.1)",
      color: "var(--success-color)",
      padding: "6px 12px",
      borderRadius: "20px",
      fontSize: "13px",
      fontWeight: "500",
    },
    defaultIcon: {
      fontSize: "12px",
    },
    addButton: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      width: "100%",
      padding: "14px",
      backgroundColor: "var(--primary-color)",
      color: "white",
      border: "none",
      borderRadius: "8px",
      fontSize: "15px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    addIcon: {
      fontSize: "18px",
    },
    formCard: {
      backgroundColor: "var(--card-bg)",
      borderRadius: "12px",
      padding: "24px",
      boxShadow: "var(--shadow)",
      border: "1px solid var(--border-color)",
      marginTop: "16px",
    },
    formHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "24px",
    },
    formTitle: {
      fontSize: "18px",
      fontWeight: "600",
      color: "var(--text-color)",
      margin: 0,
    },
    closeButton: {
      backgroundColor: "transparent",
      color: "var(--text-secondary)",
      border: "none",
      fontSize: "20px",
      cursor: "pointer",
      padding: "4px",
      borderRadius: "4px",
      transition: "all 0.2s ease",
    },
    formGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "20px",
      marginBottom: "24px",
    },
    formGroup: {
      display: "flex",
      flexDirection: "column",
    },
    formGroupFull: {
      gridColumn: "1 / -1",
      display: "flex",
      flexDirection: "column",
    },
    label: {
      fontSize: "14px",
      fontWeight: "500",
      color: "var(--text-color)",
      marginBottom: "8px",
    },
    input: {
      padding: "12px 16px",
      border: "1px solid var(--border-color)",
      borderRadius: "8px",
      fontSize: "15px",
      color: "var(--text-color)",
      backgroundColor: "var(--input-bg)",
      outline: "none",
      transition: "border-color 0.2s ease, box-shadow 0.2s ease",
    },
    textarea: {
      padding: "12px 16px",
      border: "1px solid var(--border-color)",
      borderRadius: "8px",
      fontSize: "15px",
      color: "var(--text-color)",
      backgroundColor: "var(--input-bg)",
      outline: "none",
      transition: "border-color 0.2s ease, box-shadow 0.2s ease",
      resize: "vertical",
      fontFamily: "inherit",
    },
    checkboxGroup: {
      marginBottom: "24px",
    },
    checkboxLabel: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      fontSize: "14px",
      color: "var(--text-color)",
      fontWeight: "500",
      cursor: "pointer",
    },
    checkbox: {
      width: "16px",
      height: "16px",
      cursor: "pointer",
    },
    checkboxHint: {
      fontSize: "12px",
      color: "var(--text-secondary)",
      margin: "8px 0 0 24px",
    },
    formActions: {
      display: "flex",
      gap: "12px",
    },
    cancelButton: {
      flex: 1,
      backgroundColor: "var(--input-bg)",
      color: "var(--text-color)",
      border: "1px solid var(--border-color)",
      padding: "12px",
      borderRadius: "8px",
      fontSize: "15px",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    submitButton: {
      flex: 1,
      backgroundColor: "var(--success-color)",
      color: "white",
      border: "none",
      padding: "12px",
      borderRadius: "8px",
      fontSize: "15px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    buttonDisabled: {
      backgroundColor: "var(--disabled-bg)",
      color: "var(--disabled-color)",
      cursor: "not-allowed",
      opacity: 0.7,
    },
    buttonLoading: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
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
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Loading addresses...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Select Shipping Address</h3>
        <p style={styles.subtitle}>
          Choose an address for delivery or add a new one
        </p>
      </div>

      {error && (
        <div style={styles.errorContainer}>
          ❌ {error}
        </div>
      )}

      {/* Address List */}
      <div style={styles.addressList}>
        {addresses.length === 0 ? (
          <div style={styles.emptyAddress}>
            <div style={styles.emptyIcon}>🏠</div>
            <h4 style={styles.emptyTitle}>No addresses saved</h4>
            <p style={styles.emptyText}>Add your first address below</p>
          </div>
        ) : (
          addresses.map(addr => (
            <div 
              key={addr.id} 
              data-address-id={addr.id}
              style={{
                ...styles.addressCard,
                ...(selectedAddressId === addr.id ? styles.addressCardSelected : {})
              }}
              onClick={() => handleSelectAddress(addr.id)}
              {...getHoverStyles('addressCard')}
            >
              <div style={styles.addressRadio}>
                <div style={{
                  ...styles.radioCircle,
                  ...(selectedAddressId === addr.id ? styles.radioCircleSelected : {})
                }}>
                  {selectedAddressId === addr.id && (
                    <div style={styles.radioInner}></div>
                  )}
                </div>
              </div>
              
              <div style={styles.addressContent}>
                <div style={styles.addressHeader}>
                  <h4 style={styles.addressName}>{addr.full_name}</h4>
                  <span style={styles.addressPhone}>{addr.phone}</span>
                </div>
                
                <p style={styles.addressText}>
                  {addr.address_line}, {addr.city}, {addr.state} - {addr.pincode}
                </p>
                
                {addr.is_default && (
                  <div style={styles.defaultBadge}>
                    <span style={styles.defaultIcon}>✓</span>
                    Default Address
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add New Address Button */}
      {!showAddForm && (
        <button
          onClick={() => setShowAddForm(true)}
          style={styles.addButton}
          {...getHoverStyles('addButton')}
        >
          <span style={styles.addIcon}>+</span>
          Add New Address
        </button>
      )}

      {/* Add Address Form */}
      {showAddForm && (
        <div style={styles.formCard}>
          <div style={styles.formHeader}>
            <h4 style={styles.formTitle}>Add New Address</h4>
            <button
              onClick={() => setShowAddForm(false)}
              style={styles.closeButton}
              {...getHoverStyles('closeButton')}
            >
              ✕
            </button>
          </div>

          <div style={styles.formGrid}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Full Name</label>
              <input
                name="full_name"
                placeholder="Enter full name"
                value={form.full_name}
                onChange={handleChange}
                style={styles.input}
                {...getHoverStyles('input')}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Phone Number</label>
              <input
                name="phone"
                placeholder="Enter phone number"
                value={form.phone}
                onChange={handleChange}
                style={styles.input}
                {...getHoverStyles('input')}
              />
            </div>

            <div style={styles.formGroupFull}>
              <label style={styles.label}>Address</label>
              <textarea
                name="address_line"
                placeholder="Street address, apartment, suite, etc."
                value={form.address_line}
                onChange={handleChange}
                style={styles.textarea}
                rows="3"
                {...getHoverStyles('textarea')}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>City</label>
              <input
                name="city"
                placeholder="Enter city"
                value={form.city}
                onChange={handleChange}
                style={styles.input}
                {...getHoverStyles('input')}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>State</label>
              <input
                name="state"
                placeholder="Enter state"
                value={form.state}
                onChange={handleChange}
                style={styles.input}
                {...getHoverStyles('input')}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Pincode</label>
              <input
                name="pincode"
                placeholder="Enter pincode"
                value={form.pincode}
                onChange={handleChange}
                style={styles.input}
                {...getHoverStyles('input')}
              />
            </div>
          </div>

          <div style={styles.checkboxGroup}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="is_default"
                checked={form.is_default}
                onChange={handleChange}
                style={styles.checkbox}
              />
              Set as default address
            </label>
            <p style={styles.checkboxHint}>
              This address will be pre-selected for future orders
            </p>
          </div>

          <div style={styles.formActions}>
            <button
              onClick={() => setShowAddForm(false)}
              style={styles.cancelButton}
              {...getHoverStyles('cancelButton')}
            >
              Cancel
            </button>
            <button
              onClick={addAddress}
              disabled={adding}
              style={{
                ...styles.submitButton,
                ...(adding ? styles.buttonDisabled : {})
              }}
              {...getHoverStyles('submitButton')}
            >
              {adding ? (
                <span style={styles.buttonLoading}>
                  <span style={styles.buttonSpinner}></span>
                  Adding...
                </span>
              ) : (
                "Save Address"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}