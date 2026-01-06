import { Link } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const { role, logout, cartItemCount } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    setMobileMenuOpen(false);
    navigate("/");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileOpen && !event.target.closest('.profile-wrapper')) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [profileOpen]);

  // Navigation links based on role
  const getNavLinks = () => {
    const commonLinks = [
      { to: "/", label: "Products" }
    ];
    
    if (role === "CUSTOMER") {
      return [
        ...commonLinks,
        { to: "/cart", label: "Cart", badge: cartItemCount },
        { to: "/orders", label: "Orders" }
      ];
    }
    
    if (role === "ADMIN") {
      return [
        ...commonLinks,
        { to: "/admin/sellers", label: "Verify Sellers" }
        
      ];
    }
    
    if (role === "SELLER") {
      return [
        ...commonLinks,
        { to: "/seller/profile", label: "Profile" },
        { to: "/seller/products", label: "My Products" },
        { to: "/seller/add", label: "Add Product" },
    
      ];
    }
    
    return commonLinks;
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''} ${theme === 'dark' ? 'navbar-dark' : 'navbar-light'}`}>
        <div className="navbar-container">
          
          {/* Logo */}
          <Link to="/" className="navbar-logo">
            <h1 className="logo-text">
              <span className="logo-icon">🛒</span>
              E-Shop
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="navbar-desktop">
            
            {/* Navigation Links */}
            <div className="nav-links">
              {getNavLinks().map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="nav-link"
                >
                  {link.label}
                  {link.badge > 0 && (
                    <span className="nav-badge">
                      {link.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>

            {/* Theme Toggle */}
            <div className="theme-toggle-container">
              <button 
                onClick={toggleTheme}
                className="theme-toggle-btn"
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                <div className="theme-toggle-track">
                  <div className={`theme-toggle-thumb ${theme === 'dark' ? 'dark' : 'light'}`}>
                    {theme === 'light' ? '☀️' : '🌙'}
                  </div>
                </div>
                <span className="theme-toggle-label">
                  {theme === 'light' ? 'Light' : 'Dark'}
                </span>
              </button>
            </div>

            {/* Auth Section */}
            <div className="auth-section">
              {!role ? (
                <>
                  <Link
                    to="/login"
                    className="btn-login"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="btn-register"
                  >
                    Register
                  </Link>
                </>
              ) : (
                <div className="profile-wrapper relative">
                  {/* Profile Avatar */}
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className={`profile-avatar ${profileOpen ? 'profile-active' : ''}`}
                  >
                    <span className="avatar-icon">👤</span>
                    {cartItemCount > 0 && role === "CUSTOMER" && (
                      <span className="cart-bubble">{cartItemCount}</span>
                    )}
                  </button>

                  {/* Profile Dropdown */}
                  {profileOpen && (
                    <div className="profile-dropdown">
                      <div className="dropdown-header">
                        <p className="dropdown-welcome">Welcome!</p>
                        <p className="dropdown-role">Role: <strong>{role}</strong></p>
                      </div>
                      
                      <div className="dropdown-menu">
                        <Link
                          to="/profile"
                          onClick={() => setProfileOpen(false)}
                          className="dropdown-item"
                        >
                          <span className="item-icon">👤</span>
                          My Profile
                        </Link>
                        
                        {role === "CUSTOMER" && (
                          <>
                            <Link
                              to="/cart"
                              onClick={() => setProfileOpen(false)}
                              className="dropdown-item"
                            >
                              <span className="item-icon">🛒</span>
                              My Cart {cartItemCount > 0 && (
                                <span className="item-badge">{cartItemCount}</span>
                              )}
                            </Link>
                            <Link
                              to="/orders"
                              onClick={() => setProfileOpen(false)}
                              className="dropdown-item"
                            >
                              <span className="item-icon">📦</span>
                              My Orders
                            </Link>
                          </>
                        )}
                        
                        {role === "SELLER" && (
                          <>
                            <Link
                              to="/seller/products"
                              onClick={() => setProfileOpen(false)}
                              className="dropdown-item"
                            >
                              <span className="item-icon">📦</span>
                              My Products
                            </Link>
                           
                          </>
                        )}
                        
                        {role === "ADMIN" && (
                          <Link
                            to="/admin/sellers"
                            onClick={() => setProfileOpen(false)}
                            className="dropdown-item"
                          >
                            <span className="item-icon">👨‍💼</span>
                            Verify Sellers
                          </Link>
                        )}
                      </div>
                      
                      <div className="dropdown-footer">
                        <button
                          onClick={handleLogout}
                          className="btn-logout"
                        >
                          <span className="logout-icon">🚪</span>
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={handleMobileMenuToggle}
            className="mobile-menu-btn"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <span className="menu-icon">✕</span>
            ) : (
              <span className="menu-icon">☰</span>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="mobile-nav">
          <div className="mobile-nav-content">
            {/* Mobile Theme Toggle */}
            <div className="mobile-theme-toggle">
              <button 
                onClick={toggleTheme}
                className="mobile-theme-toggle-btn"
              >
                <span>{theme === 'light' ? '☀️' : '🌙'}</span>
                <span>{theme === 'light' ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
            </div>

            {getNavLinks().map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className="mobile-nav-link"
              >
                {link.label}
                {link.badge > 0 && (
                  <span className="mobile-nav-badge">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
            
            <div className="mobile-auth-section">
              {!role ? (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="mobile-btn-login"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="mobile-btn-register"
                  >
                    Register
                  </Link>
                </>
              ) : (
                <>
                  <div className="mobile-profile-info">
                    <p className="mobile-role">Role: <strong>{role}</strong></p>
                    <Link
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="mobile-profile-link"
                    >
                      My Profile
                    </Link>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="mobile-btn-logout"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        /* Navbar Base Styles */
        .navbar {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          position: sticky;
          top: 0;
          z-index: 1000;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }
        
        .navbar-light {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .navbar-dark {
          background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
        }
        
        .navbar-scrolled {
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
          padding: 0.5rem 0;
        }
        
        .navbar-scrolled.navbar-light {
          background: linear-gradient(135deg, #4c51bf 0%, #6b46c1 100%);
        }
        
        .navbar-scrolled.navbar-dark {
          background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%);
        }
        
        .navbar-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 70px;
        }
        
        /* Logo Styles */
        .navbar-logo {
          text-decoration: none;
          display: flex;
          align-items: center;
        }
        
        .logo-text {
          font-size: 1.75rem;
          font-weight: 800;
          background: linear-gradient(45deg, #fff, #f0f0f0);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin: 0;
          transition: transform 0.3s ease;
        }
        
        .navbar-dark .logo-text {
          background: linear-gradient(45deg, #e2e8f0, #cbd5e0);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .logo-text:hover {
          transform: scale(1.05);
        }
        
        .logo-icon {
          font-size: 2rem;
          animation: bounce 2s infinite;
        }
        
        /* Desktop Navigation */
        .navbar-desktop {
          display: flex;
          align-items: center;
          gap: 2rem;
        }
        
        .nav-links {
          display: flex;
          gap: 1rem;
        }
        
        .nav-link {
          position: relative;
          color: rgba(255, 255, 255, 0.9);
          text-decoration: none;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          font-weight: 500;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .nav-link:hover {
          color: white;
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
        }
        
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0;
          height: 2px;
          background: white;
          border-radius: 2px;
          transition: all 0.3s ease;
          transform: translateX(-50%);
        }
        
        .nav-link:hover::after {
          width: 80%;
        }
        
        .nav-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          background: linear-gradient(45deg, #ff6b6b, #ee5a52);
          color: white;
          font-size: 0.75rem;
          font-weight: bold;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: pulse 2s infinite;
        }
        
        /* Theme Toggle */
        .theme-toggle-container {
          display: flex;
          align-items: center;
        }
        
        .theme-toggle-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 2rem;
          padding: 0.25rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .theme-toggle-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.3);
        }
        
        .theme-toggle-track {
          position: relative;
          width: 50px;
          height: 24px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          transition: all 0.3s ease;
        }
        
        .theme-toggle-thumb {
          position: absolute;
          top: 2px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          font-size: 12px;
        }
        
        .theme-toggle-thumb.light {
          left: 2px;
          background: #fbbf24;
          color: #92400e;
        }
        
        .theme-toggle-thumb.dark {
          left: 28px;
          background: #374151;
          color: #fbbf24;
        }
        
        .theme-toggle-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: white;
          white-space: nowrap;
        }
        
        /* Auth Section */
        .auth-section {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .btn-login {
          padding: 0.5rem 1.5rem;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 0.5rem;
          color: white;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        
        .btn-login:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.5);
          transform: translateY(-2px);
        }
        
        .btn-register {
          padding: 0.5rem 1.5rem;
          background: linear-gradient(45deg, #ff7e5f, #feb47b);
          border-radius: 0.5rem;
          color: white;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(255, 126, 95, 0.4);
        }
        
        .btn-register:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 126, 95, 0.6);
          background: linear-gradient(45deg, #ff6b47, #fea968);
        }
        
        /* Profile Avatar */
        .profile-avatar {
          position: relative;
          width: 45px;
          height: 45px;
          background: linear-gradient(45deg, #3498db, #9b59b6);
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .profile-avatar:hover {
          transform: scale(1.1);
          border-color: rgba(255, 255, 255, 0.6);
          box-shadow: 0 0 20px rgba(52, 152, 219, 0.5);
        }
        
        .profile-active {
          border-color: white;
          box-shadow: 0 0 25px rgba(52, 152, 219, 0.7);
        }
        
        .avatar-icon {
          font-size: 1.5rem;
        }
        
        .cart-bubble {
          position: absolute;
          top: -5px;
          right: -5px;
          background: linear-gradient(45deg, #ff6b6b, #ee5a52);
          color: white;
          font-size: 0.7rem;
          font-weight: bold;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #4c51bf;
          animation: bounce 1s infinite;
        }
        
        /* Profile Dropdown */
        .profile-dropdown {
          position: absolute;
          top: 60px;
          right: 0;
          width: 280px;
          background: white;
          border-radius: 1rem;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          overflow: hidden;
          animation: slideDown 0.3s ease-out;
          z-index: 1001;
        }
        
        .navbar-dark .profile-dropdown {
          background: #2d3748;
          color: #e2e8f0;
        }
        
        .dropdown-header {
          padding: 1.5rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        
        .navbar-dark .dropdown-header {
          background: linear-gradient(135deg, #4a5568 0%, #2d3748 100%);
        }
        
        .dropdown-welcome {
          margin: 0 0 0.5rem 0;
          font-size: 0.9rem;
          opacity: 0.9;
        }
        
        .dropdown-role {
          margin: 0;
          font-size: 1.1rem;
        }
        
        .dropdown-menu {
          padding: 0.5rem 0;
        }
        
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1.5rem;
          color: #4a5568;
          text-decoration: none;
          transition: all 0.2s ease;
          border-left: 3px solid transparent;
        }
        
        .navbar-dark .dropdown-item {
          color: #e2e8f0;
        }
        
        .dropdown-item:hover {
          background: #f7fafc;
          color: #2d3748;
          border-left-color: #667eea;
          padding-left: 1.75rem;
        }
        
        .navbar-dark .dropdown-item:hover {
          background: #4a5568;
          color: #fff;
          border-left-color: #81e6d9;
        }
        
        .item-icon {
          font-size: 1.2rem;
          opacity: 0.7;
        }
        
        .item-badge {
          margin-left: auto;
          background: #ff6b6b;
          color: white;
          font-size: 0.7rem;
          font-weight: bold;
          padding: 0.2rem 0.5rem;
          border-radius: 1rem;
        }
        
        .dropdown-footer {
          padding: 1rem 1.5rem;
          border-top: 1px solid #e2e8f0;
          background: #f8fafc;
        }
        
        .navbar-dark .dropdown-footer {
          border-top: 1px solid #4a5568;
          background: #2d3748;
        }
        
        .btn-logout {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.75rem;
          background: linear-gradient(45deg, #ff6b6b, #ee5a52);
          border: none;
          border-radius: 0.5rem;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .btn-logout:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
        }
        
        .logout-icon {
          font-size: 1.2rem;
        }
        
        /* Mobile Menu Button */
        .mobile-menu-btn {
          display: none;
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 0.5rem;
          color: white;
          padding: 0.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .mobile-menu-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.5);
          transform: rotate(90deg);
        }
        
        .menu-icon {
          font-size: 1.5rem;
          display: block;
          line-height: 1;
        }
        
        /* Mobile Navigation */
        .mobile-nav {
          position: fixed;
          top: 70px;
          left: 0;
          right: 0;
          background: linear-gradient(135deg, #4c51bf 0%, #6b46c1 100%);
          z-index: 999;
          animation: slideIn 0.3s ease-out;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }
        
        .navbar-dark .mobile-nav {
          background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
        }
        
        .mobile-nav-content {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        /* Mobile Theme Toggle */
        .mobile-theme-toggle {
          margin-bottom: 1rem;
        }
        
        .mobile-theme-toggle-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 0.5rem;
          color: white;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .mobile-theme-toggle-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.3);
        }
        
        .mobile-nav-link {
          padding: 1rem;
          color: white;
          text-decoration: none;
          border-radius: 0.5rem;
          background: rgba(255, 255, 255, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: all 0.3s ease;
        }
        
        .mobile-nav-link:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateX(10px);
        }
        
        .mobile-nav-badge {
          background: linear-gradient(45deg, #ff6b6b, #ee5a52);
          color: white;
          font-size: 0.75rem;
          font-weight: bold;
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          animation: pulse 2s infinite;
        }
        
        .mobile-auth-section {
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 2px solid rgba(255, 255, 255, 0.2);
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .mobile-btn-login {
          padding: 1rem;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 0.5rem;
          color: white;
          text-decoration: none;
          text-align: center;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        
        .mobile-btn-login:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.5);
        }
        
        .mobile-btn-register {
          padding: 1rem;
          background: linear-gradient(45deg, #ff7e5f, #feb47b);
          border-radius: 0.5rem;
          color: white;
          text-decoration: none;
          text-align: center;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        
        .mobile-btn-register:hover {
          background: linear-gradient(45deg, #ff6b47, #fea968);
          transform: translateY(-2px);
        }
        
        .mobile-profile-info {
          background: rgba(255, 255, 255, 0.1);
          padding: 1rem;
          border-radius: 0.5rem;
          margin-bottom: 1rem;
        }
        
        .mobile-role {
          color: white;
          margin: 0 0 1rem 0;
          font-size: 0.9rem;
        }
        
        .mobile-profile-link {
          color: white;
          text-decoration: none;
          display: block;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 0.5rem;
          text-align: center;
          transition: all 0.3s ease;
        }
        
        .mobile-profile-link:hover {
          background: rgba(255, 255, 255, 0.3);
        }
        
        .mobile-btn-logout {
          padding: 1rem;
          background: linear-gradient(45deg, #ff6b6b, #ee5a52);
          border: none;
          border-radius: 0.5rem;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .mobile-btn-logout:hover {
          background: linear-gradient(45deg, #ff5555, #ee4444);
          transform: translateY(-2px);
        }
        
        /* Animations */
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        
        @keyframes pulse {
          0% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(255, 107, 107, 0.7);
          }
          70% {
            transform: scale(1.05);
            box-shadow: 0 0 0 10px rgba(255, 107, 107, 0);
          }
          100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(255, 107, 107, 0);
          }
        }
        
        /* Responsive Styles */
        @media (max-width: 768px) {
          .navbar-desktop {
            display: none;
          }
          
          .mobile-menu-btn {
            display: block;
          }
          
          .navbar-container {
            padding: 0 1rem;
            height: 60px;
          }
          
          .logo-text {
            font-size: 1.5rem;
          }
          
          .logo-icon {
            font-size: 1.5rem;
          }
        }
        
        @media (min-width: 769px) {
          .mobile-nav {
            display: none;
          }
        }
        
        /* Active link styles */
        .nav-link.active {
          color: white;
          background: rgba(255, 255, 255, 0.15);
        }
        
        .nav-link.active::after {
          width: 80%;
        }
      `}</style>
    </>
  );
}