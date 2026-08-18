import React from 'react';
import { X, Plus, Search, Check, Layers, Image as ImageIcon } from 'lucide-react';
import { CATALOG_PRODUCTS } from '../data/sampleData';

export default function ProductCatalogModal({ 
  isOpen, 
  onClose, 
  onAddProduct,
  currency = '₹' 
}) {
  if (!isOpen) return null;

  const [search, setSearch] = React.useState('');
  const [addedIds, setAddedIds] = React.useState({});

  const filteredProducts = CATALOG_PRODUCTS.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.itemCode.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (product) => {
    onAddProduct({
      ...product,
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      quantity: 1,
      total: product.unitPrice,
    });
    setAddedIds(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds(prev => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in no-print">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2">
            <Layers className="text-emerald-400" size={20} />
            <div>
              <h2 className="text-base font-bold text-white font-heading">
                Durga Product Catalog
              </h2>
              <p className="text-xs text-slate-400">
                Select pre-saved Durga Manufactor items to insert into quotation
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/30">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              placeholder="Search product code, name, specifications..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input pl-9"
            />
          </div>
        </div>

        {/* Product Grid / List */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {filteredProducts.map((prod) => (
            <div 
              key={prod.id}
              className="bg-slate-950/60 border border-slate-800 hover:border-slate-700 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-4 transition-all"
            >
              <div className="flex items-center gap-3 w-full sm:w-auto">
                {prod.image ? (
                  <img 
                    src={prod.image} 
                    alt={prod.name} 
                    className="w-16 h-16 object-cover rounded-lg border border-slate-700 flex-shrink-0"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="64" height="64"><rect width="100" height="100" rx="8" fill="%231e293b"/><text x="50" y="55" font-family="sans-serif" font-size="12" fill="%2364748b" text-anchor="middle">No Image</text></svg>';
                    }}
                  />
                ) : (
                  <div className="w-16 h-16 bg-slate-800 rounded-lg flex items-center justify-center text-slate-500 flex-shrink-0">
                    <ImageIcon size={24} />
                  </div>
                )}
                
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="bg-blue-600/20 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-500/30 font-mono">
                      {prod.itemCode}
                    </span>
                    <h4 className="font-bold text-white text-sm">
                      {prod.name}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1 mb-1">
                    {prod.description}
                  </p>
                  
                  {/* Specs summary tags */}
                  <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-300">
                    <span className="bg-slate-800 px-1.5 py-0.5 rounded">Dim: {prod.dimensions}</span>
                    <span className="bg-slate-800 px-1.5 py-0.5 rounded">Wt: {prod.weight}</span>
                    <span className="bg-slate-800 px-1.5 py-0.5 rounded">Cap: {prod.capacity}</span>
                  </div>
                </div>
              </div>

              {/* Price & Add Action */}
              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-slate-800 pt-2 sm:pt-0">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase font-semibold">Unit Price</span>
                  <span className="font-mono font-extrabold text-emerald-400 text-sm">
                    {currency} {prod.unitPrice.toLocaleString('en-IN')}
                  </span>
                </div>

                <button
                  onClick={() => handleAdd(prod)}
                  className={`
                    btn btn-sm transition-all min-w-[90px]
                    ${addedIds[prod.id] 
                      ? 'bg-emerald-600 text-white' 
                      : 'btn-primary'
                    }
                  `}
                >
                  {addedIds[prod.id] ? (
                    <>
                      <Check size={14} /> Added!
                    </>
                  ) : (
                    <>
                      <Plus size={14} /> Insert
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/50 flex justify-end">
          <button
            onClick={onClose}
            className="btn btn-secondary text-xs px-4"
          >
            Close Catalog
          </button>
        </div>
      </div>
    </div>
  );
}
