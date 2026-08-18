import React from 'react';
import { 
  FileText, 
  Download, 
  Eye, 
  PlusCircle, 
  RotateCcw, 
  Save, 
  Sliders, 
  Building2,
  FolderOpen
} from 'lucide-react';

export default function Header({ 
  onExportPdf, 
  isExporting, 
  onOpenColumnModal, 
  onOpenCatalog, 
  onResetSample, 
  onSaveQuote,
  activeColumnsCount,
  savedQuotesCount,
  onOpenSavedModal
}) {
  return (
    <header className="no-print glass-card mb-6 p-4 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Company & App Brand */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/30">
            D
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight text-white font-heading">
                DURGA <span className="text-blue-400 font-normal">QUOTATION BUILDER</span>
              </h1>
              <span className="bg-blue-500/20 text-blue-300 text-xs px-2.5 py-0.5 rounded-full border border-blue-500/30 font-semibold">
                Localhost System
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Durga Manufactor • Precision Engineering Quotations
            </p>
          </div>
        </div>

        {/* Action Toolbars */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Column Toggle Button */}
          <button 
            onClick={onOpenColumnModal}
            className="btn btn-secondary flex items-center gap-2"
            title="Hide or Show Table Columns"
          >
            <Sliders size={16} className="text-blue-400" />
            <span>Columns</span>
            <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {activeColumnsCount}
            </span>
          </button>

          {/* Product Catalog Picker */}
          <button 
            onClick={onOpenCatalog}
            className="btn btn-secondary flex items-center gap-2"
            title="Browse & Add Pre-saved Durga Products"
          >
            <PlusCircle size={16} className="text-emerald-400" />
            <span>Add Catalog Item</span>
          </button>

          {/* Saved Quotes Drawer */}
          <button 
            onClick={onOpenSavedModal}
            className="btn btn-secondary flex items-center gap-2"
            title="Load Previously Saved Quotations"
          >
            <FolderOpen size={16} className="text-amber-400" />
            <span>Saved Quotes ({savedQuotesCount})</span>
          </button>

          {/* Reset / Sample Data */}
          <button 
            onClick={onResetSample}
            className="btn btn-secondary p-2.5 text-slate-400 hover:text-white"
            title="Reset to Sample Data"
          >
            <RotateCcw size={16} />
          </button>

          {/* Save Local Draft */}
          <button 
            onClick={onSaveQuote}
            className="btn btn-secondary flex items-center gap-2 text-emerald-400 hover:text-emerald-300"
            title="Save Quotation Draft to Local Storage"
          >
            <Save size={16} />
            <span>Save</span>
          </button>

          {/* Export PDF Primary Action */}
          <button 
            onClick={onExportPdf}
            disabled={isExporting}
            className="btn btn-primary flex items-center gap-2 text-white font-semibold"
          >
            {isExporting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <Download size={17} />
                <span>Export PDF</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
