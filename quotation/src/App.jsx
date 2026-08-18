import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import QuotationEditor from './components/QuotationEditor';
import QuotationPreview from './components/QuotationPreview';
import ColumnToggleModal from './components/ColumnToggleModal';
import ProductCatalogModal from './components/ProductCatalogModal';
import SavedQuotesModal from './components/SavedQuotesModal';

import { 
  DEFAULT_COMPANY, 
  DEFAULT_CUSTOMER, 
  DEFAULT_QUOTATION_META, 
  INITIAL_COLUMNS, 
  INITIAL_ITEMS 
} from './data/sampleData';

import { exportToPdf } from './utils/pdfGenerator';
import { Eye, Edit3, Columns, CheckCircle } from 'lucide-react';

export default function App() {
  // State definitions
  const [company, setCompany] = useState(DEFAULT_COMPANY);
  const [customer, setCustomer] = useState(DEFAULT_CUSTOMER);
  const [meta, setMeta] = useState(DEFAULT_QUOTATION_META);
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [columns, setColumns] = useState(INITIAL_COLUMNS);

  // Modals visibility
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);

  // Layout View Mode: 'split' | 'editor' | 'preview'
  const [viewMode, setViewMode] = useState('split');
  const [isExporting, setIsExporting] = useState(false);
  const [savedQuotes, setSavedQuotes] = useState([]);
  const [toastMessage, setToastMessage] = useState('');

  // Load initial saved quotes from LocalStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('durga_saved_quotations');
      if (stored) {
        setSavedQuotes(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load saved quotations', e);
    }
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // PDF Export trigger
  const handleExportPdf = async () => {
    setIsExporting(true);
    const fileName = `Durga-Quotation-${meta.quotationNo || 'Doc'}.pdf`;
    
    // Slight delay to ensure DOM is fully rendered
    setTimeout(async () => {
      const success = await exportToPdf('quotation-document-preview', fileName);
      setIsExporting(false);
      if (success) {
        showToast('PDF Exported Successfully!');
      }
    }, 300);
  };

  // Reset to default sample data
  const handleResetSample = () => {
    if (window.confirm('Reset all fields to Durga default sample data?')) {
      setCompany(DEFAULT_COMPANY);
      setCustomer(DEFAULT_CUSTOMER);
      setMeta({
        ...DEFAULT_QUOTATION_META,
        quotationNo: `DM-QT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toISOString().split('T')[0]
      });
      setItems(INITIAL_ITEMS);
      setColumns(INITIAL_COLUMNS);
      showToast('Reset to Durga Sample Data');
    }
  };

  // Save current quote draft
  const handleSaveQuote = () => {
    const newQuote = {
      id: `quote-${Date.now()}`,
      timestamp: new Date().toISOString(),
      company,
      customer,
      meta,
      items,
      columns,
    };

    const updated = [newQuote, ...savedQuotes];
    setSavedQuotes(updated);
    try {
      localStorage.setItem('durga_saved_quotations', JSON.stringify(updated));
      showToast(`Quotation ${meta.quotationNo} Saved!`);
    } catch (e) {
      console.error('Save failed', e);
    }
  };

  // Load a saved quote
  const handleLoadQuote = (q) => {
    if (q.company) setCompany(q.company);
    if (q.customer) setCustomer(q.customer);
    if (q.meta) setMeta(q.meta);
    if (q.items) setItems(q.items);
    if (q.columns) setColumns(q.columns);
    showToast(`Loaded Quotation ${q.meta?.quotationNo}`);
  };

  // Delete a saved quote
  const handleDeleteQuote = (id) => {
    const updated = savedQuotes.filter(q => q.id !== id);
    setSavedQuotes(updated);
    try {
      localStorage.setItem('durga_saved_quotations', JSON.stringify(updated));
      showToast('Deleted saved quote');
    } catch (e) {
      console.error('Delete failed', e);
    }
  };

  // Insert catalog item
  const handleAddProductFromCatalog = (productItem) => {
    setItems(prev => [...prev, productItem]);
    showToast(`Added ${productItem.name}`);
  };

  const activeColumnsCount = columns.filter(c => c.visible).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 font-semibold text-sm animate-bounce no-print">
          <CheckCircle size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation & Action Header */}
      <Header
        onExportPdf={handleExportPdf}
        isExporting={isExporting}
        onOpenColumnModal={() => setIsColumnModalOpen(true)}
        onOpenCatalog={() => setIsCatalogOpen(true)}
        onResetSample={handleResetSample}
        onSaveQuote={handleSaveQuote}
        activeColumnsCount={activeColumnsCount}
        savedQuotesCount={savedQuotes.length}
        onOpenSavedModal={() => setIsSavedModalOpen(true)}
      />

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 pb-12">
        {/* Layout View Mode Switcher (Split / Editor Only / Preview Only) */}
        <div className="no-print mb-4 flex items-center justify-between bg-slate-900/60 p-2 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <span>Workspace Layout:</span>
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setViewMode('split')}
              className={`px-3 py-1.5 rounded-md font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'split' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Columns size={14} />
              <span>Split View</span>
            </button>

            <button
              onClick={() => setViewMode('editor')}
              className={`px-3 py-1.5 rounded-md font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'editor' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Edit3 size={14} />
              <span>Form Editor</span>
            </button>

            <button
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1.5 rounded-md font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'preview' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye size={14} />
              <span>PDF Preview</span>
            </button>
          </div>
        </div>

        {/* Content View Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT: Quotation Editor */}
          {(viewMode === 'split' || viewMode === 'editor') && (
            <div className={`${viewMode === 'split' ? 'lg:col-span-6' : 'lg:col-span-12'}`}>
              <QuotationEditor
                company={company}
                setCompany={setCompany}
                customer={customer}
                setCustomer={setCustomer}
                meta={meta}
                setMeta={setMeta}
                items={items}
                setItems={setItems}
                columns={columns}
                onOpenColumnModal={() => setIsColumnModalOpen(true)}
                onOpenCatalog={() => setIsCatalogOpen(true)}
              />
            </div>
          )}

          {/* RIGHT: Document Live Paper Preview */}
          {(viewMode === 'split' || viewMode === 'preview') && (
            <div className={`${viewMode === 'split' ? 'lg:col-span-6' : 'lg:col-span-12'} overflow-x-auto py-2`}>
              <QuotationPreview
                company={company}
                customer={customer}
                meta={meta}
                items={items}
                columns={columns}
              />
            </div>
          )}
        </div>
      </main>

      {/* MODALS */}
      <ColumnToggleModal
        isOpen={isColumnModalOpen}
        onClose={() => setIsColumnModalOpen(false)}
        columns={columns}
        setColumns={setColumns}
      />

      <ProductCatalogModal
        isOpen={isCatalogOpen}
        onClose={() => setIsCatalogOpen(false)}
        onAddProduct={handleAddProductFromCatalog}
        currency={meta.currency}
      />

      <SavedQuotesModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        savedQuotes={savedQuotes}
        onLoadQuote={handleLoadQuote}
        onDeleteQuote={handleDeleteQuote}
      />
    </div>
  );
}
