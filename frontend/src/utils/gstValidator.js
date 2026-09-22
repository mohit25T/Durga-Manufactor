/**
 * GSTIN Validation Utility
 * Validates strict 15-character GSTIN pattern:
 * - Chars 1-2   : 2 Numbers (State Code, e.g. 24 -> Gujarat)
 * - Chars 3-7   : 5 Alphabets (A-Z)
 * - Chars 8-11  : 4 Digits (0-9)
 * - Char 12     : 1 Alphabet (A-Z)
 * - Char 13     : 1 Number (0-9)
 * - Char 14     : Compulsory 'Z'
 * - Char 15     : Checksum Digit (calculated via Dhananjay Gokhale Luhn Mod 36 algorithm)
 *
 * Reference: https://medium.com/@dhananjaygokhale/decoding-gst-number-checksum-digit-1ef2c8c53ad6
 */

export const GST_CHARSET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

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

/**
 * Calculates the 15th Checksum Digit using the Dhananjay Gokhale algorithm (Luhn Mod 36):
 * Reference: https://medium.com/@dhananjaygokhale/decoding-gst-number-checksum-digit-1ef2c8c53ad6
 *
 * Steps:
 * 1. Assign numeric code [C] for each of the 14 characters:
 *    '0'-'9' -> 0-9, 'A'-'Z' -> 10-35
 * 2. Multiply each code [C] by multiplier [M] alternating between 1 and 2:
 *    Positions 1, 3, 5, 7, 9, 11, 13 (odd, 0-indexed even): M = 1
 *    Positions 2, 4, 6, 8, 10, 12, 14 (even, 0-indexed odd): M = 2
 * 3. Product [P] = C * M.
 *    Divide P by 36: Quotient [Q] = Math.floor(P / 36), Remainder [R] = P % 36.
 *    Hash = Q + R.
 * 4. Sum [S] = Sum of all 14 hashes.
 * 5. Remainder [Z] = S % 36.
 * 6. Checksum Code [Y] = (36 - Z) % 36.
 * 7. Look up character at index Y in GST_CHARSET.
 */
export const calculateGSTChecksum = (first14Chars) => {
  if (!first14Chars || first14Chars.length < 14) return null;
  const clean = first14Chars.substring(0, 14).toUpperCase();
  let sum = 0;
  for (let i = 0; i < 14; i++) {
    const char = clean[i];
    const code = GST_CHARSET.indexOf(char);
    if (code === -1) return null;

    const multiplier = (i % 2 === 0) ? 1 : 2;
    const product = code * multiplier;
    const quotient = Math.floor(product / 36);
    const remainder = product % 36;
    sum += (quotient + remainder);
  }
  const z = sum % 36;
  const checkCode = (36 - z) % 36;
  return GST_CHARSET[checkCode];
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
  { pos: 15, desc: "the calculated checksum character (0-9 or A-Z)", test: (c) => /^[0-9A-Z]$/.test(c), eg: "0" }
];

export const getNextGSTHint = (length, text = "") => {
  if (!length || length === 0) {
    return "Format: 2 Numbers (State Code) + 5 Letters (PAN) + 4 Digits + 1 Letter + 1 Number + Z + Checksum (e.g. 24AHMPT0206E1ZO)";
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

  if (length === 14 && text && text.length >= 14) {
    const expectedChecksum = calculateGSTChecksum(text.substring(0, 14));
    if (expectedChecksum) {
      return `${statePrefix}Pos 15/15: Calculated Checksum is '${expectedChecksum}' (Dhananjay Gokhale algorithm)`;
    }
  }

  if (length >= 15) {
    return `${statePrefix}Valid 15-character GSTIN pattern complete!`;
  }
  const next = GST_RULES[length];
  return `${statePrefix}Pos ${next.pos}/15: Enter ${next.desc}`;
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
    const expectedChecksum = upper.length >= 14 ? calculateGSTChecksum(upper.substring(0, 14)) : null;
    return {
      accepted: true,
      value: upper,
      message: getNextGSTHint(upper.length, upper),
      isError: false,
      isComplete: false,
      stateName,
      stateCode,
      expectedChecksum
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

  // Validate first 14 characters against position rules
  const limit = upper.length > 14 ? 14 : upper.length;
  for (let i = 0; i < limit; i++) {
    const char = upper[i];
    const rule = GST_RULES[i];
    if (!rule.test(char)) {
      return {
        accepted: false,
        value: oldVal, // DO NOT TAKE INPUT!
        message: `⚠️ Rejected '${char}': Position ${rule.pos} must be ${rule.desc}`,
        isError: true,
        isComplete: false
      };
    }
  }

  // If 15th character is entered, verify Dhananjay Gokhale Checksum
  let expectedChecksum = null;
  if (upper.length >= 14) {
    expectedChecksum = calculateGSTChecksum(upper.substring(0, 14));
  }

  if (upper.length === 15 && expectedChecksum !== null) {
    const entered15th = upper[14];
    if (entered15th !== expectedChecksum) {
      return {
        accepted: false,
        value: oldVal, // DO NOT TAKE INPUT!
        message: `⚠️ Rejected '${entered15th}': 15th checksum character must be '${expectedChecksum}' `,
        isError: true,
        isComplete: false,
        expectedChecksum
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
      ? (stateName ? `✅ Valid 15-character GSTIN complete for ${stateName} (Code: ${stateCode}, Checksum: ${expectedChecksum})!` : `✅ Valid 15-character GSTIN complete (Checksum: ${expectedChecksum} Verified)!`)
      : getNextGSTHint(upper.length, upper),
    isError: false,
    isComplete,
    stateName,
    stateCode,
    expectedChecksum
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

  for (let i = 0; i < 14; i++) {
    const char = cleanGSTIN[i];
    const rule = GST_RULES[i];
    if (!rule.test(char)) {
      return {
        isValid: false,
        message: `Invalid Char ${rule.pos} ('${char}'): Must be ${rule.desc}.`
      };
    }
  }

  const expectedChecksum = calculateGSTChecksum(cleanGSTIN.substring(0, 14));
  if (expectedChecksum !== null && cleanGSTIN[14] !== expectedChecksum) {
    return {
      isValid: false,
      message: `Invalid Checksum Digit ('${cleanGSTIN[14]}'): Must be '${expectedChecksum}' based on GST checksum algorithm. Full GSTIN should be: ${cleanGSTIN.substring(0, 14)}${expectedChecksum}`,
      expectedChecksum
    };
  }

  const stateCode = cleanGSTIN.substring(0, 2);
  const stateName = getStateName(stateCode);

  return {
    isValid: true,
    message: stateName ? `Valid GSTIN for ${stateName} (Code: ${stateCode}, Checksum: ${expectedChecksum})` : `Valid GSTIN (Checksum: ${expectedChecksum} Verified)`,
    stateName,
    stateCode,
    expectedChecksum
  };
};
