import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Award,
  Percent,
  ShoppingBag,
  Clock,
  FileText,
  Download,
  LogOut,
  User,
  Phone,
  MapPin,
  Plus,
  Minus,
  CheckCircle,
  PackageCheck,
  Search,
  ChevronRight,
  AlertCircle,
  HelpCircle,
  Truck,
  Bell
} from "lucide-react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const isLocalhost =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname.startsWith("192.168.") ||
    window.location.hostname.endsWith(".local"));

const API_BASE = isLocalhost
  ? "http://localhost:5000/api"
  : (import.meta.env.VITE_API_URL || "https://b.durgamanufactures.com/api");

function DealerDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("catalog"); // "overview" | "catalog" | "orders" | "resources" | "profile"
  const [dealer, setDealer] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cart / Bulk Quote State
  const [cart, setCart] = useState([]); // [{ product, quantity }]
  const [orderNotes, setOrderNotes] = useState("");
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [orderSuccessMsg, setOrderSuccessMsg] = useState("");

  // Custom Item Input State
  const [customItemName, setCustomItemName] = useState("");
  const [customItemQty, setCustomItemQty] = useState(1);
  const [customItemEstPrice, setCustomItemEstPrice] = useState("");

  // Notifications State
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  // Search filter for catalog
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [categoryOrder, setCategoryOrder] = useState([]);

  // Edit profile state
  const [profileForm, setProfileForm] = useState({
    companyName: "",
    contactPerson: "",
    phone: "",
    gstNumber: "",
    address: "",
    city: "",
    state: ""
  });
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");

  const getAuthHeaders = () => {
    const token = localStorage.getItem("dealerToken");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchDealerData = async () => {
    try {
      setLoading(true);
      const profileRes = await axios.get(`${API_BASE}/dealers/profile`, getAuthHeaders());
      if (profileRes.data.success) {
        setDealer(profileRes.data.dealer);
        setProfileForm({
          companyName: profileRes.data.dealer.companyName || "",
          contactPerson: profileRes.data.dealer.contactPerson || "",
          phone: profileRes.data.dealer.phone || "",
          gstNumber: profileRes.data.dealer.gstNumber || "",
          address: profileRes.data.dealer.address || "",
          city: profileRes.data.dealer.city || "",
          state: profileRes.data.dealer.state || ""
        });
      }

      // Fetch category order setting
      try {
        const settingsRes = await axios.get(`${API_BASE}/settings/categoryOrder`);
        if (settingsRes?.data?.success && settingsRes.data.data) {
          setCategoryOrder(JSON.parse(settingsRes.data.data));
        }
      } catch (e) {
        console.error("Failed to fetch categoryOrder setting:", e);
      }

      // Fetch products catalog
      let prodArray = [];
      try {
        const prodRes = await axios.get(`${API_BASE}/products`);
        const rawData = prodRes.data.data || prodRes.data.products || prodRes.data;
        if (Array.isArray(rawData)) {
          prodArray = rawData;
        }
      } catch (e) {
        console.error("Failed to fetch products from backend:", e);
      }

      if (prodArray.length === 0) {
        prodArray = [
          { _id: '1', name: 'Heavy Duty Potato Slicer HP-500', description: 'Cuts 500kg/hr. Stainless steel body with premium blades.', category: 'Slicers', price: 45000, images: ['https://images.unsplash.com/photo-1581091226825-a6a2a5aee158'] },
          { _id: '2', name: 'Commercial Flour Mill FM-X', description: 'High speed grinding with stone mechanism. 20HP motor.', category: 'Mills', price: 85000, images: ['https://images.unsplash.com/photo-1581092160607-ee22621dd758'] },
          { _id: '3', name: 'Industrial Veg Cutter V-300', description: 'Multifunctional cutting blades included. Continuous operation.', category: 'Cutters', price: 38000, images: ['https://images.unsplash.com/photo-1581092335397-9583fe92d232'] },
          { _id: '4', name: 'Dough Kneader DK-50', description: '50kg capacity spiral kneader for commercial bakeries.', category: 'Kneaders', price: 62000, images: ['https://images.unsplash.com/photo-1581092162384-8987c1d64718'] },
          { _id: '5', name: 'Onion Peeler OP-Pro', description: 'Automatic onion peeling machine, 200kg/hr output.', category: 'Peelers', price: 54000, images: ['https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc'] },
          { _id: '6', name: 'Pulverizer Machine P-Max', description: 'Heavy duty spices grinding machine with double chamber.', category: 'Mills', price: 72000, images: ['https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0'] }
        ];
      }

      setProducts(prodArray);

      // Fetch dealer orders
      const ordersRes = await axios.get(`${API_BASE}/dealers/orders`, getAuthHeaders());
      if (ordersRes.data.success) {
        setOrders(ordersRes.data.orders || []);
      }

      // Fetch Notifications & Trigger Native Device Push Banner
      try {
        const notifRes = await axios.get(`${API_BASE}/dealers/notifications`, getAuthHeaders());
        if (notifRes.data.success) {
          const list = notifRes.data.notifications || [];
          const unread = notifRes.data.unreadCount || 0;
          setNotifications(list);
          setUnreadCount(unread);

          if ("Notification" in window && Notification.permission === "granted" && unread > 0 && list.length > 0) {
            new Notification(list[0].title, {
              body: list[0].message
            });
          }
        }
      } catch (ne) {
        console.error("Error fetching notifications:", ne);
      }
    } catch (err) {
      console.error("Error fetching dealer data:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem("dealerToken");
        localStorage.removeItem("dealerInfo");
        navigate("/dealer/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleNotifications = async () => {
    const nextState = !showNotifications;
    setShowNotifications(nextState);
    if (nextState && unreadCount > 0) {
      try {
        await axios.patch(`${API_BASE}/dealers/notifications/mark-read`, {}, getAuthHeaders());
        setUnreadCount(0);
      } catch (err) {
        console.error("Error marking notifications read:", err);
      }
    }
  };

  useEffect(() => {
    fetchDealerData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("dealerToken");
    localStorage.removeItem("dealerInfo");
    navigate("/dealer/login");
  };

  // Cart operations
  const addToCart = (product) => {
    const discount = dealer?.discountPercent ?? 10;
    const originalPrice = Number(product.price) || 0;
    const discountedPrice = Math.round(originalPrice * (1 - discount / 100));

    const existingIndex = cart.findIndex((item) => item.product._id === product._id);
    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += 1;
      setCart(updated);
    } else {
      setCart([
        ...cart,
        {
          product,
          productTitle: product.name || product.title || "Machinery",
          quantity: 1,
          originalPrice,
          discountedPrice
        }
      ]);
    }
  };

  const updateCartQty = (productId, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.product._id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const calculateCartTotal = () => {
    return cart.reduce((sum, item) => sum + item.discountedPrice * item.quantity, 0);
  };

  const handleAddCustomItemToCart = (e) => {
    e.preventDefault();
    if (!customItemName.trim()) {
      alert("Please enter custom machine/product name.");
      return;
    }
    const estRate = Number(customItemEstPrice) || 0;
    const qty = Number(customItemQty) || 1;

    setCart((prev) => [
      ...prev,
      {
        product: { _id: "CUSTOM_" + Date.now(), isCustom: true },
        productTitle: customItemName.trim(),
        quantity: qty,
        originalPrice: estRate,
        discountedPrice: estRate
      }
    ]);

    setCustomItemName("");
    setCustomItemQty(1);
    setCustomItemEstPrice("");
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;
    setSubmittingOrder(true);
    setOrderSuccessMsg("");

    try {
      const payload = {
        items: cart.map((item) => ({
          product: item.product?.isCustom ? null : item.product._id,
          productTitle: item.productTitle,
          quantity: item.quantity,
          originalPrice: item.originalPrice,
          discountedPrice: item.discountedPrice
        })),
        notes: orderNotes
      };

      const res = await axios.post(`${API_BASE}/dealers/orders`, payload, getAuthHeaders());
      if (res.data.success) {
        setOrderSuccessMsg("Bulk Quotation / Order submitted successfully!");
        setCart([]);
        setOrderNotes("");
        // Refresh orders
        const ordersRes = await axios.get(`${API_BASE}/dealers/orders`, getAuthHeaders());
        if (ordersRes.data.success) {
          setOrders(ordersRes.data.orders);
        }
        setTimeout(() => {
          setOrderSuccessMsg("");
          setActiveTab("orders");
        }, 2000);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to submit order. Please try again.");
    } finally {
      setSubmittingOrder(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setUpdatingProfile(true);
    setProfileMsg("");

    try {
      const res = await axios.put(`${API_BASE}/dealers/profile`, profileForm, getAuthHeaders());
      if (res.data.success) {
        setDealer(res.data.dealer);
        setProfileMsg("Profile updated successfully!");
        setTimeout(() => setProfileMsg(""), 3000);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    } finally {
      setUpdatingProfile(false);
    }
  };

  const categories = ["ALL", ...new Set(products.map((p) => p.category).filter(Boolean))].sort((a, b) => {
    if (a === "ALL") return -1;
    if (b === "ALL") return 1;
    const indexA = categoryOrder.indexOf(a);
    const indexB = categoryOrder.indexOf(b);
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    return a.localeCompare(b);
  });

  const filteredProducts = [...products]
    .filter((p) => {
      const title = (p.name || p.title || "").toLowerCase();
      const cat = p.category || "";
      const matchesSearch = title.includes(searchQuery.toLowerCase());
      const matchesCat = selectedCategory === "ALL" || cat === selectedCategory;
      return matchesSearch && matchesCat;
    })
    .sort((a, b) => {
      const catA = a.category || "";
      const catB = b.category || "";

      const indexA = categoryOrder.indexOf(catA);
      const indexB = categoryOrder.indexOf(catB);

      if (indexA !== -1 && indexB !== -1 && indexA !== indexB) {
        return indexA - indexB;
      }
      if (indexA !== -1 && indexB === -1) return -1;
      if (indexA === -1 && indexB !== -1) return 1;

      if (catA !== catB) {
        return catA.localeCompare(catB);
      }

      return (a.name || a.title || "").localeCompare(b.name || b.title || "");
    });

  // Group sorted products by category for section headers
  const groupedProducts = filteredProducts.reduce((acc, p) => {
    const cat = p.category || "General Machinery";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(p);
    return acc;
  }, {});

  const getBadgeColor = (tier) => {
    switch (tier) {
      case "Platinum":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      case "Gold":
        return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      default:
        return "bg-slate-700 text-slate-300 border-slate-600";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmed":
      case "Delivered":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
      case "Processing":
      case "Dispatched":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "Cancelled":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      default:
        return "bg-amber-500/20 text-amber-300 border-amber-500/30";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand-amber border-t-transparent rounded-full animate-spin" />
          <p className="text-xs uppercase tracking-widest text-slate-400">Loading Dealer Portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans">
      <Navbar />

      {/* Top Banner Header */}
      <section className="bg-gradient-to-r from-slate-900 via-brand-slateDark to-slate-900 border-b border-slate-800 py-6 px-4 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-brand-amber/10 border border-brand-amber/30 flex items-center justify-center text-brand-amber font-serif font-bold text-2xl">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
                  {dealer?.companyName || "Dealer Portal"}
                </h1>
                <span className={`text-xs px-2.5 py-0.5 border font-semibold ${getBadgeColor(dealer?.tier)}`}>
                  {dealer?.tier || "Standard"} Member
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Contact: <span className="text-white font-medium">{dealer?.contactPerson}</span> | Email:{" "}
                <span className="text-white font-medium">{dealer?.email}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end md:self-auto">
            <div className="bg-slate-900 border border-slate-800 px-4 py-2 text-right">
              <span className="block text-[10px] text-slate-400 uppercase tracking-widest font-bold">Wholesale Discount</span>
              <span className="text-lg font-serif font-bold text-brand-amber">{dealer?.discountPercent ?? 0}% OFF MRP</span>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={toggleNotifications}
                className="bg-slate-900 border border-slate-800 hover:border-brand-amber text-slate-200 p-3 relative transition-colors"
                title="Notifications"
              >
                <Bell className="w-5 h-5 text-brand-amber" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-950 animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown Panel */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-brand-amber/40 shadow-2xl z-50 p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h3 className="text-xs font-bold uppercase text-white tracking-wider flex items-center gap-1.5">
                      <Bell className="w-4 h-4 text-brand-amber" /> Order Notifications
                    </h3>
                    <span className="text-[10px] text-slate-400 font-bold">{notifications.length} Updates</span>
                  </div>

                  <div className="max-h-72 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-400 py-4 text-center">No order notifications yet.</p>
                    ) : (
                      notifications.map((n) => (
                        <div key={n._id} className="bg-slate-950 p-2.5 border border-slate-800 space-y-1">
                          <div className="flex items-center justify-between text-xs font-bold text-brand-amber">
                            <span>{n.title}</span>
                            <span className="text-[10px] text-slate-500 font-normal">{new Date(n.createdAt).toLocaleDateString("en-IN")}</span>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleLogout}
              className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 md:px-12 sticky top-[73px] z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: "catalog", label: "Wholesale Catalog", icon: ShoppingBag },
            { id: "orders", label: `My Orders & Quotes (${orders.length})`, icon: Clock },
            { id: "resources", label: "Resource Library", icon: FileText },
            { id: "profile", label: "Dealership Profile", icon: User }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3.5 px-4 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all whitespace-nowrap border-b-2 ${
                  isActive
                    ? "border-brand-amber text-brand-amber bg-brand-amber/5"
                    : "border-transparent text-slate-400 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Dashboard Content */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 md:px-12 py-8">
        
        {/* --- TAB 1: WHOLESALE CATALOG --- */}
        {activeTab === "catalog" && (
          <div className="space-y-6">
            {/* Search & Filter Bar */}
            <div className="bg-slate-900 border border-slate-800 p-4 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search machines, models..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-brand-amber pl-10 pr-4 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
                <span className="text-xs text-slate-400 font-bold uppercase shrink-0">Category:</span>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 text-xs font-bold transition-all whitespace-nowrap ${
                      selectedCategory === cat
                        ? "bg-brand-amber text-slate-950"
                        : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Layout: Products Grid (Left) + Cart Summary (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Products List Grouped by Category */}
              <div className="lg:col-span-8 space-y-8">
                {Object.entries(groupedProducts).map(([categoryName, catProducts]) => (
                  <div key={categoryName} className="space-y-4">
                    {/* Category Header */}
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-brand-amber font-serif flex items-center gap-2">
                        <span className="w-2 h-2 bg-brand-amber inline-block" />
                        {categoryName}
                      </h3>
                      <span className="text-[10px] bg-slate-900 border border-slate-800 text-slate-400 font-bold px-2 py-0.5">
                        {catProducts.length} Machine(s)
                      </span>
                    </div>

                    {/* Category Products Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {catProducts.map((p) => {
                        const originalPrice = Number(p.price) || 0;
                        const discount = dealer?.discountPercent ?? 10;
                        const discountedPrice = Math.round(originalPrice * (1 - discount / 100));
                        const imgUrl = p.images?.[0] || p.image || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158";

                        return (
                          <motion.div
                            key={p._id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-slate-900 border border-slate-800 hover:border-brand-amber/50 transition-all flex flex-col justify-between overflow-hidden group"
                          >
                            <div>
                              {/* Image */}
                              <div className="h-44 bg-slate-950 relative overflow-hidden flex items-center justify-center">
                                {imgUrl ? (
                                  <img
                                    src={imgUrl}
                                    alt={p.name || p.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                  />
                                ) : (
                                  <Building2 className="w-12 h-12 text-slate-700" />
                                )}
                                <div className="absolute top-2 right-2 bg-brand-amber text-slate-950 font-bold text-[10px] uppercase px-2 py-0.5">
                                  {discount}% Dealer Off
                                </div>
                              </div>

                              {/* Info */}
                              <div className="p-4">
                                <h3 className="font-bold text-sm text-white line-clamp-1 mb-1">
                                  {p.name || p.title}
                                </h3>
                                <p className="text-slate-400 text-xs line-clamp-2 mb-3">
                                  {p.description || "Heavy-duty food processing machinery engineered for durability."}
                                </p>

                                {/* Pricing */}
                                <div className="flex items-baseline justify-between pt-2 border-t border-slate-800">
                                  <div>
                                    <span className="text-[10px] uppercase text-slate-500 block">MRP</span>
                                    <span className="text-xs text-slate-400 line-through">
                                      ₹{originalPrice.toLocaleString("en-IN")}
                                    </span>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-[10px] uppercase text-brand-amber block font-bold">Dealer Rate</span>
                                    <span className="text-base font-serif font-bold text-white">
                                      ₹{discountedPrice.toLocaleString("en-IN")}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Add to Quote Button */}
                            <div className="p-4 pt-0">
                              <button
                                onClick={() => addToCart(p)}
                                className="w-full bg-slate-800 hover:bg-brand-amber hover:text-slate-950 text-white font-bold text-xs uppercase tracking-wider py-2.5 transition-all flex items-center justify-center gap-2"
                              >
                                <Plus className="w-4 h-4" /> Add to Order / Quote
                              </button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {filteredProducts.length === 0 && (
                  <div className="bg-slate-900 border border-slate-800 p-12 text-center text-slate-400">
                    <p className="text-sm">No machines found matching your criteria.</p>
                  </div>
                )}
              </div>

              {/* Order / Quote Cart Sidebar */}
              <div className="lg:col-span-4">
                <div className="bg-slate-900 border border-slate-800 p-5 sticky top-36">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h3 className="font-bold text-sm uppercase tracking-wider text-white flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-brand-amber" /> Bulk Order Cart
                    </h3>
                    <span className="text-xs bg-slate-800 text-brand-amber font-bold px-2 py-0.5">
                      {cart.length} Item(s)
                    </span>
                  </div>

                  {orderSuccessMsg && (
                    <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 shrink-0" />
                      <span>{orderSuccessMsg}</span>
                    </div>
                  )}

                  {cart.length === 0 ? (
                    <div className="py-6 text-center text-slate-500 text-xs">
                      Your order cart is empty. Click "+ Add to Order" from catalog or add a custom machine below.
                    </div>
                  ) : (
                    <div className="mt-4 space-y-4">
                      {/* Cart Items List */}
                      <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                        {cart.map((item) => (
                          <div key={item.product._id} className="bg-slate-950 border border-slate-800 p-3">
                            <div className="flex items-start justify-between">
                              <h4 className="text-xs font-bold text-white line-clamp-1">{item.productTitle}</h4>
                              <span className="text-xs font-serif font-bold text-brand-amber">
                                ₹{(item.discountedPrice * item.quantity).toLocaleString("en-IN")}
                              </span>
                            </div>
                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-900 text-xs text-slate-400">
                              <span>Rate: ₹{item.discountedPrice.toLocaleString("en-IN")}</span>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => updateCartQty(item.product._id, -1)}
                                  className="w-5 h-5 bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-white"
                                >
                                  -
                                </button>
                                <span className="font-bold text-white px-1">{item.quantity}</span>
                                <button
                                  onClick={() => updateCartQty(item.product._id, 1)}
                                  className="w-5 h-5 bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-white"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Total Breakdown */}
                      <div className="pt-3 border-t border-slate-800 space-y-2">
                        {(() => {
                          const subtotal = calculateCartTotal();
                          const gstAmount = Math.round(subtotal * 0.18);
                          const grandTotal = subtotal + gstAmount;

                          return (
                            <>
                              <div className="flex justify-between text-xs text-slate-400">
                                <span>Subtotal (Excl. GST)</span>
                                <span className="text-white font-medium">
                                  ₹{subtotal.toLocaleString("en-IN")}
                                </span>
                              </div>
                              <div className="flex justify-between text-xs text-slate-400">
                                <span>GST (18%)</span>
                                <span className="text-amber-400 font-medium">
                                  + ₹{gstAmount.toLocaleString("en-IN")}
                                </span>
                              </div>
                              <div className="flex justify-between text-xs text-white font-bold pt-2 border-t border-slate-800">
                                <span>Grand Total (Incl. 18% GST)</span>
                                <span className="text-brand-amber font-serif font-bold text-base">
                                  ₹{grandTotal.toLocaleString("en-IN")}
                                </span>
                              </div>
                            </>
                          );
                        })()}
                        <p className="text-[10px] text-slate-500 pt-1">Applied dealer tier margin discount + 18% standard GST.</p>
                      </div>

                      {/* Order Notes */}
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                          Special Instructions / Delivery Notes
                        </label>
                        <textarea
                          rows={2}
                          value={orderNotes}
                          onChange={(e) => setOrderNotes(e.target.value)}
                          placeholder="e.g. Request custom motor configuration or batch dispatch..."
                          className="w-full bg-slate-950 border border-slate-800 focus:border-brand-amber p-2 text-xs text-white focus:outline-none"
                        />
                      </div>

                      <button
                        onClick={handlePlaceOrder}
                        disabled={submittingOrder}
                        className="w-full bg-gradient-to-r from-brand-amber to-amber-500 hover:from-amber-400 hover:to-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider py-3 shadow-lg transition-all flex items-center justify-center gap-2"
                      >
                        {submittingOrder ? (
                          "Submitting Order..."
                        ) : (
                          <>
                            <Send className="w-4 h-4" /> Submit Bulk Order / Quote
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Add Custom Machine / Unlisted Product Form */}
                  <div className="mt-5 pt-4 border-t border-slate-800 space-y-2">
                    <label className="block text-[11px] font-bold text-brand-amber uppercase flex items-center justify-between">
                      <span>+ Add Unlisted / Custom Machine</span>
                      <span className="text-[9px] text-slate-400 font-normal uppercase">Not in catalog</span>
                    </label>
                    <form onSubmit={handleAddCustomItemToCart} className="space-y-2">
                      <input
                        type="text"
                        placeholder="Custom machine title (e.g. 10HP Spice Mill)..."
                        value={customItemName}
                        onChange={(e) => setCustomItemName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-brand-amber text-xs text-white p-2 focus:outline-none"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          placeholder="Qty"
                          min="1"
                          value={customItemQty}
                          onChange={(e) => setCustomItemQty(e.target.value)}
                          className="bg-slate-950 border border-slate-800 focus:border-brand-amber text-xs text-white p-2 focus:outline-none"
                        />
                        <input
                          type="number"
                          placeholder="Est. Rate (₹)"
                          value={customItemEstPrice}
                          onChange={(e) => setCustomItemEstPrice(e.target.value)}
                          className="bg-slate-950 border border-slate-800 focus:border-brand-amber text-xs text-white p-2 focus:outline-none"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-slate-800 hover:bg-slate-700 text-brand-amber border border-brand-amber/30 text-xs font-bold uppercase py-2 transition-colors"
                      >
                        + Add Custom Item to Cart
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 2: MY ORDERS & QUOTES --- */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-5 h-5 text-brand-amber" /> Dealership Order History & Quotations
            </h2>

            {orders.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 p-12 text-center text-slate-400">
                <PackageCheck className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                <p className="text-sm font-semibold text-white mb-1">No Orders Placed Yet</p>
                <p className="text-xs text-slate-500 mb-4">Browse our wholesale catalog to submit your first quotation or machinery order.</p>
                <button
                  onClick={() => setActiveTab("catalog")}
                  className="bg-brand-amber text-slate-950 font-bold px-4 py-2 text-xs uppercase tracking-wider"
                >
                  Browse Catalog
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((ord) => (
                  <div key={ord._id} className="bg-slate-900 border border-slate-800 p-5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-2">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-widest">Order ID: #{ord._id.slice(-8)}</span>
                        <p className="text-xs text-slate-400">Date: {new Date(ord.createdAt).toLocaleDateString("en-IN")}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs px-3 py-1 border font-bold uppercase tracking-wider ${getStatusColor(ord.status)}`}>
                          Status: {ord.status}
                        </span>
                        <span className="text-lg font-serif font-bold text-white">
                          ₹{ord.totalAmount?.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      {ord.items?.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs bg-slate-950 p-2.5 border border-slate-800/60">
                          <span className="font-bold text-white">{item.productTitle}</span>
                          <span className="text-slate-400">
                            Qty: <strong className="text-white">{item.quantity}</strong> × ₹{item.discountedPrice?.toLocaleString("en-IN")} ={" "}
                            <strong className="text-white font-serif">₹{(item.quantity * item.discountedPrice).toLocaleString("en-IN")}</strong>
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Tax & Bill Breakdown */}
                    {(() => {
                      const itemSum = ord.items?.reduce((s, it) => s + (it.quantity * it.discountedPrice), 0) || 0;
                      const subtotal = ord.subtotal || itemSum;
                      const isFullGst = ord.includeFullGst !== false;
                      const billAmt = isFullGst ? subtotal : (ord.billAmount !== undefined ? ord.billAmount : subtotal);
                      const withoutBillAmt = isFullGst ? 0 : (ord.withoutBillAmount || 0);
                      const gstAmount = ord.gstAmount !== undefined ? ord.gstAmount : Math.round(billAmt * 0.18);
                      const grandTotal = ord.totalAmount || (billAmt + gstAmount + withoutBillAmt);

                      return (
                        <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-400">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span>Subtotal: <strong className="text-white">₹{subtotal.toLocaleString("en-IN")}</strong></span>
                            {!isFullGst && (
                              <>
                                <span>Billed Amount: <strong className="text-emerald-400">₹{billAmt.toLocaleString("en-IN")}</strong></span>
                                <span>Without Bill (Cash): <strong className="text-cyan-400">₹{withoutBillAmt.toLocaleString("en-IN")}</strong></span>
                              </>
                            )}
                            <span>GST (18%): <strong className="text-amber-400">+ ₹{gstAmount.toLocaleString("en-IN")}</strong></span>
                          </div>
                          <div className="flex justify-between items-center pt-1 text-white font-bold text-sm">
                            <span>Total Payable:</span>
                            <span className="text-brand-amber font-serif font-bold text-base">₹{grandTotal.toLocaleString("en-IN")}</span>
                          </div>
                        </div>
                      );
                    })()}

                    {ord.notes && (
                      <p className="mt-3 text-xs text-slate-400 bg-slate-950/50 p-2 border-l-2 border-brand-amber">
                        Note: {ord.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- TAB 3: RESOURCE LIBRARY --- */}
        {activeTab === "resources" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand-amber" /> Technical & Marketing Resource Library
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Official documents, product specification brochures, and authorized dealership marketing assets for Durga Manufactures.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "2026 Product Catalog & Spec Sheet", desc: "Complete specs, capacity, and dimensions for all food processing machinery.", size: "4.2 MB PDF" },
                { title: "Machinery Operation & Maintenance Guide", desc: "Standard operating procedures, safety guidelines, and routine servicing steps.", size: "6.8 MB PDF" },
                { title: "Authorized Dealership Certificate Template", desc: "High-resolution printable certificate for display at dealer showroom.", size: "1.5 MB PDF" },
                { title: "Commercial Marketing & Showroom Banners", desc: "Print-ready banner templates and social media promotional media assets.", size: "12.0 MB ZIP" },
                { title: "Warranty & Spare Parts Replacements Policy", desc: "Official warranty terms, claim protocols, and OEM spare part code list.", size: "2.1 MB PDF" },
                { title: "Factory Quality Compliance & Test Reports", desc: "ISO compliance certificates and safety test documentations.", size: "3.4 MB PDF" }
              ].map((res, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-800 p-5 flex flex-col justify-between hover:border-brand-amber/40 transition-colors">
                  <div>
                    <FileText className="w-8 h-8 text-brand-amber mb-3" />
                    <h3 className="font-bold text-sm text-white mb-1">{res.title}</h3>
                    <p className="text-xs text-slate-400 mb-4 leading-relaxed">{res.desc}</p>
                  </div>
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-mono">{res.size}</span>
                    <button
                      onClick={() => alert(`Downloading ${res.title}...`)}
                      className="text-xs font-bold text-brand-amber hover:underline flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" /> Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- TAB 4: DEALERSHIP PROFILE --- */}
        {activeTab === "profile" && (
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <User className="w-5 h-5 text-brand-amber" /> Dealership Account Profile
            </h2>

            {profileMsg && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> {profileMsg}
              </div>
            )}

            <form onSubmit={handleProfileUpdate} className="bg-slate-900 border border-slate-800 p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Company / Firm Name</label>
                  <input
                    type="text"
                    value={profileForm.companyName}
                    onChange={(e) => setProfileForm({ ...profileForm, companyName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-brand-amber px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Contact Person</label>
                  <input
                    type="text"
                    value={profileForm.contactPerson}
                    onChange={(e) => setProfileForm({ ...profileForm, contactPerson: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-brand-amber px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-brand-amber px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">GST Number</label>
                  <input
                    type="text"
                    value={profileForm.gstNumber}
                    onChange={(e) => setProfileForm({ ...profileForm, gstNumber: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-brand-amber px-3 py-2 text-xs text-white uppercase focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">City</label>
                  <input
                    type="text"
                    value={profileForm.city}
                    onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-brand-amber px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">State</label>
                  <input
                    type="text"
                    value={profileForm.state}
                    onChange={(e) => setProfileForm({ ...profileForm, state: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-brand-amber px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Address</label>
                  <input
                    type="text"
                    value={profileForm.address}
                    onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-brand-amber px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={updatingProfile}
                className="bg-brand-amber text-slate-950 font-bold px-6 py-3 text-xs uppercase tracking-wider hover:bg-amber-400 transition-colors disabled:opacity-50"
              >
                {updatingProfile ? "Updating..." : "Save Profile Details"}
              </button>
            </form>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default DealerDashboard;
