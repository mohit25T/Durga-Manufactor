// Utility to format and generate WhatsApp message URL (Clean Text, No Icons)

export const formatWhatsAppOrderMessage = ({ phone, dealerName, orderId, status, subtotal, billAmount, gstAmount, totalAmount }) => {
  let cleanPhone = (phone || "").replace(/\D/g, "");
  if (cleanPhone.length === 10) {
    cleanPhone = "91" + cleanPhone;
  }

  const sub = subtotal || (totalAmount ? Math.round(totalAmount / 1.18) : 0);
  const bAmt = billAmount || sub;
  const gst = gstAmount || Math.round(bAmt * 0.18);
  const tot = totalAmount || (bAmt + gst);
  const formattedStatus = (status || "PENDING").toUpperCase();

  const lines = [
    "*DURGA MANUFACTURES*",
    "*Order Update Notification*",
    "",
    `Hello *${dealerName || "Dealer"}*,`,
    "",
    `Your order *#${orderId.toString().slice(-8).toUpperCase()}* details:`,
    "",
    `Order Status: *${formattedStatus}*`,
    `Machines Subtotal: *₹${sub.toLocaleString("en-IN")}*`,
    `Billed Base Amount: *₹${bAmt.toLocaleString("en-IN")}*`,
    `18% GST: *+₹${gst.toLocaleString("en-IN")}*`,
    `Total Payment Amount: *₹${tot.toLocaleString("en-IN")}*`,
    "",
    "Thank you for choosing Durga Manufactures!",
    "Portal: https://durgamanufactures.com/dealer/dashboard"
  ];

  const messageText = lines.join("\n");
  const encodedMessage = encodeURIComponent(messageText);
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;

  return {
    cleanPhone,
    message: messageText,
    whatsappUrl
  };
};
