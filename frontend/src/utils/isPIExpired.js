/**
 * Helper function to determine if a Proforma Invoice is EXPIRED.
 * A PI is expired if:
 * 1. It is not confirmed / locked / paid.
 * 2. AND either current date > validUntil OR >30 days have passed since creation/issuance.
 */
export const isPIExpired = (invoice) => {
  if (!invoice) return false;

  const status = (invoice.status || "").toUpperCase();
  const isConfirmed = ["CONFIRMED", "PAID", "CANCELLED"].includes(status) || invoice.isLocked;

  if (isConfirmed) return false;

  const now = new Date();
  const validUntil = invoice.validUntil ? new Date(invoice.validUntil) : null;
  const createdAt = invoice.createdAt
    ? new Date(invoice.createdAt)
    : (invoice.invoiceDate ? new Date(invoice.invoiceDate) : null);

  if (validUntil && now > validUntil) {
    return true;
  }

  if (createdAt && (now.getTime() - createdAt.getTime()) > (30 * 24 * 60 * 60 * 1000)) {
    return true;
  }

  return false;
};
