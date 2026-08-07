import nodemailer from "nodemailer";

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  const host = process.env.EMAIL_HOST || "smtp.gmail.com";
  const port = Number(process.env.EMAIL_PORT) || 587;
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    return null; // Email credentials not configured yet
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass }
  });
};

export const sendOrderStatusEmail = async ({ toEmail, toName, orderId, status, totalAmount, items }) => {
  try {
    const transporter = createTransporter();
    if (!transporter) {
      console.log(`[Email Notification Skipped] EMAIL_USER/EMAIL_PASS not configured in .env for ${toEmail}`);
      return false;
    }

    const itemsHtml = (items || [])
      .map(
        (it) =>
          `<tr>
            <td style="padding: 8px; border: 1px solid #334155; color: #f8fafc;">${it.productTitle}</td>
            <td style="padding: 8px; border: 1px solid #334155; color: #f8fafc; text-align: center;">${it.quantity}</td>
            <td style="padding: 8px; border: 1px solid #334155; color: #e2e8f0; text-align: right;">₹${(it.discountedPrice || 0).toLocaleString("en-IN")}</td>
          </tr>`
      )
      .join("");

    const mailOptions = {
      from: `"Durga Manufactures" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: `Order #${orderId.toString().slice(-8).toUpperCase()} Status Update: ${status.toUpperCase()}`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #090d16; color: #ffffff; padding: 24px; border-radius: 8px; max-width: 600px; margin: 0 auto; border: 1px solid #f59e0b;">
          <div style="text-align: center; padding-bottom: 16px; border-bottom: 2px solid #f59e0b;">
            <h2 style="color: #f59e0b; margin: 0; font-size: 22px;">DURGA MANUFACTURES</h2>
            <p style="color: #94a3b8; font-size: 12px; margin-top: 4px;">Authorized Dealer Order Update</p>
          </div>

          <div style="padding: 20px 0;">
            <p style="font-size: 15px; color: #e2e8f0;">Hello <strong>${toName || "Dealer"}</strong>,</p>
            <p style="font-size: 14px; color: #cbd5e1;">Your machinery order status has been updated to:</p>
            
            <div style="background-color: #1e293b; padding: 12px 20px; border-left: 4px solid #f59e0b; font-weight: bold; font-size: 18px; color: #f59e0b; margin: 16px 0;">
              ${status.toUpperCase()}
            </div>

            <p style="font-size: 13px; color: #94a3b8; margin-bottom: 12px;"><strong>Order ID:</strong> #${orderId}</p>

            <table style="width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 13px;">
              <thead>
                <tr style="background-color: #1e293b; color: #f59e0b;">
                  <th style="padding: 8px; text-align: left; border: 1px solid #334155;">Item</th>
                  <th style="padding: 8px; text-align: center; border: 1px solid #334155;">Qty</th>
                  <th style="padding: 8px; text-align: right; border: 1px solid #334155;">Rate</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <div style="margin-top: 16px; font-size: 16px; text-align: right; color: #ffffff;">
              <strong>Total Amount Payable: <span style="color: #f59e0b;">₹${(totalAmount || 0).toLocaleString("en-IN")}</span></strong>
            </div>
          </div>

          <div style="border-top: 1px solid #334155; padding-top: 16px; text-align: center; font-size: 11px; color: #64748b;">
            <p>Thank you for choosing Durga Manufactures.</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`[Email Notification Sent] Successfully sent order status email to ${toEmail}`);
    return true;
  } catch (error) {
    console.error("EMAIL NOTIFICATION ERROR:", error);
    return false;
  }
};
