import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  Settings, 
  FileText, 
  Truck, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  X, 
  HelpCircle,
  ChevronRight
} from "lucide-react";

export default function WorkflowGuideModal({ isOpen, onClose }) {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      number: "01",
      tag: "Verification & Onboarding",
      title: "Register with GSTIN & Admin Approval",
      subtitle: "Instant Tax Verification & Custom Wholesale Tier Assignment",
      icon: ShieldCheck,
      color: "amber",
      badge: "Statutory Compliant",
      accentBg: "bg-amber-500/10",
      accentBorder: "border-amber-500/30",
      accentText: "text-amber-400",
      activeTabClass: "border-amber-500 text-amber-400 bg-amber-500/10",
      summary: "Every dealer account is verified via their 15-digit GSTIN number to ensure tax compliance and genuine B2B dealership eligibility.",
      points: [
        "Enter your 15-digit GSTIN with live State Code and PAN verification.",
        "Automatic State detection (from 38 Indian States/UTs) & Luhn Mod 36 checksum calculation.",
        "Durga Manufactures factory admin reviews credentials and activates wholesale tier discount slabs.",
        "Instant confirmation via WhatsApp, email, and portal notification upon approval."
      ]
    },
    {
      number: "02",
      tag: "Machinery Catalog",
      title: "Explore Factory-Direct Industrial Machines",
      subtitle: "Heavy Duty Sheet Metal & Workshop Equipment from Rajkot",
      icon: Settings,
      color: "blue",
      badge: "Direct from Rajkot",
      accentBg: "bg-blue-500/10",
      accentBorder: "border-blue-500/30",
      accentText: "text-blue-400",
      activeTabClass: "border-blue-500 text-blue-400 bg-blue-500/10",
      summary: "Browse our comprehensive machinery line with full mechanical specifications, electrical options, and factory operational videos.",
      points: [
        "Full catalogue of Hydraulic Shearing, Press Brake, Power Press & Lathe machines.",
        "Inspect plate thickness capacities, cutting lengths, motor HP, and blade specs.",
        "Watch live factory floor video demonstrations directly inside each product page.",
        "Real-time tier-adjusted wholesale pricing tailored specifically to your dealership account."
      ]
    },
    {
      number: "03",
      tag: "Instant Quotation",
      title: "Generate Official Proforma Invoice (PI)",
      subtitle: "Live 18% GST Breakdown & Statutory Digital PDF Delivery",
      icon: FileText,
      color: "emerald",
      badge: "Tax-Compliant PDF",
      accentBg: "bg-emerald-500/10",
      accentBorder: "border-emerald-500/30",
      accentText: "text-emerald-400",
      activeTabClass: "border-emerald-500 text-emerald-400 bg-emerald-500/10",
      summary: "Configure custom machine options, calculate transparent taxes and transit charges, and download instant statutory Proforma Invoices.",
      points: [
        "Add machines to your dealer cart with customized electricals and tooling requirements.",
        "Live 18% GST calculation: CGST + SGST (within Gujarat) or IGST (interstate deliveries).",
        "Transparent breakdown of machine base price, packaging, and freight transit charges.",
        "Download high-resolution official statutory PDF PI with embedded QR code & bank details."
      ]
    },
    {
      number: "04",
      tag: "Fulfillment & Dispatch",
      title: "Upload Signed PO & Track Factory Dispatch",
      subtitle: "End-to-End Production Tracking to Site Delivery",
      icon: Truck,
      color: "purple",
      badge: "Rajkot Dispatch",
      accentBg: "bg-purple-500/10",
      accentBorder: "border-purple-500/30",
      accentText: "text-purple-400",
      activeTabClass: "border-purple-500 text-purple-400 bg-purple-500/10",
      summary: "Confirm orders with one click, upload authorized purchase orders directly to cloud storage, and track factory production to dispatch.",
      points: [
        "Sign and stamp the generated Proforma Invoice or your company Purchase Order (PO).",
        "Upload directly inside the portal (securely archived in cloud storage).",
        "Live order status: Inquiry ➔ Proforma Invoice ➔ Production ➔ Pre-dispatch QC.",
        "Direct factory dispatch from Rajkot with transporter LR receipt and tracking."
      ]
    }
  ];

  if (!isOpen) return null;

  const current = steps[activeStep];
  const StepIcon = current.icon;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative bg-slate-900 border border-slate-700/60 rounded-2xl w-full max-w-3xl shadow-2xl text-white overflow-hidden my-auto"
        >
          {/* Header Bar */}
          <div className="bg-slate-950/80 border-b border-slate-800 px-5 sm:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-brand-amber/15 border border-brand-amber/40 flex items-center justify-center text-brand-amber">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-white tracking-wide uppercase flex items-center gap-2">
                  How App & Portal Work
                  <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold bg-brand-amber/20 text-brand-amber border border-brand-amber/30 rounded-full">
                    4-Step B2B Workflow
                  </span>
                </h2>
                <p className="text-[11px] text-slate-400">
                  End-to-End Industrial Machinery Procurement Pipeline
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              title="Close Guide"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 4 Steps Horizontal Tab Bar */}
          <div className="grid grid-cols-4 border-b border-slate-800 bg-slate-950/50">
            {steps.map((s, idx) => {
              const isCurrent = idx === activeStep;
              const isPast = idx < activeStep;
              return (
                <button
                  key={s.number}
                  onClick={() => setActiveStep(idx)}
                  className={`py-3 px-2 text-center transition-all border-b-2 flex flex-col items-center justify-center gap-1 ${
                    isCurrent
                      ? s.activeTabClass
                      : isPast
                      ? "border-emerald-500/60 text-slate-300 hover:bg-slate-800/40"
                      : "border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-800/20"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    {isPast ? (
                      <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center text-[9px] font-bold">
                        ✓
                      </span>
                    ) : (
                      <span className={`text-[10px] font-mono font-bold ${isCurrent ? "opacity-100" : "opacity-60"}`}>
                        {s.number}
                      </span>
                    )}
                    <span className="text-[11px] font-bold hidden md:inline truncate">
                      {s.tag}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Step Content Body */}
          <div className="p-5 sm:p-7 space-y-5">
            {/* Step Banner Card */}
            <div className={`p-5 rounded-xl border ${current.accentBorder} ${current.accentBg} relative overflow-hidden transition-all duration-300`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className={`w-12 h-12 rounded-xl bg-slate-900/80 border ${current.accentBorder} flex items-center justify-center ${current.accentText} shrink-0`}>
                    <StepIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <span className={`text-[10px] font-bold tracking-widest uppercase ${current.accentText}`}>
                      STEP {current.number} • {current.tag}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                      {current.title}
                    </h3>
                    <p className="text-xs text-slate-300 mt-0.5">
                      {current.subtitle}
                    </p>
                  </div>
                </div>

                <span className={`hidden sm:inline-block px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${current.accentBorder} ${current.accentText} bg-slate-900/60`}>
                  {current.badge}
                </span>
              </div>
            </div>

            {/* Stage Description & Checklist */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-3">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <span>Key Stage Deliverables</span>
                <span className="h-px flex-1 bg-slate-800" />
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {current.points.map((pt, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-900/50 border border-slate-800/80">
                    <div className={`mt-0.5 w-4 h-4 rounded-full ${current.accentBg} ${current.accentText} border ${current.accentBorder} flex items-center justify-center shrink-0`}>
                      <Check className="w-2.5 h-2.5" />
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      {pt}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Complete Pipeline Progress Bar */}
            <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl px-4 py-3 flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-2 text-slate-400">
                <span className="font-bold text-white">Full Flow:</span>
                <span className={activeStep === 0 ? "text-amber-400 font-bold" : "text-slate-400"}>01. Register</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                <span className={activeStep === 1 ? "text-blue-400 font-bold" : "text-slate-400"}>02. Catalog</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                <span className={activeStep === 2 ? "text-emerald-400 font-bold" : "text-slate-400"}>03. PI Invoice</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                <span className={activeStep === 3 ? "text-purple-400 font-bold" : "text-slate-400"}>04. Dispatch</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                Step {activeStep + 1} of 4
              </span>
            </div>
          </div>

          {/* Footer Navigation Buttons */}
          <div className="bg-slate-950 border-t border-slate-800 px-5 sm:px-6 py-3.5 flex items-center justify-between">
            <button
              onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
              disabled={activeStep === 0}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Previous
            </button>

            <div className="flex items-center gap-3">
              {activeStep < steps.length - 1 ? (
                <button
                  onClick={() => setActiveStep(activeStep + 1)}
                  className="px-5 py-2.5 rounded-lg bg-brand-amber hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-brand-amber/20 transition-all"
                >
                  Next: {steps[activeStep + 1].tag}
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-lg bg-brand-amber hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-brand-amber/20 transition-all"
                >
                  Got It • Close Guide
                  <Check className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
