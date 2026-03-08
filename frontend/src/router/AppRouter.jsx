import { BrowserRouter, Routes, Route } from "react-router-dom";

/* Public Pages */

import Home from "../pages/Home";
import Products from "../pages/Products";
import ProductDetails from "../pages/ProductDetails";
import About from "../pages/About";
import Contact from "../pages/Contact";

/* Admin Pages */

import Login from "../pages/admin/Login";
import Dashboard from "../pages/admin/Dashboard";
import AddProduct from "../pages/admin/AddProduct";
import ProductsAdmin from "../pages/admin/Products";
import Leads from "../pages/admin/Leads";
import EditProduct from "../pages/admin/EditProduct";

/* Protected Route */

import ProtectedRoute from "../components/ProtectedRoute";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Website */}

        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* Admin Login (Public) */}

        <Route path="/admin/login" element={<Login />} />

        {/* Protected Admin Routes */}

        <Route path="/admin" element={<ProtectedRoute />}>

          <Route path="dashboard" element={<Dashboard />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="products" element={<ProductsAdmin />} />
          <Route path="edit-product/:id" element={<EditProduct />} />
          <Route path="leads" element={<Leads />} />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;