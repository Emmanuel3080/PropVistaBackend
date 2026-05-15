const sendMail = require("../ResendSetup/Resend");

const AdminPropertyBooking = async (
    agentEmail,
    clientName,
    clientEmail,
    clientPhone,
    property, 
    viewingDate,
    viewingTime
) => {
    const formattedPrice = new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        maximumFractionDigits: 0,
    }).format(property.price);

    const htmlContent = `
    <div style="background-color: #f4f4f5; padding: 40px 10px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <div style="max-width: 540px; margin: 0 auto; background: #ffffff; border-radius: 20px; border: 1px solid #e4e4e7; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
        
        <!-- Branding & Status -->
        <div style="padding: 30px; border-bottom: 1px solid #f4f4f5;">
          <table width="100%">
            <tr>
              <td>
                <span style="background: #0f172a; color: #ffffff; padding: 6px 12px; border-radius: 100px; font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;">Propvista Lead</span>
              </td>
              <td align="right">
                <span style="color: #71717a; font-size: 12px;">${new Date().toLocaleDateString()}</span>
              </td>
            </tr>
          </table>
          <h2 style="margin: 20px 0 0 0; font-size: 22px; color: #18181b; letter-spacing: -0.5px;">New Viewing: ${property.title}</h2>
          <p style="margin: 5px 0 0 0; color: #71717a; font-size: 14px;">Market Value: ${formattedPrice}</p>
        </div>

        <!-- NEW: Property Preview Image -->
        <div style="padding: 25px 30px 0;">
          <div style="border-radius: 12px; overflow: hidden; border: 1px solid #e4e4e7;">
            <img src="${property.image}" alt="${property.title}" style="width: 100%; height: 220px; object-fit: cover; display: block;" />
          </div>
        </div>

        <!-- Lead Data -->
        <div style="padding: 30px;">
          <div style="margin-bottom: 25px;">
            <label style="display: block; font-size: 10px; color: #a1a1aa; text-transform: uppercase; font-weight: 800; letter-spacing: 1px; margin-bottom: 8px;">Prospect Profile</label>
            <div style="background: #fcfcfd; border-radius: 12px; padding: 15px; border: 1px solid #f1f1f1;">
              <table width="100%" style="border-collapse: collapse;">
                <tr>
                  <td style="padding-bottom: 10px; border-bottom: 1px solid #f1f1f1;">
                    <span style="font-size: 13px; color: #71717a;">Lead Name</span>
                    <span style="font-size: 14px; color: #18181b; font-weight: 600; float: right;">${clientName}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f1f1f1;">
                    <span style="font-size: 13px; color: #71717a;">Mobile</span>
                    <span style="font-size: 14px; color: #18181b; font-weight: 600; float: right;">${clientPhone || 'No phone provided'}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 10px;">
                    <span style="font-size: 13px; color: #71717a;">Email</span>
                    <span style="font-size: 14px; color: #18181b; font-weight: 600; float: right;">${clientEmail}</span>
                  </td>
                </tr>
              </table>
            </div>
          </div>

          <!-- Schedule Card -->
          <div style="margin-bottom: 30px;">
            <label style="display: block; font-size: 10px; color: #a1a1aa; text-transform: uppercase; font-weight: 800; letter-spacing: 1px; margin-bottom: 8px;">Appointment Window</label>
            <div style="background: #18181b; color: #ffffff; border-radius: 12px; padding: 18px; text-align: center;">
              <span style="font-size: 15px; font-weight: 500;">📅 ${viewingDate} &nbsp; • &nbsp; ⏰ ${viewingTime}</span>
            </div>
          </div>

          <!-- Action Buttons -->
          <a href="mailto:${clientEmail}" style="display: block; text-align: center; background: #0f172a; color: #ffffff; padding: 16px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 14px; margin-bottom: 12px;">Contact Prospect</a>
          <a href="https://propvista-realty.vercel.app/dashboard" style="display: block; text-align: center; background: transparent; color: #18181b; border: 1px solid #e4e4e7; padding: 16px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 14px;">View in Dashboard</a>
        </div>

        <div style="background: #fafafa; padding: 25px; text-align: center; border-top: 1px solid #f4f4f5;">
          <p style="margin: 0; font-size: 11px; color: #a1a1aa; letter-spacing: 0.5px;">PROPVISTA REALTY CRM • INTERNAL NOTIFICATION</p>
        </div>
      </div>
    </div>
  `;

  // ... rest of your sendMail logic
  try {
      const result = await sendMail({
          from: "Propvista Alerts <onboarding@resend.dev>",
          to: agentEmail,
          subject: `[New Lead] ${clientName} - ${property.title}`,
          html: htmlContent,
      });
  
      return result;
  } catch (error) {
      console.error("❌ Propvista Admin Mailer Error:", error);
      throw error;
  }
}




module.exports = AdminPropertyBooking