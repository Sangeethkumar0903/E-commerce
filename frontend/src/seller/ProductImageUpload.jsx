import { useState, useRef } from "react";
import api from "../api/axios";

export default function ProductImageUpload({ productId }) {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) {
      setImage(null);
      setPreview(null);
      return;
    }

    // Check file type
    if (!file.type.match('image.*')) {
      setError("Please select an image file (JPEG, PNG, etc.)");
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }

    setImage(file);
    setError("");
    setSuccess(false);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setError("");
  };

  const upload = async () => {
    if (!image) {
      setError("Please select an image to upload");
      return;
    }

    setUploading(true);
    setError("");
    
    try {
      const formData = new FormData();
      formData.append("image", image);

      await api.post(
        `products/upload-image/${productId}/`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setSuccess(true);
      setImage(null);
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Auto-hide success message
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const styles = {
    container: {
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    },
    title: {
      fontSize: "20px",
      fontWeight: "600",
      color: "#111827",
      margin: "0 0 16px 0",
    },
    uploadArea: {
      border: "2px dashed #d1d5db",
      borderRadius: "12px",
      padding: "40px 20px",
      textAlign: "center",
      backgroundColor: "#f9fafb",
      cursor: "pointer",
      transition: "all 0.2s ease",
      marginBottom: "16px",
    },
    uploadAreaHover: {
      borderColor: "#3b82f6",
      backgroundColor: "#eff6ff",
    },
    uploadIcon: {
      fontSize: "48px",
      color: "#9ca3af",
      marginBottom: "12px",
    },
    uploadText: {
      fontSize: "16px",
      color: "#6b7280",
      margin: "0 0 8px 0",
    },
    uploadSubtext: {
      fontSize: "14px",
      color: "#9ca3af",
      margin: 0,
    },
    fileInput: {
      display: "none",
    },
    previewContainer: {
      marginBottom: "20px",
    },
    previewTitle: {
      fontSize: "14px",
      fontWeight: "500",
      color: "#374151",
      margin: "0 0 12px 0",
    },
    previewImage: {
      width: "100%",
      maxWidth: "300px",
      height: "200px",
      objectFit: "cover",
      borderRadius: "8px",
      border: "1px solid #e5e7eb",
      marginBottom: "12px",
    },
    imageInfo: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: "white",
      padding: "12px 16px",
      borderRadius: "8px",
      border: "1px solid #e5e7eb",
      marginBottom: "16px",
    },
    imageName: {
      fontSize: "14px",
      color: "#111827",
      fontWeight: "500",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      flex: 1,
    },
    removeButton: {
      backgroundColor: "transparent",
      color: "#ef4444",
      border: "1px solid #ef4444",
      padding: "6px 12px",
      borderRadius: "6px",
      fontSize: "13px",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.2s ease",
      marginLeft: "12px",
      flexShrink: 0,
    },
    errorContainer: {
      backgroundColor: "#fef2f2",
      border: "1px solid #fecaca",
      color: "#7f1d1d",
      padding: "12px 16px",
      borderRadius: "8px",
      marginBottom: "16px",
      fontSize: "14px",
    },
    successContainer: {
      backgroundColor: "#d1fae5",
      border: "1px solid #a7f3d0",
      color: "#065f46",
      padding: "12px 16px",
      borderRadius: "8px",
      marginBottom: "16px",
      fontSize: "14px",
    },
    buttonContainer: {
      display: "flex",
      gap: "12px",
    },
    uploadButton: {
      backgroundColor: "#3b82f6",
      color: "white",
      border: "none",
      padding: "12px 24px",
      borderRadius: "8px",
      fontSize: "15px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s ease",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      minWidth: "140px",
    },
    uploadButtonDisabled: {
      backgroundColor: "#93c5fd",
      cursor: "not-allowed",
      opacity: 0.7,
    },
    cancelButton: {
      backgroundColor: "transparent",
      color: "#6b7280",
      border: "1px solid #d1d5db",
      padding: "12px 24px",
      borderRadius: "8px",
      fontSize: "15px",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    loadingSpinner: {
      width: "18px",
      height: "18px",
      border: "2px solid rgba(255, 255, 255, 0.3)",
      borderTop: "2px solid white",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
    },
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Upload Product Image</h3>

      {error && (
        <div style={styles.errorContainer}>
          ❌ {error}
        </div>
      )}

      {success && (
        <div style={styles.successContainer}>
          ✅ Image uploaded successfully!
        </div>
      )}

      {/* Upload Area */}
      <div
        style={styles.uploadArea}
        onClick={() => fileInputRef.current?.click()}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "#3b82f6";
          e.currentTarget.style.backgroundColor = "#eff6ff";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "#d1d5db";
          e.currentTarget.style.backgroundColor = "#f9fafb";
        }}
      >
        <div style={styles.uploadIcon}>📁</div>
        <p style={styles.uploadText}>
          {image ? "Click to change image" : "Click to upload or drag and drop"}
        </p>
        <p style={styles.uploadSubtext}>
          {image ? "Selected: " + image.name : "PNG, JPG, GIF up to 5MB"}
        </p>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={styles.fileInput}
        />
      </div>

      {/* Preview Section */}
      {preview && (
        <div style={styles.previewContainer}>
          <p style={styles.previewTitle}>Preview</p>
          <img 
            src={preview} 
            alt="Preview" 
            style={styles.previewImage}
          />
          <div style={styles.imageInfo}>
            <span style={styles.imageName} title={image?.name}>
              {image?.name}
            </span>
            <button
              onClick={handleRemoveImage}
              style={styles.removeButton}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#fef2f2";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              Remove
            </button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div style={styles.buttonContainer}>
        <button
          onClick={upload}
          disabled={uploading || !image}
          style={{
            ...styles.uploadButton,
            ...(uploading || !image ? styles.uploadButtonDisabled : {})
          }}
          onMouseEnter={(e) => {
            if (!uploading && image) {
              e.currentTarget.style.backgroundColor = "#2563eb";
              e.currentTarget.style.transform = "translateY(-1px)";
            }
          }}
          onMouseLeave={(e) => {
            if (!uploading && image) {
              e.currentTarget.style.backgroundColor = "#3b82f6";
              e.currentTarget.style.transform = "translateY(0)";
            }
          }}
        >
          {uploading ? (
            <>
              <span style={styles.loadingSpinner}></span>
              Uploading...
            </>
          ) : (
            "Upload Image"
          )}
        </button>

        {image && (
          <button
            onClick={handleRemoveImage}
            style={styles.cancelButton}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#f3f4f6";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            Cancel
          </button>
        )}
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}