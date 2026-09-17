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
    hi: "अस्वीकृत",
  },
  submitted: {
    en: "Submitted to Factory",
    gu: "ફેક્ટરીમાં સબમિટ કરેલ",
    hi: "फ़ैक्टरी में जमा किया गया",
  },
  pi_generated: {
    en: "Proforma Invoice (PI) Ready",
    gu: "પ્રોફોર્મા ઇનવોઇસ તૈયાર છે",
    hi: "प्रोफार्मा चालान तैयार है",
  },
  po_uploaded: {
    en: "Signed PO Uploaded",
    gu: "સાઇન કરેલ PO અપલોડ કર્યું",
    hi: "हस्ताक्षरित PO अपलोड किया गया",
  },
};

export const langMiddleware = (req, res, next) => {
  const acceptLang = req.headers["accept-language"] || req.query.lang || "en";
  req.lang = ["en", "gu", "hi"].includes(acceptLang) ? acceptLang : "en";

  // Override res.json to format translated fields if available
  const originalJson = res.json;
  res.json = function (body) {
    if (body && typeof body === "object" && req.lang !== "en") {
      body = translateResponseBody(body, req.lang);
    }
    return originalJson.call(this, body);
  };

  next();
};

function translateResponseBody(obj, lang) {
  if (Array.isArray(obj)) {
    return obj.map((item) => translateResponseBody(item, lang));
  } else if (obj !== null && typeof obj === "object") {
    const newObj = {};
    for (const key of Object.keys(obj)) {
      const val = obj[key];
      if (key === "status" && typeof val === "string" && statusTranslations[val.toLowerCase()]) {
        newObj[key] = val;
        newObj["status_translated"] = statusTranslations[val.toLowerCase()][lang] || val;
      } else if (key.endsWith(`_${lang}`) && val) {
        const baseKey = key.replace(`_${lang}`, "");
        newObj[baseKey] = val;
        newObj[key] = val;
      } else {
        newObj[key] = translateResponseBody(val, lang);
      }
    }
    return newObj;
  }
  return obj;
}
