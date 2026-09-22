/**
 * GSTIN Validation Utility
 * Validates strict 15-character GSTIN pattern:
 * - Chars 1-2   : 2 Numbers (State Code, e.g. 24 -> Gujarat)
 * - Chars 3-7   : 5 Alphabets (A-Z)
 * - Chars 8-11  : 4 Digits (0-9)
 * - Char 12     : 1 Alphabet (A-Z)
 * - Char 13     : 1 Number (0-9)
 * - Char 14     : Compulsory 'Z'
 * - Char 15     : 1 Digit (0-9)
 *
 * Example: 24AHMPT0206E1Z0
 */

export const GST_STATE_CODES = {
  "01": "Jammu and Kashmir",
  "02": "Himachal Pradesh",
  "03": "Punjab",
  "04": "Chandigarh",
  "05": "Uttarakhand",
  "06": "Haryana",
  "07": "Delhi",
  "08": "Rajasthan",
  "09": "Uttar Pradesh",
  "10": "Bihar",
  "11": "Sikkim",
  "12": "Arunachal Pradesh",
  "13": "Nagaland",
  "14": "Manipur",
  "15": "Mizoram",
  "16": "Tripura",
  "17": "Meghalaya",
  "18": "Assam",
  "19": "West Bengal",
  "20": "Jharkhand",
  "21": "Odisha",
  "22": "Chhattisgarh",
  "23": "Madhya Pradesh",
  "24": "Gujarat",
  "26": "Dadra and Nagar Haveli and Daman and Diu",
  "27": "Maharashtra",
  "29": "Karnataka",
  "30": "Goa",
  "31": "Lakshadweep",
  "32": "Kerala",
  "33": "Tamil Nadu",
  "34": "Puducherry",
  "35": "Andaman and Nicobar Islands",
  "36": "Telangana",
  "37": "Andhra Pradesh",
  "38": "Ladakh",
  "97": "Other Territory",
  "99": "Centre Jurisdiction / Other Country"
};

export const getStateName = (code) => {
  return GST_STATE_CODES[code] || null;
};

export const GST_RULES = [
  { pos: 1, desc: "a NUMBER (0-9) for state code", test: (c) => /^[0-9]$/.test(c), eg: "2" },
  { pos: 2, desc: "a NUMBER (0-9) for state code", test: (c) => /^[0-9]$/.test(c), eg: "4" },
  { pos: 3, desc: "1st LETTER of PAN (A-Z)", test: (c) => /^[A-Z]$/.test(c), eg: "A" },
  { pos: 4, desc: "2nd LETTER of PAN (A-Z)", test: (c) => /^[A-Z]$/.test(c), eg: "H" },
  { pos: 5, desc: "3rd LETTER of PAN (A-Z)", test: (c) => /^[A-Z]$/.test(c), eg: "M" },
  { pos: 6, desc: "4th LETTER of PAN (A-Z)", test: (c) => /^[A-Z]$/.test(c), eg: "P" },
  { pos: 7, desc: "5th LETTER of PAN (A-Z)", test: (c) => /^[A-Z]$/.test(c), eg: "T" },
  { pos: 8, desc: "1st DIGIT of PAN (0-9)", test: (c) => /^[0-9]$/.test(c), eg: "0" },
  { pos: 9, desc: "2nd DIGIT of PAN (0-9)", test: (c) => /^[0-9]$/.test(c), eg: "2" },
  { pos: 10, desc: "3rd DIGIT of PAN (0-9)", test: (c) => /^[0-9]$/.test(c), eg: "0" },
  { pos: 11, desc: "4th DIGIT of PAN (0-9)", test: (c) => /^[0-9]$/.test(c), eg: "6" },
  { pos: 12, desc: "1 LETTER (A-Z)", test: (c) => /^[A-Z]$/.test(c), eg: "E" },
  { pos: 13, desc: "1 NUMBER (0-9)", test: (c) => /^[0-9]$/.test(c), eg: "1" },
  { pos: 14, desc: "compulsory letter 'Z'", test: (c) => c === "Z", eg: "Z" },
  { pos: 15, desc: "1 DIGIT (0-9)", test: (c) => /^[0-9]$/.test(c), eg: "0" }
];

export const getNextGSTHint = (length, text = "") => {
  if (!length || length === 0) {
    return "Format: 2 Numbers (State Code) + 5 Letters (PAN) + 4 Digits + 1 Letter + 1 Number + Z + 1 Digit (e.g. 24AHMPT0206E1Z0)";
  }
  if (length === 1) {
    return "Pos 2/15: Enter 2nd digit of State Code (0-9)";
  }

  let statePrefix = "";
  if (text && text.length >= 2) {
    const code = text.substring(0, 2);
    const state = getStateName(code);
    if (state) {
      statePrefix = `📍 State: ${state} (Code ${code}) • `;
    } else {
      statePrefix = `⚠️ Unknown State Code '${code}' • `;
    }
  }

  if (length >= 15) {
    return `${statePrefix}Valid 15-character GSTIN pattern complete!`;
  }
  const next = GST_RULES[length];
  return `${statePrefix}Pos ${next.pos}/15: Enter ${next.desc} (Pattern: 24AHMPT0206E1Z0)`;
};

/**
 * Filter keystrokes / input:
 * If character doesn't match condition at that position, rejects input and provides suggestion.
 */
export const filterGSTINInput = (newVal = "", oldVal = "") => {
  const upper = newVal.toUpperCase();

  // If user deleted characters, allow
  if (upper.length < (oldVal || "").length) {
    const stateCode = upper.length >= 2 ? upper.substring(0, 2) : null;
    const stateName = stateCode ? getStateName(stateCode) : null;
    return {
      accepted: true,
      value: upper,
      message: getNextGSTHint(upper.length, upper),
      isError: false,
      isComplete: false,
      stateName,
      stateCode
    };
  }

  if (upper.length > 15) {
    return {
      accepted: false,
      value: oldVal,
      message: "⚠️ Maximum 15 characters allowed for GSTIN.",
      isError: true,
      isComplete: false
    };
  }

  // Validate each character against position rules
  for (let i = 0; i < upper.length; i++) {
    const char = upper[i];
    const rule = GST_RULES[i];
    if (!rule.test(char)) {
      return {
        accepted: false,
        value: oldVal, // DO NOT TAKE INPUT!
        message: `⚠️ Rejected '${char}': Position ${rule.pos} must be ${rule.desc} (Pattern: 24AHMPT0206E1Z0)`,
        isError: true,
        isComplete: false
      };
    }
  }

  const isComplete = upper.length === 15;
  const stateCode = upper.length >= 2 ? upper.substring(0, 2) : null;
  const stateName = stateCode ? getStateName(stateCode) : null;

  return {
    accepted: true,
    value: upper,
    message: isComplete
      ? (stateName ? `✅ Valid 15-character GSTIN complete for ${stateName} (Code: ${stateCode})!` : "✅ Valid 15-character GSTIN pattern complete!")
      : getNextGSTHint(upper.length, upper),
    isError: false,
    isComplete,
    stateName,
    stateCode
  };
};

export const validateGSTIN = (gstin) => {
  if (!gstin) return { isValid: false, message: "GSTIN is required" };

  const cleanGSTIN = gstin.trim().toUpperCase();

  if (cleanGSTIN.length !== 15) {
    return {
      isValid: false,
      message: `GSTIN must be exactly 15 characters (Entered: ${cleanGSTIN.length}). Expected Format: 24AHMPT0206E1Z0`
    };
  }

  for (let i = 0; i < 15; i++) {
    const char = cleanGSTIN[i];
    const rule = GST_RULES[i];
    if (!rule.test(char)) {
      return {
        isValid: false,
        message: `Invalid Char ${rule.pos} ('${char}'): Must be ${rule.desc}. Expected Format: 24AHMPT0206E1Z0`
      };
    }
  }

  const stateCode = cleanGSTIN.substring(0, 2);
  const stateName = getStateName(stateCode);

  return {
    isValid: true,
    message: stateName ? `Valid GSTIN for ${stateName} (Code: ${stateCode})` : "Valid GSTIN Pattern",
    stateName,
    stateCode
  };
};
