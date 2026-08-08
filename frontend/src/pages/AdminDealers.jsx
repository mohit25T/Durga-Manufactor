import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Users,
  CheckCircle2,
  XCircle,
  ShieldAlert,
  Percent,
  Award,
  Search,
  Menu,
  Plus,
  ChevronDown,
  ShoppingBag,
  Trash2,
  MessageSquare
} from "lucide-react";
import API from "../services/api";
import AdminSidebar from "../components/admin/AdminSidebar";

function AdminDealers() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState("pending"); // "pending" | "approved" | "rejected" | "orders"

  const [dealers, setDealers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Edit tier/discount state
  const [editingDealerId, setEditingDealerId] = useState(null);
  const [editTier, setEditTier] = useState("Silver");
  const [editDiscount, setEditDiscount] = useState(10);
  const [savingEdit, setSavingEdit] = useState(false);

  // Edit order items & split billing state
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [editOrderItems, setEditOrderItems] = useState([]);
  const [editIncludeFullGst, setEditIncludeFullGst] = useState(true);
  const [editBillAmount, setEditBillAmount] = useState(0);
  const [editWithoutBillAmount, setEditWithoutBillAmount] = useState(0);
  const [savingOrderPrice, setSavingOrderPrice] = useState(false);

  // Admin Create Order State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [productList, setProductList] = useState([]);
  const [selectedDealerId, setSelectedDealerId] = useState("");
  const [createOrderItems, setCreateOrderItems] = useState([]);
  const [createIncludeFullGst, setCreateIncludeFullGst] = useState(true);
  const [createBillAmount, setCreateBillAmount] = useState(0);
  const [createWithoutBillAmount, setCreateWithoutBillAmount] = useState(0);
  const [createNotes, setCreateNotes] = useState("");
  const [creatingOrder, setCreatingOrder] = useState(false);

  // Selected product input state for admin order creation
  const [selProductId, setSelProductId] = useState("");
  const [customProductName, setCustomProductName] = useState("");
  const [selQty, setSelQty] = useState(1);
  const [selCustomRate, setSelCustomRate] = useState("");

  const fetchAdminDealerData = async () => {
    try {
      setLoading(true);
      const dealersRes = await API.get("/dealers/admin/all");
      if (dealersRes.data.success) {
        setDealers(dealersRes.data.dealers || []);
      }

      const ordersRes = await API.get("/dealers/admin/orders");
      if (ordersRes.data.success) {
        setOrders(ordersRes.data.orders || []);
      }

      const prodRes = await API.get("/products");
      if (prodRes.data && prodRes.data.data) {
        setProductList(prodRes.data.data);
      }
    } catch (err) {
      console.error("Admin Dealers Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartEditOrderItems = (ord) => {
    setEditingOrderId(ord._id);
    const items = (ord.items || []).map((item) => ({
      ...item,
      discountedPrice: item.discountedPrice || 0
    }));
    const subtotal = items.reduce((s, it) => s + (it.quantity * it.discountedPrice), 0);
    setEditOrderItems(items);
    setEditIncludeFullGst(ord.includeFullGst !== false);
    setEditBillAmount(ord.billAmount !== undefined ? ord.billAmount : subtotal);
    setEditWithoutBillAmount(ord.withoutBillAmount !== undefined ? ord.withoutBillAmount : 0);
  };

  const handleUpdateItemPrice = (itemIdx, newPrice) => {
    const updated = [...editOrderItems];
    updated[itemIdx] = {
      ...updated[itemIdx],
      discountedPrice: Number(newPrice) || 0
    };
    setEditOrderItems(updated);
    
    // Auto recalculate default bill split if non-full GST
    const newSubtotal = updated.reduce((s, it) => s + (it.quantity * it.discountedPrice), 0);
    if (!editIncludeFullGst) {
      setEditWithoutBillAmount(Math.max(0, newSubtotal - (Number(editBillAmount) || 0)));
    }
  };

  const handleSaveOrderItemsPrices = async (orderId) => {
    try {
      setSavingOrderPrice(true);
      const res = await API.patch(`/dealers/admin/orders/${orderId}/status`, {
        items: editOrderItems,
        includeFullGst: editIncludeFullGst,
        billAmount: Number(editBillAmount),
        withoutBillAmount: Number(editWithoutBillAmount)
      });
      if (res.data.success) {
        setEditingOrderId(null);
        fetchAdminDealerData();
      }
    } catch (err) {
      console.error("Error updating order item prices:", err);
      alert("Failed to update product item prices.");
    } finally {
      setSavingOrderPrice(false);
    }
  };

  const handleDeleteOrderAdmin = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order permanently?")) {
      return;
    }
    try {
      const res = await API.delete(`/dealers/admin/orders/${orderId}`);
      if (res.data.success) {
        fetchAdminDealerData();
      }
    } catch (err) {
      console.error("Error deleting order:", err);
      alert("Failed to delete order.");
    }
  };

  // Helper for admin adding product item to create order list
  const handleAddProductToCreateOrder = () => {
    if (!selProductId) return;

    if (selProductId === "CUSTOM") {
      if (!customProductName.trim()) {
        alert("Please enter custom product name.");
        return;
      }
      const rate = selCustomRate !== "" ? Number(selCustomRate) : 0;
      setCreateOrderItems([
        ...createOrderItems,
        {
          product: null,
          productTitle: customProductName.trim(),
          quantity: Number(selQty) || 1,
          originalPrice: rate,
          discountedPrice: rate
        }
      ]);
      setSelProductId("");
      setCustomProductName("");
      setSelQty(1);
      setSelCustomRate("");
      return;
    }

    const prod = productList.find((p) => p._id === selProductId);
    if (!prod) return;

    const defaultRate = (prod.appPrice !== undefined && prod.appPrice !== null && Number(prod.appPrice) > 0)
      ? Number(prod.appPrice)
      : (Number(prod.price) || 0);
    const rate = selCustomRate !== "" ? Number(selCustomRate) : defaultRate;
    const existingIdx = createOrderItems.findIndex((it) => it.product === prod._id);

    if (existingIdx > -1) {
      const updated = [...createOrderItems];
      updated[existingIdx].quantity += Number(selQty) || 1;
      updated[existingIdx].discountedPrice = rate;
      setCreateOrderItems(updated);
    } else {
      setCreateOrderItems([
        ...createOrderItems,
        {
          product: prod._id,
          productTitle: prod.name || prod.title,
          quantity: Number(selQty) || 1,
          originalPrice: Number(prod.price) || 0,
          discountedPrice: rate
        }
      ]);
    }

    setSelProductId("");
    setSelQty(1);
    setSelCustomRate("");
  };

  const handleRemoveCreateOrderItem = (idx) => {
    setCreateOrderItems(createOrderItems.filter((_, i) => i !== idx));
  };

  const handleAdminCreateOrderSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDealerId) {
      alert("Please select a dealer or customer.");
      return;
    }

    let finalItems = [...createOrderItems];
    if (finalItems.length === 0 && selProductId) {
      if (selProductId === "CUSTOM" && customProductName.trim()) {
        const rate = selCustomRate !== "" ? Number(selCustomRate) : 0;
        finalItems = [{
          product: null,
          productTitle: customProductName.trim(),
          quantity: Number(selQty) || 1,
          originalPrice: rate,
          discountedPrice: rate
        }];
      } else {
        const prod = productList.find((p) => p._id === selProductId);
        if (prod) {
          const defaultRate = (prod.appPrice !== undefined && prod.appPrice !== null && Number(prod.appPrice) > 0)
            ? Number(prod.appPrice)
            : (Number(prod.price) || 0);
          const rate = selCustomRate !== "" ? Number(selCustomRate) : defaultRate;
          finalItems = [{
            product: prod._id,
            productTitle: prod.name || prod.title,
            quantity: Number(selQty) || 1,
            originalPrice: Number(prod.price) || 0,
            discountedPrice: rate
          }];
        }
      }
    }

    if (finalItems.length === 0) {
      alert("Please select at least one product for the order.");
      return;
    }

    try {
      setCreatingOrder(true);
      const res = await API.post("/dealers/admin/orders/create", {
        dealerId: selectedDealerId,
        items: finalItems,
        includeFullGst: createIncludeFullGst,
        billAmount: Number(createBillAmount),
        withoutBillAmount: Number(createWithoutBillAmount),
        notes: createNotes,
        status: "Confirmed"
      });

      if (res.data.success) {
        setShowCreateModal(false);
        setCreateOrderItems([]);
        setSelectedDealerId("");
        setCreateNotes("");
        setSelProductId("");
        setSelQty(1);
        setSelCustomRate("");
        fetchAdminDealerData();
        alert("Dealer order created successfully!");
      }
    } catch (err) {
      console.error("Admin Create Order Error:", err);
      alert("Failed to create order.");
    } finally {
      setCreatingOrder(false);
    }
  };

  useEffect(() => {
    fetchAdminDealerData();
  }, []);

  const handleUpdateDealerStatus = async (dealerId, newStatus) => {
    try {
      const res = await API.patch(`/dealers/admin/${dealerId}/status`, { status: newStatus });
      if (res.data.success) {
        fetchAdminDealerData();
      }
    } catch (err) {
      console.error("Error updating dealer status:", err);
      alert("Failed to update dealer status.");
    }
  };

  const handleSaveDealerTier = async (dealerId) => {
    try {
      setSavingEdit(true);
      const res = await API.patch(`/dealers/admin/${dealerId}/status`, {
        tier: editTier,
        discountPercent: Number(editDiscount)
      });
      if (res.data.success) {
        setEditingDealerId(null);
        fetchAdminDealerData();
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update tier.");
    } finally {
      setSavingEdit(false);
    }
  };

  const handleSendWhatsAppAlert = (ord) => {
    const phone = ord.dealer?.phone || "";
    let cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length === 10) cleanPhone = "91" + cleanPhone;

    const subtotal = ord.subtotal || Math.round((ord.totalAmount || 0) / 1.18);
    const billAmt = ord.billAmount !== undefined ? ord.billAmount : subtotal;
    const gst = ord.gstAmount !== undefined ? ord.gstAmount : Math.round(billAmt * 0.18);
    const totalPayable = ord.totalAmount || (billAmt + gst);
    const orderId = (ord._id || "").toString().slice(-8).toUpperCase();
    const name = ord.dealer?.contactPerson || ord.dealer?.companyName || "Dealer";
    const statusText = (ord.status || "PENDING").toUpperCase();

    const lines = [
      "*DURGA MANUFACTURES*",
      "*Order Update Notification*",
      "",
      `Hello *${name}*,`,
      "",
      `Your order *#${orderId}* details:`,
      "",
      `Order Status: *${statusText}*`,
      `Machines Subtotal: *₹${subtotal.toLocaleString("en-IN")}*`,
      `Billed Base Amount: *₹${billAmt.toLocaleString("en-IN")}*`,
      `18% GST: *+₹${gst.toLocaleString("en-IN")}*`,
      `Total Payment Amount: *₹${totalPayable.toLocaleString("en-IN")}*`,
      "",
      "Thank you for choosing Durga Manufactures!",
      "Portal: https://durgamanufactures.com/dealer/dashboard"
    ];

    const messageText = lines.join("\n");
    const encodedMessage = encodeURIComponent(messageText);

    const waUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
    window.open(waUrl, "_blank");
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await API.patch(`/dealers/admin/orders/${orderId}/status`, { status: newStatus });
      if (res.data.success) {
        fetchAdminDealerData();
        const updatedOrd = orders.find((o) => o._id === orderId);
        if (updatedOrd && window.confirm(`Order status updated to ${newStatus}. Send WhatsApp update to dealer (${updatedOrd.dealer?.phone || "Dealer"})?`)) {
          handleSendWhatsAppAlert({ ...updatedOrd, status: newStatus });
        }
      }
    } catch (err) {
      console.error("Error updating order status:", err);
      alert("Failed to update status.");
    }
  };

  const pendingDealers = dealers.filter((d) => d.status === "pending");
  const approvedDealers = dealers.filter((d) => d.status === "approved");
  const rejectedDealers = dealers.filter((d) => d.status === "rejected");

  const filteredDealers = (
    activeSubTab === "pending"
      ? pendingDealers
      : activeSubTab === "approved"
      ? approvedDealers
      : rejectedDealers
  ).filter((d) => {
    const q = searchQuery.toLowerCase();
    return (
      (d.companyName || "").toLowerCase().includes(q) ||
      (d.contactPerson || "").toLowerCase().includes(q) ||
      (d.email || "").toLowerCase().includes(q) ||
      (d.phone || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-brand-slateDark text-white flex font-sans">
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-slate-900 border-b border-white/10 p-4 md:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-slate-400 hover:text-white"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl font-bold font-serif text-white tracking-wide">
                Dealer Management & Orders
              </h1>
              <p className="text-xs text-slate-400">
                Review dealer applications, set wholesale tier margins, and process bulk machinery orders.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-brand-amber/10 border border-brand-amber/30 px-3 py-1 text-brand-amber font-bold text-xs">
              Pending Applications: {pendingDealers.length}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-4 md:p-8 space-y-6 flex-1">
          
          {/* Sub Navigation Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveSubTab("pending")}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                  activeSubTab === "pending"
                    ? "bg-brand-amber text-slate-950"
                    : "bg-slate-900 text-slate-400 hover:text-white border border-white/10"
                }`}
              >
                Pending ({pendingDealers.length})
              </button>

              <button
                onClick={() => setActiveSubTab("approved")}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                  activeSubTab === "approved"
                    ? "bg-brand-amber text-slate-950"
                    : "bg-slate-900 text-slate-400 hover:text-white border border-white/10"
                }`}
              >
                Approved Dealers ({approvedDealers.length})
              </button>

              <button
                onClick={() => setActiveSubTab("rejected")}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                  activeSubTab === "rejected"
                    ? "bg-brand-amber text-slate-950"
                    : "bg-slate-900 text-slate-400 hover:text-white border border-white/10"
                }`}
              >
                Rejected ({rejectedDealers.length})
              </button>

              <button
                onClick={() => setActiveSubTab("orders")}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                  activeSubTab === "orders"
                    ? "bg-brand-amber text-slate-950"
                    : "bg-slate-900 text-slate-400 hover:text-white border border-white/10"
                }`}
              >
                Dealer Orders ({orders.length})
              </button>
            </div>

            {activeSubTab !== "orders" && (
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search dealer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 focus:border-brand-amber pl-9 pr-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>
            )}
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-slate-400 uppercase tracking-widest">
              Loading Dealers Data...
            </div>
          ) : (
            <>
              {/* DEALERS TABLE / CARDS */}
              {activeSubTab !== "orders" && (
                <div className="space-y-4">
                  {filteredDealers.map((d) => (
                    <div
                      key={d._id}
                      className="bg-slate-900 border border-white/10 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-base font-bold text-white">{d.companyName}</h3>
                          <span
                            className={`text-[10px] px-2 py-0.5 border font-bold uppercase ${
                              d.status === "approved"
                                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                                : d.status === "rejected"
                                ? "bg-red-500/20 text-red-300 border-red-500/30"
                                : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                            }`}
                          >
                            {d.status}
                          </span>
                          {d.status === "approved" && (
                            <span className="text-[10px] px-2 py-0.5 bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold uppercase">
                              {d.tier} Tier ({d.discountPercent}% OFF)
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400">
                          Contact: <strong className="text-white">{d.contactPerson}</strong> | Email:{" "}
                          <strong className="text-white">{d.email}</strong> | Phone:{" "}
                          <strong className="text-white">{d.phone}</strong>
                        </p>
                        <p className="text-xs text-slate-500">
                          GST: {d.gstNumber || "N/A"} | Location: {d.city || ""}, {d.state || ""} ({d.address || ""})
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        {d.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleUpdateDealerStatus(d._id, "approved")}
                              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-4 h-4" /> Approve Dealer
                            </button>
                            <button
                              onClick={() => handleUpdateDealerStatus(d._id, "rejected")}
                              className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 px-3 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-1"
                            >
                              <XCircle className="w-4 h-4" /> Reject
                            </button>
                          </>
                        )}

                        {d.status === "approved" && (
                          <div className="flex items-center gap-2">
                            {editingDealerId === d._id ? (
                              <div className="flex items-center gap-2 bg-slate-950 p-2 border border-slate-800">
                                <select
                                  value={editTier}
                                  onChange={(e) => {
                                    setEditTier(e.target.value);
                                    if (e.target.value === "Standard") setEditDiscount(0);
                                    if (e.target.value === "Bronze") setEditDiscount(5);
                                    if (e.target.value === "Silver") setEditDiscount(10);
                                    if (e.target.value === "Gold") setEditDiscount(15);
                                    if (e.target.value === "Platinum") setEditDiscount(20);
                                  }}
                                  className="bg-slate-900 text-xs text-white p-1 border border-slate-700 font-bold"
                                >
                                  <option value="Standard">Standard Tier (0%)</option>
                                  <option value="Bronze">Bronze Tier (5%)</option>
                                  <option value="Silver">Silver Tier (10%)</option>
                                  <option value="Gold">Gold Tier (15%)</option>
                                  <option value="Platinum">Platinum Tier (20%)</option>
                                </select>
                                <input
                                  type="number"
                                  value={editDiscount}
                                  onChange={(e) => setEditDiscount(e.target.value)}
                                  className="w-16 bg-slate-900 text-xs text-white p-1 border border-slate-700 text-center"
                                />
                                <span className="text-xs text-slate-400">%</span>
                                <button
                                  onClick={() => handleSaveDealerTier(d._id)}
                                  disabled={savingEdit}
                                  className="bg-brand-amber text-slate-950 px-2 py-1 text-xs font-bold uppercase"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditingDealerId(null)}
                                  className="text-slate-400 hover:text-white text-xs px-1"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <>
                                <button
                                  onClick={() => {
                                    setEditingDealerId(d._id);
                                    setEditTier(d.tier || "Silver");
                                    setEditDiscount(d.discountPercent || 10);
                                  }}
                                  className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-1 border border-white/10"
                                >
                                  <Percent className="w-3.5 h-3.5 text-brand-amber" /> Edit Margin
                                </button>
                                <button
                                  onClick={() => handleUpdateDealerStatus(d._id, "rejected")}
                                  className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-2 text-xs font-bold uppercase"
                                >
                                  Revoke
                                </button>
                              </>
                            )}
                          </div>
                        )}

                        {d.status === "rejected" && (
                          <button
                            onClick={() => handleUpdateDealerStatus(d._id, "approved")}
                            className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 px-3 py-2 text-xs font-bold uppercase"
                          >
                            Re-Approve
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {filteredDealers.length === 0 && (
                    <div className="bg-slate-900 border border-white/10 p-12 text-center text-slate-400 text-xs uppercase tracking-widest">
                      No dealers found in this category.
                    </div>
                  )}
                </div>
              )}

              {/* DEALER ORDERS TAB */}
              {activeSubTab === "orders" && (
                <div className="space-y-4">
                  {/* Top Bar for Admin Order Creation */}
                  <div className="flex justify-between items-center bg-slate-900 border border-white/10 p-4">
                    <div>
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">Dealer Orders & Quotations</h3>
                      <p className="text-xs text-slate-400">Manage dealer orders, customize product rates, and manage official GST vs cash billing splits.</p>
                    </div>
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="bg-brand-amber hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg"
                    >
                      <Plus className="w-4 h-4" /> Create Order for Customer / Dealer
                    </button>
                  </div>

                  {orders.map((ord) => (
                    <div key={ord._id} className="bg-slate-900 border border-white/10 p-5 space-y-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-white/10 gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-base">
                              {ord.dealer?.companyName || "Dealer"}
                            </span>
                            <span className="text-xs px-2 py-0.5 bg-slate-800 text-slate-300 border border-slate-700">
                              {ord.dealer?.tier || "Standard"} Tier ({ord.dealer?.discountPercent ?? 0}% Off)
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Contact: {ord.dealer?.contactPerson} ({ord.dealer?.phone} | {ord.dealer?.email})
                          </p>
                        </div>

                        <div className="flex items-center gap-4 flex-wrap">
                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 uppercase tracking-widest block">Order Status</span>
                            <span className="text-sm font-bold text-white">
                              {ord.status}
                            </span>
                          </div>

                          {editingOrderId === ord._id ? (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleSaveOrderItemsPrices(ord._id)}
                                disabled={savingOrderPrice}
                                className="bg-brand-amber text-slate-950 px-3 py-2 text-xs font-bold uppercase hover:bg-amber-400 transition-colors shadow-md"
                              >
                                {savingOrderPrice ? "Saving..." : "Save Product Prices & Tax Split"}
                              </button>
                              <button
                                onClick={() => setEditingOrderId(null)}
                                className="text-slate-400 hover:text-white text-xs px-2 py-2 border border-slate-700 bg-slate-950"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleStartEditOrderItems(ord)}
                              className="bg-slate-800 hover:bg-slate-700 text-brand-amber border border-brand-amber/30 px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors"
                            >
                              Edit Rates & Billing Split
                            </button>
                          )}

                          {/* Order Status Select & WhatsApp Alert */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <select
                              value={ord.status}
                              onChange={(e) => handleUpdateOrderStatus(ord._id, e.target.value)}
                              className="bg-slate-950 border border-slate-800 text-xs text-white p-2 font-bold focus:border-brand-amber focus:outline-none"
                            >
                              <option value="Pending">Status: Pending</option>
                              <option value="Confirmed">Status: Confirmed</option>
                              <option value="Processing">Status: Processing</option>
                              <option value="Dispatched">Status: Dispatched</option>
                              <option value="Delivered">Status: Delivered</option>
                              <option value="Cancelled">Status: Cancelled</option>
                            </select>

                            <button
                              onClick={() => handleSendWhatsAppAlert(ord)}
                              title="Send WhatsApp Alert to Dealer Phone"
                              className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-2 text-xs font-bold uppercase transition-colors flex items-center gap-1.5"
                            >
                              <MessageSquare className="w-4 h-4 text-emerald-400" /> Send WhatsApp
                            </button>

                            <button
                              onClick={() => handleDeleteOrderAdmin(ord._id)}
                              title="Delete Order"
                              className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 p-2 text-xs font-bold uppercase transition-colors flex items-center gap-1"
                            >
                              <Trash2 className="w-4 h-4" /> Delete
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-2">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                          Ordered Machines & Unit Wholesale Prices:
                        </span>

                        {editingOrderId === ord._id ? (
                          <div className="space-y-2 bg-slate-950 p-3 border border-brand-amber/40">
                            {editOrderItems.map((item, idx) => (
                              <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 bg-slate-900 border border-slate-800">
                                <div>
                                  <span className="font-bold text-white text-xs block">{item.productTitle}</span>
                                  <span className="text-[11px] text-slate-400">Qty: <strong className="text-white">{item.quantity}</strong> | Original MRP: ₹{item.originalPrice?.toLocaleString("en-IN")}</span>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <span className="text-xs text-brand-amber font-bold">Wholesale Unit Rate: ₹</span>
                                  <input
                                    type="number"
                                    value={item.discountedPrice}
                                    onChange={(e) => handleUpdateItemPrice(idx, e.target.value)}
                                    className="w-28 bg-slate-950 border border-slate-700 text-xs font-bold text-white p-1 focus:border-brand-amber focus:outline-none"
                                  />
                                  <span className="text-xs text-slate-400 font-serif font-bold min-w-[80px] text-right">
                                    = ₹{(item.quantity * item.discountedPrice).toLocaleString("en-IN")}
                                  </span>
                                </div>
                              </div>
                            ))}

                            {/* GST Checkbox & Split Billing Config */}
                            <div className="bg-slate-900 p-3 border border-slate-800 space-y-3 text-xs mt-3">
                              <label className="flex items-center gap-2 text-white font-bold cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={editIncludeFullGst}
                                  onChange={(e) => {
                                    const checked = e.target.checked;
                                    setEditIncludeFullGst(checked);
                                    const subtotal = editOrderItems.reduce((s, it) => s + (it.quantity * it.discountedPrice), 0);
                                    if (checked) {
                                      setEditBillAmount(subtotal);
                                      setEditWithoutBillAmount(0);
                                    } else {
                                      setEditBillAmount(Math.round(subtotal / 2));
                                      setEditWithoutBillAmount(subtotal - Math.round(subtotal / 2));
                                    }
                                  }}
                                  className="w-4 h-4 text-brand-amber accent-brand-amber rounded"
                                />
                                <span>Include 18% GST on Full Subtotal</span>
                              </label>

                              {!editIncludeFullGst && (
                                <div className="pt-2 border-t border-slate-800">
                                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                                    Billed Amount (Bank Portion): ₹
                                  </label>
                                  <input
                                    type="number"
                                    value={editBillAmount}
                                    onChange={(e) => setEditBillAmount(Number(e.target.value) || 0)}
                                    className="w-full bg-slate-950 border border-slate-700 text-xs font-bold text-white p-2 focus:border-brand-amber focus:outline-none"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          ord.items?.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-slate-950 p-3 border border-white/5 text-xs">
                              <span className="font-bold text-white">{item.productTitle}</span>
                              <span className="text-slate-400">
                                Qty: <strong className="text-white">{item.quantity}</strong> × ₹{item.discountedPrice?.toLocaleString("en-IN")} ={" "}
                                <strong className="text-brand-amber font-serif">
                                  ₹{(item.quantity * item.discountedPrice).toLocaleString("en-IN")}
                                </strong>
                              </span>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Subtotal & 18% GST Breakdown Box Under Product Prices */}
                      {(() => {
                        const currentItems = editingOrderId === ord._id ? editOrderItems : (ord.items || []);
                        const subtotal = currentItems.reduce(
                          (sum, item) => sum + (Number(item.quantity) || 1) * (Number(item.discountedPrice) || 0),
                          0
                        );

                        const isFullGst = editingOrderId === ord._id ? editIncludeFullGst : (ord.includeFullGst !== false);
                        const billAmt = editingOrderId === ord._id ? Number(editBillAmount) : (ord.billAmount !== undefined ? ord.billAmount : subtotal);
                        const withoutBillAmt = editingOrderId === ord._id ? Number(editWithoutBillAmount) : (ord.withoutBillAmount || 0);

                        const gst = isFullGst ? Math.round(subtotal * 0.18) : Math.round(billAmt * 0.18);
                        const grandTotal = isFullGst ? (subtotal + gst) : (billAmt + gst + withoutBillAmt);

                        return (
                          <div className="bg-slate-950 p-4 border border-slate-800 space-y-2 mt-3 text-xs">
                            <div className="flex justify-between text-slate-400">
                              <span>Machines Subtotal:</span>
                              <span className="font-bold text-white font-serif">₹{subtotal.toLocaleString("en-IN")}</span>
                            </div>

                            {!isFullGst ? (
                              <>
                                <div className="flex justify-between text-slate-400">
                                  <span>Billed Base (Bank Portion):</span>
                                  <span className="font-bold text-emerald-400 font-serif">₹{billAmt.toLocaleString("en-IN")}</span>
                                </div>
                                <div className="flex justify-between text-slate-400">
                                  <span>18% GST (Applied ONLY on Billed Portion):</span>
                                  <span className="font-bold text-amber-400 font-serif">+ ₹{gst.toLocaleString("en-IN")}</span>
                                </div>
                                <div className="flex justify-between text-white font-bold p-2.5 bg-slate-900 border border-slate-800 my-1">
                                  <span className="text-emerald-400 uppercase tracking-wider">Total Bill Amount (Billed + GST):</span>
                                  <span className="text-emerald-400 font-serif font-bold text-base">₹{(billAmt + gst).toLocaleString("en-IN")}</span>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="flex justify-between text-slate-400">
                                  <span>Add 18% GST (100% Official Bill):</span>
                                  <span className="font-bold text-amber-400 font-serif">+ ₹{gst.toLocaleString("en-IN")}</span>
                                </div>
                                <div className="flex justify-between text-white font-bold p-2.5 bg-slate-900 border border-slate-800 my-1">
                                  <span className="text-emerald-400 uppercase tracking-wider">Total Bill Amount (Billed + GST):</span>
                                  <span className="text-emerald-400 font-serif font-bold text-base">₹{(subtotal + gst).toLocaleString("en-IN")}</span>
                                </div>
                              </>
                            )}

                            <div className="flex justify-between text-white font-bold pt-2 border-t border-slate-800 text-sm">
                              <span className="text-brand-amber uppercase tracking-wider">Grand Total Payable:</span>
                              <span className="text-brand-amber font-serif font-bold text-base">₹{grandTotal.toLocaleString("en-IN")}</span>
                            </div>
                          </div>
                        );
                      })()}

                      {ord.notes && (
                        <p className="text-xs text-slate-400 bg-slate-950/50 p-2 border-l-2 border-brand-amber">
                          Dealer Note: {ord.notes}
                        </p>
                      )}
                    </div>
                  ))}

                  {orders.length === 0 && (
                    <div className="bg-slate-900 border border-white/10 p-12 text-center text-slate-400 text-xs uppercase tracking-widest">
                      No dealer orders have been placed yet.
                    </div>
                  )}
                </div>
              )}

              {/* ADMIN CREATE ORDER MODAL */}
              {showCreateModal && (
                <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
                  <div className="bg-slate-900 border border-brand-amber/40 w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl relative">
                    <button
                      onClick={() => setShowCreateModal(false)}
                      className="absolute top-4 right-4 text-slate-400 hover:text-white"
                    >
                      <XCircle className="w-6 h-6" />
                    </button>

                    <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Plus className="w-5 h-5 text-brand-amber" /> Create Order for Customer / Dealer
                    </h2>

                    <form onSubmit={handleAdminCreateOrderSubmit} className="space-y-4">
                      {/* Select Dealer */}
                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                          Select Dealer / Customer *
                        </label>
                        <select
                          value={selectedDealerId}
                          onChange={(e) => setSelectedDealerId(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 text-xs text-white p-2.5 font-bold focus:border-brand-amber focus:outline-none"
                          required
                        >
                          <option value="">-- Choose Approved Dealer --</option>
                          {dealers
                            .filter((d) => d.status === "approved")
                            .map((d) => (
                              <option key={d._id} value={d._id}>
                                {d.companyName} ({d.contactPerson} - {d.city || d.email})
                              </option>
                            ))}
                        </select>
                      </div>

                      {/* Add Product Items */}
                      <div className="bg-slate-950 p-4 border border-slate-800 space-y-3">
                        <label className="block text-xs font-bold text-brand-amber uppercase">
                          Add Machinery Products to Order
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                          <select
                            value={selProductId}
                            onChange={(e) => setSelProductId(e.target.value)}
                            className="sm:col-span-2 bg-slate-900 border border-slate-700 text-xs text-white p-2 focus:outline-none font-medium"
                          >
                            <option value="">-- Select Catalog Product --</option>
                            <option value="CUSTOM" className="text-brand-amber font-bold">+ Type Custom Machine / Product Name --</option>
                            {productList.map((p) => (
                              <option key={p._id} value={p._id}>
                                {p.name || p.title} (MRP: ₹{p.price})
                              </option>
                            ))}
                          </select>
                          <input
                            type="number"
                            placeholder="Qty"
                            min="1"
                            value={selQty}
                            onChange={(e) => setSelQty(e.target.value)}
                            className="bg-slate-900 border border-slate-700 text-xs text-white p-2 focus:outline-none"
                          />
                          <input
                            type="number"
                            placeholder="Rate (₹)"
                            value={selCustomRate}
                            onChange={(e) => setSelCustomRate(e.target.value)}
                            className="bg-slate-900 border border-slate-700 text-xs text-white p-2 focus:outline-none"
                          />
                        </div>

                        {selProductId === "CUSTOM" && (
                          <div className="pt-1">
                            <label className="block text-[11px] font-bold text-brand-amber uppercase mb-1">
                              Custom Machine / Product Name:
                            </label>
                            <input
                              type="text"
                              placeholder="Type custom product title (e.g. 10HP Custom Spice Pulverizer)..."
                              value={customProductName}
                              onChange={(e) => setCustomProductName(e.target.value)}
                              className="w-full bg-slate-900 border border-brand-amber/60 text-xs font-bold text-white p-2 focus:border-brand-amber focus:outline-none"
                            />
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={handleAddProductToCreateOrder}
                          className="bg-slate-800 hover:bg-slate-700 text-brand-amber border border-brand-amber/30 px-3 py-1.5 text-xs font-bold uppercase tracking-wider"
                        >
                          + Add Item
                        </button>

                        {/* List of Added Items */}
                        {createOrderItems.length > 0 && (
                          <div className="space-y-2 pt-2 border-t border-slate-800">
                            {createOrderItems.map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between bg-slate-900 p-2 text-xs border border-slate-800">
                                <div>
                                  <span className="font-bold text-white">{item.productTitle}</span>
                                  <span className="text-slate-400 block text-[11px]">Qty: {item.quantity} × ₹{item.discountedPrice}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="font-serif font-bold text-brand-amber">₹{(item.quantity * item.discountedPrice).toLocaleString("en-IN")}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveCreateOrderItem(idx)}
                                    className="text-red-400 hover:text-red-300"
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* GST Checkbox & Split Payment */}
                      <div className="bg-slate-950 p-4 border border-slate-800 space-y-3 text-xs">
                        <label className="flex items-center gap-2 text-white font-bold cursor-pointer">
                          <input
                            type="checkbox"
                            checked={createIncludeFullGst}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setCreateIncludeFullGst(checked);
                              const currentDraftRate = selProductId && selCustomRate !== "" ? (Number(selQty) || 1) * Number(selCustomRate) : 0;
                              const subtotal = createOrderItems.reduce((s, it) => s + (it.quantity * it.discountedPrice), 0) + currentDraftRate;
                              if (checked) {
                                setCreateBillAmount(subtotal);
                                setCreateWithoutBillAmount(0);
                              } else {
                                setCreateBillAmount(Math.round(subtotal / 2));
                                setCreateWithoutBillAmount(subtotal - Math.round(subtotal / 2));
                              }
                            }}
                            className="w-4 h-4 text-brand-amber accent-brand-amber rounded"
                          />
                          <span>Include 18% GST on Full Subtotal</span>
                        </label>

                        {!createIncludeFullGst && (
                          <div className="pt-2 border-t border-slate-800">
                            <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                              Billed Amount (Bank Portion): ₹
                            </label>
                            <input
                              type="number"
                              value={createBillAmount}
                              onChange={(e) => setCreateBillAmount(Number(e.target.value) || 0)}
                              className="w-full bg-slate-900 border border-slate-700 text-xs font-bold text-white p-2 focus:border-brand-amber focus:outline-none"
                            />
                          </div>
                        )}

                        {/* Live Summary Calculation */}
                        {(() => {
                          const currentDraftRate = selProductId && selCustomRate !== "" ? (Number(selQty) || 1) * Number(selCustomRate) : 0;
                          const subtotal = createOrderItems.reduce((s, it) => s + (it.quantity * it.discountedPrice), 0) + currentDraftRate;
                          const bAmt = createIncludeFullGst ? subtotal : Number(createBillAmount);
                          const gst = Math.round(bAmt * 0.18);
                          const grandTotal = bAmt + gst;

                          return (
                            <div className="pt-3 border-t border-slate-800 space-y-2 text-slate-300 text-xs">
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-slate-900/60 p-2.5 border border-slate-800">
                                <div>
                                  <span className="block text-[10px] text-slate-400 uppercase">Machines Subtotal</span>
                                  <strong className="text-white font-serif text-sm">₹{subtotal.toLocaleString("en-IN")}</strong>
                                </div>
                                <div>
                                  <span className="block text-[10px] text-slate-400 uppercase">Billed Base</span>
                                  <strong className="text-emerald-400 font-serif text-sm">₹{bAmt.toLocaleString("en-IN")}</strong>
                                </div>
                                <div>
                                  <span className="block text-[10px] text-slate-400 uppercase">GST (18%)</span>
                                  <strong className="text-amber-400 font-serif text-sm">+ ₹{gst.toLocaleString("en-IN")}</strong>
                                </div>
                              </div>

                              <div className="flex justify-between items-center bg-slate-900 p-2.5 border border-slate-800 text-white font-bold">
                                <span className="text-emerald-400 uppercase tracking-wider text-xs">Total Bill Amount (Billed + GST):</span>
                                <span className="text-emerald-400 font-serif font-bold text-base">₹{(bAmt + gst).toLocaleString("en-IN")}</span>
                              </div>

                              <div className="flex justify-between items-center text-white font-bold text-sm pt-2 border-t border-slate-800">
                                <span className="text-brand-amber uppercase tracking-wider">Grand Total Payable:</span>
                                <span className="text-brand-amber font-serif font-bold text-lg">₹{grandTotal.toLocaleString("en-IN")}</span>
                              </div>
                            </div>
                          );
                        })()}
                      </div>

                      {/* Notes */}
                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Order Notes</label>
                        <textarea
                          rows={2}
                          value={createNotes}
                          onChange={(e) => setCreateNotes(e.target.value)}
                          placeholder="Delivery terms or notes..."
                          className="w-full bg-slate-950 border border-slate-800 p-2 text-xs text-white focus:outline-none"
                        />
                      </div>

                      <div className="flex justify-end gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowCreateModal(false)}
                          className="bg-slate-800 text-slate-300 px-4 py-2 text-xs font-bold uppercase"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={creatingOrder}
                          className="bg-brand-amber text-slate-950 px-5 py-2 text-xs font-bold uppercase tracking-wider hover:bg-amber-400"
                        >
                          {creatingOrder ? "Creating..." : "Create Order"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default AdminDealers;
