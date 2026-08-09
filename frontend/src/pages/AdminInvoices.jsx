import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FileText,
  Plus,
  Search,
  Printer,
  Edit,
  Trash2,
  Share2,
  CheckCircle2,
  Clock,
  DollarSign,
  Building2,
  Filter,
  Eye,
  AlertCircle
} from "lucide-react";
import axios from "axios";
import AdminLayout from "../components/admin/AdminLayout";
import InvoicePrintModal from "../components/admin/InvoicePrintModal";

const isLocalhost =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname.startsWith("192.168.") ||
    window.location.hostname.endsWith(".local"));

const API_BASE = isLocalhost
  ? "http://localhost:5000/api"
  : (import.meta.env.VITE_API_URL || "https://durga-manufactor.onrender.com/api");

export default function AdminInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Selected Invoice for Print/PDF preview
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showPrintModal, setShowPrintModal] = useState(false);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/invoices`, getAuthHeaders());
      if (res.data.success) {
        setInvoices(res.data.invoices || []);
      }
    } catch (err) {
      console.error("Error fetching invoices:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await axios.put(`${API_BASE}/invoices/${id}`, { status: newStatus }, getAuthHeaders());
      if (res.data.success) {
        setInvoices((prev) =>
          prev.map((inv) => (inv._id === id ? { ...inv, status: newStatus } : inv))
        );
      }
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update invoice status.");
    }
  };

  const handleDelete = async (id, invNum) => {
    if (!window.confirm(`Are you sure you want to delete Proforma Invoice ${invNum}?`)) return;

    try {
      const res = await axios.delete(`${API_BASE}/invoices/${id}`, getAuthHeaders());
      if (res.data.success) {
        setInvoices((prev) => prev.filter((inv) => inv._id !== id));
      }
    } catch (err) {
      console.error("Error deleting invoice:", err);
      alert("Failed to delete invoice.");
    }
  };

  const handleWhatsAppShare = (inv) => {
    const text = `*PROFORMA INVOICE - DURGA MANUFACTURES*\n` +
      `Invoice No: ${inv.invoiceNumber}\n` +
      `Date: ${new Date(inv.invoiceDate).toLocaleDateString("en-IN")}\n` +
      `Customer: ${inv.companyName || inv.customerName}\n` +
      `Grand Total: ₹${inv.grandTotal?.toLocaleString("en-IN")}\n` +
      `Advance Amount: ₹${inv.advancePayment?.toLocaleString("en-IN")}\n\n` +
      `Thank you for choosing Durga Manufactures! Call +91 94281 56213 for support.`;

    const cleanPhone = (inv.phone || "").replace(/\D/g, "");
    const targetPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const url = `https://wa.me/${targetPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  // Filtered invoices
  const filteredInvoices = invoices.filter((inv) => {
    const matchesStatus = statusFilter === "ALL" || inv.status === statusFilter;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      inv.invoiceNumber?.toLowerCase().includes(query) ||
      inv.customerName?.toLowerCase().includes(query) ||
      inv.companyName?.toLowerCase().includes(query) ||
      inv.phone?.toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });

  // Calculate Metrics
  const totalInvoiceValue = invoices.reduce((sum, i) => sum + (i.grandTotal || 0), 0);
  const paidInvoiceValue = invoices
    .filter((i) => i.status === "Paid" || i.status === "Approved")
    .reduce((sum, i) => sum + (i.grandTotal || 0), 0);
  const pendingCount = invoices.filter((i) => i.status === "Sent" || i.status === "Draft").length;

  const getStatusBadge = (status) => {
    switch (status) {
      case "Paid":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "Approved":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "Sent":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-slate-100 text-slate-800 border-slate-300";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8 font-sans">
        {/* Top Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-sand pb-5">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-brand-slateDark tracking-tight flex items-center gap-3">
              <FileText className="w-7 h-7 text-brand-amber" />
              Proforma Invoice System
            </h1>
            <p className="text-brand-gray text-sm font-semibold mt-1">
              Create, track, print, and share GST proforma invoices for machinery dealers and leads.
            </p>
          </div>

          <Link
            to="/admin/invoices/create"
            className="inline-flex items-center justify-center gap-2 bg-brand-amber hover:bg-brand-slateDark hover:text-white text-brand-slateDark px-6 py-3 rounded-none text-xs font-bold uppercase tracking-wider transition-all shadow-md"
          >
            <Plus className="w-4 h-4" /> Create New Invoice
          </Link>
        </div>

        {/* Financial Metrics Cards (Matching Dashboard.jsx KPI stats) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-brand-light rounded-none p-5 shadow border border-brand-sand flex items-center gap-4">
            <div className="w-12 h-12 rounded-none bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-brand-gray font-bold text-xs uppercase tracking-wider mb-0.5">Total Invoices</p>
              <h3 className="text-xl font-bold text-brand-slateDark">{invoices.length}</h3>
            </div>
          </div>

          <div className="bg-brand-light rounded-none p-5 shadow border border-brand-sand flex items-center gap-4">
            <div className="w-12 h-12 rounded-none bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-brand-gray font-bold text-xs uppercase tracking-wider mb-0.5">Total Value (₹)</p>
              <h3 className="text-xl font-bold text-brand-slateDark">₹{totalInvoiceValue.toLocaleString("en-IN")}</h3>
            </div>
          </div>

          <div className="bg-brand-light rounded-none p-5 shadow border border-brand-sand flex items-center gap-4">
            <div className="w-12 h-12 rounded-none bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-brand-gray font-bold text-xs uppercase tracking-wider mb-0.5">Confirmed Volume</p>
              <h3 className="text-xl font-bold text-brand-slateDark">₹{paidInvoiceValue.toLocaleString("en-IN")}</h3>
            </div>
          </div>

          <div className="bg-brand-light rounded-none p-5 shadow border border-brand-sand flex items-center gap-4">
            <div className="w-12 h-12 rounded-none bg-brand-amber/10 text-brand-amber flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-brand-gray font-bold text-xs uppercase tracking-wider mb-0.5">Pending Quotes</p>
              <h3 className="text-xl font-bold text-brand-slateDark">{pendingCount}</h3>
            </div>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-brand-light p-4 rounded-none shadow border border-brand-sand flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Status Tabs */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {["ALL", "Sent", "Approved", "Paid", "Draft", "Cancelled"].map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-4 py-2 text-xs font-bold rounded-none uppercase tracking-wider transition-all ${
                  statusFilter === tab
                    ? "bg-brand-slateDark text-white shadow"
                    : "bg-white text-brand-slateDark hover:bg-stone-100 border border-brand-sand"
                }`}
              >
                {tab === "ALL" ? "All Invoices" : tab}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-brand-gray absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search PI #, dealer, customer..."
              className="w-full bg-stone-50 border border-brand-sand rounded-none pl-10 pr-4 py-2 text-xs text-brand-slateDark font-semibold outline-none focus:border-brand-amber"
            />
          </div>
        </div>

        {/* Invoices List Table */}
        <div className="bg-brand-light rounded-none border border-brand-sand overflow-hidden shadow">
          {loading ? (
            <div className="p-12 text-center text-brand-gray text-xs font-bold">
              <div className="w-8 h-8 border-4 border-brand-amber border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              Loading Proforma Invoices...
            </div>
          ) : filteredInvoices.length === 0 ? (
            <div className="p-12 text-center text-brand-gray text-xs space-y-3">
              <FileText className="w-10 h-10 text-brand-sand mx-auto" />
              <p className="font-bold text-brand-slateDark text-sm">No Proforma Invoices Found</p>
              <p className="max-w-xs mx-auto">Create a new PI or clear your search filter to view saved invoices.</p>
              <Link
                to="/admin/invoices/create"
                className="inline-flex items-center gap-2 bg-brand-amber text-brand-slateDark px-4 py-2 rounded-none font-bold text-xs uppercase"
              >
                <Plus className="w-4 h-4" /> Create Invoice Now
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-brand-slateDark text-white uppercase tracking-wider text-[11px]">
                    <th className="p-4">Invoice #</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Customer / Dealer</th>
                    <th className="p-4">Location</th>
                    <th className="p-4 text-right">Grand Total</th>
                    <th className="p-4 text-right">Advance (50%)</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-sand bg-white text-brand-slateDark font-semibold">
                  {filteredInvoices.map((inv) => (
                    <tr key={inv._id} className="hover:bg-stone-50 transition-colors">
                      <td className="p-4 font-mono font-bold text-brand-slateDark">{inv.invoiceNumber}</td>
                      <td className="p-4 text-brand-gray font-semibold">
                        {new Date(inv.invoiceDate).toLocaleDateString("en-IN")}
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-brand-slateDark text-sm">{inv.companyName || inv.customerName}</div>
                        {inv.companyName && <div className="text-[11px] text-brand-gray">{inv.customerName}</div>}
                        <div className="text-[10px] text-brand-gray font-mono mt-0.5">{inv.phone}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-brand-slateDark">{inv.city || inv.state}</div>
                        <div className="text-[10px] text-brand-gray">{inv.state || "Gujarat"}</div>
                      </td>
                      <td className="p-4 text-right font-mono font-bold text-sm text-brand-slateDark">
                        ₹{(inv.grandTotal || 0).toLocaleString("en-IN")}
                      </td>
                      <td className="p-4 text-right font-mono text-emerald-700 font-bold">
                        ₹{(inv.advancePayment || 0).toLocaleString("en-IN")}
                      </td>
                      <td className="p-4 text-center">
                        <select
                          value={inv.status}
                          onChange={(e) => handleStatusChange(inv._id, e.target.value)}
                          className={`text-[10px] font-bold px-2 py-1 rounded-none border uppercase ${getStatusBadge(
                            inv.status
                          )} bg-white outline-none`}
                        >
                          <option value="Draft">Draft</option>
                          <option value="Sent">Sent</option>
                          <option value="Approved">Approved</option>
                          <option value="Paid">Paid</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedInvoice(inv);
                              setShowPrintModal(true);
                            }}
                            className="p-2 bg-brand-slateDark text-white hover:bg-slate-800 rounded-none transition-all shadow-sm"
                            title="Print / Export PDF"
                          >
                            <Printer className="w-3.5 h-3.5 text-brand-amber" />
                          </button>

                          <button
                            onClick={() => handleWhatsAppShare(inv)}
                            className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-none transition-all shadow-sm"
                            title="Share on WhatsApp"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>

                          <Link
                            to={`/admin/invoices/edit/${inv._id}`}
                            className="p-2 bg-stone-100 border border-brand-sand hover:border-brand-amber text-brand-slateDark rounded-none transition-colors"
                            title="Edit Invoice"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Link>

                          <button
                            onClick={() => handleDelete(inv._id, inv.invoiceNumber)}
                            className="p-2 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 rounded-none transition-colors"
                            title="Delete Invoice"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Print / Preview Modal */}
        {showPrintModal && selectedInvoice && (
          <InvoicePrintModal
            isOpen={showPrintModal}
            invoice={selectedInvoice}
            onClose={() => {
              setShowPrintModal(false);
              setSelectedInvoice(null);
            }}
          />
        )}
      </div>
    </AdminLayout>
  );
}
