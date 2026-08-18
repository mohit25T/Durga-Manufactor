export const DEFAULT_COMPANY = {
  name: 'DURGA MANUFACTOR',
  tagline: 'Precision Engineering & Industrial Manufacturing Solutions',
  address: 'Plot No. 42, Industrial Area Phase II, MIDC',
  city: 'Pune, Maharashtra - 411026, India',
  phone: '+91 98765 43210 / +91 020 2748 9900',
  email: 'sales@durgamanufactor.com',
  website: 'www.durgamanufactor.com',
  gstin: '27AAACD1234E1Z5',
  logoText: 'DURGA',
  logoUrl: '', // Optional image URL
};

export const DEFAULT_CUSTOMER = {
  name: 'Apex Industrial Solutions Pvt Ltd',
  contactPerson: 'Mr. Rajesh Sharma (Procurement Head)',
  address: '104, Tech Tower, GIDC Estate',
  city: 'Ahmedabad, Gujarat - 380015',
  phone: '+91 98250 11223',
  email: 'r.sharma@apexindustrial.in',
  gstin: '24AABCA5678F2Z8',
};

export const DEFAULT_QUOTATION_META = {
  quotationNo: 'DM-QT-2026-0842',
  date: new Date().toISOString().split('T')[0],
  validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  currency: '₹',
  taxRate: 18, // GST %
  shippingCharge: 0,
  notes: '1. Prices are valid for 30 days from issuance date.\n2. Delivery within 2-3 weeks from receipt of confirmed purchase order.\n3. Warranty: 12 Months standard manufacturer warranty.',
  paymentTerms: '50% Advance with Purchase Order, 50% upon delivery before installation.',
  watermarkText: 'DURGA',
  showWatermark: true,
  watermarkOpacity: 0.08,
};

export const INITIAL_COLUMNS = [
  { id: 'productNo', label: 'Product # / Sr No', visible: true, key: 'itemCode' },
  { id: 'image', label: 'Product Image', visible: true, key: 'image' },
  { id: 'description', label: 'Description / Title', visible: true, key: 'name' },
  { id: 'dimensions', label: 'Dimensions (LxWxH)', visible: true, key: 'dimensions' },
  { id: 'weight', label: 'Weight', visible: true, key: 'weight' },
  { id: 'capacity', label: 'Capacity', visible: true, key: 'capacity' },
  { id: 'unitPrice', label: 'Unit Price', visible: true, key: 'unitPrice' },
  { id: 'quantity', label: 'Qty', visible: true, key: 'quantity' },
  { id: 'totalPrice', label: 'Total Amount', visible: true, key: 'total' },
];

export const CATALOG_PRODUCTS = [
  {
    id: 'prod-1',
    itemCode: 'DM-WT-1000',
    name: 'Durga High-Capacity Water Storage Tank',
    description: 'Heavy duty multi-layer insulated polyethylene water storage tank with anti-bacterial lining.',
    dimensions: '1200 x 1200 x 1450 mm',
    weight: '45.5 kg',
    capacity: '1,000 Liters',
    unitPrice: 18500,
    image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200"><rect width="200" height="200" rx="16" fill="%230f172a"/><path d="M60 45 h80 a10 10 0 0 1 10 10 v100 a15 15 0 0 1 -15 15 h-70 a15 15 0 0 1 -15 -15 v-100 a10 10 0 0 1 10 -10 z" fill="%232563eb" stroke="%233b82f6" stroke-width="4"/><ellipse cx="100" cy="45" rx="40" ry="8" fill="%231d4ed8" stroke="%2360a5fa" stroke-width="2"/><rect x="85" y="32" width="30" height="13" rx="3" fill="%231e293b" stroke="%23475569" stroke-width="2"/><line x1="60" y1="75" x2="140" y2="75" stroke="%231d4ed8" stroke-width="3"/><line x1="60" y1="105" x2="140" y2="105" stroke="%231d4ed8" stroke-width="3"/><line x1="60" y1="135" x2="140" y2="135" stroke="%231d4ed8" stroke-width="3"/><text x="100" y="112" font-family="Arial, sans-serif" font-weight="900" font-size="12" fill="%23ffffff" text-anchor="middle" letter-spacing="1">DURGA 1000L</text></svg>',
  },
  {
    id: 'prod-2',
    itemCode: 'DM-WT-2500',
    name: 'Durga Commercial Process Water Tank',
    description: 'Triple-layer UV protected heavy duty industrial water reservoir for chemical & process water storage.',
    dimensions: '1650 x 1650 x 1950 mm',
    weight: '98.0 kg',
    capacity: '2,500 Liters',
    unitPrice: 38200,
    image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200"><rect width="200" height="200" rx="16" fill="%230f172a"/><path d="M50 40 h100 a12 12 0 0 1 12 12 v110 a16 16 0 0 1 -16 16 h-80 a16 16 0 0 1 -16 -16 v-110 a12 12 0 0 1 12 -12 z" fill="%230284c7" stroke="%2338bdf8" stroke-width="4"/><ellipse cx="100" cy="40" rx="50" ry="10" fill="%230369a1" stroke="%237dd3fc" stroke-width="2"/><rect x="80" y="25" width="40" height="15" rx="4" fill="%231e293b" stroke="%23475569" stroke-width="2"/><line x1="50" y1="75" x2="150" y2="75" stroke="%230369a1" stroke-width="4"/><line x1="50" y1="110" x2="150" y2="110" stroke="%230369a1" stroke-width="4"/><line x1="50" y1="145" x2="150" y2="145" stroke="%230369a1" stroke-width="4"/><text x="100" y="116" font-family="Arial, sans-serif" font-weight="900" font-size="13" fill="%23ffffff" text-anchor="middle" letter-spacing="1">DURGA 2500L</text></svg>',
  },
  {
    id: 'prod-3',
    itemCode: 'DM-HP-50',
    name: 'Durga Heavy Duty Hydraulic Pressure Tank',
    description: 'Stainless steel SS316 grade pressurized water tank engineered for continuous commercial water supply.',
    dimensions: '800 x 800 x 1200 mm',
    weight: '62.0 kg',
    capacity: '500 Liters',
    unitPrice: 54000,
    image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200"><rect width="200" height="200" rx="16" fill="%230f172a"/><path d="M65 50 h70 a20 20 0 0 1 20 20 v90 a10 10 0 0 1 -10 10 h-90 a10 10 0 0 1 -10 -10 v-90 a20 20 0 0 1 20 -20 z" fill="%2364748b" stroke="%2394a3b8" stroke-width="4"/><path d="M65 50 a20 20 0 0 1 70 0" fill="%23475569"/><rect x="90" y="25" width="20" height="25" fill="%23334155" stroke="%2394a3b8" stroke-width="2"/><circle cx="100" cy="22" r="10" fill="%23f59e0b" stroke="%23d97706" stroke-width="2"/><text x="100" y="115" font-family="Arial, sans-serif" font-weight="900" font-size="11" fill="%23ffffff" text-anchor="middle">SS316 HYDRAULIC</text></svg>',
  },
  {
    id: 'prod-4',
    itemCode: 'DM-RO-500L',
    name: 'Durga Commercial RO Filtration Vessel',
    description: 'FRP High Pressure Vessel with automatic backwash valve system & digital pressure monitoring.',
    dimensions: '600 x 600 x 1800 mm',
    weight: '38.0 kg',
    capacity: '500 LPH',
    unitPrice: 72500,
    image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200"><rect width="200" height="200" rx="16" fill="%230f172a"/><rect x="75" y="30" width="50" height="140" rx="25" fill="%230d9488" stroke="%232dd4bf" stroke-width="4"/><rect x="85" y="20" width="30" height="15" rx="3" fill="%23115e59"/><circle cx="100" cy="70" r="12" fill="%23134e4a" stroke="%232dd4bf" stroke-width="2"/><circle cx="100" cy="130" r="12" fill="%23134e4a" stroke="%232dd4bf" stroke-width="2"/><text x="100" y="104" font-family="Arial, sans-serif" font-weight="900" font-size="10" fill="%23ffffff" text-anchor="middle">RO VESSEL</text></svg>',
  },
  {
    id: 'prod-5',
    itemCode: 'DM-PMP-75',
    name: 'Durga Submersible Heavy Duty Slurry Pump',
    description: 'High efficiency 7.5 HP cast iron submersible pump for industrial effluent & drainage management.',
    dimensions: '450 x 400 x 750 mm',
    weight: '52.0 kg',
    capacity: '450 L/min',
    unitPrice: 29800,
    image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200"><rect width="200" height="200" rx="16" fill="%230f172a"/><rect x="65" y="60" width="70" height="90" rx="10" fill="%23ea580c" stroke="%23fb923c" stroke-width="4"/><rect x="75" y="35" width="50" height="25" rx="5" fill="%23c2410c"/><rect x="85" y="150" width="30" height="20" rx="2" fill="%237c2d12"/><text x="100" y="112" font-family="Arial, sans-serif" font-weight="900" font-size="11" fill="%23ffffff" text-anchor="middle">7.5HP PUMP</text></svg>',
  }
];

export const INITIAL_ITEMS = [
  {
    id: 'item-1',
    itemCode: 'DM-WT-1000',
    name: 'Durga High-Capacity Water Storage Tank',
    description: 'Heavy duty multi-layer insulated polyethylene water storage tank with anti-bacterial lining.',
    dimensions: '1200 x 1200 x 1450 mm',
    weight: '45.5 kg',
    capacity: '1,000 Liters',
    unitPrice: 18500,
    quantity: 2,
    image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200"><rect width="200" height="200" rx="16" fill="%230f172a"/><path d="M60 45 h80 a10 10 0 0 1 10 10 v100 a15 15 0 0 1 -15 15 h-70 a15 15 0 0 1 -15 -15 v-100 a10 10 0 0 1 10 -10 z" fill="%232563eb" stroke="%233b82f6" stroke-width="4"/><ellipse cx="100" cy="45" rx="40" ry="8" fill="%231d4ed8" stroke="%2360a5fa" stroke-width="2"/><rect x="85" y="32" width="30" height="13" rx="3" fill="%231e293b" stroke="%23475569" stroke-width="2"/><line x1="60" y1="75" x2="140" y2="75" stroke="%231d4ed8" stroke-width="3"/><line x1="60" y1="105" x2="140" y2="105" stroke="%231d4ed8" stroke-width="3"/><line x1="60" y1="135" x2="140" y2="135" stroke="%231d4ed8" stroke-width="3"/><text x="100" y="112" font-family="Arial, sans-serif" font-weight="900" font-size="12" fill="%23ffffff" text-anchor="middle" letter-spacing="1">DURGA 1000L</text></svg>',
  },
  {
    id: 'item-2',
    itemCode: 'DM-WT-2500',
    name: 'Durga Commercial Process Water Tank',
    description: 'Triple-layer UV protected heavy duty industrial water reservoir for chemical & process water storage.',
    dimensions: '1650 x 1650 x 1950 mm',
    weight: '98.0 kg',
    capacity: '2,500 Liters',
    unitPrice: 38200,
    quantity: 1,
    image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200"><rect width="200" height="200" rx="16" fill="%230f172a"/><path d="M50 40 h100 a12 12 0 0 1 12 12 v110 a16 16 0 0 1 -16 16 h-80 a16 16 0 0 1 -16 -16 v-110 a12 12 0 0 1 12 -12 z" fill="%230284c7" stroke="%2338bdf8" stroke-width="4"/><ellipse cx="100" cy="40" rx="50" ry="10" fill="%230369a1" stroke="%237dd3fc" stroke-width="2"/><rect x="80" y="25" width="40" height="15" rx="4" fill="%231e293b" stroke="%23475569" stroke-width="2"/><line x1="50" y1="75" x2="150" y2="75" stroke="%230369a1" stroke-width="4"/><line x1="50" y1="110" x2="150" y2="110" stroke="%230369a1" stroke-width="4"/><line x1="50" y1="145" x2="150" y2="145" stroke="%230369a1" stroke-width="4"/><text x="100" y="116" font-family="Arial, sans-serif" font-weight="900" font-size="13" fill="%23ffffff" text-anchor="middle" letter-spacing="1">DURGA 2500L</text></svg>',
  },
];

