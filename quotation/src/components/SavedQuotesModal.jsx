import React from 'react';
import { X, FolderOpen, Trash2, Calendar, FileText, CheckCircle } from 'lucide-react';

export default function SavedQuotesModal({
  isOpen,
  onClose,
  savedQuotes,
  onLoadQuote,
  onDeleteQuote
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in no-print">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2">
            <FolderOpen className="text-amber-400" size={20} />
            <div>
              <h2 className="text-base font-bold text-white font-heading">
                Saved Quotations
              </h2>
              <p className="text-xs text-slate-400">
                Manage and restore locally saved Durga Manufactor quotations
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

        {/* Saved Items List */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {savedQuotes.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-sm">
              No saved quotations found in local storage.
            </div>
          ) : (
            savedQuotes.map((q) => (
              <div 
                key={q.id}
                className="bg-slate-950/60 border border-slate-800 hover:border-slate-700 rounded-xl p-3 flex items-center justify-between gap-4 transition-all"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-blue-400 text-sm">
                      {q.meta?.quotationNo || 'Draft'}
                    </span>
                    <span className="text-white font-semibold text-sm">
                      • {q.customer?.name || 'Unnamed Client'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span>Date: {q.meta?.date}</span>
                    <span>Items: {q.items?.length || 0}</span>
                    <span className="text-emerald-400 font-mono font-bold">
                      {q.meta?.currency || '₹'} {
                        (q.items || []).reduce((acc, i) => acc + (parseFloat(i.unitPrice||0)*parseFloat(i.quantity||1)), 0).toLocaleString('en-IN')
                      }
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onLoadQuote(q);
                      onClose();
                    }}
                    className="btn btn-primary btn-sm text-xs"
                  >
                    Load
                  </button>

                  <button
                    onClick={() => onDeleteQuote(q.id)}
                    className="p-1.5 text-slate-400 hover:text-red-400 rounded hover:bg-slate-800"
                    title="Delete Draft"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/50 flex justify-end">
          <button
            onClick={onClose}
            className="btn btn-secondary text-xs px-4"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
