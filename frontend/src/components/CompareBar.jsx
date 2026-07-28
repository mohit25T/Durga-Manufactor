import { motion, AnimatePresence } from "framer-motion";
import { Scale, X, ArrowRight, Trash2 } from "lucide-react";
import { useCompare } from "../context/CompareContext";
import CompareModal from "./CompareModal";

export default function CompareBar() {
  const { compareItems, removeFromCompare, clearCompare, setIsModalOpen } = useCompare();

  if (!compareItems || compareItems.length === 0) return null;

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed bottom-4 right-4 md:bottom-6 md:right-24 z-40 bg-brand-forest text-white border border-brand-sand shadow-2xl p-3 md:p-4 rounded-none flex items-center gap-3 max-w-[90vw] md:max-w-xl"
        >
          {/* BAR HEADER / ICON */}
          <div className="flex items-center gap-2 pr-3 border-r border-white/20 shrink-0">
            <div className="w-8 h-8 rounded-full bg-amber-400 text-brand-charcoal flex items-center justify-center font-bold">
              <Scale className="w-4 h-4" />
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-bold uppercase tracking-wider text-amber-400">Compare</p>
              <p className="text-[10px] text-white/80 font-semibold">{compareItems.length} of 3 selected</p>
            </div>
          </div>

          {/* SELECTED ITEM THUMBNAILS */}
          <div className="flex items-center gap-2 overflow-x-auto py-0.5">
            {compareItems.map((item) => (
              <div
                key={item._id}
                className="relative w-10 h-10 md:w-12 md:h-12 bg-white border border-brand-sand shrink-0 group"
              >
                <img
                  src={item.images?.[0] || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=100&q=80"}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromCompare(item._id);
                  }}
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center cursor-pointer transition-colors shadow-xs"
                  title="Remove"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </div>
            ))}
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex items-center gap-2 ml-auto shrink-0">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-amber-400 hover:bg-amber-500 text-brand-charcoal font-bold px-3 py-2 text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md transition-colors"
            >
              <span>Compare Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={clearCompare}
              className="p-2 text-white/70 hover:text-white transition-colors cursor-pointer"
              title="Clear all comparison items"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* RENDER MODAL WHEN OPEN */}
      <CompareModal />
    </>
  );
}
