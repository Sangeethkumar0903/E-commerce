import { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext"; // Import useTheme hook

export default function Profile() {
  const { role } = useContext(AuthContext);
  const { theme } = useTheme(); // Get current theme

  const [profile, setProfile] = useState({
    full_name: "",
    phone: "",
    email: ""
  });

  const [edit, setEdit] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [addressForm, setAddressForm] = useState({
    full_name: "",
    phone: "",
    address_line: "",
    city: "",
    state: "",
    pincode: ""
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [addingAddress, setAddingAddress] = useState(false);
  const [error, setError] = useState("");

  /* ---------------- PROFILE ---------------- */

  useEffect(() => {
    setLoading(true);
    api.get("accounts/profile/")
      .then(res => {
        setProfile(res.data);
        setError("");
      })
      .catch(() => {
        setError("Failed to load profile");
      })
      .finally(() => setLoading(false));
    
    if (role === "CUSTOMER") loadAddresses();
  }, [role]);

  const updateProfile = async () => {
    if (!profile.full_name.trim()) {
      setError("Full name is required");
      return;
    }
    
    setSaving(true);
    setError("");
    
    try {
      await api.put("accounts/profile/", {
        full_name: profile.full_name,
        phone: profile.phone
      });
      setEdit(false);
    } catch (err) {
      setError("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  /* ---------------- ADDRESS ---------------- */

  const loadAddresses = () => {
    api.get("accounts/addresses/")
      .then(res => setAddresses(res.data || []))
      .catch(() => setAddresses([]));
  };

  const addAddress = async () => {
    if (!addressForm.full_name.trim() || !addressForm.phone.trim() || 
        !addressForm.address_line.trim() || !addressForm.city.trim() || 
        !addressForm.state.trim() || !addressForm.pincode.trim()) {
      setError("Please fill in all address fields");
      return;
    }
    
    setAddingAddress(true);
    setError("");
    
    try {
      await api.post("accounts/addresses/", addressForm);
      setAddressForm({
        full_name: "",
        phone: "",
        address_line: "",
        city: "",
        state: "",
        pincode: ""
      });
      loadAddresses();
    } catch (err) {
      setError("Failed to add address. Please try again.");
    } finally {
      setAddingAddress(false);
    }
  };

  const setDefault = async (id) => {
    try {
      await api.put(`accounts/addresses/${id}/`, { is_default: true });
      loadAddresses();
    } catch (err) {
      setError("Failed to set default address");
    }
  };

  const deleteAddress = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?")) {
      return;
    }
    
    try {
      await api.delete(`accounts/addresses/${id}/`);
      loadAddresses();
    } catch (err) {
      setError("Failed to delete address");
    }
  };

  const styles = {
    container: {
      maxWidth: "1000px",
      margin: "0 auto",
      padding: "20px",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      backgroundColor: "var(--bg-color)",
      color: "var(--text-color)",
      minHeight: "100vh",
      transition: "background-color 0.3s ease, color 0.3s ease"
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
      border: `4px solid var(--border-color)`,
      borderTop: `4px solid var(--primary-color)`,
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
    },
    loadingText: {
      fontSize: "18px",
      color: "var(--text-secondary)",
      margin: 0,
    },
    header: {
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
      margin: 0,
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
    card: {
      backgroundColor: "var(--card-bg)",
      borderRadius: "12px",
      padding: "32px",
      boxShadow: "var(--shadow)",
      border: "1px solid var(--border-color)",
      marginBottom: "30px",
      transition: "all 0.3s ease"
    },
    cardHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "32px",
      flexWrap: "wrap",
      gap: "15px"
    },
    cardTitle: {
      fontSize: "24px",
      fontWeight: "600",
      color: "var(--text-color)",
      margin: 0,
    },
    cardSubtitle: {
      fontSize: "14px",
      color: "var(--text-secondary)",
      margin: "8px 0 0 0",
    },
    editButton: {
      backgroundColor: "var(--primary-color)",
      color: "white",
      border: "none",
      padding: "10px 20px",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    editActions: {
      display: "flex",
      gap: "12px",
    },
    cancelButton: {
      backgroundColor: "var(--input-bg)",
      color: "var(--text-color)",
      border: "1px solid var(--border-color)",
      padding: "10px 20px",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    saveButton: {
      backgroundColor: "var(--success-color)",
      color: "white",
      border: "none",
      padding: "10px 20px",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    formGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "24px",
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
    inputDisabled: {
      padding: "12px 16px",
      border: "1px solid var(--border-color)",
      borderRadius: "8px",
      fontSize: "15px",
      color: "var(--text-secondary)",
      backgroundColor: "var(--placeholder-bg)",
      outline: "none",
    },
    hintText: {
      fontSize: "12px",
      color: "var(--text-secondary)",
      margin: "8px 0 0 0",
    },
    buttonDisabled: {
      opacity: 0.7,
      cursor: "not-allowed",
      backgroundColor: "var(--disabled-bg) !important",
      color: "var(--disabled-color) !important",
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
    addressSection: {
      marginTop: "40px",
    },
    emptyAddress: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 20px",
      textAlign: "center",
    },
    emptyIcon: {
      fontSize: "48px",
      marginBottom: "16px",
      opacity: 0.5,
    },
    emptyTitle: {
      fontSize: "18px",
      fontWeight: "600",
      color: "var(--text-color)",
      margin: "0 0 8px 0",
    },
    emptyText: {
      fontSize: "14px",
      color: "var(--text-secondary)",
      margin: 0,
    },
    addressesGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
      gap: "20px",
      marginBottom: "40px",
    },
    addressCard: {
      backgroundColor: "var(--card-bg)",
      borderRadius: "8px",
      padding: "20px",
      border: "1px solid var(--border-color)",
      transition: "all 0.2s ease",
      boxShadow: "var(--shadow)",
    },
    addressHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: "12px",
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
      margin: "0 0 16px 0",
    },
    addressFooter: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    defaultBadge: {
      display: "flex",
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
    setDefaultButton: {
      backgroundColor: "var(--category-bg)",
      color: "var(--category-color)",
      border: "1px solid var(--border-color)",
      padding: "6px 12px",
      borderRadius: "6px",
      fontSize: "13px",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    deleteButton: {
      backgroundColor: "var(--error-bg)",
      color: "var(--error-color)",
      border: "1px solid var(--error-color)",
      padding: "6px 12px",
      borderRadius: "6px",
      fontSize: "13px",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    addAddressCard: {
      padding: "32px",
      backgroundColor: "var(--category-bg)",
      borderRadius: "8px",
      border: `1px solid var(--primary-color)`,
    },
    addAddressTitle: {
      fontSize: "20px",
      fontWeight: "600",
      color: "var(--primary-color)",
      margin: "0 0 24px 0",
    },
    addressFormGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "20px",
      marginBottom: "24px",
    },
    addAddressButton: {
      backgroundColor: "var(--primary-color)",
      color: "white",
      border: "none",
      padding: "12px 24px",
      borderRadius: "8px",
      fontSize: "15px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s ease",
      width: "100%",
    },
  };

  // Helper functions for hover effects using theme variables
  const getHoverStyles = (element) => {
    const hoverStyles = {
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
      cancelButton: {
        onMouseEnter: (e) => {
          e.currentTarget.style.backgroundColor = "var(--hover-bg)";
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.backgroundColor = "var(--input-bg)";
        }
      },
      saveButton: {
        onMouseEnter: (e) => {
          if (!saving) {
            e.currentTarget.style.backgroundColor = "var(--success-color)";
            e.currentTarget.style.opacity = "0.9";
            e.currentTarget.style.transform = "translateY(-1px)";
          }
        },
        onMouseLeave: (e) => {
          if (!saving) {
            e.currentTarget.style.backgroundColor = "var(--success-color)";
            e.currentTarget.style.opacity = "1";
            e.currentTarget.style.transform = "translateY(0)";
          }
        }
      },
      setDefaultButton: {
        onMouseEnter: (e) => {
          e.currentTarget.style.backgroundColor = "var(--hover-bg)";
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.backgroundColor = "var(--category-bg)";
        }
      },
      deleteButton: {
        onMouseEnter: (e) => {
          e.currentTarget.style.backgroundColor = "rgba(231, 76, 60, 0.2)";
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.backgroundColor = "var(--error-bg)";
        }
      },
      addAddressButton: {
        onMouseEnter: (e) => {
          if (!addingAddress) {
            e.currentTarget.style.backgroundColor = "var(--secondary-color)";
            e.currentTarget.style.transform = "translateY(-1px)";
          }
        },
        onMouseLeave: (e) => {
          if (!addingAddress) {
            e.currentTarget.style.backgroundColor = "var(--primary-color)";
            e.currentTarget.style.transform = "translateY(0)";
          }
        }
      },
      addressCard: {
        onMouseEnter: (e) => {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "var(--shadow-hover)";
          e.currentTarget.style.borderColor = "var(--primary-color)";
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "var(--shadow)";
          e.currentTarget.style.borderColor = "var(--border-color)";
        }
      },
      input: {
        onFocus: (e) => {
          e.currentTarget.style.borderColor = "var(--primary-color)";
          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(52, 152, 219, 0.1)";
        },
        onBlur: (e) => {
          e.currentTarget.style.borderColor = "var(--border-color)";
          e.currentTarget.style.boxShadow = "none";
        }
      }
    };
    
    return hoverStyles[element] || {};
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>My Profile</h1>
        <p style={styles.subtitle}>Manage your personal information and addresses</p>
      </div>

      {error && (
        <div style={styles.errorContainer}>
          ❌ {error}
        </div>
      )}

      {/* ================= BASIC DETAILS ================= */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h2 style={styles.cardTitle}>Basic Details</h2>
          {!edit ? (
            <button
              onClick={() => setEdit(true)}
              style={styles.editButton}
              {...getHoverStyles('editButton')}
            >
              Edit Profile
            </button>
          ) : (
            <div style={styles.editActions}>
              <button
                onClick={() => setEdit(false)}
                style={styles.cancelButton}
                {...getHoverStyles('cancelButton')}
              >
                Cancel
              </button>
              <button
                onClick={updateProfile}
                disabled={saving}
                style={{
                  ...styles.saveButton,
                  ...(saving ? styles.buttonDisabled : {})
                }}
                {...getHoverStyles('saveButton')}
              >
                {saving ? (
                  <span style={styles.buttonLoading}>
                    <span style={styles.buttonSpinner}></span>
                    Saving...
                  </span>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          )}
        </div>

        <div style={styles.formGrid}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              style={edit ? styles.input : styles.inputDisabled}
              value={profile.full_name}
              disabled={!edit}
              onChange={e => setProfile({ ...profile, full_name: e.target.value })}
              placeholder="Enter your full name"
              {...getHoverStyles('input')}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Phone Number</label>
            <input
              style={edit ? styles.input : styles.inputDisabled}
              value={profile.phone}
              disabled={!edit}
              onChange={e => setProfile({ ...profile, phone: e.target.value })}
              placeholder="Enter your phone number"
              {...getHoverStyles('input')}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              style={styles.inputDisabled}
              value={profile.email}
              disabled
              placeholder="Your email address"
            />
            <p style={styles.hintText}>Email cannot be changed</p>
          </div>
        </div>
      </div>

      {/* ================= ADDRESS SECTION ================= */}
      {role === "CUSTOMER" && (
        <div style={styles.addressSection}>
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div>
                <h2 style={styles.cardTitle}>My Addresses</h2>
                <p style={styles.cardSubtitle}>Manage your shipping addresses</p>
              </div>
            </div>

            {addresses.length === 0 ? (
              <div style={styles.emptyAddress}>
                <div style={styles.emptyIcon}>🏠</div>
                <h3 style={styles.emptyTitle}>No addresses added</h3>
                <p style={styles.emptyText}>Add your first address below</p>
              </div>
            ) : (
              <div style={styles.addressesGrid}>
                {addresses.map(addr => (
                  <div 
                    key={addr.id} 
                    style={styles.addressCard}
                    {...getHoverStyles('addressCard')}
                  >
                    <div style={styles.addressHeader}>
                      <h4 style={styles.addressName}>{addr.full_name}</h4>
                      <span style={styles.addressPhone}>{addr.phone}</span>
                    </div>
                    
                    <p style={styles.addressText}>
                      {addr.address_line}, {addr.city}, {addr.state} - {addr.pincode}
                    </p>

                    <div style={styles.addressFooter}>
                      {addr.is_default ? (
                        <span style={styles.defaultBadge}>
                          <span style={styles.defaultIcon}>✓</span>
                          Default Address
                        </span>
                      ) : (
                        <button
                          onClick={() => setDefault(addr.id)}
                          style={styles.setDefaultButton}
                          {...getHoverStyles('setDefaultButton')}
                        >
                          Set as Default
                        </button>
                      )}
                      
                      <button
                        onClick={() => deleteAddress(addr.id)}
                        style={styles.deleteButton}
                        {...getHoverStyles('deleteButton')}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* -------- ADD ADDRESS FORM -------- */}
            <div style={styles.addAddressCard}>
              <h3 style={styles.addAddressTitle}>Add New Address</h3>
              
              <div style={styles.addressFormGrid}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Full Name</label>
                  <input
                    style={styles.input}
                    placeholder="Enter full name"
                    value={addressForm.full_name}
                    onChange={e => setAddressForm({ ...addressForm, full_name: e.target.value })}
                    {...getHoverStyles('input')}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Phone Number</label>
                  <input
                    style={styles.input}
                    placeholder="Enter phone number"
                    value={addressForm.phone}
                    onChange={e => setAddressForm({ ...addressForm, phone: e.target.value })}
                    {...getHoverStyles('input')}
                  />
                </div>

                <div style={styles.formGroupFull}>
                  <label style={styles.label}>Address Line</label>
                  <input
                    style={styles.input}
                    placeholder="Street address, apartment, suite, etc."
                    value={addressForm.address_line}
                    onChange={e => setAddressForm({ ...addressForm, address_line: e.target.value })}
                    {...getHoverStyles('input')}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>City</label>
                  <input
                    style={styles.input}
                    placeholder="Enter city"
                    value={addressForm.city}
                    onChange={e => setAddressForm({ ...addressForm, city: e.target.value })}
                    {...getHoverStyles('input')}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>State</label>
                  <input
                    style={styles.input}
                    placeholder="Enter state"
                    value={addressForm.state}
                    onChange={e => setAddressForm({ ...addressForm, state: e.target.value })}
                    {...getHoverStyles('input')}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Pincode</label>
                  <input
                    style={styles.input}
                    placeholder="Enter pincode"
                    value={addressForm.pincode}
                    onChange={e => setAddressForm({ ...addressForm, pincode: e.target.value })}
                    {...getHoverStyles('input')}
                  />
                </div>
              </div>

              <button
                onClick={addAddress}
                disabled={addingAddress}
                style={{
                  ...styles.addAddressButton,
                  ...(addingAddress ? styles.buttonDisabled : {})
                }}
                {...getHoverStyles('addAddressButton')}
              >
                {addingAddress ? (
                  <span style={styles.buttonLoading}>
                    <span style={styles.buttonSpinner}></span>
                    Adding...
                  </span>
                ) : (
                  "Add New Address"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}