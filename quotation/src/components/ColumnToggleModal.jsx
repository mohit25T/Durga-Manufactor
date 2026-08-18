import React from 'react';
import { X, Check, Eye, EyeOff, Sliders, RotateCcw } from 'lucide-react';

export default function ColumnToggleModal({ 
  isOpen, 
  onClose, 
  columns, 
  setColumns 
}) {
  if (!isOpen) return null;

  const handleToggleColumn = (id) => {
    setColumns(prev => prev.map(col => {
      if (col.id === id) {
        return { ...col, visible: !col.visible };
      }
      return col;
    }));
  };

  const handleSelectAll = () => {
    setColumns(prev => prev.map(col => ({ ...col, visible: true })));
  };

  const handleDeselectAll = () => {
    setColumns(prev => prev.map(col => ({ ...col, visible: false })));
  };

  const handleResetDefault = () => {
    setColumns(prev => prev.map(col => ({ ...col, visible: true })));
  };

  const visibleCount = columns.filter(c => c.visible).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in no-print">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2">
            <Sliders className="text-blue-400" size={20} />
            <div>
              <h2 className="text-base font-bold text-white font-heading">
                Customize Table Columns
              </h2>
              <p className="text-xs text-slate-400">
                {visibleCount} of {columns.length} columns currently visible in PDF
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

        {/* Quick Presets Bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-slate-800/40 border-b border-slate-800 text-xs">
          <span className="text-slate-400 font-semibold">Quick Controls:</span>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleSelectAll}
              className="text-blue-400 hover:text-blue-300 font-medium"
            >
              Show All
            </button>
            <span className="text-slate-600">|</span>
            <button 
              onClick={handleDeselectAll}
              className="text-slate-400 hover:text-slate-300 font-medium"
            >
              Hide All
            </button>
            <span className="text-slate-600">|</span>
            <button 
              onClick={handleResetDefault}
              className="text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
            >
              <RotateCcw size={12} />
              Reset
            </button>
          </div>
        </div>

        {/* Columns Checkbox List */}
        <div className="p-4 space-y-2 max-h-[60vh] overflow-y-auto">
          {columns.map((col) => (
            <label
              key={col.id}
              onClick={() => handleToggleColumn(col.id)}
              className={`
                flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer user-select-none
                ${col.visible 
                  ? 'bg-blue-600/15 border-blue-500/50 text-white' 
                  : 'bg-slate-950/40 border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300'
                }
              `}
            >
              <div className="flex items-center gap-3">
                <div className={`
                  w-5 h-5 rounded flex items-center justify-center border transition-colors
                  ${col.visible 
                    ? 'bg-blue-600 border-blue-500 text-white' 
                    : 'border-slate-700 bg-slate-900'
                  }
                `}>
                  {col.visible && <Check size={14} strokeWidth={3} />}
                </div>
                <span className="font-semibold text-sm">{col.label}</span>
              </div>

              <div className="flex items-center gap-1.5 text-xs">
                {col.visible ? (
                  <span className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-medium">
                    <Eye size={12} /> Visible
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full font-medium">
                    <EyeOff size={12} /> Hidden
                  </span>
                )}
              </div>
            </label>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex justify-end">
          <button
            onClick={onClose}
            className="btn btn-primary w-full py-2.5 font-bold"
          >
            Apply & Done
          </button>
        </div>
      </div>
    </div>
  );
}
