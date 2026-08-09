/**
 * Utility to convert numeric currency values to English words (Indian numbering system format)
 * Example: 154200 -> "One Lakh Fifty Four Thousand Two Hundred Rupees Only"
 */

const a = [
  "", "One ", "Two ", "Three ", "Four ", "Five ", "Six ", "Seven ", "Eight ", "Nine ", "Ten ",
  "Eleven ", "Twelve ", "Thirteen ", "Fourteen ", "Fifteen ", "Sixteen ", "Seventeen ", "Eighteen ", "Nineteen "
];
const b = ["", "", "Twenty ", "Thirty ", "Forty ", "Fifty ", "Sixty ", "Seventy ", "Eighty ", "Ninety "];

export function numberToWords(num) {
  if (num === null || num === undefined || isNaN(num)) return "Zero Rupees Only";
  const amount = Math.round(Number(num));
  if (amount === 0) return "Zero Rupees Only";

  const numStr = amount.toString();
  if (numStr.length > 9) return "Amount Too Large";

  const n = ("000000000" + numStr).substr(-9);
  const match = n.match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!match) return "";

  let str = "";
  // Crore
  const crore = parseInt(match[1]);
  if (crore !== 0) {
    str += (a[crore] || (b[Math.floor(crore / 10)] + a[crore % 10])) + "Crore ";
  }

  // Lakh
  const lakh = parseInt(match[2]);
  if (lakh !== 0) {
    str += (a[lakh] || (b[Math.floor(lakh / 10)] + a[lakh % 10])) + "Lakh ";
  }

  // Thousand
  const thousand = parseInt(match[3]);
  if (thousand !== 0) {
    str += (a[thousand] || (b[Math.floor(thousand / 10)] + a[thousand % 10])) + "Thousand ";
  }

  // Hundred
  const hundred = parseInt(match[4]);
  if (hundred !== 0) {
    str += a[hundred] + "Hundred ";
  }

  // Tens & Units
  const tens = parseInt(match[5]);
  if (tens !== 0) {
    if (str !== "") str += "and ";
    str += (a[tens] || (b[Math.floor(tens / 10)] + a[tens % 10]));
  }

  return str.trim() + " Rupees Only";
}
