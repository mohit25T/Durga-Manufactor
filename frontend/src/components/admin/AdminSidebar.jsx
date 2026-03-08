import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import * as Icons from "lucide-react";

function AdminSidebar({ isOpen, setIsOpen }) {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: Icons.LayoutDashboard },
    { name: "Manage Products", path: "/admin/products", icon: Icons.PackageSearch },
    { name: "Add Product", path: "/admin/add-product", icon: Icons.PackagePlus },
    { name: "Leads & Inquiries", path: "/admin/leads", icon: Icons.Users },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/admin/login");
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-brand-slateDark/50 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed top-0 left-0 h-screen w-72 bg-brand-slateDark text-white z-50 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 border-r border-brand-amber/20 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-6 flex items-center justify-between border-b border-white/10">
          <Link to="/admin/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-amber rounded-xl flex items-center justify-center shadow-lg shadow-brand-amber/20">
              <span className="text-brand-slateDark font-extrabold text-xl">D</span>
            </div>
            <div>
              <h2 className="font-bold text-lg tracking-tight">Admin Portal</h2>
              <p className="text-xs text-brand-gray">Durga Manufactures</p>
            </div>
          </Link>
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-brand-gray hover:text-white transition-colors">
            <Icons.X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-grow p-4 space-y-2 mt-4">
          <p className="px-4 text-xs font-bold text-brand-gray uppercase tracking-widest mb-4">Main Menu</p>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                  isActive ? "text-brand-slateDark font-bold bg-brand-amber shadow-lg shadow-brand-amber/20" : "text-brand-gray hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-brand-slateDark" : "text-brand-gray group-hover:text-brand-amber transition-colors"}`} />
                <span className="relative z-10">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left text-brand-gray hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-colors font-medium"
          >
            <Icons.LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </motion.aside>
    </>
  );
}

export default AdminSidebar;
