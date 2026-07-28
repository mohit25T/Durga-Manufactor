import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Phone, ExternalLink, Scale, Check, ShieldCheck, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useCompare } from "../context/CompareContext";

export default function CompareModal() {
  const { compareItems, removeFromCompare, clearCompare, isModalOpen, setIsModalOpen } = useCompare();

  if (!isModalOpen || compareItems.length === 0) return null;

  // Helper to extract Motor HP
  const getHpValue = (product) => {
    if (product.name) {
      const match = product.name.match(/(\d+(\.\d+)?)\s*(?:H\.P\.|HP)(?!\w)/i);
      if (match) return `${match[1]} H.P.`;
    }
    if (product.table && Array.isArray(product.table)) {
      for (const row of product.table) {
        if (Array.isArray(row) && row.length >= 2) {
          const key = row[0]?.toUpperCase().trim();
          const val = row[1];
          if (["MOTOR", "POWER", "MOTOR POWER", "HP", "H.P."].includes(key)) {
            return val;
          }
        }
      }
    }
    return "Standard Duty";
  };

  // Extract all unique specification keys across selected products
  const getAllSpecKeys = () => {
    const keysSet = new Set();
    compareItems.forEach((p) => {
      if (p.table && Array.isArray(p.table)) {
        p.table.forEach((row) => {
          if (Array.isArray(row) && row[0]) {
            keysSet.add(row[0].trim());
          }
        });
      }
    });
    return Array.from(keysSet);
  };

  const specKeys = getAllSpecKeys();

  // Helper to get specific spec value for product
  const getSpecValue = (product, targetKey) => {
    if (product.table && Array.isArray(product.table)) {
      const foundRow = product.table.find(
        (row) => Array.isArray(row) && row[0]?.toLowerCase().trim() === targetKey.toLowerCase().trim()
      );
      if (foundRow && foundRow[1]) return foundRow[1];
    }
    return "—";
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-brand-charcoal/70 backdrop-blur-xs flex items-center justify-center p-3 md:p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="bg-white border border-brand-sand shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col rounded-none overflow-hidden"
        >
          {/* MODAL HEADER */}
          <div className="bg-brand-forest text-white p-4 md:p-6 flex items-center justify-between border-b border-brand-sand shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                <Scale className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-400/10 px-2 py-0.5 border border-amber-400/30">
                  Side-by-Side Comparison
                </span>
                <h3 className="font-serif text-lg md:text-2xl font-bold tracking-tight mt-0.5">
                  Commercial Machine Comparison Matrix
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={clearCompare}
                className="hidden sm:inline-flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 text-xs font-bold uppercase tracking-wider cursor-pointer border border-white/20 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear All
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* SCROLLABLE TABLE BODY */}
          <div className="p-4 md:p-6 overflow-x-auto overflow-y-auto flex-grow bg-brand-cream/10">
            <table className="w-full text-left border-collapse border border-brand-sand min-w-[640px]">
              <thead>
                <tr className="bg-stone-50 border-b border-brand-sand">
                  <th className="p-4 w-48 text-xs font-serif font-bold text-brand-forest uppercase tracking-wider bg-stone-100 border-r border-brand-sand">
                    Machine Features & Specs
                  </th>
                  {compareItems.map((p) => (
                    <th key={p._id} className="p-4 border-r border-brand-sand align-top min-w-[220px]">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-brand-forest bg-brand-sage/30 px-2 py-0.5 border border-brand-forest/20">
                          {p.category}
                        </span>
                        <button
                          onClick={() => removeFromCompare(p._id)}
                          className="text-stone-400 hover:text-red-600 transition-colors p-1 cursor-pointer"
                          title="Remove from comparison"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="h-32 mb-3 bg-white border border-brand-sand overflow-hidden flex items-center justify-center">
                        <img
                          src={p.images?.[0] || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&q=80"}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <h4 className="font-serif font-bold text-sm text-brand-charcoal mb-2 line-clamp-2">
                        {p.name}
                      </h4>

                      {p.price && (
                        <p className="font-bold text-sm text-brand-forest mb-3">
                          ₹{parseInt(p.price).toLocaleString("en-IN")}{" "}
                          <span className="text-[10px] font-normal text-brand-gray">(Ex-Factory)</span>
                        </p>
                      )}

                      <div className="space-y-1.5 pt-2 border-t border-brand-sand/60">
                        <Link
                          to={`/products/${p._id}`}
                          onClick={() => setIsModalOpen(false)}
                          className="w-full inline-flex items-center justify-center gap-1.5 bg-brand-forest text-white py-1.5 px-3 text-[10px] font-bold uppercase tracking-wider hover:bg-brand-forest/90 transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          View Product
                        </Link>
                        <a
                          href={`https://wa.me/919428156213?text=${encodeURIComponent(
                            `Hello Durga Manufactor! I am comparing ${p.name}. Please send technical brochure & best quotation.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full inline-flex items-center justify-center gap-1.5 bg-[#25D366] text-white py-1.5 px-3 text-[10px] font-bold uppercase tracking-wider hover:bg-[#20bd5a] transition-colors"
                        >
                          <Phone className="w-3 h-3" />
                          WhatsApp Quote
                        </a>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-brand-sand text-xs font-semibold text-brand-charcoal">
                {/* MOTOR POWER ROW */}
                <tr className="bg-amber-50/50">
                  <td className="p-3.5 font-bold text-brand-forest uppercase tracking-wider bg-amber-100/40 border-r border-brand-sand flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-600" /> Motor Power
                  </td>
                  {compareItems.map((p) => (
                    <td key={p._id} className="p-3.5 border-r border-brand-sand font-bold text-brand-forest">
                      {getHpValue(p)}
                    </td>
                  ))}
                </tr>

                {/* CATEGORY ROW */}
                <tr>
                  <td className="p-3.5 font-bold text-brand-gray uppercase tracking-wider bg-stone-50 border-r border-brand-sand">
                    Industry Category
                  </td>
                  {compareItems.map((p) => (
                    <td key={p._id} className="p-3.5 border-r border-brand-sand">
                      {p.category}
                    </td>
                  ))}
                </tr>

                {/* PRICE ROW */}
                <tr>
                  <td className="p-3.5 font-bold text-brand-gray uppercase tracking-wider bg-stone-50 border-r border-brand-sand">
                    Ex-Factory Price
                  </td>
                  {compareItems.map((p) => (
                    <td key={p._id} className="p-3.5 border-r border-brand-sand font-bold text-brand-forest">
                      {p.price ? `₹${parseInt(p.price).toLocaleString("en-IN")}` : "Contact for Price"}
                    </td>
                  ))}
                </tr>

                {/* DYNAMIC SPECIFICATION ROWS */}
                {specKeys.map((key) => (
                  <tr key={key} className="hover:bg-stone-50 transition-colors">
                    <td className="p-3.5 font-bold text-brand-gray uppercase tracking-wider bg-stone-50 border-r border-brand-sand">
                      {key}
                    </td>
                    {compareItems.map((p) => (
                      <td key={p._id} className="p-3.5 border-r border-brand-sand font-medium">
                        {getSpecValue(p, key)}
                      </td>
                    ))}
                  </tr>
                ))}

                {/* DESCRIPTION SUMMARY */}
                <tr>
                  <td className="p-3.5 font-bold text-brand-gray uppercase tracking-wider bg-stone-50 border-r border-brand-sand">
                    Overview & Application
                  </td>
                  {compareItems.map((p) => (
                    <td key={p._id} className="p-3.5 border-r border-brand-sand text-brand-gray font-normal leading-relaxed line-clamp-4">
                      {p.description || "Heavy-duty commercial food processing machine."}
                    </td>
                  ))}
                </tr>

                {/* WARRANTY & SUPPORT ROW */}
                <tr className="bg-stone-50">
                  <td className="p-3.5 font-bold text-brand-forest uppercase tracking-wider bg-stone-100 border-r border-brand-sand">
                    Manufacturing Warranty
                  </td>
                  {compareItems.map((p) => (
                    <td key={p._id} className="p-3.5 border-r border-brand-sand font-bold text-green-700">
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="w-4 h-4 text-green-600" />
                        1 Year Motor Warranty
                      </span>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* FOOTER */}
          <div className="p-4 bg-stone-50 border-t border-brand-sand flex items-center justify-between shrink-0">
            <span className="text-xs font-semibold text-brand-gray">
              Comparing {compareItems.length} of max 3 machines
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={clearCompare}
                className="px-3 py-1.5 bg-stone-200 hover:bg-stone-300 text-brand-charcoal text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Clear Selection
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-1.5 bg-brand-forest text-white text-xs font-bold uppercase tracking-wider hover:bg-brand-forest/90 cursor-pointer"
              >
                Close Comparison
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
