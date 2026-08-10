import { motion, AnimatePresence } from "framer-motion";
import { Printer, Share2, X } from "lucide-react";
import { numberToWords } from "../../utils/numberToWords";

export default function PurchaseOrderPrintModal({ po, isOpen, onClose }) {
  if (!isOpen || !po) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppShare = () => {
    const buyerName = po.buyerDetails?.companyName || po.buyerDetails?.dealerName || "Dealer";
    const total = po.financials?.grandTotal || po.totalAmount || 0;
    const text = `*CUSTOMER PURCHASE ORDER - DURGA MANUFACTURES*\n` +
      `PO No: ${po.poNumber}\n` +
      `Ref PI No: ${po.proformaInvoiceId?.invoiceNumber || "N/A"} (v${po.piVersionNumber || 1})\n` +
      `Date: ${new Date(po.poDate || po.createdAt).toLocaleDateString("en-IN")}\n` +
      `Dealer: ${buyerName}\n` +
      `Grand Total: ₹${total.toLocaleString("en-IN")}\n\n` +
      `Durga Manufactures - Rajkot, Gujarat. Support: +91 94281 56213`;
    
    const cleanPhone = (po.buyerDetails?.phone || "").replace(/\D/g, "");
    const targetPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const url = `https://wa.me/${targetPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const buyer = po.buyerDetails || {};
  const seller = po.sellerDetails || {};
  const fin = po.financials || {};
  const terms = po.commercialTerms || {};

  return (
    <AnimatePresence>
      <div 
        id="po-modal-backdrop"
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 md:p-6 overflow-y-auto"
      >
        {/* CSS Print Styles - Forced A4 Single Page Formatting */}
        <style>{`
          @media print {
            @page {
              size: A4 portrait;
              margin: 0;
            }
            html, body {
              height: 100% !important;
              overflow: hidden !important;
            }
            body * {
              visibility: hidden !important;
            }
            #po-modal-backdrop {
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              width: 100% !important;
              height: 100% !important;
              background: #ffffff !important;
              padding: 0 !important;
              margin: 0 !important;
              overflow: hidden !important;
              display: block !important;
            }
            #po-document, #po-document * {
              visibility: visible !important;
            }
            #po-document {
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              width: 210mm !important;
              height: 297mm !important;
              max-width: 210mm !important;
              max-height: 297mm !important;
              margin: 0 !important;
              padding: 8mm 12mm !important;
              box-shadow: none !important;
              border: none !important;
              border-radius: 0 !important;
              background: #ffffff !important;
              box-sizing: border-box !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              page-break-after: avoid !important;
              page-break-inside: avoid !important;
            }
            .grid-cols-2 {
              display: grid !important;
              grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            }
            .print-hidden {
              display: none !important;
            }
          }
        `}</style>

        {/* Top Header Buttons */}
        <div className="fixed top-4 right-4 z-[110] flex items-center gap-3 print-hidden">
          <button
            onClick={handleWhatsAppShare}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-bold text-xs shadow-lg transition-all"
          >
            <Share2 className="w-4 h-4" /> Share on WhatsApp
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-brand-amber hover:bg-amber-400 text-slate-950 px-4 py-2 rounded-lg font-bold text-xs shadow-lg transition-all"
          >
            <Printer className="w-4 h-4" /> Print / Save PO PDF
          </button>
          <button
            onClick={onClose}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PO Paper Document Container */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white text-slate-900 w-[210mm] max-w-full min-h-[297mm] h-[297mm] p-6 md:p-8 rounded-xl shadow-2xl my-auto overflow-hidden font-sans text-xs relative flex flex-col justify-between mx-auto"
          id="po-document"
        >
          {/* Background Watermark Logo - Tilted 45 Degrees */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.5] z-0 overflow-hidden">
            <img
              src="/millzon-watermark.png"
              alt="MillZon Watermark"
              className="w-[750px] max-w-none object-contain select-none transform -rotate-45"
            />
          </div>

          <div className="relative z-10 flex flex-col justify-between flex-1 space-y-3">
            {/* Top Header Section */}
            <div className="space-y-3">
              {/* Header Banner */}
              <div className="border-b-2 border-slate-900 pb-2.5">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <h1 className="font-serif text-xl md:text-2xl font-extrabold text-slate-900 tracking-wider uppercase">
                      DURGA MANUFACTURES
                    </h1>
                    <p className="text-slate-700 font-bold text-[11px] mt-0.5">
                      Commercial Food Processing Machinery Manufacturer
                    </p>
                    <p className="text-slate-600 text-[10px] mt-0.5 max-w-lg leading-tight font-medium">
                      {seller.address || "Plot No. A5, Shapar Main Road, Opp. Mahindra Gear, Decora Cement Campus, Shapar (Veraval) 360024, Rajkot, Gujarat, India."}
                    </p>
                    <div className="flex flex-wrap gap-3 text-[10px] text-slate-700 font-semibold mt-1.5">
                      <span><strong>Phone:</strong> {seller.phone || "+91 94281 56213"}</span>
                      <span><strong>Email:</strong> {seller.email || "durgamanufactures2010@gmail.com"}</span>
                      <span><strong>GSTIN:</strong> {seller.gstin || "24HMPT0206E1ZO"}</span>
                    </div>
                  </div>

                  <div className="text-right sm:text-right border-l-2 border-emerald-600 pl-3">
                    <span className="inline-block bg-emerald-950 text-emerald-400 font-bold px-2.5 py-0.5 text-xs tracking-widest uppercase mb-1">
                      PURCHASE ORDER
                    </span>
                    <div className="text-[11px] space-y-0.5">
                      <p><strong>PO No:</strong> <span className="font-mono text-slate-900 font-bold">{po.poNumber}</span></p>
                      <p><strong>PO Date:</strong> {new Date(po.poDate || po.createdAt).toLocaleDateString("en-IN")}</p>
                      <p><strong>Ref PI No:</strong> <span className="font-mono font-bold">{po.proformaInvoiceId?.invoiceNumber || "N/A"}</span></p>
                      <p><strong>Ref PI Version:</strong> Version {po.piVersionNumber || 1}</p>
                      <p><strong>Status:</strong> <span className="text-emerald-800 font-bold uppercase">{po.status}</span></p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer & Shipping Details Grid */}
              <div className="grid grid-cols-2 gap-3 bg-transparent border-2 border-slate-900 p-2.5 rounded-none text-[10.5px]">
                <div>
                  <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[10px] mb-1 border-b border-slate-900 pb-0.5">
                    Issued By (Dealer / Buyer):
                  </h3>
                  <p className="font-bold text-xs text-slate-900">{buyer.companyName || buyer.dealerName}</p>
                  {buyer.contactPerson && <p className="text-slate-800 font-bold">Attn: {buyer.contactPerson}</p>}
                  <p className="text-slate-700 whitespace-pre-line font-medium leading-tight">{buyer.billingAddress}</p>
                  <p className="text-slate-700 font-medium">{buyer.city}, {buyer.state}</p>
                  <p className="text-slate-800 font-bold mt-0.5">Phone: {buyer.phone} {buyer.email && `| Email: ${buyer.email}`}</p>
                  {buyer.gstin && <p className="text-slate-900 font-extrabold">GSTIN: {buyer.gstin}</p>}
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[10px] mb-1 border-b border-slate-900 pb-0.5">
                    Manufacturer / Seller Details:
                  </h3>
                  <p className="font-bold text-xs text-slate-900">{seller.companyName} (Brand: {seller.brand})</p>
                  <p className="text-slate-700 whitespace-pre-line font-medium leading-tight">{seller.address}</p>
                  <p className="text-slate-800 font-bold mt-0.5">GSTIN: <strong>{seller.gstin}</strong> | PAN: <strong>{seller.pan}</strong></p>
                  <p className="text-slate-800 font-bold">UDYAM NO: <strong>{seller.udyam}</strong></p>
                </div>
              </div>

              {/* Purchase Order Items Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border-2 border-slate-900 text-[10px]">
                  <thead>
                    <tr className="bg-slate-900 text-white uppercase tracking-wider text-[9.5px]">
                      <th className="border border-slate-900 p-1.5 text-center w-8">#</th>
                      <th className="border border-slate-900 p-1.5 text-left">Product / Machine Details</th>
                      <th className="border border-slate-900 p-1.5 text-center w-14">Model</th>
                      <th className="border border-slate-900 p-1.5 text-center w-12">Qty</th>
                      <th className="border border-slate-900 p-1.5 text-right w-20">Unit Price</th>
                      <th className="border border-slate-900 p-1.5 text-right w-20">Taxable</th>
                      <th className="border border-slate-900 p-1.5 text-center w-14">GST %</th>
                      <th className="border border-slate-900 p-1.5 text-right w-24">Total (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900 text-slate-900 font-semibold bg-transparent">
                    {(po.items || []).map((item, index) => (
                      <tr key={index} className="bg-transparent">
                        <td className="border border-slate-900 p-1.5 text-center font-bold">{index + 1}</td>
                        <td className="border border-slate-900 p-1.5 font-bold text-slate-900">
                          {item.name}
                          {item.description && <span className="text-[9px] text-slate-600 font-normal block">{item.description}</span>}
                        </td>
                        <td className="border border-slate-900 p-1.5 text-center font-mono font-bold">{item.model || "-"}</td>
                        <td className="border border-slate-900 p-1.5 text-center font-bold">{item.quantity}</td>
                        <td className="border border-slate-900 p-1.5 text-right font-mono font-bold">₹{item.unitPrice?.toLocaleString("en-IN")}</td>
                        <td className="border border-slate-900 p-1.5 text-right font-mono font-bold">₹{item.taxableAmount?.toLocaleString("en-IN")}</td>
                        <td className="border border-slate-900 p-1.5 text-center font-bold">{item.gstRate || 18}%</td>
                        <td className="border border-slate-900 p-1.5 text-right font-mono font-extrabold text-slate-900">
                          ₹{item.totalAmount?.toLocaleString("en-IN")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottom Financial & Terms Section */}
            <div className="mt-auto space-y-2.5 pt-2">
              <div className="grid grid-cols-2 gap-3 text-[10.5px]">
                {/* Left: Financial Summary & Amount in Words */}
                <div className="bg-transparent text-slate-900 p-2.5 rounded-none border-2 border-slate-900 flex flex-col justify-between space-y-2 font-semibold">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-emerald-800 font-bold border-b border-slate-900 pb-1">
                      <span>Advance Payable (50%):</span>
                      <span className="font-mono text-sm font-extrabold">₹{fin.advancePayment?.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-900 font-bold border-b border-slate-900 pb-1">
                      <span>Balance Due Before Dispatch:</span>
                      <span className="font-mono text-sm font-extrabold">₹{fin.balanceDue?.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                  <div className="pt-1.5 border-t border-slate-900 text-[10px] text-slate-900 italic leading-tight">
                    <strong className="text-red-700 not-italic uppercase font-extrabold">Amount in Words:</strong> {numberToWords(fin.grandTotal || po.totalAmount || 0)}
                  </div>
                </div>

                {/* Right: Subtotal, Charges, GST & Grand Total */}
                <div className="bg-transparent text-slate-900 p-2.5 rounded-none border-2 border-slate-900 space-y-1 text-[10.5px] font-semibold">
                  <div className="flex justify-between border-b border-slate-900 pb-0.5">
                    <span className="text-slate-900 font-bold">Subtotal (Taxable Value):</span>
                    <span className="font-mono font-bold">₹{fin.subtotal?.toLocaleString("en-IN")}</span>
                  </div>
                  {fin.freightCharges > 0 && (
                    <div className="flex justify-between border-b border-slate-900 pb-0.5">
                      <span className="text-slate-900 font-bold">Freight & Delivery:</span>
                      <span className="font-mono font-bold">₹{fin.freightCharges?.toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  {fin.packagingCharges > 0 && (
                    <div className="flex justify-between border-b border-slate-900 pb-0.5">
                      <span className="text-slate-900 font-bold">Packaging & Crating:</span>
                      <span className="font-mono font-bold">₹{fin.packagingCharges?.toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  {!fin.isInterstate ? (
                    <>
                      <div className="flex justify-between text-slate-900 font-bold">
                        <span>CGST (9%):</span>
                        <span className="font-mono font-bold">₹{fin.cgstAmount?.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex justify-between text-slate-900 font-bold border-b border-slate-900 pb-0.5">
                        <span>SGST (9%):</span>
                        <span className="font-mono font-bold">₹{fin.sgstAmount?.toLocaleString("en-IN")}</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between text-slate-900 font-bold border-b border-slate-900 pb-0.5">
                      <span>IGST (18%):</span>
                      <span className="font-mono font-bold">₹{fin.igstAmount?.toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-900 font-extrabold text-sm pt-0.5 border-t border-slate-900">
                    <span>GRAND TOTAL:</span>
                    <span className="font-mono text-slate-900 font-extrabold">₹{(fin.grandTotal || po.totalAmount)?.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>

              {/* Commercial Terms & Conditions */}
              <div className="border-2 border-slate-900 p-2 text-[9.5px] font-semibold space-y-0.5">
                <p className="font-extrabold text-red-600 uppercase border-b border-slate-900 pb-0.5">
                  COMMERCIAL TERMS & ORDER AGREEMENT:
                </p>
                <p>1. Payment: {terms.paymentTerms || "50% Advance, 50% before dispatch."}</p>
                <p>2. Delivery: {terms.deliveryTerms || "Ex-factory Rajkot."} | Freight: {terms.freightTerms || "On customer."}</p>
                <p>3. Warranty: {terms.warrantyTerms || "1 Year Warranty."} | Electrical fittings: {terms.installationTerms || "On customer."}</p>
                {terms.otherTerms && <p>4. Special Notes: {terms.otherTerms}</p>}
              </div>

              {/* DUAL SIGNATURE BOX (Mandatory PDF Specification Requirements) */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t-2 border-slate-900 text-[10px]">
                {/* Left: Dealer / Buyer Authorized Signatory & Stamp Box (As per Page 9 of PDF) */}
                <div className="border-2 border-slate-900 p-2.5 space-y-1 bg-transparent">
                  <p className="font-extrabold text-slate-900 border-b border-slate-900 pb-0.5 uppercase">
                    Authorized Signatory (Dealer / Buyer)
                  </p>
                  <p className="text-slate-800 pt-1">Signature: ________________________</p>
                  <div className="my-1.5 flex items-center justify-between border border-dashed border-slate-400 p-2 rounded">
                    <span className="text-slate-500 font-bold">Company Stamp:</span>
                    <span className="text-slate-400 text-xs">[ STAMP HERE ]</span>
                  </div>
                  <p className="text-slate-800">Date: _____________________________</p>
                </div>

                {/* Right: Durga Manufactures Authorized Signatory */}
                <div className="border-2 border-slate-900 p-2.5 flex flex-col justify-between text-center bg-transparent">
                  <p className="font-extrabold text-slate-900 border-b border-slate-900 pb-0.5 uppercase text-left">
                    For DURGA MANUFACTURES
                  </p>
                  <div className="h-10 flex items-center justify-center my-1">
                    <img
                      src="/signature.jpg"
                      alt="Authorized Signatory"
                      className="h-10 object-contain mix-blend-multiply"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 border-t border-slate-900 pt-0.5">
                      DURGA MANUFACTURES
                    </p>
                    <p className="text-[9px] text-slate-600 font-bold uppercase">Authorized Signatory</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
