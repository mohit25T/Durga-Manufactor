import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FileText,
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  Building2,
  User,
  Phone,
  Mail,
  MapPin,
  Percent,
  Calculator,
  ShieldCheck,
  CheckCircle2,
  Printer,
  Info
} from "lucide-react";
import API from "../services/api";
import AdminLayout from "../components/admin/AdminLayout";
import InvoicePrintModal from "../components/admin/InvoicePrintModal";

export default function CreateInvoice() {
  const navigate = useNavigate();
  const { id } = useParams(); // If present, edit mode
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Selectable datasets
  const [dealers, setDealers] = useState([]);
  const [leads, setLeads] = useState([]);
  const [products, setProducts] = useState([]);

  // Preview Modal state
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [savedInvoiceData, setSavedInvoiceData] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    invoiceNumber: "",
    invoiceDate: new Date().toISOString().split("T")[0],
    validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    customerType: "Dealer", // "Dealer" | "Lead" | "Custom"
    dealerId: "",
    leadId: "",
    customerName: "",
    companyName: "",
    phone: "",
    email: "",
    gstNumber: "",
    billingAddress: "",
    shippingAddress: "",
    city: "",
    state: "Gujarat",
    pincode: "",
    items: [
      {
        productId: "",
        name: "",
        hsnCode: "8438",
        quantity: 1,
        unit: "Set",
        unitPrice: 0,
        discountPercent: 0,
        taxableAmount: 0,
        gstRate: 18,
        gstAmount: 0,
        totalAmount: 0
      }
    ],
    subtotal: 0,
    freightCharges: 0,
    packagingCharges: 0,
    isInterstate: false,
    cgstAmount: 0,
    sgstAmount: 0,
    igstAmount: 0,
    totalGst: 0,
    grandTotal: 0,
    advancePayment: 0,
    balanceDue: 0,
    paymentTerms: "50% Advance with Purchase Order, 50% before Dispatch from Rajkot Factory.",
    notes: "Pan-India Warranty & Factory Service Included. Subject to Rajkot Jurisdiction.",
    udyamNumber: "GJ-20-0130533",
    bankDetails: {
      bankName: "Bank Of Baroda, Aji GIDC, Rajkot",
      accountName: "DURGA MANUFACTURES",
      accountNumber: "17400200000634",
      ifscCode: "BARB0AJIRAJ",
      branch: "Aji GIDC, Rajkot"
    },
    status: "Sent"
  });

  // Fetch initial datasets & next invoice number
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch dealers, leads, products in parallel
        const [dealersRes, leadsRes, productsRes] = await Promise.all([
          API.get("/dealers/admin/all").catch(() =>
            API.get("/dealers").catch(() => ({ data: {} }))
          ),
          API.get("/leads").catch(() => ({ data: {} })),
          API.get("/products").catch(() => ({ data: {} }))
        ]);

        const dealersArr = dealersRes.data?.dealers || dealersRes.data?.data || (Array.isArray(dealersRes.data) ? dealersRes.data : []);
        const leadsArr = leadsRes.data?.leads || leadsRes.data?.data || (Array.isArray(leadsRes.data) ? leadsRes.data : []);
        const productsArr = productsRes.data?.products || productsRes.data?.data || (Array.isArray(productsRes.data) ? productsRes.data : []);

        setDealers(dealersArr);
        setLeads(leadsArr);
        setProducts(productsArr);

        if (isEditMode) {
          // Fetch invoice to edit
          const invRes = await API.get(`/invoices/${id}`);
          if (invRes.data.success && invRes.data.invoice) {
            const inv = invRes.data.invoice;
            setFormData({
              ...inv,
              invoiceDate: inv.invoiceDate ? new Date(inv.invoiceDate).toISOString().split("T")[0] : "",
              validUntil: inv.validUntil ? new Date(inv.validUntil).toISOString().split("T")[0] : ""
            });
          }
        } else {
          // Fetch next invoice number
          const numRes = await API.get("/invoices/next-number");
          if (numRes.data.success && numRes.data.invoiceNumber) {
            setFormData((prev) => ({ ...prev, invoiceNumber: numRes.data.invoiceNumber }));
          }
        }
      } catch (err) {
        console.error("Error fetching data for invoice builder:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isEditMode]);

  // Recalculate totals whenever items, freight, or state changes
  useEffect(() => {
    recalculateTotals(formData.items, formData.freightCharges, formData.packagingCharges, formData.state);
  }, [formData.state]);

  const recalculateTotals = (itemsList, freight = formData.freightCharges, packaging = formData.packagingCharges, stateVal = formData.state) => {
    let sub = 0;
    let gstSum = 0;

    const updatedItems = itemsList.map((item) => {
      const qty = Number(item.quantity) || 1;
      const rate = Number(item.unitPrice) || 0;
      const disc = Number(item.discountPercent) || 0;
      const gstRate = Number(item.gstRate) || 18;

      const discountedRate = rate - (rate * disc) / 100;
      const taxable = discountedRate * qty;
      const gstAmt = (taxable * gstRate) / 100;
      const tot = taxable + gstAmt;

      sub += taxable;
      gstSum += gstAmt;

      return {
        ...item,
        taxableAmount: Math.round(taxable),
        gstAmount: Math.round(gstAmt),
        totalAmount: Math.round(tot)
      };
    });

    const isInter = (stateVal || "").trim().toLowerCase() !== "gujarat";
    const freightVal = Number(freight) || 0;
    const pkgVal = Number(packaging) || 0;

    const cgst = isInter ? 0 : Math.round(gstSum / 2);
    const sgst = isInter ? 0 : Math.round(gstSum / 2);
    const igst = isInter ? Math.round(gstSum) : 0;

    const grand = Math.round(sub + freightVal + pkgVal + gstSum);
    const advance = Math.round(grand * 0.5);
    const balance = grand - advance;

    setFormData((prev) => ({
      ...prev,
      items: updatedItems,
      subtotal: Math.round(sub),
      freightCharges: freightVal,
      packagingCharges: pkgVal,
      isInterstate: isInter,
      cgstAmount: cgst,
      sgstAmount: sgst,
      igstAmount: igst,
      totalGst: Math.round(gstSum),
      grandTotal: grand,
      advancePayment: advance,
      balanceDue: balance
    }));
  };

  // Handle Customer Selection Dropdown
  const handleDealerSelect = (dealerId) => {
    const d = dealers.find((item) => item._id === dealerId);
    if (d) {
      const stateName = d.state || "Gujarat";
      const updatedData = {
        ...formData,
        customerType: "Dealer",
        dealerId,
        leadId: "",
        customerName: d.contactPerson || d.companyName || "",
        companyName: d.companyName || "",
        phone: d.phone || "",
        email: d.email || "",
        gstNumber: d.gstNumber || "",
        billingAddress: d.address || "",
        shippingAddress: d.address || "",
        city: d.city || "",
        state: stateName
      };
      setFormData(updatedData);
      recalculateTotals(updatedData.items, updatedData.freightCharges, updatedData.packagingCharges, stateName);
    }
  };

  const handleLeadSelect = (leadId) => {
    const l = leads.find((item) => item._id === leadId);
    if (l) {
      const updatedData = {
        ...formData,
        customerType: "Lead",
        dealerId: "",
        leadId,
        customerName: l.name || "",
        companyName: l.company || l.name || "",
        phone: l.phone || "",
        email: l.email || "",
        gstNumber: "",
        billingAddress: l.city || "",
        shippingAddress: l.city || "",
        city: l.city || "",
        state: "Gujarat"
      };
      setFormData(updatedData);
    }
  };

  // Line Item Management
  const handleItemChange = (index, field, value) => {
    const updated = [...formData.items];
    updated[index][field] = value;

    // Auto fill price if product selected
    if (field === "productId") {
      const selProduct = products.find((p) => p._id === value);
      if (selProduct) {
        updated[index].name = selProduct.name || selProduct.title || "";
        updated[index].unitPrice = selProduct.appPrice || selProduct.price || 0;
        updated[index].hsnCode = "8438";
      }
    }

    recalculateTotals(updated);
  };

  const addItemRow = () => {
    const newItems = [
      ...formData.items,
      {
        productId: "",
        name: "",
        hsnCode: "8438",
        quantity: 1,
        unit: "Set",
        unitPrice: 0,
        discountPercent: 0,
        taxableAmount: 0,
        gstRate: 18,
        gstAmount: 0,
        totalAmount: 0
      }
    ];
    recalculateTotals(newItems);
  };

  const removeItemRow = (index) => {
    if (formData.items.length === 1) return;
    const newItems = formData.items.filter((_, i) => i !== index);
    recalculateTotals(newItems);
  };

  // Save Invoice Submit Handler
  const handleSubmit = async (e, openPrintAfter = false) => {
    if (e) e.preventDefault();

    if (!formData.customerName.trim() && !formData.companyName.trim()) {
      setErrorMessage("Please specify Customer Name / Company Name.");
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMessage("Please enter customer phone number.");
      return;
    }

    setSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    const payload = {
      ...formData,
      dealerId: formData.dealerId && formData.dealerId.trim() !== "" ? formData.dealerId : null,
      leadId: formData.leadId && formData.leadId.trim() !== "" ? formData.leadId : null,
      items: formData.items.map((item) => ({
        ...item,
        productId: item.productId && item.productId.trim() !== "" ? item.productId : null
      }))
    };

    try {
      let res;
      if (isEditMode) {
        res = await API.put(`/invoices/${id}`, payload);
      } else {
        res = await API.post("/invoices", payload);
      }

      if (res.data.success) {
        const savedInv = res.data.invoice;
        setSuccessMessage(`⚡ Proforma Invoice ${savedInv.invoiceNumber} saved successfully!`);
        setSavedInvoiceData(savedInv);

        if (openPrintAfter) {
          setShowPrintModal(true);
        } else {
          setTimeout(() => navigate("/admin/invoices"), 1500);
        }
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(err.response?.data?.message || "Failed to save Proforma Invoice.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-brand-amber border-t-transparent rounded-full animate-spin" />
            <p className="text-xs uppercase tracking-widest text-brand-gray font-bold">Loading Invoice Builder...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8 font-sans">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-sand pb-5">
          <div className="flex items-center gap-3">
            <Link
              to="/admin/invoices"
              className="p-2.5 bg-brand-light border border-brand-sand hover:border-brand-amber text-brand-slateDark rounded-none transition-colors shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-brand-slateDark tracking-tight flex items-center gap-2">
                <FileText className="w-7 h-7 text-brand-amber" />
                {isEditMode ? `Edit Invoice: ${formData.invoiceNumber}` : "Create Proforma Invoice"}
              </h1>
              <p className="text-brand-gray text-sm">
                Generate official B2B machinery proforma invoice with pan-India GST breakdown & bank details.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={(e) => handleSubmit(e, true)}
              disabled={saving}
              className="inline-flex items-center gap-2 bg-brand-slateDark hover:bg-slate-800 text-white px-4 py-3 rounded-none text-xs font-bold uppercase tracking-wider transition-all shadow-md"
            >
              <Printer className="w-4 h-4 text-brand-amber" /> Save & Print PDF
            </button>
            <button
              type="button"
              onClick={(e) => handleSubmit(e, false)}
              disabled={saving}
              className="inline-flex items-center gap-2 bg-brand-amber hover:bg-brand-slateDark hover:text-white text-brand-slateDark px-6 py-3 rounded-none text-xs font-bold uppercase tracking-wider transition-all shadow-md"
            >
              <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Invoice"}
            </button>
          </div>
        </div>

        {/* Feedback Messages */}
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-none text-xs font-bold flex items-center justify-between shadow-sm">
            <span>⚠️ {errorMessage}</span>
            <button onClick={() => setErrorMessage("")}>&times;</button>
          </div>
        )}

        {successMessage && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-none text-xs font-bold flex items-center justify-between shadow-sm">
            <span>{successMessage}</span>
            <button onClick={() => setSuccessMessage("")}>&times;</button>
          </div>
        )}

        {/* 1. Invoice Metadata Section */}
        <div className="bg-brand-light p-6 md:p-8 rounded-none shadow border border-brand-sand space-y-6">
          <div className="flex items-center gap-3 border-b border-brand-sand pb-4">
            <Info className="w-5 h-5 text-brand-amber" />
            <h2 className="text-lg font-bold text-brand-slateDark">
              1. Invoice Meta & Validity
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-xs font-bold text-brand-slateDark uppercase tracking-wider mb-2">
                Invoice Number
              </label>
              <input
                type="text"
                value={formData.invoiceNumber}
                onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                className="w-full px-4 py-3 bg-stone-50 border border-brand-sand rounded-none text-brand-slateDark font-mono text-sm font-bold outline-none focus:border-brand-amber transition-all"
                placeholder="PI-2026-0001"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-slateDark uppercase tracking-wider mb-2">
                Invoice Date
              </label>
              <input
                type="date"
                value={formData.invoiceDate}
                onChange={(e) => setFormData({ ...formData, invoiceDate: e.target.value })}
                className="w-full px-4 py-3 bg-stone-50 border border-brand-sand rounded-none text-brand-slateDark text-sm font-bold outline-none focus:border-brand-amber transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-slateDark uppercase tracking-wider mb-2">
                Valid Until
              </label>
              <input
                type="date"
                value={formData.validUntil}
                onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                className="w-full px-4 py-3 bg-stone-50 border border-brand-sand rounded-none text-brand-slateDark text-sm font-bold outline-none focus:border-brand-amber transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-slateDark uppercase tracking-wider mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-3 bg-stone-50 border border-brand-sand rounded-none text-brand-slateDark text-sm font-bold outline-none focus:border-brand-amber transition-all"
              >
                <option value="Draft">Draft</option>
                <option value="Sent">Sent to Customer</option>
                <option value="Approved">Approved / Order Confirmed</option>
                <option value="Paid">Fully Paid</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* 2. Customer & Billing Information */}
        <div className="bg-brand-light p-6 md:p-8 rounded-none shadow border border-brand-sand space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-sand pb-4">
            <div className="flex items-center gap-3">
              <Building2 className="w-5 h-5 text-brand-amber" />
              <h2 className="text-lg font-bold text-brand-slateDark">
                2. Customer & Billing Information
              </h2>
            </div>

            {/* Customer Type Toggle Buttons */}
            <div className="flex items-center bg-stone-100 p-1 border border-brand-sand rounded-none">
              {["Dealer", "Lead", "Custom"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData({ ...formData, customerType: type })}
                  className={`px-4 py-1.5 text-xs font-bold uppercase transition-all ${
                    formData.customerType === type
                      ? "bg-brand-slateDark text-white shadow-sm"
                      : "text-brand-gray hover:text-brand-slateDark"
                  }`}
                >
                  {type === "Dealer" ? "Authorized Dealer" : type === "Lead" ? "Website Lead" : "Custom Client"}
                </button>
              ))}
            </div>
          </div>

          {/* Preset Selectors */}
          {formData.customerType === "Dealer" && (
            <div className="bg-stone-50 p-4 border border-brand-sand">
              <label className="block text-xs font-bold text-brand-slateDark uppercase tracking-wider mb-2">
                Select Authorized Dealer ({dealers.length} Dealers Found)
              </label>
              <select
                value={formData.dealerId}
                onChange={(e) => handleDealerSelect(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-brand-sand rounded-none text-brand-slateDark font-bold text-sm outline-none focus:border-brand-amber"
              >
                <option value="">-- Choose Authorized Dealer --</option>
                {dealers.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.companyName} ({d.contactPerson || "Contact"} - {d.city || d.state || "India"})
                  </option>
                ))}
              </select>
            </div>
          )}

          {formData.customerType === "Lead" && (
            <div className="bg-stone-50 p-4 border border-brand-sand">
              <label className="block text-xs font-bold text-brand-slateDark uppercase tracking-wider mb-2">
                Select Inquiry Lead ({leads.length} Leads Found)
              </label>
              <select
                value={formData.leadId}
                onChange={(e) => handleLeadSelect(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-brand-sand rounded-none text-brand-slateDark font-bold text-sm outline-none focus:border-brand-amber"
              >
                <option value="">-- Choose Existing Lead --</option>
                {leads.map((l) => (
                  <option key={l._id} value={l._id}>
                    {l.name} ({l.company || l.city || l.phone})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Customer Input Fields Table / Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold text-brand-slateDark uppercase tracking-wider mb-2">
                Company Name *
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full px-4 py-3 bg-stone-50 border border-brand-sand rounded-none text-brand-slateDark text-sm font-bold outline-none focus:border-brand-amber"
                placeholder="e.g. Royal Food Industries"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-slateDark uppercase tracking-wider mb-2">
                Contact Person *
              </label>
              <input
                type="text"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                className="w-full px-4 py-3 bg-stone-50 border border-brand-sand rounded-none text-brand-slateDark text-sm font-bold outline-none focus:border-brand-amber"
                placeholder="e.g. Rajesh Patel"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-slateDark uppercase tracking-wider mb-2">
                Phone Number *
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 bg-stone-50 border border-brand-sand rounded-none text-brand-slateDark text-sm font-bold outline-none focus:border-brand-amber"
                placeholder="+91 98258 00000"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-slateDark uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-stone-50 border border-brand-sand rounded-none text-brand-slateDark text-sm font-semibold outline-none focus:border-brand-amber"
                placeholder="dealer@company.com"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-slateDark uppercase tracking-wider mb-2">
                GSTIN Number
              </label>
              <input
                type="text"
                value={formData.gstNumber}
                onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value.toUpperCase() })}
                className="w-full px-4 py-3 bg-stone-50 border border-brand-sand rounded-none text-brand-slateDark text-sm font-mono uppercase font-bold outline-none focus:border-brand-amber"
                placeholder="24AAAAA0000A1Z5"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-slateDark uppercase tracking-wider mb-2">
                State (GST Region) *
              </label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => {
                  const stateVal = e.target.value;
                  setFormData({ ...formData, state: stateVal });
                  recalculateTotals(formData.items, formData.freightCharges, formData.packagingCharges, stateVal);
                }}
                className="w-full px-4 py-3 bg-stone-50 border border-brand-sand rounded-none text-brand-slateDark text-sm font-bold outline-none focus:border-brand-amber"
                placeholder="Gujarat"
              />
              <span className="text-xs text-orange-600 font-bold mt-1.5 block">
                {formData.isInterstate ? "⚡ Inter-State IGST (18%)" : "⚡ Intra-State CGST (9%) + SGST (9%)"}
              </span>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-brand-slateDark uppercase tracking-wider mb-2">
                Billing Address *
              </label>
              <textarea
                rows={2}
                value={formData.billingAddress}
                onChange={(e) => setFormData({ ...formData, billingAddress: e.target.value })}
                className="w-full px-4 py-3 bg-stone-50 border border-brand-sand rounded-none text-brand-slateDark text-sm font-semibold outline-none focus:border-brand-amber"
                placeholder="Full billing address..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-slateDark uppercase tracking-wider mb-2">
                City / Location
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-3 bg-stone-50 border border-brand-sand rounded-none text-brand-slateDark text-sm font-semibold outline-none focus:border-brand-amber"
                placeholder="Ahmedabad / Mumbai"
              />
            </div>
          </div>
        </div>

        {/* 3. Machinery & Product Line Items Table */}
        <div className="bg-brand-light p-6 md:p-8 rounded-none shadow border border-brand-sand space-y-6">
          <div className="flex items-center justify-between border-b border-brand-sand pb-4">
            <div className="flex items-center gap-3">
              <Calculator className="w-5 h-5 text-brand-amber" />
              <h2 className="text-lg font-bold text-brand-slateDark">
                3. Machinery & Product Line Items ({products.length} Products Available)
              </h2>
            </div>

            <button
              type="button"
              onClick={addItemRow}
              className="inline-flex items-center gap-1.5 bg-brand-slateDark text-white hover:bg-slate-800 px-4 py-2 rounded-none text-xs font-bold uppercase tracking-wider transition-all shadow"
            >
              <Plus className="w-4 h-4 text-brand-amber" /> Add Line Item
            </button>
          </div>

          {/* Line Items Table */}
          <div className="overflow-x-auto border border-brand-sand">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-brand-slateDark text-white uppercase tracking-wider text-[11px]">
                  <th className="p-3 w-12 text-center">#</th>
                  <th className="p-3">Machine Description / Catalog Select</th>
                  <th className="p-3 w-28 text-center">HSN</th>
                  <th className="p-3 w-24 text-center">Qty</th>
                  <th className="p-3 w-36 text-right">Unit Price (₹)</th>
                  <th className="p-3 w-24 text-center">Disc %</th>
                  <th className="p-3 w-36 text-right">Total (₹)</th>
                  <th className="p-3 w-16 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-sand bg-white text-brand-slateDark font-semibold">
                {formData.items.map((item, index) => (
                  <tr key={index} className="hover:bg-stone-50 transition-colors">
                    <td className="p-3 text-center font-bold text-brand-slateDark">{index + 1}</td>
                    
                    <td className="p-3 space-y-2">
                      <select
                        value={item.productId || ""}
                        onChange={(e) => handleItemChange(index, "productId", e.target.value)}
                        className="w-full px-3 py-2 bg-stone-50 border border-brand-sand rounded-none text-xs text-brand-slateDark font-bold outline-none focus:border-brand-amber"
                      >
                        <option value="">-- Choose Machine from Catalog --</option>
                        {products.map((p) => (
                          <option key={p._id} value={p._id}>
                            {p.name || p.title} (₹{(p.appPrice || p.price || 0).toLocaleString("en-IN")})
                          </option>
                        ))}
                      </select>

                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleItemChange(index, "name", e.target.value)}
                        placeholder="Machine description or custom model"
                        className="w-full px-3 py-2 bg-white border border-brand-sand rounded-none text-xs text-brand-slateDark font-bold"
                      />
                    </td>

                    <td className="p-3 text-center">
                      <input
                        type="text"
                        value={item.hsnCode}
                        onChange={(e) => handleItemChange(index, "hsnCode", e.target.value)}
                        className="w-full px-2 py-2 bg-stone-50 border border-brand-sand text-center text-xs font-mono font-bold"
                      />
                    </td>

                    <td className="p-3 text-center">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                        className="w-full px-2 py-2 bg-stone-50 border border-brand-sand text-center text-xs font-bold"
                      />
                    </td>

                    <td className="p-3 text-right">
                      <input
                        type="number"
                        min="0"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(index, "unitPrice", e.target.value)}
                        className="w-full px-3 py-2 bg-stone-50 border border-brand-sand text-right text-xs font-mono font-bold text-brand-slateDark"
                      />
                    </td>

                    <td className="p-3 text-center">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={item.discountPercent}
                        onChange={(e) => handleItemChange(index, "discountPercent", e.target.value)}
                        className="w-full px-2 py-2 bg-stone-50 border border-brand-sand text-center text-xs font-bold text-orange-600"
                      />
                    </td>

                    <td className="p-3 text-right font-mono font-bold text-sm text-brand-slateDark">
                      ₹{item.totalAmount?.toLocaleString("en-IN")}
                    </td>

                    <td className="p-3 text-center">
                      <button
                        type="button"
                        onClick={() => removeItemRow(index)}
                        disabled={formData.items.length === 1}
                        className="p-2 text-slate-400 hover:text-red-600 transition-colors disabled:opacity-30"
                        title="Remove Line Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Terms & Calculations Summary */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Terms & Notes */}
          <div className="md:col-span-7 bg-brand-light p-6 md:p-8 rounded-none shadow border border-brand-sand space-y-4">
            <h2 className="text-sm font-bold text-brand-slateDark uppercase tracking-wider border-b border-brand-sand pb-3">
              4. Payment Terms & Bank Instructions
            </h2>

            <div>
              <label className="block text-xs font-bold text-brand-slateDark uppercase tracking-wider mb-2">
                Payment Terms
              </label>
              <textarea
                rows={2}
                value={formData.paymentTerms}
                onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                className="w-full px-4 py-3 bg-stone-50 border border-brand-sand rounded-none text-brand-slateDark text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-slateDark uppercase tracking-wider mb-2">
                Special Warranty & Note Instructions
              </label>
              <textarea
                rows={2}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-3 bg-stone-50 border border-brand-sand rounded-none text-brand-slateDark text-xs font-semibold"
              />
            </div>
          </div>

          {/* Financial Calculation Box */}
          <div className="md:col-span-5 bg-brand-slateDark text-white p-6 rounded-none shadow-xl border border-brand-amber/30 space-y-4">
            <h2 className="text-xs font-extrabold text-brand-amber uppercase tracking-widest border-b border-white/10 pb-2">
              5. Final Calculations
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center text-slate-300">
                <span className="font-bold">Subtotal (Taxable Value):</span>
                <span className="font-mono font-extrabold text-white text-sm">₹{formData.subtotal.toLocaleString("en-IN")}</span>
              </div>

              <div className="flex justify-between items-center gap-4">
                <span className="text-slate-300 font-bold">Freight & Pan-India Shipping:</span>
                <input
                  type="number"
                  min="0"
                  value={formData.freightCharges}
                  onChange={(e) => {
                    const freightVal = Number(e.target.value) || 0;
                    setFormData({ ...formData, freightCharges: freightVal });
                    recalculateTotals(formData.items, freightVal, formData.packagingCharges);
                  }}
                  className="w-28 bg-slate-950 border border-slate-700 rounded-none px-2 py-1 text-right font-mono text-xs text-white font-bold"
                />
              </div>

              {!formData.isInterstate ? (
                <>
                  <div className="flex justify-between text-slate-300 text-xs">
                    <span>CGST (9%):</span>
                    <span className="font-mono font-bold">₹{formData.cgstAmount.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-slate-300 text-xs pb-2 border-b border-white/10">
                    <span>SGST (9%):</span>
                    <span className="font-mono font-bold">₹{formData.sgstAmount.toLocaleString("en-IN")}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between text-slate-300 text-xs pb-2 border-b border-white/10">
                  <span>IGST (18% Inter-state):</span>
                  <span className="font-mono font-bold">₹{formData.igstAmount.toLocaleString("en-IN")}</span>
                </div>
              )}

              <div className="flex justify-between items-center text-brand-amber font-extrabold text-lg pt-1">
                <span>GRAND TOTAL:</span>
                <span className="font-mono">₹{formData.grandTotal.toLocaleString("en-IN")}</span>
              </div>

              <div className="pt-3 border-t border-white/10 space-y-2 text-xs">
                <div className="flex justify-between items-center text-emerald-400 font-bold">
                  <span>Advance Payment Payable (50%):</span>
                  <span className="font-mono text-sm font-extrabold">₹{formData.advancePayment.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Balance Due Before Dispatch:</span>
                  <span className="font-mono font-bold">₹{formData.balanceDue.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex justify-end gap-4 border-t border-brand-sand pt-6">
          <Link
            to="/admin/invoices"
            className="px-6 py-3 bg-brand-light border border-brand-sand text-brand-slateDark hover:bg-stone-100 rounded-none text-xs font-bold uppercase tracking-wider shadow-sm"
          >
            Cancel
          </Link>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, false)}
            disabled={saving}
            className="flex items-center gap-2 bg-brand-amber hover:bg-brand-slateDark hover:text-white text-brand-slateDark px-6 py-3 rounded-none text-xs font-bold uppercase tracking-wider transition-all shadow-md"
          >
            <Save className="w-4 h-4" /> {saving ? "Saving Invoice..." : "Save Proforma Invoice"}
          </button>
        </div>

        {/* Print Modal */}
        {showPrintModal && savedInvoiceData && (
          <InvoicePrintModal
            isOpen={showPrintModal}
            invoice={savedInvoiceData}
            onClose={() => setShowPrintModal(false)}
          />
        )}
      </div>
    </AdminLayout>
  );
}
