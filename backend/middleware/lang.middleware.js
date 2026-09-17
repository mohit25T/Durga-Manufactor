/**
 * Node.js Express Localization Middleware
 * Translates backend API responses based on Accept-Language header ('en', 'gu', 'hi')
 */

const statusTranslations = {
  pending: {
    en: "Pending Admin Review",
    gu: "એડમિન સમીક્ષા બાકી",
    hi: "एडमिन समीक्षा लंबित",
  },
  approved: {
    en: "Approved",
    gu: "મંજૂર",
    hi: "स्वीकृत",
  },
  rejected: {
    en: "Rejected",
    gu: "અસ્વીકૃત",
    hi: "અસ્વીકૃત",
  },
  submitted: {
    en: "Submitted to Factory",
    gu: "ફેક્ટરીમાં સબમિટ કરેલ",
    hi: "फ़ैक्टરી में जमा किया गया",
  },
  pi_generated: {
    en: "Proforma Invoice (PI) Ready",
    gu: "પ્રોફોર્મા ઇનવોઇસ તૈયાર છે",
    hi: "प्रोफાર્મા ચાલાન તૈયાર હે",
  },
  po_uploaded: {
    en: "Signed PO Uploaded",
    gu: "સાઇન કરેલ PO અપલોડ કર્યું",
    hi: "હસ્તાક્ષરિત PO અપલોડ કિયા ગયા",
  },
};

export const langMiddleware = (req, res, next) => {
  const acceptLang = req.headers["accept-language"] || req.query.lang || "en";
  req.lang = ["en", "gu", "hi"].includes(acceptLang) ? acceptLang : "en";

  // Override res.json to format translated fields safely
  const originalJson = res.json;
  res.json = function (body) {
    if (body && typeof body === "object" && req.lang !== "en") {
      try {
        // Convert Mongoose documents or complex objects to clean plain JSON first
        const plainBody = JSON.parse(JSON.stringify(body));
        body = translateResponseBody(plainBody, req.lang);
      } catch (err) {
        console.warn("⚠️ Language middleware translation skipped due to serialization:", err.message);
      }
    }
    return originalJson.call(this, body);
  };

  next();
};

function translateResponseBody(obj, lang, depth = 0, seen = new WeakSet()) {
  // Guard against deep stack recursion
  if (depth > 12) return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => translateResponseBody(item, lang, depth + 1, seen));
  } else if (obj !== null && typeof obj === "object") {
    if (seen.has(obj)) return obj;
    seen.add(obj);

    const newObj = {};
    for (const key of Object.keys(obj)) {
      // Ignore internal Mongoose / Buffer keys
      if (key.startsWith("$") || key.startsWith("_doc")) continue;

      const val = obj[key];
      if (key === "status" && typeof val === "string" && statusTranslations[val.toLowerCase()]) {
        newObj[key] = val;
        newObj["status_translated"] = statusTranslations[val.toLowerCase()][lang] || val;
      } else if (key.endsWith(`_${lang}`) && val) {
        const baseKey = key.replace(`_${lang}`, "");
        newObj[baseKey] = val;
        newObj[key] = val;
      } else if (typeof val === "object" && val !== null) {
        newObj[key] = translateResponseBody(val, lang, depth + 1, seen);
      } else {
        newObj[key] = val;
      }
    }
    return newObj;
  }
  return obj;
}
