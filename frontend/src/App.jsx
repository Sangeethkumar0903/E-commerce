import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { ThemeProvider } from "./context/ThemeContext"; 

import ProductList from "./customer/ProductList";
import Cart from "./customer/Cart";
import Orders from "./customer/Orders";
import Login from "./auth/Login";
import Register from "./auth/Register";
import SellerProfile from "./seller/SellerProfile";
import AddProduct from "./seller/AddProduct";
import SellerProducts from "./seller/SellerProducts"; // Add this import
import SellerStatus from "./seller/SellerStatus";
import AdminVerifySeller from "./admin/AdminVerifySeller";
import Profile from "./customer/Profile";

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/cart"
            element={
              <ProtectedRoute roles={["CUSTOMER"]}>
                <Cart />
              </ProtectedRoute>
            }
          />

          <Route
            path="/orders"
            element={
              <ProtectedRoute roles={["CUSTOMER"]}>
                <Orders />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/profile"
            element={
              <ProtectedRoute roles={["CUSTOMER", "SELLER"]}>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Seller Routes */}
          <Route
            path="/seller/add"
            element={
              <ProtectedRoute roles={["SELLER"]}>
                <AddProduct />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/seller/products"
            element={
              <ProtectedRoute roles={["SELLER"]}>
                <SellerProducts /> {/* Add this route */}
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/seller/profile"
            element={
              <ProtectedRoute roles={["SELLER"]}>
                <SellerProfile />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/seller/status"
            element={
              <ProtectedRoute roles={["SELLER"]}>
                <SellerStatus />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/sellers"
            element={
              <ProtectedRoute roles={["ADMIN"]}>
                <AdminVerifySeller />
              </ProtectedRoute>
            }
          />  

        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}