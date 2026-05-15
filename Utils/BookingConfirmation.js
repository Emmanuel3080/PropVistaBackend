const sendMail = require("../ResendSetup/Resend");

const ClientPropertyBooking = async (clientEmail, clientName, propertyDetails) => {
    const { title, price, location, propertyType, bedrooms, image, viewingDate, viewingTime } = propertyDetails;

    // Format price to currency (e.g., $500,000)
    const formattedPrice = new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        maximumFractionDigits: 0,
    }).format(price);

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Viewing Confirmed – Propvista</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Serif+Display&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background-color: #f0ede8; font-family: 'DM Sans', sans-serif; -webkit-font-smoothing: antialiased; }
    .wrapper { padding: 48px 16px; }
    .card { max-width: 540px; margin: 0 auto; background: #faf9f7; border-radius: 24px; overflow: hidden; border: 1px solid #e5e1da; box-shadow: 0 10px 30px rgba(0,0,0,0.03); }
    .hero { position: relative; height: 240px; overflow: hidden; }
    .hero img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .hero-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%); }
    .hero-badge { position: absolute; top: 18px; left: 20px; background: rgba(255,255,255,0.2); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.4); color: #fff; font-size: 10px; font-weight: 600; letter-spacing: 1.2px; text-transform: uppercase; padding: 6px 14px; border-radius: 100px; }
    .hero-address { position: absolute; bottom: 22px; left: 20px; right: 20px; }
    .hero-address p { font-family: 'DM Serif Display', serif; font-size: 26px; color: #fff; line-height: 1.2; }
    .body { padding: 32px 32px 0; }
    .greeting { font-size: 16px; color: #2c2a26; line-height: 1.6; margin-bottom: 28px; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; border: 1px solid #e5e1da; border-radius: 16px; overflow: hidden; margin-bottom: 20px; }
    .info-cell { padding: 18px; background: #fdfcfb; }
    .info-cell:nth-child(1), .info-cell:nth-child(3) { border-right: 1px solid #e5e1da; }
    .info-cell:nth-child(1), .info-cell:nth-child(2) { border-bottom: 1px solid #e5e1da; }
    .info-label { font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: #a39f97; margin-bottom: 6px; }
    .info-value { font-size: 15px; font-weight: 600; color: #1e1c19; display: flex; align-items: center; gap: 8px; }
    .info-value svg { flex-shrink: 0; color: #9e9a93; }
    .address-row { display: flex; align-items: center; gap: 12px; padding: 16px; background: #f5f3ef; border: 1px solid #e5e1da; border-radius: 14px; margin-bottom: 28px; }
    .address-text { font-size: 13px; color: #3a3731; line-height: 1.5; }
    .address-text span { display: block; font-size: 10px; font-weight: 700; color: #a39f97; text-transform: uppercase; margin-bottom: 2px; }
    .cta-wrap { padding: 0 32px 32px; }
    .cta-btn { display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; background: #1e1c19; color: #faf9f7; padding: 16px; border-radius: 12px; text-decoration: none; font-size: 15px; font-weight: 600; }
    .cta-note { text-align: center; font-size: 12px; color: #a39f97; margin-top: 16px; }
    .footer { border-top: 1px solid #e5e1da; padding: 20px 32px; display: flex; align-items: center; justify-content: space-between; font-size: 11px; color: #b5b0a8; }
    .footer-links a { color: #b5b0a8; text-decoration: none; margin-left: 12px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="hero">
        <img src="${image}" alt="${title}" />
        <div class="hero-overlay"></div>
        <div class="hero-badge">Viewing Confirmed</div>
        <div class="hero-address">
          <p>${title}</p>
        </div>
      </div>

      <div class="body">
        <p class="greeting">
          You're all set, <strong>${clientName}!</strong> Your tour has been confirmed. 
          Here is your appointment itinerary.
        </p>

        <div class="info-grid">
          <!-- DATE -->
          <div class="info-cell">
            <div class="info-label">Date</div>
            <div class="info-value">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              ${viewingDate}
            </div>
          </div>
          <!-- TIME -->
          <div class="info-cell">
            <div class="info-label">Time</div>
            <div class="info-value">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              ${viewingTime}
            </div>
          </div>
          <!-- PRICE -->
          <div class="info-cell">
            <div class="info-label">Price</div>
            <div class="info-value">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
              ${formattedPrice}
            </div>
          </div>
          <!-- LAYOUT -->
          <div class="info-cell">
            <div class="info-label">Layout</div>
            <div class="info-value">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3h7v7H3z"></path><path d="M14 3h7v7h-7z"></path><path d="M14 14h7v7h-7z"></path><path d="M3 14h7v7H3z"></path></svg>
              ${bedrooms} Bedrooms
            </div>
          </div>
        </div>

        <div class="address-row">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          <div class="address-text">
            <span>Location</span>
            ${location}
          </div>
        </div>
      </div>

      <div class="cta-wrap">
        <a href="https://maps.google.com/?q=${location}" class="cta-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2L2 11l6 3 13-7-7 13 3 6 9-21z"></path></svg>
          Get Directions
        </a>
        <p class="cta-note">Reply to this email if you need to reschedule.</p>
      </div>

      <div class="footer">
        <span>© ${new Date().getFullYear()} Propvista Realty</span>
        <div class="footer-links">
          <a href="#">Privacy</a>
          <a href="#">Support</a>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
`;

    try {
        const result = await sendMail({
            from: "<onboarding@resend.dev>",
            to: clientEmail,
            subject: `Confirmed: Viewing for ${title}`,
            html: htmlContent
        });

        return { success: !!result, data: result };
    } catch (error) {
        console.error("Booking Mail Error:", error);
        return { success: false, error };
    }
};

module.exports = ClientPropertyBooking;