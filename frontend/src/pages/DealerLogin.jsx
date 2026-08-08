import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Building2, User, Mail, Lock, Phone, MapPin, FileText, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle, Search, X } from "lucide-react";
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

function DealerLogin() {
  const [activeTab, setActiveTab] = useState("login"); // "login" | "register"
  const [loading, setLoading] = useState(false);
  const [fetchingGst, setFetchingGst] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [gstModal, setGstModal] = useState({ isOpen: false, title: "", message: "" });

  const handleGstLookup = async (gstinVal) => {
    const cleanGst = (gstinVal || regData.gstNumber).trim().toUpperCase();
    if (!cleanGst) {
      setGstModal({
        isOpen: true,
        title: "GST Number Required",
        message: "Please enter a GSTIN number before searching."
      });
      return;
    }

    setFetchingGst(true);
    setErrorMessage("");
    try {
      const res = await axios.get(`${API_BASE}/dealers/gst-lookup/${cleanGst}`);
      const data = res.data.data || res.data;
      if (data && (data.companyName || data.state || data.address)) {
        setRegData(prev => ({
          ...prev,
          gstNumber: cleanGst,
          companyName: data.companyName || prev.companyName,
          contactPerson: data.contactPerson && !prev.contactPerson ? data.contactPerson : prev.contactPerson,
          city: data.city || prev.city,
          state: data.state || prev.state,
          address: data.address || prev.address,
        }));
        setSuccessMessage("⚡ Company details fetched and auto-filled!");
        setTimeout(() => setSuccessMessage(""), 4000);
      } else {
        setGstModal({
          isOpen: true,
          title: "GSTIN Not Found",
          message: res.data.error || "The GSTIN entered could not be found on the Government GST Portal. Please verify the number for typos."
        });
      }
    } catch (err) {
      console.error("EXACT GST FETCH ERROR IN BROWSER CONSOLE:", {
        status: err.response?.status,
        data: err.response?.data,
        error: err.response?.data?.error || err.response?.data?.message,
        message: err.message,
        fullErrorObject: err
      });
      const errMsg = err.response?.data?.error || err.response?.data?.message || err.message || "GSTIN not found or invalid on Government GST Network. Please verify the number.";
      setGstModal({
        isOpen: true,
        title: "Invalid GSTIN Number",
        message: errMsg
      });
    } finally {
      setFetchingGst(false);
    }
  };

  const navigate = useNavigate();

  // Login form state
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  // Register form state
  const [regData, setRegData] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    password: "",
    phone: "",
    gstNumber: "",
    address: "",
    city: "",
    state: ""
  });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/dealers/login`, loginData);
      if (res.data.success) {
        localStorage.setItem("dealerToken", res.data.token);
        localStorage.setItem("dealerInfo", JSON.stringify(res.data.dealer));
        navigate("/dealer/dashboard");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(
        err.response?.data?.message || "Invalid credentials or login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/dealers/register`, regData);
      if (res.data.success) {
        setSuccessMessage(res.data.message);
        setRegData({
          companyName: "",
          contactPerson: "",
          email: "",
          password: "",
          phone: "",
          gstNumber: "",
          address: "",
          city: "",
          state: ""
        });
        setTimeout(() => setActiveTab("login"), 4000);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(
        err.response?.data?.message || "Failed to submit dealership request. Please check inputs."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow flex items-center justify-center px-4 py-12 relative overflow-hidden">
        {/* Background Decorative Gradients */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-brand-amber/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl w-full grid md:grid-cols-12 gap-8 items-stretch relative z-10">
          
          {/* Side Info Panel */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="md:col-span-5 bg-gradient-to-br from-brand-slateDark via-slate-900 to-slate-950 border border-amber-500/20 p-8 flex flex-col justify-between"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-brand-amber text-xs font-bold uppercase tracking-wider mb-6">
                <ShieldCheck className="w-4 h-4" /> B2B Dealer Portal
              </div>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-4 leading-tight">
                Empowering Machinery Partners Worldwide
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-8">
                Access exclusive dealer wholesale pricing, check machine availability, submit bulk quotation requests, and download technical manuals.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-amber shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-white text-xs font-bold uppercase tracking-wider">Tiered Wholesale Pricing</h4>
                    <p className="text-slate-400 text-xs">Custom margins & discount rates for Silver, Gold, and Platinum dealers.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-amber shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-white text-xs font-bold uppercase tracking-wider">Direct Order Tracking</h4>
                    <p className="text-slate-400 text-xs">Track dispatch status from Rajkot factory to your location in real time.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-amber shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-white text-xs font-bold uppercase tracking-wider">Technical Resource Library</h4>
                    <p className="text-slate-400 text-xs">Download high-res brochures, specification sheets, and certificates.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800 text-xs text-slate-500">
              Need assistance? Call factory desk: <span className="text-brand-amber font-bold">+91 94281 56213</span>
            </div>
          </motion.div>

          {/* Form Panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="md:col-span-7 bg-slate-900/90 backdrop-blur-xl border border-slate-800 p-6 md:p-8 flex flex-col justify-center"
          >
            {/* Tabs */}
            <div className="flex border-b border-slate-800 mb-6">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("login");
                  setErrorMessage("");
                  setSuccessMessage("");
                }}
                className={`flex-1 py-3 text-center text-xs font-bold uppercase tracking-widest transition-all border-b-2 ${
                  activeTab === "login"
                    ? "border-brand-amber text-brand-amber"
                    : "border-transparent text-slate-400 hover:text-white"
                }`}
              >
                Dealer Login
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("register");
                  setErrorMessage("");
                  setSuccessMessage("");
                }}
                className={`flex-1 py-3 text-center text-xs font-bold uppercase tracking-widest transition-all border-b-2 ${
                  activeTab === "register"
                    ? "border-brand-amber text-brand-amber"
                    : "border-transparent text-slate-400 hover:text-white"
                }`}
              >
                Apply Dealership
              </button>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-none flex items-start gap-2"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </motion.div>
            )}

            {/* Success Message */}
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-none flex items-start gap-2"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </motion.div>
            )}

            {/* Login Form */}
            {activeTab === "login" && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                    Dealer Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      required
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      placeholder="dealer@company.com"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-brand-amber px-10 py-3 text-sm text-white focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                    <input
                      type="password"
                      required
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-brand-amber px-10 py-3 text-sm text-white focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 bg-brand-amber hover:bg-amber-400 text-slate-950 py-3 font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-amber/20 disabled:opacity-50"
                >
                  {loading ? "Authenticating..." : "Sign In to Dealer Portal"}
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab("register")}
                    className="text-xs text-brand-amber hover:underline font-semibold"
                  >
                    Don't have a dealer account? Apply here
                  </button>
                </div>
              </form>
            )}

            {/* Register Form */}
            {activeTab === "register" && (
              <form onSubmit={handleRegisterSubmit} className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                      Company / Business Name *
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        required
                        value={regData.companyName}
                        onChange={(e) => setRegData({ ...regData, companyName: e.target.value })}
                        placeholder="Rajkot Agro Traders"
                        className="w-full bg-slate-950 border border-slate-800 focus:border-brand-amber pl-9 pr-3 py-2 text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                      Contact Person Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        required
                        value={regData.contactPerson}
                        onChange={(e) => setRegData({ ...regData, contactPerson: e.target.value })}
                        placeholder="Rajesh Patel"
                        className="w-full bg-slate-950 border border-slate-800 focus:border-brand-amber pl-9 pr-3 py-2 text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                      <input
                        type="email"
                        required
                        value={regData.email}
                        onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                        placeholder="rajesh@agrotraders.com"
                        className="w-full bg-slate-950 border border-slate-800 focus:border-brand-amber pl-9 pr-3 py-2 text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                      <input
                        type="tel"
                        required
                        value={regData.phone}
                        onChange={(e) => setRegData({ ...regData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full bg-slate-950 border border-slate-800 focus:border-brand-amber pl-9 pr-3 py-2 text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type="password"
                      required
                      value={regData.password}
                      onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                      placeholder="Create strong password"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-brand-amber pl-9 pr-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* SEPARATE DEDICATED ROW FOR GST NUMBER */}
                <div className="pt-1">
                  <label className="block text-[11px] font-bold uppercase text-brand-amber mb-1">
                    GST Number (Auto-Fill Company Details)
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <FileText className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        value={regData.gstNumber}
                        onChange={(e) => {
                          const val = e.target.value.toUpperCase();
                          setRegData({ ...regData, gstNumber: val });
                        }}
                        placeholder="24AAAAA0000A1Z5"
                        className="w-full bg-slate-950 border border-slate-800 focus:border-brand-amber pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none uppercase tracking-wider font-mono"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleGstLookup(regData.gstNumber)}
                      disabled={fetchingGst}
                      className="bg-brand-amber hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 text-xs rounded flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-md shadow-brand-amber/20"
                      title="Click search to fetch GSTIN company details"
                    >
                      {fetchingGst ? (
                        <span className="animate-pulse text-[11px]">Searching...</span>
                      ) : (
                        <>
                          <Search className="w-4 h-4 text-slate-950" />
                          <span>Search GST</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* City & State Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">City</label>
                    <input
                      type="text"
                      value={regData.city}
                      onChange={(e) => setRegData({ ...regData, city: e.target.value })}
                      placeholder="Rajkot"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-brand-amber px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">State</label>
                    <input
                      type="text"
                      value={regData.state}
                      onChange={(e) => setRegData({ ...regData, state: e.target.value })}
                      placeholder="Gujarat"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-brand-amber px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* SEPARATE FULL-WIDTH BOX FOR ADDRESS */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Factory / Business Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                    <textarea
                      rows={2}
                      value={regData.address}
                      onChange={(e) => setRegData({ ...regData, address: e.target.value })}
                      placeholder="Plot No 12, GIDC Industrial Estate, Near National Highway, Rajkot, Gujarat"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-brand-amber pl-9 pr-3 py-2 text-xs text-white focus:outline-none resize-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 bg-brand-amber hover:bg-amber-400 text-slate-950 py-3 font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-amber/20 disabled:opacity-50"
                >
                  {loading ? "Submitting Application..." : "Submit Dealership Application"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </main>

      {/* INVALID GST POPUP MODAL */}
      {gstModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            className="bg-slate-900 border border-red-500/40 rounded-xl p-6 max-w-md w-full shadow-2xl shadow-red-950/60 text-white relative overflow-hidden"
          >
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center shrink-0">
                <AlertCircle className="w-6 h-6 text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-black text-white tracking-tight uppercase mb-1">
                  {gstModal.title || "Invalid GST Number"}
                </h3>
                <div className="h-0.5 w-10 bg-red-500 rounded mb-2" />
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {gstModal.message}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setGstModal({ isOpen: false, title: "", message: "" })}
                className="text-slate-400 hover:text-white transition-colors p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setGstModal({ isOpen: false, title: "", message: "" })}
              className="w-full mt-3 bg-red-600 hover:bg-red-500 text-white font-bold py-2.5 px-4 rounded-lg text-xs uppercase tracking-wider transition-all shadow-lg shadow-red-600/30 cursor-pointer"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default DealerLogin;
