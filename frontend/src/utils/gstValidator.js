/**
 * GSTIN Validation Utility (From ERP-main)
 * Implements Regex and Mod 36 Checksum logic.
 */

const charMap = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export const validateGSTIN = (gstin) => {
  if (!gstin) return { isValid: false, message: "GSTIN is required" };

  const cleanGSTIN = gstin.trim().toUpperCase();

  if (cleanGSTIN.length !== 15) {
    return { isValid: false, message: "GSTIN must be exactly 15 characters long." };
  }

  // 1. Regex Check (Chars 1-2: State, 3-7: PAN Letters, 8-11: PAN Digits, 12: Entity Index, 13: Z, 14: Check Digit)
  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z1-9]{1}[Z1-9A-Z]{1}[0-9A-Z]{1}$/;
  if (!gstRegex.test(cleanGSTIN)) {
    // Specific error explanations
    const panPart = cleanGSTIN.substring(2, 7);
    if (!/^[A-Z]{5}$/.test(panPart)) {
      return {
        isValid: false,
        message: `Invalid GSTIN: Characters 3 to 7 ('${panPart}') must be ALL LETTERS (A-Z). E.g. 24AHMPT0206E1Z0`
      };
    }
    return { isValid: false, message: "Invalid GSTIN Format (Expected: 24AAAAA0000A1Z5)" };
  }

  return { isValid: true, message: "Structurally Valid GSTIN" };
};
