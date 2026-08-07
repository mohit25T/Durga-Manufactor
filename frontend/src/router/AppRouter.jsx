import { HashRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "../ScrollTop";
import FloatingActionButton from "../components/FloatingActionButton";
import AiChatbot from "../components/AiChatbot";
import CompareBar from "../components/CompareBar";
import { CompareProvider } from "../context/CompareContext";

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
import AdminDealers from "../pages/AdminDealers";

/* Dealer Pages */
import DealerLogin from "../pages/DealerLogin";
import DealerDashboard from "../pages/DealerDashboard";
import ProtectedDealerRoute from "../components/ProtectedDealerRoute";

function AppRouter() {
  return (
    <HashRouter>
      <CompareProvider>
        <ScrollToTop />
        <FloatingActionButton />
        <AiChatbot />
        <CompareBar />
        <Routes>
          {/* Public Website */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* Dealer Portal Routes */}
          <Route path="/dealer/login" element={<DealerLogin />} />
          <Route
            path="/dealer/dashboard"
            element={
              <ProtectedDealerRoute>
                <DealerDashboard />
              </ProtectedDealerRoute>
            }
          />

          {/* Protected Admin Routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/add-product"
            element={
              <ProtectedRoute>
                <AddProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <ProtectedRoute>
                <ProductsAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products/edit/:id"
            element={
              <ProtectedRoute>
                <EditProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/edit-product/:id"
            element={
              <ProtectedRoute>
                <EditProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/leads"
            element={
              <ProtectedRoute>
                <Leads />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dealers"
            element={
              <ProtectedRoute>
                <AdminDealers />
              </ProtectedRoute>
            }
          />
        </Routes>
      </CompareProvider>
    </HashRouter>
  );
}

export default AppRouter;
