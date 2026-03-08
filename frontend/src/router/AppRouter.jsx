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

       

          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/add-product" element={<AddProduct />} />
          <Route path="/admin/products" element={<ProductsAdmin />} />
          <Route path="/admin/edit-product/:id" element={<EditProduct />} />
          <Route path="/admin/leads" element={<Leads />} />

        

      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;