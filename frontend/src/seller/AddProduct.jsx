import { useEffect, useState } from "react";
import api from "../api/axios";
import { useTheme } from "../context/ThemeContext"; // Import useTheme hook

export default function AddProduct() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  const [product, setProduct] = useState({
    title: "",
    description: "",
    price: "",
    stock_quantity: "",
    brand: "",
    category: ""
  });

  const { theme } = useTheme(); // Get current theme

  useEffect(() => {
    setLoading(true);
    api.get("products/categories/")
      .then(res => setCategories(res.data || []))
      .catch(() => {
        setCategories([]);
        setError("Failed to load categories");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleInputChange = (field) => (e) => {
    setProduct({...product, [field]: e.target.value});
    setError("");
    setSuccess(false);
  };

  const submit = async () => {
    // Validate required fields
    if (!product.title.trim()) {
      setError("Product title is required");
      return;
    }
    if (!product.price || isNaN(product.price) || Number(product.price) <= 0) {
      setError("Please enter a valid price");
      return;
    }
    if (!product.stock_quantity || isNaN(product.stock_quantity) || Number(product.stock_quantity) < 0) {
      setError("Please enter a valid stock quantity");
      return;
    }
    if (!product.category) {
      setError("Please select a category");
      return;
    }

    setSubmitting(true);
    setError("");
    
    try {
      await api.post("products/seller/products/", {
        title: product.title,
        description: product.description,
        price: parseFloat(product.price),
        stock_quantity: parseInt(product.stock_quantity),
        brand: product.brand,
        category: parseInt(product.category)
      });
      
      setSuccess(true);
      
      // Reset form
      setProduct({
        title: "",
        description: "",
        price: "",
        stock_quantity: "",
        brand: "",
        category: ""
      });
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add product. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Helper function for hover effects using theme variables
  const getHoverStyles = (element) => {
    const hoverStyles = {
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
      select: {
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
      button: {
        onMouseEnter: (e) => {
          if (!submitting) {
            e.currentTarget.style.backgroundColor = "var(--secondary-color)";
            e.currentTarget.style.transform = "translateY(-2px)";
          }
        },
        onMouseLeave: (e) => {
          if (!submitting) {
            e.currentTarget.style.backgroundColor = "var(--primary-color)";
            e.currentTarget.style.transform = "translateY(0)";
          }
        }
      }
    };
    
    return hoverStyles[element] || {};
  };

  const styles = {
    container: {
      maxWidth: "800px",
      margin: "0 auto",
      padding: "20px",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      backgroundColor: "var(--bg-color)", // ✅ Theme background
      color: "var(--text-color)", // ✅ Theme text color
      minHeight: "100vh",
      transition: "background-color 0.3s ease, color 0.3s ease" // ✅ Smooth transition
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
    formContainer: {
      backgroundColor: "var(--card-bg)", // ✅ Theme card background
      borderRadius: "12px",
      padding: "32px",
      boxShadow: "var(--shadow)", // ✅ Theme shadow
      border: "1px solid var(--border-color)", // ✅ Theme border
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
    successContainer: {
      backgroundColor: "rgba(39, 174, 96, 0.1)", // ✅ Using theme success color
      border: "1px solid rgba(39, 174, 96, 0.3)",
      color: "var(--success-color)", // ✅ Theme success color
      padding: "16px",
      borderRadius: "8px",
      marginBottom: "24px",
      fontSize: "14px",
    },
    formGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "20px",
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
      color: "var(--text-color)", // ✅ Theme text color
      marginBottom: "8px",
      display: "flex",
      alignItems: "center",
      gap: "4px",
    },
    required: {
      color: "var(--error-color)", // ✅ Theme error color
    },
    input: {
      padding: "12px 16px",
      border: "1px solid var(--border-color)", // ✅ Theme border
      borderRadius: "8px",
      fontSize: "15px",
      color: "var(--text-color)", // ✅ Theme text color
      backgroundColor: "var(--input-bg)", // ✅ Theme input background
      outline: "none",
      transition: "border-color 0.2s ease, box-shadow 0.2s ease",
    },
    select: {
      padding: "12px 16px",
      border: "1px solid var(--border-color)", // ✅ Theme border
      borderRadius: "8px",
      fontSize: "15px",
      color: "var(--text-color)", // ✅ Theme text color
      backgroundColor: "var(--input-bg)", // ✅ Theme input background
      outline: "none",
      transition: "border-color 0.2s ease, box-shadow 0.2s ease",
      cursor: "pointer",
      appearance: "none",
      backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
      backgroundPosition: "right 0.5rem center",
      backgroundRepeat: "no-repeat",
      backgroundSize: "1.5em 1.5em",
      paddingRight: "2.5rem",
    },
    textarea: {
      padding: "12px 16px",
      border: "1px solid var(--border-color)", // ✅ Theme border
      borderRadius: "8px",
      fontSize: "15px",
      color: "var(--text-color)", // ✅ Theme text color
      backgroundColor: "var(--input-bg)", // ✅ Theme input background
      outline: "none",
      transition: "border-color 0.2s ease, box-shadow 0.2s ease",
      minHeight: "120px",
      resize: "vertical",
      fontFamily: "inherit",
    },
    buttonContainer: {
      gridColumn: "1 / -1",
      marginTop: "20px",
      display: "flex",
      justifyContent: "flex-end",
    },
    button: {
      backgroundColor: "var(--primary-color)", // ✅ Theme primary color
      color: "white",
      border: "none",
      padding: "14px 32px",
      borderRadius: "8px",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s ease",
      minWidth: "160px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
    },
    buttonDisabled: {
      backgroundColor: "var(--disabled-bg)", // ✅ Theme disabled background
      color: "var(--disabled-color)", // ✅ Theme disabled color
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
    noteText: {
      fontSize: "12px",
      color: "var(--text-secondary)", // ✅ Theme secondary text
      margin: "8px 0 0 0",
    },
    currencySymbol: {
      position: "absolute",
      left: "12px",
      top: "50%",
      transform: "translateY(-50%)",
      color: "var(--text-secondary)", // ✅ Theme secondary text
      fontSize: "15px",
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Add New Product</h1>
        <p style={styles.subtitle}>Fill in the details below to add a new product to your store</p>
      </div>

      <div style={styles.formContainer}>
        {error && (
          <div style={styles.errorContainer}>
            {error}
          </div>
        )}
        
        {success && (
          <div style={styles.successContainer}>
            ✅ Product added successfully! You can add another product.
          </div>
        )}

        <div style={styles.formGrid}>
          {/* Title */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Product Title <span style={styles.required}>*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Wireless Bluetooth Headphones"
              value={product.title}
              onChange={handleInputChange("title")}
              style={styles.input}
              {...getHoverStyles('input')}
            />
          </div>

          {/* Brand */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Brand
            </label>
            <input
              type="text"
              placeholder="e.g., Sony, Apple, Nike"
              value={product.brand}
              onChange={handleInputChange("brand")}
              style={styles.input}
              {...getHoverStyles('input')}
            />
          </div>

          {/* Price */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Price <span style={styles.required}>*</span>
            </label>
            <div style={{ position: "relative" }}>
              <span style={styles.currencySymbol}>₹</span>
              <input
                type="number"
                placeholder="0.00"
                value={product.price}
                onChange={handleInputChange("price")}
                style={{
                  ...styles.input,
                  paddingLeft: "30px",
                }}
                {...getHoverStyles('input')}
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {/* Stock Quantity */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Stock Quantity <span style={styles.required}>*</span>
            </label>
            <input
              type="number"
              placeholder="e.g., 100"
              value={product.stock_quantity}
              onChange={handleInputChange("stock_quantity")}
              style={styles.input}
              {...getHoverStyles('input')}
              min="0"
            />
          </div>

          {/* Category */}
          <div style={styles.formGroupFull}>
            <label style={styles.label}>
              Category <span style={styles.required}>*</span>
            </label>
            <select
              value={product.category}
              onChange={handleInputChange("category")}
              style={styles.select}
              {...getHoverStyles('select')}
            >
              <option value="">Select a category</option>
              {loading ? (
                <option value="" disabled>Loading categories...</option>
              ) : categories.length === 0 ? (
                <option value="" disabled>No categories available</option>
              ) : (
                categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Description */}
          <div style={styles.formGroupFull}>
            <label style={styles.label}>
              Description
            </label>
            <textarea
              placeholder="Describe your product in detail..."
              value={product.description}
              onChange={handleInputChange("description")}
              style={styles.textarea}
              {...getHoverStyles('textarea')}
            />
            <p style={styles.noteText}>
              Provide a detailed description to help customers understand your product better.
            </p>
          </div>

          {/* Submit Button */}
          <div style={styles.buttonContainer}>
            <button
              onClick={submit}
              disabled={submitting}
              style={{
                ...styles.button,
                ...(submitting ? styles.buttonDisabled : {}),
              }}
              {...getHoverStyles('button')}
            >
              {submitting ? (
                <>
                  <span style={styles.loadingSpinner}></span>
                  Adding Product...
                </>
              ) : (
                "Add Product"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}