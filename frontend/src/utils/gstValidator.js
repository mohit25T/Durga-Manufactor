/**
 * GSTIN Validation Utility
 * Validates strict 15-character GSTIN pattern:
 * - Chars 1-2   : 2 Numbers (State Code, e.g. 24)
 * - Chars 3-7   : 5 Alphabets (A-Z)
 * - Chars 8-11  : 4 Digits (0-9)
 * - Char 12     : 1 Alphabet (A-Z)
 * - Char 13     : 1 Number (0-9)
 * - Char 14     : Compulsory 'Z'
 * - Char 15     : 1 Digit (0-9)
 *
 * Example: 24AHMPT0206E1Z0
 */

export const validateGSTIN = (gstin) => {
  if (!gstin) return { isValid: false, message: "GSTIN is required" };

  const cleanGSTIN = gstin.trim().toUpperCase();

  if (cleanGSTIN.length !== 15) {
    return {
      isValid: false,
      message: `GSTIN must be exactly 15 characters (Entered: ${cleanGSTIN.length}). Expected Format: 24AHMPT0206E1Z0`
    };
  }

  // 1. Chars 1-2: 2 Numbers (State Code)
  if (!/^[0-9]{2}$/.test(cleanGSTIN.substring(0, 2))) {
    return {
      isValid: false,
      message: `Invalid Chars 1-2 ('${cleanGSTIN.substring(0, 2)}'): Must be 2 NUMBERS for state code (e.g. '24' for Gujarat, '27' for Maharashtra).`
    };
  }

  // 2. Chars 3-7: 5 Alphabets
  if (!/^[A-Z]{5}$/.test(cleanGSTIN.substring(2, 7))) {
    return {
      isValid: false,
      message: `Invalid Chars 3-7 ('${cleanGSTIN.substring(2, 7)}'): Must be 5 LETTERS (A-Z). E.g., 24AHMPT0206E1Z0`
    };
  }

  // 3. Chars 8-11: 4 Digits
  if (!/^[0-9]{4}$/.test(cleanGSTIN.substring(7, 11))) {
    return {
      isValid: false,
      message: `Invalid Chars 8-11 ('${cleanGSTIN.substring(7, 11)}'): Must be 4 DIGITS (0-9). E.g., 24AHMPT0206E1Z0`
    };
  }

  // 4. Char 12: 1 Alphabet
  if (!/^[A-Z]{1}$/.test(cleanGSTIN.substring(11, 12))) {
    return {
      isValid: false,
      message: `Invalid Char 12 ('${cleanGSTIN.substring(11, 12)}'): Must be 1 LETTER (A-Z). E.g., 24AHMPT0206E1Z0`
    };
  }

  // 5. Char 13: 1 Number
  if (!/^[0-9]{1}$/.test(cleanGSTIN.substring(12, 13))) {
    return {
      isValid: false,
      message: `Invalid Char 13 ('${cleanGSTIN.substring(12, 13)}'): Must be 1 NUMBER (0-9). E.g., 24AHMPT0206E1Z0`
    };
  }

  // 6. Char 14: Compulsory 'Z'
  if (cleanGSTIN[13] !== 'Z') {
    return {
      isValid: false,
      message: `Invalid Char 14 ('${cleanGSTIN[13]}'): Must be compulsory letter 'Z'. E.g., 24AHMPT0206E1Z0`
    };
  }

  // 7. Char 15: 1 Digit
  if (!/^[0-9]{1}$/.test(cleanGSTIN.substring(14, 15))) {
    return {
      isValid: false,
      message: `Invalid Char 15 ('${cleanGSTIN[14]}'): Must be 1 DIGIT (0-9). E.g., 24AHMPT0206E1Z0`
    };
  }

  // Final Strict Full Pattern Check
  const strictRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}Z[0-9]{1}$/;
  if (!strictRegex.test(cleanGSTIN)) {
    return {
      isValid: false,
      message: "Invalid GSTIN Pattern. Required format: 2 Numbers + 5 Letters + 4 Digits + 1 Letter + 1 Digit + Z + 1 Digit (e.g. 24AHMPT0206E1Z0)"
    };
  }

  return { isValid: true, message: "Valid GSTIN Pattern" };
};
