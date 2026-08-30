import { motion } from "framer-motion";
import { ShieldCheck, Lock as LockIcon, FileText, Building2, Mail, Phone, MapPin, Eye, CheckCircle2 } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function PrivacyPolicy() {
  const lastUpdated = "August 2026";

  return (
    <div className="min-h-screen bg-brand-slateDark text-white flex flex-col selection:bg-brand-amber selection:text-brand-slateDark">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Badge & Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4 mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-amber/10 border border-brand-amber/30 text-brand-amber text-xs font-bold uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4" />
            Official Durga Manufactures Policy
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight">
            Privacy Policy & Data Security
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Protecting your business credentials, GST records, quotation requests, and commercial transaction details across our B2B manufacturing and dealership platform.
          </p>
          <div className="text-xs text-slate-500 font-semibold tracking-wider uppercase">
            Effective Date: {lastUpdated} | Rajkot, Gujarat (India)
          </div>
        </motion.div>

        {/* Content Sections */}
        <div className="space-y-8 text-sm sm:text-base leading-relaxed text-slate-300">
          {/* Section 1 */}
          <motion.section
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 sm:p-8 space-y-4 shadow-xl"
          >
            <div className="flex items-center gap-3 text-brand-amber font-bold text-lg">
              <Building2 className="w-5 h-5 text-brand-amber" />
              <h2>1. Introduction & Scope of Business</h2>
            </div>
            <p>
              <strong>Durga Manufactures</strong> (&quot;Company&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), operating under the brand name <strong>Millzon</strong>, is an engineering enterprise headquartered in Shapar (Veraval), Rajkot, Gujarat, specializing in commercial food processing machinery, pulverizers, hammer mills, spices grinding plants, grading machines, and industrial equipment.
            </p>
            <p>
              This Privacy Policy explains how we collect, process, store, and safeguard data when authorized dealers, suppliers, industrial buyers, and website visitors use our website, dealer portal, quotation engine, and mobile applications.
            </p>
          </motion.section>

          {/* Section 2 */}
          <motion.section
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 sm:p-8 space-y-4 shadow-xl"
          >
            <div className="flex items-center gap-3 text-brand-amber font-bold text-lg">
              <FileText className="w-5 h-5 text-brand-amber" />
              <h2>2. Information We Collect</h2>
            </div>
            <p>To facilitate wholesale dealership operations, custom manufacturing quotations, and tax-compliant invoicing, we collect:</p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {[
                "Business Legal Name & Trade Name",
                "Authorized Contact Person & Designation",
                "Official Mobile Number & WhatsApp Contact",
                "Corporate Email Address",
                "GSTIN & State Tax Registration Number",
                "Factory / Billing / Dispatch Warehouse Address",
                "Machine Specifications & Inquiry Requests",
                "Proforma Invoices & Signed Purchase Orders (PO)"
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 bg-slate-950/50 p-3 rounded-lg border border-slate-800/80">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-slate-200">{item}</span>
                </li>
              ))}
            </ul>
          </motion.section>

          {/* Section 3 */}
          <motion.section
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 sm:p-8 space-y-4 shadow-xl"
          >
            <div className="flex items-center gap-3 text-brand-amber font-bold text-lg">
              <Eye className="w-5 h-5 text-brand-amber" />
              <h2>3. How We Use Your Information</h2>
            </div>
            <p>We utilize the collected commercial information strictly for business workflow execution:</p>
            <ul className="list-disc list-inside space-y-2 text-slate-300 text-xs sm:text-sm pl-2">
              <li><strong>Verification & Onboarding:</strong> Verifying authorized machinery dealers and assigning wholesale discount slabs.</li>
              <li><strong>Quotation & Invoicing:</strong> Generating official Proforma Invoices (PI) with HSN codes, split billing, and GST calculations.</li>
              <li><strong>Order Fulfillment & Dispatch:</strong> Manufacturing scheduling, serial allocation, testing, and factory dispatch from Rajkot.</li>
              <li><strong>Legal & Audit Compliance:</strong> Preserving signed and stamped Purchase Orders (PO) for statutory audit and GST E-way bills.</li>
              <li><strong>Factory Warranty & After-Sales:</strong> Providing 6-month limited motor warranty support, genuine spare parts (Jali, Beaters), and factory maintenance.</li>
            </ul>
          </motion.section>

          {/* Section 4 */}
          <motion.section
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 sm:p-8 space-y-4 shadow-xl"
          >
            <div className="flex items-center gap-3 text-brand-amber font-bold text-lg">
              <LockIcon className="w-5 h-5 text-brand-amber" />
              <h2>4. Data Protection & Confidentiality Commitment</h2>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-lg text-emerald-300 text-xs sm:text-sm">
              <strong>Zero Third-Party Selling Policy:</strong> Durga Manufactures does not sell, rent, lease, or monetize dealer contact details, pricing negotiations, or commercial data to any external advertising network or third party.
            </div>
            <p>
              All customer and dealer database records are encrypted and protected behind authentication middleware with role-based access control (Admin and Verified Dealer level).
            </p>
          </motion.section>

          {/* Section 5 */}
          <motion.section
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 sm:p-8 space-y-4 shadow-xl"
          >
            <div className="flex items-center gap-3 text-brand-amber font-bold text-lg">
              <Building2 className="w-5 h-5 text-brand-amber" />
              <h2>5. Contact Factory Compliance Officer</h2>
            </div>
            <p>For any questions regarding our Privacy Policy, data corrections, or dealer profile security:</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs sm:text-sm">
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-1">
                <MapPin className="w-4 h-4 text-brand-amber mb-1" />
                <span className="font-bold text-white block">Works Address</span>
                <span className="text-slate-400">Plot A5, Shapar Main Rd, Opp. Mahindra Gear, Rajkot, Gujarat 360024</span>
              </div>
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-1">
                <Phone className="w-4 h-4 text-brand-amber mb-1" />
                <span className="font-bold text-white block">Factory Helpline</span>
                <span className="text-slate-400">+91 94281 56213 / +91 98258 70821</span>
              </div>
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-1">
                <Mail className="w-4 h-4 text-brand-amber mb-1" />
                <span className="font-bold text-white block">Official Email</span>
                <span className="text-slate-400">durgamanufactures2010@gmail.com</span>
              </div>
            </div>
          </motion.section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
