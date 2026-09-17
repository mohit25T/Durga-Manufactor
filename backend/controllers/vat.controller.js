import https from "https";

// Local regex patterns for fallback format validation
const vatPatterns = {
  IN: /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z0-9]{1}Z[A-Z0-9]{1}$/, // India GSTIN
  AT: /^ATU\d{8}$/,
  BE: /^BE[01]\d{9}$/,
  BG: /^BG\d{9,10}$/,
  CY: /^CY\d{8}[A-Z]$/,
  CZ: /^CZ\d{8,10}$/,
  DE: /^DE\d{9}$/,
  DK: /^DK\d{8}$/,
  EE: /^EE\d{9}$/,
  EL: /^EL\d{9}$/,
  ES: /^ES[A-Z0-9]\d{7}[A-Z0-9]$/,
  FI: /^FI\d{8}$/,
  FR: /^FR[A-Z0-9]{2}\d{9}$/,
  GB: /^GB(\d{9}|\d{12}|HA\d{3}|GD\d{3})$/,
  HR: /^HR\d{11}$/,
  HU: /^HU\d{8}$/,
  IE: /^IE\d[A-Z0-9\+\*]\d{5}[A-Z]{1,2}$/,
  IT: /^IT\d{11}$/,
  LU: /^LU\d{8}$/,
  LV: /^LV\d{11}$/,
  MT: /^MT\d{8}$/,
  NL: /^NL\d{9}B\d{2}$/,
  PL: /^PL\d{10}$/,
  PT: /^PT\d{9}$/,
  RO: /^RO\d{2,10}$/,
  SE: /^SE\d{12}$/,
  SI: /^SI\d{8}$/,
  SK: /^SK\d{10}$/,
  AE: /^100\d{12}$/, // UAE TRN
  SA: /^3\d{13}3$/, // Saudi Arabia VAT
};

// Fallback VAT rates
const fallbackVatRates = {
  IN: 18.0,
  DE: 19.0,
  FR: 20.0,
  GB: 20.0,
  IT: 22.0,
  ES: 21.0,
  LU: 17.0,
  NL: 21.0,
  BE: 21.0,
  AT: 20.0,
  PL: 23.0,
  SE: 25.0,
  AE: 5.0,
  SA: 15.0,
};

/**
 * Validate VAT Number against Vatlayer API with local regex fallback
 * GET /api/vat/validate?vat_number=...&country_code=...
 */
export const validateVat = async (req, res) => {
  try {
    const rawVat = (req.query.vat_number || req.query.vat || "").toString();
    const cleanVat = rawVat.replace(/[^A-Za-z0-9]/g, "").toUpperCase();

    if (!cleanVat) {
      return res.status(400).json({
        success: false,
        valid: false,
        message: "VAT / GSTIN number is required",
      });
    }

    const apiKey = process.env.VATLAYER_API_KEY || "demo_key";
    const apiUrl = `https://apilayer.net/api/validate?access_key=${apiKey}&vat_number=${cleanVat}`;

    https.get(apiUrl, (apiRes) => {
      let data = "";
      apiRes.on("data", (chunk) => (data += chunk));
      apiRes.on("end", () => {
        try {
          const json = JSON.parse(data);
          if (json.valid !== undefined && json.format_valid !== undefined) {
            return res.status(200).json({
              success: true,
              valid: json.valid,
              format_valid: json.format_valid,
              query: json.query || cleanVat,
              country_code: json.country_code || cleanVat.substring(0, 2),
              vat_number: json.vat_number || cleanVat,
              company_name: json.company_name || null,
              company_address: json.company_address || null,
              database: json.database || "ok",
            });
          } else {
            // Local regex fallback
            return performLocalVatValidation(cleanVat, res, json.error?.info);
          }
        } catch (_) {
          return performLocalVatValidation(cleanVat, res, "JSON Parse Fallback");
        }
      });
    }).on("error", (err) => {
      return performLocalVatValidation(cleanVat, res, err.message);
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to validate VAT number",
    });
  }
};

/**
 * Get VAT Rate for Country
 * GET /api/vat/rate?country_code=...
 */
export const getVatRate = async (req, res) => {
  try {
    const countryCode = (req.query.country_code || "IN").toString().toUpperCase();
    const rate = fallbackVatRates[countryCode] || 18.0;

    return res.status(200).json({
      success: true,
      country_code: countryCode,
      country_name: countryCode,
      standard_rate: rate,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to get VAT rate",
    });
  }
};

/**
 * Calculate VAT Price
 * GET /api/vat/price?amount=...&country_code=...
 */
export const calculateVatPrice = async (req, res) => {
  try {
    const amount = parseFloat(req.query.amount || "0");
    const countryCode = (req.query.country_code || "IN").toString().toUpperCase();
    const rate = fallbackVatRates[countryCode] || 18.0;

    const vatAmount = (amount * rate) / 100.0;
    const priceInclVat = amount + vatAmount;

    return res.status(200).json({
      success: true,
      country_code: countryCode,
      price_excl_vat: amount,
      price_incl_vat: priceInclVat,
      vat_rate: rate,
      vat_amount: vatAmount,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to calculate VAT price",
    });
  }
};

// Helper function for local regex format validation
function performLocalVatValidation(cleanVat, res, errorInfo) {
  const country = cleanVat.substring(0, 2);
  let isFormatValid = false;

  if (vatPatterns[country]) {
    isFormatValid = vatPatterns[country].test(cleanVat);
  } else {
    isFormatValid = /^[A-Z]{2}[A-Z0-9]{6,15}$/.test(cleanVat);
  }

  return res.status(200).json({
    success: true,
    valid: isFormatValid,
    format_valid: isFormatValid,
    query: cleanVat,
    country_code: vatPatterns[country] ? country : (cleanVat.length >= 2 ? country : "GLOBAL"),
    vat_number: cleanVat.length > 2 ? cleanVat.substring(2) : cleanVat,
    company_name: null,
    company_address: null,
    database: isFormatValid ? "Format Verified (Local Regex)" : "Invalid Format",
    error_info: errorInfo || null,
  });
}
