import React from 'react';
import { 
  Plus, 
  Trash2, 
  Upload, 
  Sliders, 
  DollarSign, 
  Building, 
  User, 
  Calendar,
  FileText,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function QuotationEditor({
  company,
  setCompany,
  customer,
  setCustomer,
  meta,
  setMeta,
  items,
  setItems,
  columns,
  onOpenColumnModal,
  onOpenCatalog
}) {
  const [activeTab, setActiveTab] = React.useState('items'); // 'items' | 'company' | 'customer' | 'settings'

  // Update specific company field
  const handleCompanyChange = (field, value) => {
    setCompany(prev => ({ ...prev, [field]: value }));
  };

  // Update specific customer field
  const handleCustomerChange = (field, value) => {
    setCustomer(prev => ({ ...prev, [field]: value }));
  };

  // Update meta field
  const handleMetaChange = (field, value) => {
    setMeta(prev => ({ ...prev, [field]: value }));
  };

  // Item Management
  const handleItemChange = (id, field, value) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'unitPrice' || field === 'quantity') {
          const price = parseFloat(field === 'unitPrice' ? value : item.unitPrice) || 0;
          const qty = parseFloat(field === 'quantity' ? value : item.quantity) || 0;
          updated.total = price * qty;
        }
        return updated;
      }
      return item;
    }));
  };

  const handleAddNewItem = () => {
    const newItem = {
      id: `item-${Date.now()}`,
      itemCode: `DM-PROD-${items.length + 101}`,
      name: 'New Durga Custom Product',
      description: 'Industrial grade manufactured component spec.',
      dimensions: '500 x 400 x 300 mm',
      weight: '15.0 kg',
      capacity: '200 L',
      unitPrice: 5000,
      quantity: 1,
      image: '',
    };
    setItems(prev => [...prev, newItem]);
  };

  const handleDeleteItem = (id) => {
    if (items.length <= 1) {
      alert('Quotation must have at least one product line item.');
      return;
    }
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleImageUpload = (id, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleItemChange(id, 'image', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const isColVisible = (colId) => {
    const col = columns.find(c => c.id === colId);
    return col ? col.visible : true;
  };

  return (
    <div className="glass-card p-5 no-print flex flex-col gap-6">
      {/* Editor Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-slate-700/60 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('items')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'items'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileText size={16} />
            <span>Product Line Items ({items.length})</span>
          </button>
          
          <button
            onClick={() => setActiveTab('customer')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'customer'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <User size={16} />
            <span>Client Details</span>
          </button>

          <button
            onClick={() => setActiveTab('company')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'company'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Building size={16} />
            <span>Company Info</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'settings'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <DollarSign size={16} />
            <span>Terms & Taxes</span>
          </button>
        </div>

        {/* Column Hide/Show Quick Trigger */}
        <button
          onClick={onOpenColumnModal}
          className="btn btn-secondary text-xs flex items-center gap-1.5 py-1.5"
        >
          <Sliders size={14} className="text-blue-400" />
          <span>Hide / Show Columns</span>
        </button>
      </div>

      {/* TAB 1: PRODUCT LINE ITEMS */}
      {activeTab === 'items' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Products & Specifications</span>
              <span className="text-xs text-slate-400 font-normal">
                (Fields corresponding to hidden columns will be excluded from the PDF)
              </span>
            </h3>
            
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenCatalog}
                className="btn btn-secondary btn-sm text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10"
              >
                + Insert from Catalog
              </button>
              <button
                onClick={handleAddNewItem}
                className="btn btn-primary btn-sm"
              >
                + Add Custom Row
              </button>
            </div>
          </div>

          {/* List of Product Items */}
          <div className="flex flex-col gap-4">
            {items.map((item, idx) => (
              <div 
                key={item.id} 
                className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 transition-all hover:border-slate-700 relative"
              >
                <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-600/30 text-blue-400 font-bold text-xs flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <span className="font-semibold text-slate-200 text-sm">
                      {item.name || 'Unnamed Product'}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="text-slate-400 hover:text-red-400 p-1 transition-colors"
                    title="Remove Item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                  {/* Image Picker Column */}
                  {isColVisible('image') && (
                    <div className="md:col-span-3 flex flex-col gap-2">
                      <label className="form-label">Product Image</label>
                      <div className="relative group border border-dashed border-slate-700 hover:border-blue-500 rounded-lg p-2 flex flex-col items-center justify-center bg-slate-950/60 min-h-[90px]">
                        {item.image ? (
                          <div className="relative w-full h-20 flex items-center justify-center">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="max-h-full max-w-full object-contain rounded"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="50" height="50"><rect width="100" height="100" rx="8" fill="%231e293b"/><text x="50" y="55" font-family="sans-serif" font-size="12" fill="%2364748b" text-anchor="middle">No Image</text></svg>';
                              }}
                            />
                            <button
                              onClick={() => handleItemChange(item.id, 'image', '')}
                              className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-0.5 text-xs opacity-80 hover:opacity-100 z-10"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <div className="text-center p-2">
                            <ImageIcon className="mx-auto text-slate-500 mb-1" size={20} />
                            <span className="text-xs text-slate-400">Click to upload image</span>
                          </div>
                        )}
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => handleImageUpload(item.id, e)}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="or paste Image URL"
                        value={(item.image || '').startsWith('data:') ? '[Uploaded Image]' : (item.image || '')}
                        onChange={(e) => handleItemChange(item.id, 'image', e.target.value)}
                        className="form-input text-xs"
                      />
                    </div>
                  )}

                  {/* Main Product Fields */}
                  <div className={`${isColVisible('image') ? 'md:col-span-9' : 'md:col-span-12'} grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3`}>
                    
                    {/* Item Code / Sr No */}
                    {isColVisible('productNo') && (
                      <div className="form-group">
                        <label className="form-label">Product # / Model</label>
                        <input
                          type="text"
                          value={item.itemCode || ''}
                          onChange={(e) => handleItemChange(item.id, 'itemCode', e.target.value)}
                          className="form-input"
                          placeholder="e.g. DM-WT-1000"
                        />
                      </div>
                    )}

                    {/* Name */}
                    <div className="form-group sm:col-span-2">
                      <label className="form-label">Product Title / Name</label>
                      <input
                        type="text"
                        value={item.name || ''}
                        onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                        className="form-input font-medium text-white"
                        placeholder="e.g. Durga Industrial Storage Tank"
                      />
                    </div>

                    {/* Description */}
                    {isColVisible('description') && (
                      <div className="form-group sm:col-span-3">
                        <label className="form-label">Description / Features</label>
                        <textarea
                          value={item.description || ''}
                          onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                          className="form-input text-xs"
                          rows={2}
                          placeholder="Detailed product specifications..."
                        />
                      </div>
                    )}

                    {/* Dimensions */}
                    {isColVisible('dimensions') && (
                      <div className="form-group">
                        <label className="form-label">Dimensions</label>
                        <input
                          type="text"
                          value={item.dimensions || ''}
                          onChange={(e) => handleItemChange(item.id, 'dimensions', e.target.value)}
                          className="form-input"
                          placeholder="e.g. 1200 x 1450 mm"
                        />
                      </div>
                    )}

                    {/* Weight */}
                    {isColVisible('weight') && (
                      <div className="form-group">
                        <label className="form-label">Weight</label>
                        <input
                          type="text"
                          value={item.weight || ''}
                          onChange={(e) => handleItemChange(item.id, 'weight', e.target.value)}
                          className="form-input"
                          placeholder="e.g. 45 kg"
                        />
                      </div>
                    )}

                    {/* Capacity */}
                    {isColVisible('capacity') && (
                      <div className="form-group">
                        <label className="form-label">Capacity</label>
                        <input
                          type="text"
                          value={item.capacity || ''}
                          onChange={(e) => handleItemChange(item.id, 'capacity', e.target.value)}
                          className="form-input"
                          placeholder="e.g. 1000 Liters"
                        />
                      </div>
                    )}

                    {/* Unit Price */}
                    {isColVisible('unitPrice') && (
                      <div className="form-group">
                        <label className="form-label">Unit Price ({meta.currency})</label>
                        <input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => handleItemChange(item.id, 'unitPrice', e.target.value)}
                          className="form-input text-emerald-400 font-semibold"
                        />
                      </div>
                    )}

                    {/* Quantity */}
                    {isColVisible('quantity') && (
                      <div className="form-group">
                        <label className="form-label">Quantity</label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)}
                          className="form-input text-center font-bold"
                        />
                      </div>
                    )}

                    {/* Line Total */}
                    {isColVisible('totalPrice') && (
                      <div className="form-group">
                        <label className="form-label">Line Total</label>
                        <div className="form-input bg-slate-950 text-emerald-400 font-bold text-base flex items-center justify-between">
                          <span>{meta.currency}</span>
                          <span>{((item.unitPrice || 0) * (item.quantity || 0)).toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: CLIENT / CUSTOMER DETAILS */}
      {activeTab === 'customer' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label className="form-label">Client Company Name</label>
            <input
              type="text"
              value={customer.name}
              onChange={(e) => handleCustomerChange('name', e.target.value)}
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Contact Person</label>
            <input
              type="text"
              value={customer.contactPerson}
              onChange={(e) => handleCustomerChange('contactPerson', e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Address</label>
            <input
              type="text"
              value={customer.address}
              onChange={(e) => handleCustomerChange('address', e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">City, State & Pincode</label>
            <input
              type="text"
              value={customer.city}
              onChange={(e) => handleCustomerChange('city', e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Client Email</label>
            <input
              type="email"
              value={customer.email}
              onChange={(e) => handleCustomerChange('email', e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">GSTIN / Tax ID</label>
            <input
              type="text"
              value={customer.gstin}
              onChange={(e) => handleCustomerChange('gstin', e.target.value)}
              className="form-input"
            />
          </div>
        </div>
      )}

      {/* TAB 3: COMPANY INFO */}
      {activeTab === 'company' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label className="form-label">Our Company Name</label>
            <input
              type="text"
              value={company.name}
              onChange={(e) => handleCompanyChange('name', e.target.value)}
              className="form-input font-bold text-blue-400"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Tagline / Subtitle</label>
            <input
              type="text"
              value={company.tagline}
              onChange={(e) => handleCompanyChange('tagline', e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Company Address</label>
            <input
              type="text"
              value={company.address}
              onChange={(e) => handleCompanyChange('address', e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">City & State</label>
            <input
              type="text"
              value={company.city}
              onChange={(e) => handleCompanyChange('city', e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Numbers</label>
            <input
              type="text"
              value={company.phone}
              onChange={(e) => handleCompanyChange('phone', e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Our GSTIN</label>
            <input
              type="text"
              value={company.gstin}
              onChange={(e) => handleCompanyChange('gstin', e.target.value)}
              className="form-input"
            />
          </div>
        </div>
      )}

      {/* TAB 4: TERMS & METADATA */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label className="form-label">Quotation Number</label>
            <input
              type="text"
              value={meta.quotationNo}
              onChange={(e) => handleMetaChange('quotationNo', e.target.value)}
              className="form-input font-bold text-blue-400"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Currency Symbol</label>
            <select
              value={meta.currency}
              onChange={(e) => handleMetaChange('currency', e.target.value)}
              className="form-select"
            >
              <option value="₹">₹ (INR - Indian Rupee)</option>
              <option value="$">$ (USD - US Dollar)</option>
              <option value="€">€ (EUR - Euro)</option>
              <option value="£">£ (GBP - British Pound)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Quotation Date</label>
            <input
              type="date"
              value={meta.date}
              onChange={(e) => handleMetaChange('date', e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Valid Until</label>
            <input
              type="date"
              value={meta.validUntil}
              onChange={(e) => handleMetaChange('validUntil', e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">GST / Tax Rate (%)</label>
            <input
              type="number"
              value={meta.taxRate}
              onChange={(e) => handleMetaChange('taxRate', parseFloat(e.target.value) || 0)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Freight / Shipping Cost ({meta.currency})</label>
            <input
              type="number"
              value={meta.shippingCharge}
              onChange={(e) => handleMetaChange('shippingCharge', parseFloat(e.target.value) || 0)}
              className="form-input"
            />
          </div>

          {/* Watermark Settings */}
          <div className="form-group">
            <label className="form-label">Watermark Text</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={meta.watermarkText}
                onChange={(e) => handleMetaChange('watermarkText', e.target.value)}
                className="form-input font-extrabold uppercase tracking-widest text-amber-400"
                placeholder="DURGA"
              />
              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer whitespace-nowrap bg-slate-800 p-2 rounded-lg border border-slate-700">
                <input
                  type="checkbox"
                  checked={meta.showWatermark}
                  onChange={(e) => handleMetaChange('showWatermark', e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                Show Watermark
              </label>
            </div>
          </div>

          <div className="form-group md:col-span-2">
            <label className="form-label">Terms & Conditions</label>
            <textarea
              value={meta.notes}
              onChange={(e) => handleMetaChange('notes', e.target.value)}
              className="form-textarea"
              rows={3}
            />
          </div>
        </div>
      )}
    </div>
  );
}
