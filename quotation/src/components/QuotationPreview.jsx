import React from 'react';
import { Building2, Phone, Mail, Globe, Calendar, FileText } from 'lucide-react';

export default function QuotationPreview({ 
  company, 
  customer, 
  meta, 
  items, 
  columns 
}) {
  // Filter only visible columns
  const visibleColumns = columns.filter(col => col.visible);

  // Financial Calculations
  const subtotal = items.reduce((acc, item) => {
    const price = parseFloat(item.unitPrice) || 0;
    const qty = parseFloat(item.quantity) || 0;
    return acc + (price * qty);
  }, 0);
  const taxRate = parseFloat(meta?.taxRate) || 0;
  const taxAmount = (subtotal * taxRate) / 100;
  const shippingCharge = parseFloat(meta?.shippingCharge) || 0;
  const grandTotal = subtotal + taxAmount + shippingCharge;

  return (
    <div className="flex flex-col items-center">
      {/* Paper Container */}
      <div 
        id="quotation-document-preview" 
        className="quotation-paper"
      >
        {/* DURGA WATERMARK BACKGROUND */}
        {meta.showWatermark && (
          <div 
            className="doc-watermark"
            style={{ opacity: meta.watermarkOpacity || 0.08 }}
          >
            {meta.watermarkText || 'DURGA'}
          </div>
        )}

        <div className="doc-content">
          {/* TOP HEADER / BRANDING */}
          <div className="flex justify-between items-start border-b-2 border-slate-900 pb-5 mb-5">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 bg-blue-700 text-white rounded-lg font-black text-xl flex items-center justify-center font-heading">
                  D
                </div>
                <div>
                  <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 font-heading uppercase">
                    {company.name || 'DURGA MANUFACTOR'}
                  </h1>
                  <p className="text-xs font-semibold text-blue-700 tracking-wide uppercase">
                    {company.tagline || 'Industrial & Engineering Solutions'}
                  </p>
                </div>
              </div>

              <div className="text-[11px] text-slate-600 space-y-0.5 mt-2">
                <p>{company.address}, {company.city}</p>
                <p>Phone: {company.phone} | Email: {company.email}</p>
                <p>GSTIN: <span className="font-semibold text-slate-800">{company.gstin}</span></p>
              </div>
            </div>

            {/* QUOTATION TITLE BADGE */}
            <div className="text-right">
              <div className="bg-slate-900 text-white px-4 py-1.5 rounded font-heading font-extrabold text-lg uppercase tracking-wider mb-2">
                QUOTATION
              </div>
              <p className="text-xs font-bold text-slate-800">
                # {meta.quotationNo}
              </p>
              <p className="text-[11px] text-slate-600">
                Date: <span className="font-medium">{meta.date}</span>
              </p>
              <p className="text-[11px] text-slate-600">
                Valid Until: <span className="font-medium">{meta.validUntil}</span>
              </p>
            </div>
          </div>

          {/* CLIENT & METADATA GRID */}
          <div className="grid grid-cols-2 gap-6 mb-6 text-xs">
            {/* Customer Box */}
            <div className="bg-slate-50 p-3.5 rounded border border-slate-200">
              <h3 className="font-heading font-bold text-blue-900 uppercase text-[11px] tracking-wider mb-1.5 pb-1 border-b border-slate-200">
                Quotation Issued To:
              </h3>
              <p className="font-bold text-sm text-slate-900 mb-0.5">{customer.name}</p>
              {customer.contactPerson && (
                <p className="text-slate-700 font-medium mb-1">Attn: {customer.contactPerson}</p>
              )}
              <p className="text-slate-600">{customer.address}, {customer.city}</p>
              <p className="text-slate-600">Ph: {customer.phone} | Email: {customer.email}</p>
              {customer.gstin && (
                <p className="text-slate-700 mt-1 font-medium">GSTIN: {customer.gstin}</p>
              )}
            </div>

            {/* Terms Summary Box */}
            <div className="bg-slate-50 p-3.5 rounded border border-slate-200">
              <h3 className="font-heading font-bold text-blue-900 uppercase text-[11px] tracking-wider mb-1.5 pb-1 border-b border-slate-200">
                Summary & Parameters:
              </h3>
              <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-slate-700 text-[11px]">
                <div><span className="font-medium text-slate-900">Currency:</span> {meta.currency}</div>
                <div><span className="font-medium text-slate-900">GST Rate:</span> {meta.taxRate}%</div>
                <div className="col-span-2"><span className="font-medium text-slate-900">Watermark:</span> {meta.watermarkText}</div>
              </div>
              <div className="mt-2 text-[10px] text-slate-500 italic">
                * Note: All specifications verified by Durga Quality Assurance team.
              </div>
            </div>
          </div>

          {/* DYNAMIC PRODUCTS TABLE */}
          <table className="doc-table">
            <thead>
              <tr>
                {visibleColumns.map(col => (
                  <th 
                    key={col.id}
                    className={`
                      ${col.id === 'unitPrice' || col.id === 'totalPrice' || col.id === 'quantity' ? 'text-right' : ''}
                      ${col.id === 'productNo' ? 'w-[10%]' : ''}
                      ${col.id === 'image' ? 'w-[12%]' : ''}
                    `}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.id || index}>
                  {visibleColumns.map(col => {
                    switch (col.id) {
                      case 'productNo':
                        return (
                          <td key={col.id} className="font-mono text-slate-700 font-semibold text-[11px]">
                            {item.itemCode || `#${index + 1}`}
                          </td>
                        );
                      case 'image':
                        return (
                          <td key={col.id}>
                            {item.image ? (
                              <img 
                                src={item.image} 
                                alt={item.name} 
                                className="product-img-thumb"
                                crossOrigin="anonymous"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="50" height="50"><rect width="100" height="100" rx="8" fill="%23f1f5f9"/><text x="50" y="55" font-family="sans-serif" font-size="12" fill="%2394a3b8" text-anchor="middle">No Image</text></svg>';
                                }}
                              />
                            ) : (
                              <div className="w-[50px] h-[50px] bg-slate-100 rounded flex items-center justify-center text-[10px] text-slate-400 border border-slate-200">
                                No Image
                              </div>
                            )}
                          </td>
                        );
                      case 'description':
                        return (
                          <td key={col.id}>
                            <p className="font-bold text-slate-900 text-xs mb-0.5">{item.name}</p>
                            {item.description && (
                              <p className="text-[11px] text-slate-600 leading-tight">{item.description}</p>
                            )}
                          </td>
                        );
                      case 'dimensions':
                        return (
                          <td key={col.id} className="text-slate-700 font-mono text-[11px]">
                            {item.dimensions || 'N/A'}
                          </td>
                        );
                      case 'weight':
                        return (
                          <td key={col.id} className="text-slate-700 font-mono text-[11px]">
                            {item.weight || 'N/A'}
                          </td>
                        );
                      case 'capacity':
                        return (
                          <td key={col.id} className="text-slate-700 font-mono text-[11px]">
                            {item.capacity || 'N/A'}
                          </td>
                        );
                      case 'unitPrice':
                        return (
                          <td key={col.id} className="text-right font-mono text-slate-900 font-medium">
                            {meta.currency} {parseFloat(item.unitPrice || 0).toLocaleString('en-IN')}
                          </td>
                        );
                      case 'quantity':
                        return (
                          <td key={col.id} className="text-right font-mono font-bold text-slate-900">
                            {item.quantity || 1}
                          </td>
                        );
                      case 'totalPrice':
                        return (
                          <td key={col.id} className="text-right font-mono font-bold text-slate-900">
                            {meta.currency} {((parseFloat(item.unitPrice || 0) * parseFloat(item.quantity || 0))).toLocaleString('en-IN')}
                          </td>
                        );
                      default:
                        return <td key={col.id}>-</td>;
                    }
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          {/* TOTALS & SUMMARY */}
          <div className="flex justify-between items-start gap-6 mb-6">
            {/* Payment Terms & Notes */}
            <div className="w-7/12 text-[11px] text-slate-700 space-y-3">
              <div className="bg-slate-50 p-3 rounded border border-slate-200">
                <p className="font-bold text-slate-900 uppercase text-[10px] tracking-wide mb-1">
                  Terms & Conditions:
                </p>
                <p className="whitespace-pre-line leading-relaxed text-[11px]">
                  {meta.notes || '1. Prices valid for 30 days.\n2. Delivery as per schedule.'}
                </p>
              </div>

              {meta.paymentTerms && (
                <div className="bg-blue-50/50 p-2.5 rounded border border-blue-100">
                  <p className="font-bold text-blue-900 text-[10px] uppercase">Payment Terms:</p>
                  <p className="text-slate-800 text-[11px]">{meta.paymentTerms}</p>
                </div>
              )}
            </div>

            {/* Financial Calculations Box */}
            <div className="w-5/12 bg-slate-50 p-4 rounded border border-slate-200 text-xs">
              <div className="space-y-2">
                <div className="flex justify-between text-slate-700">
                  <span>Subtotal:</span>
                  <span className="font-mono font-semibold">
                    {meta.currency} {subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                {taxRate > 0 && (
                  <div className="flex justify-between text-slate-700">
                    <span>GST / Tax ({taxRate}%):</span>
                    <span className="font-mono font-semibold">
                      + {meta.currency} {taxAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                )}

                {shippingCharge > 0 && (
                  <div className="flex justify-between text-slate-700">
                    <span>Freight / Shipping:</span>
                    <span className="font-mono font-semibold">
                      + {meta.currency} {shippingCharge.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                )}

                <div className="border-t-2 border-slate-900 pt-2.5 mt-2 flex justify-between items-center">
                  <span className="font-heading font-extrabold text-sm text-slate-900 uppercase">
                    Grand Total:
                  </span>
                  <span className="font-mono font-black text-base text-blue-700">
                    {meta.currency} {grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* SIGNATURE & FOOTER */}
          <div className="pt-8 border-t border-slate-300 flex justify-between items-end text-xs text-slate-600">
            <div>
              <p className="font-bold text-slate-800 text-[11px]">Thank you for your business!</p>
              <p className="text-[10px]">For queries: {company.phone} | {company.email}</p>
            </div>

            <div className="text-center w-48">
              <div className="border-b border-slate-400 pb-12 mb-1">
                <span className="text-[10px] text-slate-400 font-mono italic">[Authorized Signatory]</span>
              </div>
              <p className="font-bold text-slate-900 text-xs">For DURGA MANUFACTOR</p>
              <p className="text-[10px] text-slate-500">Authorized Signature & Stamp</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
