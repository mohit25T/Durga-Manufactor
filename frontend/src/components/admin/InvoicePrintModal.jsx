import { motion, AnimatePresence } from "framer-motion";
import { Printer, Download, Share2, X, Phone, Mail, MapPin, Building2, CheckCircle2 } from "lucide-react";
import { numberToWords } from "../../utils/numberToWords";

export default function InvoicePrintModal({ invoice, isOpen, onClose }) {
  if (!isOpen || !invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppShare = () => {
    const text = `*PROFORMA INVOICE - DURGA MANUFACTURES*\n` +
      `Invoice No: ${invoice.invoiceNumber}\n` +
      `Date: ${new Date(invoice.invoiceDate).toLocaleDateString("en-IN")}\n` +
      `Customer: ${invoice.companyName || invoice.customerName}\n` +
      `Grand Total: ₹${invoice.grandTotal?.toLocaleString("en-IN")}\n` +
      `Advance Payable: ₹${invoice.advancePayment?.toLocaleString("en-IN")}\n\n` +
      `Thank you for choosing Durga Manufactures! Call +91 94281 56213 for support.`;
    
    const cleanPhone = (invoice.phone || "").replace(/\D/g, "");
    const targetPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const url = `https://wa.me/${targetPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const isGujarat = (invoice.state || "Gujarat").trim().toLowerCase() === "gujarat" || !invoice.isInterstate;

  return (
    <AnimatePresence>
      <div 
        id="invoice-modal-backdrop"
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 md:p-6 overflow-y-auto"
      >
        {/* CSS Print Styles - Forced 1-Page A4 Portrait Formatting */}
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
            #invoice-modal-backdrop {
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
            #invoice-document, #invoice-document * {
              visibility: visible !important;
            }
            #invoice-document {
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

        {/* Action Header Bar for Modal */}
        <div className="fixed top-4 right-4 z-[110] flex items-center gap-3 print-hidden">
          <button
            onClick={handleWhatsAppShare}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-bold text-xs shadow-lg transition-all"
          >
            <Share2 className="w-4 h-4" /> Share on WhatsApp
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-brand-amber hover:bg-white text-slate-950 px-4 py-2 rounded-lg font-bold text-xs shadow-lg transition-all"
          >
            <Printer className="w-4 h-4" /> Print / Save as PDF
          </button>
          <button
            onClick={onClose}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Invoice Paper Document Container - Single Page Layout */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white text-slate-900 w-[210mm] max-w-full min-h-[297mm] h-[297mm] p-6 md:p-8 rounded-xl shadow-2xl my-auto overflow-hidden font-sans text-xs relative flex flex-col justify-between mx-auto"
          id="invoice-document"
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
            {/* Top Section: Header + Customer Info + Line Items Table */}
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
                      Plot No. A5, Shapar Main Road, Opp. Mahindra Gear, Decora Cement Campus, Shapar (Veraval) 360024, Rajkot, Gujarat, India.
                    </p>
                    <div className="flex flex-wrap gap-3 text-[10px] text-slate-700 font-semibold mt-1.5">
                      <span><strong>Phone:</strong> +91 94281 56213, +91 98258 70821</span>
                      <span><strong>Email:</strong> durgamanufactures2010@gmail.com</span>
                      <span><strong>GST NO. :</strong> 24HMPT0206E1ZO</span>
                      <span><strong>UDYAM NO:</strong> GJ-20-0130533</span>
                    </div>
                  </div>

                  <div className="text-right sm:text-right border-l-2 border-amber-500 pl-3">
                    <span className="inline-block bg-slate-900 text-amber-400 font-bold px-2.5 py-0.5 text-xs tracking-widest uppercase mb-1">
                      PROFORMA INVOICE
                    </span>
                    <div className="text-[11px] space-y-0.5">
                      <p><strong>Invoice No:</strong> <span className="font-mono text-slate-900 font-bold">{invoice.invoiceNumber}</span></p>
                      <p><strong>Date:</strong> {new Date(invoice.invoiceDate).toLocaleDateString("en-IN")}</p>
                      <p><strong>Valid Until:</strong> {new Date(invoice.validUntil).toLocaleDateString("en-IN")}</p>
                      <p><strong>Status:</strong> <span className="text-emerald-800 font-bold uppercase">{invoice.status}</span></p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Details Grid */}
              <div className="grid grid-cols-2 gap-3 bg-transparent border-2 border-slate-900 p-2.5 rounded-none text-[10.5px]">
                <div>
                  <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[10px] mb-1 border-b border-slate-900 pb-0.5">
                    Billed To (Customer / Dealer):
                  </h3>
                  <p className="font-bold text-xs text-slate-900">{invoice.companyName || invoice.customerName}</p>
                  {invoice.companyName && <p className="text-slate-800 font-bold">Attn: {invoice.customerName}</p>}
                  <p className="text-slate-700 whitespace-pre-line font-medium leading-tight">{invoice.billingAddress}</p>
                  <p className="text-slate-700 font-medium">{invoice.city}, {invoice.state} {invoice.pincode}</p>
                  <p className="text-slate-800 font-bold mt-0.5">Phone: {invoice.phone} {invoice.email && `| Email: ${invoice.email}`}</p>
                  {invoice.gstNumber && <p className="text-slate-900 font-extrabold">GSTIN: {invoice.gstNumber}</p>}
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[10px] mb-1 border-b border-slate-900 pb-0.5">
                    Shipped To (Dispatch Destination):
                  </h3>
                  <p className="font-bold text-xs text-slate-900">{invoice.companyName || invoice.customerName}</p>
                  <p className="text-slate-700 whitespace-pre-line font-medium leading-tight">{invoice.shippingAddress || invoice.billingAddress}</p>
                  <p className="text-slate-700 font-medium">{invoice.city}, {invoice.state} {invoice.pincode}</p>
                  <p className="text-slate-800 font-bold mt-0.5">Place of Supply: <strong>{invoice.state || "Gujarat"}</strong></p>
                  <p className="text-slate-800 font-bold">Dispatch From: <strong>Rajkot, Gujarat</strong></p>
                </div>
              </div>

              {/* Line Items Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border-2 border-slate-900 text-[10px]">
                  <thead>
                    <tr className="bg-slate-900 text-white uppercase tracking-wider text-[9.5px]">
                      <th className="border border-slate-900 p-1.5 text-center w-8">#</th>
                      <th className="border border-slate-900 p-1.5 text-left">Item Description</th>
                      <th className="border border-slate-900 p-1.5 text-center w-14">HSN</th>
                      <th className="border border-slate-900 p-1.5 text-center w-12">Qty</th>
                      <th className="border border-slate-900 p-1.5 text-right w-20">Unit Rate</th>
                      <th className="border border-slate-900 p-1.5 text-right w-20">Taxable</th>
                      <th className="border border-slate-900 p-1.5 text-center w-14">GST %</th>
                      <th className="border border-slate-900 p-1.5 text-right w-24">Total (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900 text-slate-900 font-semibold bg-transparent">
                    {(invoice.items || []).map((item, index) => (
                      <tr key={index} className="bg-transparent">
                        <td className="border border-slate-900 p-1.5 text-center font-bold">{index + 1}</td>
                        <td className="border border-slate-900 p-1.5 font-bold text-slate-900">
                          {item.name}
                          {item.discountPercent > 0 && (
                            <span className="text-[9px] text-emerald-800 font-bold block">
                              ({item.discountPercent}% Dealer Discount Applied)
                            </span>
                          )}
                        </td>
                        <td className="border border-slate-900 p-1.5 text-center font-mono font-bold">{item.hsnCode || "8438"}</td>
                        <td className="border border-slate-900 p-1.5 text-center font-bold">{item.quantity} {item.unit || "Set"}</td>
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

            {/* Bottom Section: Financial Calculations, GST & Bank Details, Terms, and Signature (Anchored at Bottom) */}
            <div className="mt-auto space-y-2.5 pt-2">
              {/* Tier 1: 2-Part Financial Calculations Box */}
              <div className="grid grid-cols-2 gap-3 text-[10.5px] print:grid-cols-2">
                {/* Left Part: Advance Payable, Balance Due & Amount in Words */}
                <div className="bg-transparent text-slate-900 p-2.5 rounded-none border-2 border-slate-900 flex flex-col justify-between space-y-2 font-semibold">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-emerald-800 font-bold border-b border-slate-900 pb-1">
                      <span>Advance Payable (50%):</span>
                      <span className="font-mono text-sm font-extrabold">₹{invoice.advancePayment?.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-900 font-bold border-b border-slate-900 pb-1">
                      <span>Balance Due Before Dispatch:</span>
                      <span className="font-mono text-sm font-extrabold">₹{invoice.balanceDue?.toLocaleString("en-IN")}</span>
                    </div>
                  </div>

                  {/* Amount in Words */}
                  <div className="pt-1.5 border-t border-slate-900 text-[10px] text-slate-900 italic leading-tight">
                    <strong className="text-red-700 not-italic uppercase font-extrabold">Amount in Words:</strong> {numberToWords(invoice.grandTotal)}
                  </div>
                </div>

                {/* Right Part: Subtotal, Freight, Tax & Grand Total */}
                <div className="bg-transparent text-slate-900 p-2.5 rounded-none border-2 border-slate-900 space-y-1 text-[10.5px] font-semibold">
                  <div className="flex justify-between border-b border-slate-900 pb-0.5">
                    <span className="text-slate-900 font-bold">Subtotal (Taxable Value):</span>
                    <span className="font-mono font-bold">₹{invoice.subtotal?.toLocaleString("en-IN")}</span>
                  </div>

                  {invoice.freightCharges > 0 && (
                    <div className="flex justify-between border-b border-slate-900 pb-0.5">
                      <span className="text-slate-900 font-bold">Freight & Delivery:</span>
                      <span className="font-mono font-bold">₹{invoice.freightCharges?.toLocaleString("en-IN")}</span>
                    </div>
                  )}

                  {invoice.packagingCharges > 0 && (
                    <div className="flex justify-between border-b border-slate-900 pb-0.5">
                      <span className="text-slate-900 font-bold">Packaging & Crating:</span>
                      <span className="font-mono font-bold">₹{invoice.packagingCharges?.toLocaleString("en-IN")}</span>
                    </div>
                  )}

                  {!invoice.isInterstate ? (
                    <>
                      <div className="flex justify-between text-slate-900 font-bold">
                        <span>CGST (9%):</span>
                        <span className="font-mono font-bold">₹{invoice.cgstAmount?.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex justify-between text-slate-900 font-bold border-b border-slate-900 pb-0.5">
                        <span>SGST (9%):</span>
                        <span className="font-mono font-bold">₹{invoice.sgstAmount?.toLocaleString("en-IN")}</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between text-slate-900 font-bold border-b border-slate-900 pb-0.5">
                      <span>IGST (18%):</span>
                      <span className="font-mono font-bold">₹{invoice.igstAmount?.toLocaleString("en-IN")}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-900 font-extrabold text-sm pt-0.5 border-t border-slate-900">
                    <span>GRAND TOTAL:</span>
                    <span className="font-mono text-slate-900 font-extrabold">₹{invoice.grandTotal?.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>

              {/* Tier 2: Side-by-Side GST & Bank Detail Box and TERMS & CONDITION Box */}
              <div className="grid grid-cols-2 gap-3 text-[10px] print:grid-cols-2">
                
                {/* Left Column: GST & Bank Details Table Box */}
                <div className="border-2 border-slate-900 divide-y-2 divide-slate-900 font-semibold bg-transparent">
                  {/* GST DETAIL Section */}
                  <div className="p-1 font-extrabold text-red-600 uppercase border-b-2 border-slate-900 bg-transparent text-[10px]">
                    GST DETAIL :
                  </div>
                  <div className="p-1 border-b border-slate-900 text-slate-900">
                    <strong>GST NO. :</strong> 24HMPT0206E1ZO
                  </div>
                  <div className="p-1 text-slate-900">
                    <strong>UDYAM NO:</strong> GJ-20-0130533
                  </div>

                  {/* Bank Detail Section */}
                  <div className="p-1 font-extrabold text-red-600 uppercase border-t-2 border-b-2 border-slate-900 bg-transparent text-[10px]">
                    Bank Detail
                  </div>
                  <div className="p-1 border-b border-slate-900 text-slate-900">
                    <strong>BANK:</strong> Bank Of Baroda, Aji GIDC, Rajkot
                  </div>
                  <div className="p-1 border-b border-slate-900 text-slate-900">
                    <strong>A/C NO:</strong> <span className="font-mono font-bold text-slate-900">17400200000634</span>
                  </div>
                  <div className="p-1 text-slate-900">
                    <strong>RTGS/IFSC Code:</strong> <span className="font-mono font-bold text-slate-900">BARB0AJIRAJ</span>
                  </div>
                </div>

                {/* Right Column: TERMS & CONDITION Box */}
                <div className="border-2 border-slate-900 divide-y divide-slate-900 font-semibold bg-transparent">
                  <div className="p-1 font-extrabold text-red-600 uppercase border-b-2 border-slate-900 bg-transparent text-[10px]">
                    TERMS & CONDITION:-
                  </div>
                  <div className="p-1 text-slate-900">
                    GST is extra as per bill amount.
                  </div>
                  <div className="p-1 text-slate-900">
                    All plant pulley set, v-belt & nut bolt are included.
                  </div>
                  <div className="p-1 text-slate-900">
                    All electric motor are included.
                  </div>
                  <div className="p-1 text-red-600 font-bold">
                    Electric panel board, wiring & electric fitting on customer.
                  </div>
                  <div className="p-1 text-red-600 font-bold">
                    As factory delivery but transportation charge on customer.
                  </div>
                </div>

              </div>

              {/* Footer Signature Box */}
              <div className="flex justify-between items-end pt-2 border-t-2 border-slate-900">
                <div className="text-[10px] text-slate-600 font-medium">
                  <p className="font-bold text-slate-900">Thank you for your business!</p>
                  <p>For Durga Manufactures, Rajkot, Gujarat</p>
                </div>

                <div className="text-center w-48">
                  <div className="h-10 flex items-end justify-center mb-0.5 relative">
                    <img
                      src="/signature.jpg"
                      alt="Authorized Signatory"
                      className="h-10 object-contain mix-blend-multiply"
                    />
                  </div>
                  <p className="font-bold text-slate-900 text-[10px] border-t border-slate-900 pt-0.5">
                    For DURGA MANUFACTURES
                  </p>
                  <p className="text-[9px] text-slate-600 font-bold uppercase">Authorized Signatory</p>
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
