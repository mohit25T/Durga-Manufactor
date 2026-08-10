import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  AlertCircle,
  HelpCircle,
  FileCheck,
  Send,
  XCircle,
  ShieldCheck,
  History,
  Lock
} from "lucide-react";
import API from "../services/api";
import AdminLayout from "../components/admin/AdminLayout";
import InvoicePrintModal from "../components/admin/InvoicePrintModal";
import PurchaseOrderPrintModal from "../components/admin/PurchaseOrderPrintModal";

export default function AdminInvoices() {
  const [activeTab, setActiveTab] = useState("inquiries"); // "inquiries" | "proformas" | "purchase-orders" | "summary"
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Data States
  const [inquiries, setInquiries] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [workflowSummary, setWorkflowSummary] = useState(null);

  // Print Modals
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [selectedPO, setSelectedPO] = useState(null);
  const [showPOPrintModal, setShowPOPrintModal] = useState(false);

  // Admin Action Modals
  const [priceInquiryModalOpen, setPriceInquiryModalOpen] = useState(false);
  const [pricingInquiry, setPricingInquiry] = useState(null);
  const [pricingForm, setPricingForm] = useState({
    items: [],
    freightCharges: 0,
    packagingCharges: 0,
    paymentTerms: "50% Advance with Purchase Order, 50% before Dispatch.",
    deliveryTerms: "Ex-factory Rajkot, Gujarat.",
    warrantyTerms: "1 Year Pan-India Warranty.",
    notes: "Factory Service Included. Subject to Rajkot Jurisdiction."
  });
  const [generatingPI, setGeneratingPI] = useState(false);

  // Edit PI Version Modal
  const [editPIModalOpen, setEditPIModalOpen] = useState(false);
  const [editingPI, setEditingPI] = useState(null);
  const [editPIForm, setEditPIForm] = useState({
    items: [],
    freightCharges: 0,
    packagingCharges: 0,
    paymentTerms: "",
    notes: "",
    reason: ""
  });
  const [updatingPI, setUpdatingPI] = useState(false);

  // Verify Signed PO Modal
  const [verifyPOModalOpen, setVerifyPOModalOpen] = useState(false);
  const [verifyingPO, setVerifyingPO] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [verifyingSubmitting, setVerifyingSubmitting] = useState(false);

  const fetchAllWorkflowData = async () => {
    try {
      setLoading(true);
      const [inqRes, invRes, poRes, sumRes] = await Promise.all([
        API.get("/workflow/inquiries/admin").catch(() => ({ data: { success: false } })),
        API.get("/invoices").catch(() => ({ data: { success: false } })),
        API.get("/workflow/po/admin").catch(() => ({ data: { success: false } })),
        API.get("/workflow/summary").catch(() => ({ data: { success: false } }))
      ]);

      if (inqRes.data.success) setInquiries(inqRes.data.inquiries || []);
      if (invRes.data.success) setInvoices(invRes.data.invoices || []);
      if (poRes.data.success) setPurchaseOrders(poRes.data.purchaseOrders || []);
      if (sumRes.data.success) setWorkflowSummary(sumRes.data.summary || null);
    } catch (err) {
      console.error("Error loading workflow data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllWorkflowData();
  }, []);

  // --- 1. ADMIN SETS PRICE & GENERATES PI ---
  const handleOpenPriceModal = (inquiry) => {
    setPricingInquiry(inquiry);
    const preparedItems = (inquiry.items || []).map((item) => ({
      productId: item.productId?._id || item.productId || null,
      name: item.name,
      model: item.model || "",
      quantity: item.quantity || 1,
      unitPrice: item.unitPrice || item.productId?.price || 50000,
      discountPercent: 0,
      hsnCode: "8438",
      gstRate: 18
    }));

    setPricingForm({
      items: preparedItems,
      freightCharges: 0,
      packagingCharges: 0,
      paymentTerms: "50% Advance with Purchase Order, 50% before Dispatch.",
      deliveryTerms: "Ex-factory Rajkot, Gujarat.",
      warrantyTerms: "1 Year Pan-India Warranty.",
      notes: "Factory Service Included. Subject to Rajkot Jurisdiction."
    });
    setPriceInquiryModalOpen(true);
  };

  const handleGeneratePISubmit = async (e) => {
    e.preventDefault();
    if (!pricingInquiry) return;
    setGeneratingPI(true);

    try {
      const res = await API.post(`/workflow/inquiries/${pricingInquiry._id}/generate-pi`, pricingForm);
      if (res.data.success) {
        alert(res.data.message || "Proforma Invoice generated successfully!");
        setPriceInquiryModalOpen(false);
        setPricingInquiry(null);
        fetchAllWorkflowData();
        setActiveTab("proformas");
      }
    } catch (err) {
      console.error("Generate PI error:", err);
      alert(err.response?.data?.message || "Failed to generate Proforma Invoice.");
    } finally {
      setGeneratingPI(false);
    }
  };

  // --- 2. ADMIN EDITS PI VERSION ---
  const handleOpenEditPIModal = (pi) => {
    if (pi.isLocked) {
      alert("This Proforma Invoice has been confirmed by the dealer and is locked. Silently altering confirmed PIs is restricted.");
      return;
    }
    setEditingPI(pi);
    setEditPIForm({
      items: pi.items.map(i => ({ ...i })),
      freightCharges: pi.freightCharges || 0,
      packagingCharges: pi.packagingCharges || 0,
      paymentTerms: pi.paymentTerms || "",
      notes: pi.notes || "",
      reason: ""
    });
    setEditPIModalOpen(true);
  };

  const handleUpdatePIVersionSubmit = async (e) => {
    e.preventDefault();
    if (!editingPI) return;
    if (!editPIForm.reason.trim()) {
      alert("Please provide a reason for revising this PI version.");
      return;
    }
    setUpdatingPI(true);

    try {
      const res = await API.put(`/workflow/pi/${editingPI._id}/version`, editPIForm);
      if (res.data.success) {
        alert(res.data.message || "PI version updated successfully!");
        setEditPIModalOpen(false);
        setEditingPI(null);
        fetchAllWorkflowData();
      }
    } catch (err) {
      console.error("Update PI version error:", err);
      alert(err.response?.data?.message || "Failed to update PI version.");
    } finally {
      setUpdatingPI(false);
    }
  };

  // --- 3. SEND PI TO DEALER ---
  const handleSendPIToDealer = async (piId) => {
    try {
      const res = await API.post(`/workflow/pi/${piId}/send`);
      if (res.data.success) {
        alert("Proforma Invoice sent to dealer!");
        fetchAllWorkflowData();
      }
    } catch (err) {
      console.error("Send PI error:", err);
      alert("Failed to send PI to dealer.");
    }
  };

  // --- 4. VERIFY SIGNED PO (APPROVE / REJECT) ---
  const handleVerifyPOSubmit = async (action) => {
    if (!verifyingPO) return;
    if (action === "REJECT" && !rejectionReason.trim()) {
      alert("Please enter a rejection reason.");
      return;
    }

    setVerifyingSubmitting(true);
    try {
      const payload = { action, rejectionReason };
      const res = await API.post(`/workflow/po/${verifyingPO._id}/verify`, payload);
      if (res.data.success) {
        alert(res.data.message || `Signed PO ${action === "APPROVE" ? "Approved" : "Rejected"} successfully!`);
        setVerifyPOModalOpen(false);
        setVerifyingPO(null);
        setRejectionReason("");
        fetchAllWorkflowData();
      }
    } catch (err) {
      console.error("Verify PO error:", err);
      alert(err.response?.data?.message || "Failed to process PO verification.");
    } finally {
      setVerifyingSubmitting(false);
    }
  };

  const handleWhatsAppShare = (inv) => {
    const text = `*PROFORMA INVOICE - DURGA MANUFACTURES*\n` +
      `Invoice No: ${inv.invoiceNumber} (v${inv.version || 1})\n` +
      `Date: ${new Date(inv.invoiceDate).toLocaleDateString("en-IN")}\n` +
      `Customer: ${inv.companyName || inv.customerName}\n` +
      `Grand Total: ₹${inv.grandTotal?.toLocaleString("en-IN")}\n\n` +
      `Call +91 94281 56213 for Durga Manufactures Support.`;

    const cleanPhone = (inv.phone || "").replace(/\D/g, "");
    const targetPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const url = `https://wa.me/${targetPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  return (
    <AdminLayout>
      <div className="space-y-6 font-sans">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-sand pb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-brand-slateDark tracking-tight flex items-center gap-3">
              <FileText className="w-7 h-7 text-brand-amber" />
              Dealer Sales & Order Workflow Management
            </h1>
            <p className="text-brand-gray text-xs font-semibold mt-1">
              Transaction-Safe Workflow: Dealer Inquiry $\rightarrow$ Admin Pricing $\rightarrow$ Proforma Invoice $\rightarrow$ Customer PO $\rightarrow$ Signed PO Approval.
            </p>
          </div>
        </div>

        {/* Workflow Summary Cards (Section 19 Metric Counters) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <div className="bg-white p-3 border border-brand-sand shadow-sm space-y-1">
            <p className="text-brand-gray font-bold uppercase text-[10px]">New Inquiries</p>
            <h3 className="text-lg font-bold text-amber-600">{workflowSummary?.newInquiries || inquiries.filter(i => i.status === "SUBMITTED").length}</h3>
          </div>
          <div className="bg-white p-3 border border-brand-sand shadow-sm space-y-1">
            <p className="text-brand-gray font-bold uppercase text-[10px]">Pending Pricing</p>
            <h3 className="text-lg font-bold text-blue-600">{inquiries.filter(i => i.status === "SUBMITTED" || i.status === "UNDER_REVIEW").length}</h3>
          </div>
          <div className="bg-white p-3 border border-brand-sand shadow-sm space-y-1">
            <p className="text-brand-gray font-bold uppercase text-[10px]">PI Sent to Dealer</p>
            <h3 className="text-lg font-bold text-purple-600">{invoices.filter(i => ["SENT_TO_DEALER", "Sent"].includes(i.status)).length}</h3>
          </div>
          <div className="bg-white p-3 border border-brand-sand shadow-sm space-y-1">
            <p className="text-brand-gray font-bold uppercase text-[10px]">PI Confirmed</p>
            <h3 className="text-lg font-bold text-emerald-600">{invoices.filter(i => i.isLocked || ["CONFIRMED", "Confirmed"].includes(i.status)).length}</h3>
          </div>
          <div className="bg-white p-3 border border-brand-sand shadow-sm space-y-1">
            <p className="text-brand-gray font-bold uppercase text-[10px]">Signed PO Verification</p>
            <h3 className="text-lg font-bold text-orange-600">{purchaseOrders.filter(p => p.status === "SIGNED_PO_UPLOADED").length}</h3>
          </div>
          <div className="bg-white p-3 border border-brand-sand shadow-sm space-y-1">
            <p className="text-brand-gray font-bold uppercase text-[10px]">Confirmed Orders</p>
            <h3 className="text-lg font-bold text-emerald-700">{purchaseOrders.filter(p => p.status === "ORDER_CONFIRMED").length}</h3>
          </div>
        </div>

        {/* Workflow Navigation Sub-Tabs */}
        <div className="bg-white p-2 border border-brand-sand flex items-center gap-2 overflow-x-auto">
          {[
            { id: "inquiries", label: `1. Dealer Inquiries (${inquiries.length})`, icon: HelpCircle },
            { id: "proformas", label: `2. Proforma Invoices (${invoices.length})`, icon: FileText },
            { id: "purchase-orders", label: `3. Customer POs & Verification (${purchaseOrders.length})`, icon: FileCheck },
            { id: "summary", label: "4. Audit Trail & Log History", icon: History }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-brand-slateDark text-brand-amber shadow"
                    : "text-brand-slateDark hover:bg-stone-100"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* --- SUB-TAB 1: DEALER INQUIRIES --- */}
        {activeTab === "inquiries" && (
          <div className="bg-white border border-brand-sand p-4 space-y-4">
            <div className="flex justify-between items-center border-b border-brand-sand pb-3">
              <h2 className="text-sm font-extrabold uppercase text-brand-slateDark flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-brand-amber" /> Dealer Machinery Inquiries
              </h2>
              <span className="text-xs text-brand-gray font-semibold">Review requested products and set selling price</span>
            </div>

            {loading ? (
              <div className="p-8 text-center text-xs text-brand-gray">Loading inquiries...</div>
            ) : inquiries.length === 0 ? (
              <div className="p-8 text-center text-xs text-brand-gray">No dealer inquiries submitted yet.</div>
            ) : (
              <div className="space-y-3">
                {inquiries.map((inq) => (
                  <div key={inq._id} className="border border-brand-sand p-4 hover:border-brand-amber transition-colors space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-brand-sand pb-2">
                      <div>
                        <span className="font-mono font-bold text-brand-slateDark text-sm">{inq.inquiryNumber}</span>
                        <span className="text-xs text-brand-gray ml-3">
                          Dealer: <strong>{inq.dealerId?.companyName || inq.dealerId?.contactPerson || "Dealer"}</strong> ({inq.dealerId?.phone})
                        </span>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-amber-100 text-amber-800 border border-amber-300">
                        {inq.status}
                      </span>
                    </div>

                    {/* Requested Items List */}
                    <div className="bg-stone-50 p-2.5 text-xs divide-y divide-stone-200">
                      {(inq.items || []).map((item, idx) => (
                        <div key={idx} className="py-1 flex justify-between items-center">
                          <div>
                            <span className="font-bold text-brand-slateDark">{item.name}</span>
                            {item.model && <span className="text-brand-gray ml-2">({item.model})</span>}
                            {item.specification && <p className="text-[10px] text-brand-gray italic">{item.specification}</p>}
                          </div>
                          <span className="font-mono font-bold">Qty: {item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    {/* Action */}
                    <div className="flex justify-end pt-1">
                      <button
                        onClick={() => handleOpenPriceModal(inq)}
                        className="bg-brand-amber hover:bg-brand-slateDark hover:text-white text-brand-slateDark font-bold px-4 py-2 text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-sm"
                      >
                        <DollarSign className="w-4 h-4" /> Set Price & Generate PI
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- SUB-TAB 2: PROFORMA INVOICES --- */}
        {activeTab === "proformas" && (
          <div className="bg-white border border-brand-sand p-4 space-y-4">
            <div className="flex justify-between items-center border-b border-brand-sand pb-3">
              <h2 className="text-sm font-extrabold uppercase text-brand-slateDark flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-amber" /> Proforma Invoices & Version History
              </h2>
            </div>

            {invoices.length === 0 ? (
              <div className="p-8 text-center text-xs text-brand-gray">No Proforma Invoices found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-brand-slateDark text-white uppercase tracking-wider text-[11px]">
                      <th className="p-3">PI #</th>
                      <th className="p-3">Version</th>
                      <th className="p-3">Dealer / Customer</th>
                      <th className="p-3 text-right">Grand Total</th>
                      <th className="p-3 text-center">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-sand font-semibold text-brand-slateDark">
                    {invoices.map((inv) => (
                      <tr key={inv._id} className="hover:bg-stone-50">
                        <td className="p-3 font-mono font-bold">{inv.invoiceNumber}</td>
                        <td className="p-3 font-mono font-bold text-amber-700">v{inv.version || 1}</td>
                        <td className="p-3">
                          <div className="font-bold">{inv.companyName || inv.customerName}</div>
                          <div className="text-[10px] text-brand-gray">{inv.phone}</div>
                        </td>
                        <td className="p-3 text-right font-mono font-bold text-sm">
                          ₹{(inv.grandTotal || 0).toLocaleString("en-IN")}
                        </td>
                        <td className="p-3 text-center">
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 border bg-amber-50 text-amber-800 border-amber-300">
                            {inv.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setSelectedInvoice(inv);
                                setShowPrintModal(true);
                              }}
                              className="p-1.5 bg-brand-slateDark text-white hover:bg-slate-800"
                              title="Print / Save PDF"
                            >
                              <Printer className="w-3.5 h-3.5 text-brand-amber" />
                            </button>

                            <button
                              onClick={() => handleSendPIToDealer(inv._id)}
                              className="p-1.5 bg-purple-700 text-white hover:bg-purple-600"
                              title="Send PI to Dealer"
                            >
                              <Send className="w-3.5 h-3.5" />
                            </button>

                            {!inv.isLocked ? (
                              <button
                                onClick={() => handleOpenEditPIModal(inv)}
                                className="p-1.5 bg-amber-500 text-slate-950 font-bold hover:bg-amber-400"
                                title="Edit PI Version"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <span className="p-1.5 bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-bold flex items-center gap-1" title="Confirmed & Locked">
                                <Lock className="w-3 h-3" /> Locked
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* --- SUB-TAB 3: PURCHASE ORDERS & SIGNED PO VERIFICATION --- */}
        {activeTab === "purchase-orders" && (
          <div className="bg-white border border-brand-sand p-4 space-y-4">
            <div className="flex justify-between items-center border-b border-brand-sand pb-3">
              <h2 className="text-sm font-extrabold uppercase text-brand-slateDark flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-brand-amber" /> Customer Purchase Orders & Signed PO Verification
              </h2>
            </div>

            {purchaseOrders.length === 0 ? (
              <div className="p-8 text-center text-xs text-brand-gray">No Customer Purchase Orders generated yet.</div>
            ) : (
              <div className="space-y-3">
                {purchaseOrders.map((po) => {
                  const isUploaded = po.signedPoDocument?.status === "PENDING" || po.status === "SIGNED_PO_UPLOADED";
                  const isApproved = po.status === "ORDER_CONFIRMED" || po.signedPoDocument?.status === "APPROVED";
                  const isRejected = po.status === "SIGNED_PO_REJECTED" || po.signedPoDocument?.status === "REJECTED";

                  return (
                    <div key={po._id} className="border border-brand-sand p-4 space-y-3 hover:border-brand-amber transition-colors">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-brand-sand pb-2">
                        <div>
                          <span className="font-mono font-bold text-brand-slateDark text-base">{po.poNumber}</span>
                          <span className="text-xs text-brand-gray ml-3">
                            Ref PI: <strong>{po.proformaInvoiceId?.invoiceNumber || "N/A"}</strong> (v{po.piVersionNumber || 1})
                          </span>
                          <span className="text-xs text-brand-gray ml-3">
                            Dealer: <strong>{po.buyerDetails?.companyName || po.buyerDetails?.dealerName}</strong>
                          </span>
                        </div>
                        <span className={`text-[10px] font-bold uppercase px-2.5 py-1 border ${
                          isApproved ? "bg-emerald-100 text-emerald-800 border-emerald-300" :
                          isRejected ? "bg-red-100 text-red-800 border-red-300" :
                          isUploaded ? "bg-blue-100 text-blue-800 border-blue-300" :
                          "bg-amber-100 text-amber-800 border-amber-300"
                        }`}>
                          {po.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-stone-50 p-2.5">
                        <div>
                          <p>Total Value: <strong className="font-mono text-emerald-700">₹{(po.financials?.grandTotal || po.totalAmount || 0).toLocaleString("en-IN")}</strong></p>
                          <p>Payment Terms: <span className="text-brand-gray">{po.commercialTerms?.paymentTerms}</span></p>
                        </div>
                        <div>
                          <p>Signed Document Status: <strong>{po.signedPoDocument?.status || "NOT_UPLOADED"}</strong></p>
                          {po.signedPoDocument?.fileName && (
                            <p className="text-blue-700 font-mono underline">
                              <a href={po.signedPoDocument.fileUrl} target="_blank" rel="noreferrer">
                                View File: {po.signedPoDocument.fileName}
                              </a>
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                        <button
                          onClick={() => {
                            setSelectedPO(po);
                            setShowPOPrintModal(true);
                          }}
                          className="bg-brand-slateDark text-white hover:bg-slate-800 font-bold px-3 py-1.5 text-xs uppercase tracking-wider flex items-center gap-1.5"
                        >
                          <Printer className="w-3.5 h-3.5 text-brand-amber" /> View / Print PO PDF
                        </button>

                        {isUploaded && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setVerifyingPO(po);
                                setVerifyPOModalOpen(true);
                              }}
                              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-1.5 text-xs uppercase tracking-wider shadow flex items-center gap-1.5"
                            >
                              <ShieldCheck className="w-4 h-4" /> Review & Approve Signed PO
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* --- SUB-TAB 4: AUDIT TRAIL & HISTORY LOGS --- */}
        {activeTab === "summary" && (
          <div className="bg-white border border-brand-sand p-4 space-y-4">
            <h2 className="text-sm font-extrabold uppercase text-brand-slateDark flex items-center gap-2">
              <History className="w-4 h-4 text-brand-amber" /> Immutable Workflow Audit Trail History
            </h2>

            <div className="space-y-2 text-xs">
              {invoices.flatMap(inv => (inv.auditTrail || []).map((log, idx) => (
                <div key={idx} className="bg-stone-50 border border-brand-sand p-3 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-brand-slateDark">PI {inv.invoiceNumber} (v{log.version})</span>
                    <p className="text-brand-gray text-[11px] mt-0.5">{log.reason || "Action performed"}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-brand-slateDark font-semibold">{log.changedBy} ({log.role})</span>
                    <p className="text-[10px] text-brand-gray">{new Date(log.dateTime || Date.now()).toLocaleString("en-IN")}</p>
                  </div>
                </div>
              )))}
            </div>
          </div>
        )}

        {/* --- MODAL 1: SET PRICE & GENERATE PI --- */}
        <AnimatePresence>
          {priceInquiryModalOpen && pricingInquiry && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 overflow-y-auto">
              <motion.div className="bg-white border-2 border-brand-slateDark p-6 max-w-2xl w-full text-brand-slateDark space-y-4 my-auto">
                <div className="flex justify-between items-center border-b border-brand-sand pb-3">
                  <h3 className="font-bold text-sm uppercase text-brand-slateDark">
                    Set Selling Prices & Generate PI ({pricingInquiry.inquiryNumber})
                  </h3>
                  <button onClick={() => setPriceInquiryModalOpen(false)}>
                    <XCircle className="w-5 h-5 text-brand-gray hover:text-brand-slateDark" />
                  </button>
                </div>

                <form onSubmit={handleGeneratePISubmit} className="space-y-4 text-xs">
                  <div className="space-y-2">
                    <label className="font-bold uppercase text-brand-gray block">Machine Line Items & Selling Rates (₹)</label>
                    {pricingForm.items.map((item, idx) => (
                      <div key={idx} className="bg-stone-50 p-3 border border-brand-sand grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                        <div>
                          <span className="font-bold text-brand-slateDark">{item.name}</span>
                          <span className="text-[10px] text-brand-gray block">Qty: {item.quantity}</span>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-brand-gray">Unit Price (₹):</label>
                          <input
                            type="number"
                            value={item.unitPrice}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              const updated = [...pricingForm.items];
                              updated[idx].unitPrice = val;
                              setPricingForm({ ...pricingForm, items: updated });
                            }}
                            className="w-full bg-white border border-brand-sand p-1.5 font-mono text-xs font-bold"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-brand-gray">Discount %:</label>
                          <input
                            type="number"
                            value={item.discountPercent}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              const updated = [...pricingForm.items];
                              updated[idx].discountPercent = val;
                              setPricingForm({ ...pricingForm, items: updated });
                            }}
                            className="w-full bg-white border border-brand-sand p-1.5 font-mono text-xs font-bold"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold uppercase text-brand-gray block mb-1">Freight Charges (₹)</label>
                      <input
                        type="number"
                        value={pricingForm.freightCharges}
                        onChange={(e) => setPricingForm({ ...pricingForm, freightCharges: Number(e.target.value) })}
                        className="w-full bg-white border border-brand-sand p-1.5 font-mono"
                      />
                    </div>
                    <div>
                      <label className="font-bold uppercase text-brand-gray block mb-1">Payment Terms</label>
                      <input
                        type="text"
                        value={pricingForm.paymentTerms}
                        onChange={(e) => setPricingForm({ ...pricingForm, paymentTerms: e.target.value })}
                        className="w-full bg-white border border-brand-sand p-1.5"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setPriceInquiryModalOpen(false)}
                      className="px-4 py-2 font-bold uppercase text-brand-gray"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={generatingPI}
                      className="bg-brand-amber text-brand-slateDark font-bold px-6 py-2 uppercase tracking-wider"
                    >
                      {generatingPI ? "Generating..." : "Generate Proforma Invoice"}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* --- MODAL 2: EDIT PI VERSION --- */}
        <AnimatePresence>
          {editPIModalOpen && editingPI && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 overflow-y-auto">
              <motion.div className="bg-white border-2 border-brand-slateDark p-6 max-w-2xl w-full text-brand-slateDark space-y-4 my-auto">
                <div className="flex justify-between items-center border-b border-brand-sand pb-3">
                  <h3 className="font-bold text-sm uppercase text-brand-slateDark">
                    Revise PI Version ({editingPI.invoiceNumber} - Current v{editingPI.version || 1})
                  </h3>
                  <button onClick={() => setEditPIModalOpen(false)}>
                    <XCircle className="w-5 h-5 text-brand-gray hover:text-brand-slateDark" />
                  </button>
                </div>

                <form onSubmit={handleUpdatePIVersionSubmit} className="space-y-4 text-xs">
                  <div className="space-y-2">
                    {editPIForm.items.map((item, idx) => (
                      <div key={idx} className="bg-stone-50 p-2.5 border border-brand-sand flex justify-between items-center gap-3">
                        <span className="font-bold">{item.name}</span>
                        <div className="flex items-center gap-2">
                          <label className="text-[10px] text-brand-gray">Rate ₹:</label>
                          <input
                            type="number"
                            value={item.unitPrice}
                            onChange={(e) => {
                              const updated = [...editPIForm.items];
                              updated[idx].unitPrice = Number(e.target.value);
                              setEditPIForm({ ...editPIForm, items: updated });
                            }}
                            className="w-28 bg-white border border-brand-sand p-1 font-mono font-bold"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="font-bold uppercase text-brand-slateDark block mb-1">
                      Revision Reason / Audit Note (Mandatory for Version History):
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Price negotiated down by 5% as per phone discussion"
                      value={editPIForm.reason}
                      onChange={(e) => setEditPIForm({ ...editPIForm, reason: e.target.value })}
                      className="w-full bg-stone-50 border border-brand-sand p-2 font-semibold"
                      required
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditPIModalOpen(false)}
                      className="px-4 py-2 font-bold uppercase text-brand-gray"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={updatingPI}
                      className="bg-brand-amber text-brand-slateDark font-bold px-6 py-2 uppercase tracking-wider"
                    >
                      {updatingPI ? "Saving..." : `Save as Version ${(editingPI.version || 1) + 1}`}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* --- MODAL 3: VERIFY SIGNED PO (APPROVE / REJECT) --- */}
        <AnimatePresence>
          {verifyPOModalOpen && verifyingPO && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
              <motion.div className="bg-white border-2 border-brand-slateDark p-6 max-w-lg w-full text-brand-slateDark space-y-4">
                <div className="flex justify-between items-center border-b border-brand-sand pb-3">
                  <h3 className="font-bold text-sm uppercase text-brand-slateDark flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" /> Verify Signed PO ({verifyingPO.poNumber})
                  </h3>
                  <button onClick={() => setVerifyPOModalOpen(false)}>
                    <XCircle className="w-5 h-5 text-brand-gray hover:text-brand-slateDark" />
                  </button>
                </div>

                <div className="bg-stone-50 p-3 text-xs border border-brand-sand space-y-1">
                  <p>Uploaded File: <strong className="font-mono text-blue-700">{verifyingPO.signedPoDocument?.fileName}</strong></p>
                  {verifyingPO.signedPoDocument?.fileUrl && (
                    <a href={verifyingPO.signedPoDocument.fileUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline block font-bold mt-1">
                      Open Uploaded Document Preview ↗
                    </a>
                  )}
                </div>

                <div className="space-y-2 text-xs">
                  <label className="font-bold uppercase text-brand-gray block">Rejection Reason (If Rejecting):</label>
                  <input
                    type="text"
                    placeholder="e.g. Company stamp is missing or Signature is not visible"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full bg-stone-50 border border-brand-sand p-2"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    disabled={verifyingSubmitting}
                    onClick={() => handleVerifyPOSubmit("REJECT")}
                    className="bg-red-600 hover:bg-red-500 text-white font-bold px-4 py-2 text-xs uppercase"
                  >
                    Reject Signed PO
                  </button>
                  <button
                    type="button"
                    disabled={verifyingSubmitting}
                    onClick={() => handleVerifyPOSubmit("APPROVE")}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2 text-xs uppercase"
                  >
                    Approve Signed PO & Lock Order
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* --- PRINT MODALS --- */}
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

        {showPOPrintModal && selectedPO && (
          <PurchaseOrderPrintModal
            isOpen={showPOPrintModal}
            po={selectedPO}
            onClose={() => {
              setShowPOPrintModal(false);
              setSelectedPO(null);
            }}
          />
        )}
      </div>
    </AdminLayout>
  );
}
