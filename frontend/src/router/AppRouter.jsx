import { HashRouter, Routes, Route } from "react-router-dom";

/* Public Pages */

import Home from "../pages/Home";
import Products from "../pages/Products";
import ProductDetails from "../pages/ProductDetails";
import About from "../pages/About";
import Contact from "../pages/Contact";
import ProtectedRoute from "../components/ProtectedRoute";

/* Admin Pages */

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import AddProduct from "../pages/AddProduct";
import ProductsAdmin from "../pages/AdminProducts";
import Leads from "../pages/Leads";
import EditProduct from "../pages/EditProduct";

/* Protected Route */

function AppRouter() {
  return (
    <HashRouter>
      <Routes>
        {/* Public Website */}

        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* Protected Admin Routes */}

        <Route path="/admin" element={<ProtectedRoute />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="/admin/add-product" element={<AddProduct />} />
          <Route path="/admin/products" element={<ProductsAdmin />} />
          <Route path="/admin/edit-product/:id" element={<EditProduct />} />
          <Route path="/admin/leads" element={<Leads />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default AppRouter;
