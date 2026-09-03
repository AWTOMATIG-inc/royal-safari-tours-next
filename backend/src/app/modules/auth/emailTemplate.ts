/**
 * Royal Safari Tours - Unified Responsive Email Template System
 * Symmetrical, minimal, modern, sleek, and mobile-first email layout for all platform communications.
 */

interface BaseEmailOptions {
  categoryBadge: string;
  categoryBadgeColor?: string;
  title: string;
  subtitle?: string;
  contentHtml: string;
  primaryAction?: {
    label: string;
    url: string;
    bgColor?: string;
  };
  secondaryAction?: {
    label: string;
    url: string;
    bgColor?: string;
  };
  footerNotice?: string;
}

export function renderBaseEmailTemplate({
  categoryBadge,
  categoryBadgeColor = "#DE8D3D",
  title,
  subtitle,
  contentHtml,
  primaryAction,
  secondaryAction,
  footerNotice,
}: BaseEmailOptions): string {
  return `
<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title} - Royal Safari Tours</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    @media only screen and (max-width: 600px) {
      .email-container { width: 100% !important; padding: 8px !important; }
      .content-body { padding: 24px 18px !important; }
      .header-box { padding: 24px 18px !important; }
      .data-table td { padding: 10px 12px !important; font-size: 13px !important; }
      .data-table-label { width: 40% !important; }
      .action-stack a { display: block !important; width: 100% !important; margin-right: 0 !important; margin-bottom: 10px !important; text-align: center !important; box-sizing: border-box !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; width: 100%; background-color: #F4F6F8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #1F2937;">
  <div style="background-color: #F4F6F8; padding: 28px 8px;">
    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center">
          <!-- Main Card Container (Max 580px) -->
          <table role="presentation" class="email-container" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 580px; background-color: #FFFFFF; border-radius: 20px; overflow: hidden; border: 1px solid #E5E7EB; box-shadow: 0 10px 30px rgba(13, 35, 30, 0.05);">
            
            <!-- 1. Executive Master Header Banner -->
            <tr>
              <td class="header-box" style="background-color: #0D231E; padding: 30px 28px; text-align: center;">
                <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td align="center">
                      <div style="font-size: 22px; font-weight: 800; color: #FFFFFF; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 4px;">
                        ROYAL SAFARI TOURS
                      </div>
                      <div style="display: inline-block; font-size: 10px; font-weight: 700; color: #C5A880; letter-spacing: 2px; text-transform: uppercase;">
                        LUXURY EXPEDITIONS & BESPOKE HOSPITALITY
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- 2. Dynamic Content Body -->
            <tr>
              <td class="content-body" style="padding: 34px 30px; background-color: #FFFFFF;">
                
                <!-- Category Badge Pill -->
                <div style="margin-bottom: 16px;">
                  <span style="display: inline-block; background-color: #F8FAFC; border: 1px solid ${categoryBadgeColor}; color: ${categoryBadgeColor}; font-size: 10px; font-weight: 800; padding: 4px 12px; border-radius: 9999px; letter-spacing: 1.5px; text-transform: uppercase;">
                    ${categoryBadge}
                  </span>
                </div>

                <!-- Email Title -->
                <h1 style="margin: 0 0 8px 0; font-size: 22px; font-weight: 800; color: #0D231E; line-height: 1.3;">
                  ${title}
                </h1>

                <!-- Subtitle / Intro -->
                ${
                  subtitle
                    ? `<p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.6; color: #4B5563;">${subtitle}</p>`
                    : `<div style="height: 8px;"></div>`
                }

                <!-- Slot for Dynamic Body Details -->
                <div style="font-size: 14px; line-height: 1.6; color: #374151;">
                  ${contentHtml}
                </div>

                <!-- Action CTA Buttons (If Provided) -->
                ${
                  primaryAction || secondaryAction
                    ? `
                  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 26px;">
                    <tr>
                      <td align="center" class="action-stack">
                        ${
                          primaryAction
                            ? `<a href="${primaryAction.url}" target="_blank" style="display: inline-block; background-color: ${primaryAction.bgColor || "#0D231E"}; color: #FFFFFF; font-size: 13px; font-weight: 700; text-decoration: none; padding: 13px 24px; border-radius: 12px; margin-right: 8px; margin-bottom: 8px; box-shadow: 0 4px 12px rgba(13,35,30,0.15);">${primaryAction.label}</a>`
                            : ""
                        }
                        ${
                          secondaryAction
                            ? `<a href="${secondaryAction.url}" target="_blank" style="display: inline-block; background-color: ${secondaryAction.bgColor || "#25D366"}; color: #FFFFFF; font-size: 13px; font-weight: 700; text-decoration: none; padding: 13px 22px; border-radius: 12px; margin-bottom: 8px; box-shadow: 0 4px 12px rgba(37,211,102,0.2);">${secondaryAction.label}</a>`
                            : ""
                        }
                      </td>
                    </tr>
                  </table>
                  `
                    : ""
                }

                <!-- Optional Footer Notice (Security / Disclaimers) -->
                ${
                  footerNotice
                    ? `
                  <div style="margin-top: 24px; background-color: #F8FAFC; border-left: 3px solid #C5A880; border-radius: 8px; padding: 12px 14px; font-size: 12px; line-height: 1.5; color: #64748B;">
                    ${footerNotice}
                  </div>
                  `
                    : ""
                }

              </td>
            </tr>

            <!-- 3. Unified Global Footer -->
            <tr>
              <td style="background-color: #F8FAFC; padding: 22px 28px; text-align: center; border-top: 1px solid #F1F5F9;">
                <p style="margin: 0 0 4px 0; font-size: 13px; font-weight: 800; color: #0D231E;">
                  Royal Safari Tours
                </p>
                <p style="margin: 0 0 10px 0; font-size: 11px; color: #64748B; line-height: 1.5;">
                  212, Taltola City Super Market, Khilgaon, Dhaka 1219, Bangladesh<br/>
                  Phone: <a href="tel:+8801898334722" style="color: #0D231E; text-decoration: none; font-weight: 600;">+880 1898-334722</a> &bull; WhatsApp: <a href="https://wa.me/8801898334722" style="color: #059669; text-decoration: none; font-weight: 600;">+880 1898-334722</a>
                </p>
                <p style="margin: 0; font-size: 10px; color: #94A3B8; line-height: 1.4;">
                  This is an automated system dispatch from Royal Safari Tours.<br/>
                  &copy; ${new Date().getFullYear()} Royal Safari Tours. All rights reserved.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>
`;
}

// ----------------------------------------------------------------------------
// 1. 2FA Security OTP Verification Email
// ----------------------------------------------------------------------------
export function generateOTPEmailHTML(
  otp: string,
  userName: string,
  expiryMinutes: number = 10
): string {
  const safeName = userName || "Valued User";
  const formattedOtp = otp.split("").join(" ");

  const contentHtml = `
    <p style="margin: 0 0 16px 0; font-size: 14px; color: #4B5563;">
      Hello <strong>${safeName}</strong>,
    </p>
    <p style="margin: 0 0 20px 0; font-size: 14px; color: #4B5563;">
      A sign-in attempt was initiated for your Royal Safari Tours account. Use the one-time verification passcode below to complete your authentication:
    </p>

    <!-- Code Display Box -->
    <div style="background-color: #F8FAFC; border: 1.5px dashed #0D231E; border-radius: 16px; padding: 22px; text-align: center; margin: 20px 0;">
      <span style="display: block; font-size: 11px; font-weight: 700; color: #64748B; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 6px;">
        One-Time Passcode
      </span>
      <span style="font-size: 34px; font-weight: 900; font-family: 'Courier New', Courier, monospace; color: #DE8D3D; letter-spacing: 8px; display: inline-block;">
        ${formattedOtp}
      </span>
    </div>
  `;

  return renderBaseEmailTemplate({
    categoryBadge: "Security Verification",
    categoryBadgeColor: "#DE8D3D",
    title: "Account Verification Code",
    subtitle: "Two-factor authentication code for account sign-in.",
    contentHtml,
    footerNotice: `⏱️ <strong>Security Notice:</strong> This passcode will expire in <strong>${expiryMinutes} minutes</strong>. For your protection, never share this code with anyone. Royal Safari Tours will never ask for your code.`,
  });
}

// ----------------------------------------------------------------------------
// 2. Admin Tour Booking & Public Inquiry Alert
// ----------------------------------------------------------------------------
export function generateAdminBookingAlertEmailHTML(contactData: {
  name: string;
  email: string;
  phone: string;
  message: string;
  destination?: string | null;
  travelDate?: string | null;
  guestCount?: number | null;
  notes?: string | null;
}): string {
  const isBooking = Boolean(
    contactData.destination ||
      (contactData.message && contactData.message.toLowerCase().includes("booking"))
  );
  const subjectType = isBooking ? "Tour Booking Request" : "New Contact Inquiry";
  const cleanPhone = (contactData.phone || "").replace(/[^0-9]/g, "");

  const contentHtml = `
    <p style="margin: 0 0 16px 0; font-size: 14px; color: #4B5563;">
      A new customer inquiry has just been placed on the website. Here are the traveler details:
    </p>

    <table role="presentation" class="data-table" width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse; background-color: #F8FAFC; border-radius: 12px; overflow: hidden; border: 1px solid #E5E7EB; margin: 16px 0;">
      <tr>
        <td class="data-table-label" style="padding: 12px 16px; font-size: 13px; font-weight: 600; color: #64748B; width: 38%; border-bottom: 1px solid #E5E7EB; vertical-align: middle;">Traveler Name : </td>
        <td class="data-table-value" style="padding: 12px 16px; font-size: 13px; font-weight: 700; color: #0D231E; border-bottom: 1px solid #E5E7EB; vertical-align: middle;">${contactData.name || "N/A"}</td>
      </tr>
      <tr>
        <td class="data-table-label" style="padding: 12px 16px; font-size: 13px; font-weight: 600; color: #64748B; border-bottom: 1px solid #E5E7EB; vertical-align: middle;">Phone Number : </td>
        <td class="data-table-value" style="padding: 12px 16px; font-size: 13px; font-weight: 700; border-bottom: 1px solid #E5E7EB; vertical-align: middle;">
          <a href="tel:${contactData.phone}" style="color: #059669; font-weight: 700; text-decoration: none;">${contactData.phone || "N/A"}</a>
        </td>
      </tr>
      <tr>
        <td class="data-table-label" style="padding: 12px 16px; font-size: 13px; font-weight: 600; color: #64748B; border-bottom: 1px solid #E5E7EB; vertical-align: middle;">Email Address : </td>
        <td class="data-table-value" style="padding: 12px 16px; font-size: 13px; font-weight: 700; color: #0D231E; border-bottom: 1px solid #E5E7EB; vertical-align: middle;">
          <a href="mailto:${contactData.email}" style="color: #0D231E; text-decoration: underline; font-weight: 700;">${contactData.email || "N/A"}</a>
        </td>
      </tr>
      ${
        contactData.destination
          ? `
      <tr>
        <td class="data-table-label" style="padding: 12px 16px; font-size: 13px; font-weight: 600; color: #64748B; border-bottom: 1px solid #E5E7EB; vertical-align: middle;">Expedition : </td>
        <td class="data-table-value" style="padding: 12px 16px; font-size: 13px; font-weight: 700; color: #B45309; border-bottom: 1px solid #E5E7EB; vertical-align: middle;">${contactData.destination}</td>
      </tr>`
          : ""
      }
      ${
        contactData.travelDate
          ? `
      <tr>
        <td class="data-table-label" style="padding: 12px 16px; font-size: 13px; font-weight: 600; color: #64748B; border-bottom: 1px solid #E5E7EB; vertical-align: middle;">Travel Date : </td>
        <td class="data-table-value" style="padding: 12px 16px; font-size: 13px; font-weight: 700; color: #0D231E; border-bottom: 1px solid #E5E7EB; vertical-align: middle;">${contactData.travelDate}</td>
      </tr>`
          : ""
      }
      ${
        contactData.guestCount
          ? `
      <tr>
        <td class="data-table-label" style="padding: 12px 16px; font-size: 13px; font-weight: 600; color: #64748B; border-bottom: 1px solid #E5E7EB; vertical-align: middle;">Travelers : </td>
        <td class="data-table-value" style="padding: 12px 16px; font-size: 13px; font-weight: 700; color: #0D231E; border-bottom: 1px solid #E5E7EB; vertical-align: middle;">${contactData.guestCount} Person(s)</td>
      </tr>`
          : ""
      }
    </table>

    <div style="background-color: #F8FAFC; border: 1px solid #E5E7EB; border-radius: 12px; padding: 16px; margin-top: 16px;">
      <div style="font-size: 11px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">
        Inquiry Message / Special Requests:
      </div>
      <div style="font-size: 13px; color: #1F2937; line-height: 1.5; white-space: pre-wrap;">${contactData.message || "No special requests provided."}</div>
    </div>
  `;

  return renderBaseEmailTemplate({
    categoryBadge: isBooking ? "Tour Booking Alert" : "Contact Inquiry Alert",
    categoryBadgeColor: isBooking ? "#2cb775" : "#0D231E",
    title: `New ${subjectType}`,
    subtitle: `Submission from <strong>${contactData.name || "Valued Guest"}</strong> (${contactData.phone || "No Phone"}).`,
    contentHtml,
    primaryAction: cleanPhone
      ? {
          label: "WhatsApp Customer",
          url: `https://wa.me/${cleanPhone}`,
          bgColor: "#25D366",
        }
      : undefined,
    secondaryAction: contactData.email
      ? {
          label: "Reply via Email",
          url: `mailto:${contactData.email}`,
          bgColor: "#0D231E",
        }
      : undefined,
  });
}

// ----------------------------------------------------------------------------
// 3. Guest / Traveler Booking Confirmation Receipt
// ----------------------------------------------------------------------------
export function generateGuestBookingConfirmationEmailHTML(
  guestName: string,
  destination?: string | null,
  travelDate?: string | null,
  guestCount?: number | null
): string {
  const contentHtml = `
    <p style="margin: 0 0 14px 0; font-size: 14px; color: #4B5563;">
      Hello <strong>${guestName || "Valued Traveler"}</strong>,
    </p>
    <p style="margin: 0 0 16px 0; font-size: 14px; color: #4B5563;">
      Thank you for reserving with <strong>Royal Safari Tours</strong>. We have received your expedition booking request and our dedicated travel concierge is now preparing your bespoke itinerary.
    </p>

    ${
      destination || travelDate || guestCount
        ? `
      <table role="presentation" class="data-table" width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse; background-color: #F8FAFC; border-radius: 12px; overflow: hidden; border: 1px solid #E5E7EB; margin: 16px 0;">
        ${
          destination
            ? `
        <tr>
          <td class="data-table-label" style="padding: 12px 16px; font-size: 13px; font-weight: 600; color: #64748B; width: 38%; border-bottom: 1px solid #E5E7EB; vertical-align: middle;">Expedition : </td>
          <td class="data-table-value" style="padding: 12px 16px; font-size: 13px; font-weight: 700; color: #0D231E; border-bottom: 1px solid #E5E7EB; vertical-align: middle;">${destination}</td>
        </tr>`
            : ""
        }
        ${
          travelDate
            ? `
        <tr>
          <td class="data-table-label" style="padding: 12px 16px; font-size: 13px; font-weight: 600; color: #64748B; width: 38%; border-bottom: 1px solid #E5E7EB; vertical-align: middle;">Travel Date : </td>
          <td class="data-table-value" style="padding: 12px 16px; font-size: 13px; font-weight: 700; color: #0D231E; border-bottom: 1px solid #E5E7EB; vertical-align: middle;">${travelDate}</td>
        </tr>`
            : ""
        }
        ${
          guestCount
            ? `
        <tr>
          <td class="data-table-label" style="padding: 12px 16px; font-size: 13px; font-weight: 600; color: #64748B; width: 38%; vertical-align: middle;">Travelers : </td>
          <td class="data-table-value" style="padding: 12px 16px; font-size: 13px; font-weight: 700; color: #0D231E; vertical-align: middle;">${guestCount} Person(s)</td>
        </tr>`
            : ""
        }
      </table>
      `
        : ""
    }

    <p style="margin: 0 0 14px 0; font-size: 14px; color: #4B5563;">
      Our reservation team will contact you shortly by phone or WhatsApp to finalize your transport, hotel accommodation, and day-by-day itinerary.
    </p>
  `;

  return renderBaseEmailTemplate({
    categoryBadge: "Reservation Acknowledgment",
    categoryBadgeColor: "#2cb775",
    title: "We Received Your Reservation Request",
    subtitle: "Your journey towards extraordinary wilderness experiences begins here.",
    contentHtml,
    primaryAction: {
      label: "Contact Us",
      url: "https://wa.me/8801898334722",
      bgColor: "#25D366",
    },
    secondaryAction: {
      label: "Explore Tours",
      url: "https://royalsafaritours.com",
      bgColor: "#0D231E",
    },
    footerNotice: "📞 <strong>Immediate Assistance:</strong> Call our luxury travel desk at <strong>+880 1898-334722</strong> or reach us 24/7 on WhatsApp.",
  });
}

// ----------------------------------------------------------------------------
// 4. Job Application / Recruitment — Candidate Confirmation
// ----------------------------------------------------------------------------
export function generateApplicantConfirmationEmailHTML(
  applicantName: string,
  jobTitle: string
): string {
  const contentHtml = `
    <p style="margin: 0 0 14px 0; font-size: 14px; color: #4B5563;">
      Dear <strong>${applicantName}</strong>,
    </p>
    <p style="margin: 0 0 16px 0; font-size: 14px; color: #4B5563;">
      Thank you for your interest in joining <strong>Royal Safari Tours</strong>. We have successfully received your application for the <strong>${jobTitle}</strong> position.
    </p>
    <div style="background-color: #F8FAFC; border: 1px solid #E5E7EB; border-radius: 12px; padding: 16px; margin: 16px 0; font-size: 13px; color: #374151; line-height: 1.5;">
      Our Human Resources & Talent Acquisition team is currently reviewing applicant profiles. If your experience and qualifications align with our team requirements, we will reach out to schedule an interview.
    </div>
    <p style="margin: 0; font-size: 14px; color: #4B5563;">
      We appreciate your time and enthusiasm for Royal Safari Tours.
    </p>
  `;

  return renderBaseEmailTemplate({
    categoryBadge: "Recruitment Application",
    categoryBadgeColor: "#0D231E",
    title: "Application Received",
    subtitle: `Position: <strong>${jobTitle}</strong>`,
    contentHtml,
    footerNotice: "Royal Safari Tours HR Team &bull; Recruitment & Talent Management",
  });
}

// ----------------------------------------------------------------------------
// 5. Job Application / Recruitment — Admin / HR Alert
// ----------------------------------------------------------------------------
export function generateAdminJobApplicationAlertEmailHTML(
  applicantName: string,
  applicantEmail: string,
  applicantPhone: string,
  jobTitle: string
): string {
  const cleanPhone = (applicantPhone || "").replace(/[^0-9]/g, "");

  const contentHtml = `
    <p style="margin: 0 0 16px 0; font-size: 14px; color: #4B5563;">
      A new candidate has submitted their resume and application for <strong>${jobTitle}</strong>.
    </p>

    <table role="presentation" class="data-table" width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse; background-color: #F8FAFC; border-radius: 12px; overflow: hidden; border: 1px solid #E5E7EB; margin: 16px 0;">
      <tr>
        <td class="data-table-label" style="padding: 12px 16px; font-size: 13px; font-weight: 600; color: #64748B; width: 38%; border-bottom: 1px solid #E5E7EB; vertical-align: middle;">Candidate Name : </td>
        <td class="data-table-value" style="padding: 12px 16px; font-size: 13px; font-weight: 700; color: #0D231E; border-bottom: 1px solid #E5E7EB; vertical-align: middle;">${applicantName}</td>
      </tr>
      <tr>
        <td class="data-table-label" style="padding: 12px 16px; font-size: 13px; font-weight: 600; color: #64748B; border-bottom: 1px solid #E5E7EB; vertical-align: middle;">Applied Position : </td>
        <td class="data-table-value" style="padding: 12px 16px; font-size: 13px; font-weight: 700; color: #B45309; border-bottom: 1px solid #E5E7EB; vertical-align: middle;">${jobTitle}</td>
      </tr>
      <tr>
        <td class="data-table-label" style="padding: 12px 16px; font-size: 13px; font-weight: 600; color: #64748B; border-bottom: 1px solid #E5E7EB; vertical-align: middle;">Email Address : </td>
        <td class="data-table-value" style="padding: 12px 16px; font-size: 13px; font-weight: 700; border-bottom: 1px solid #E5E7EB; vertical-align: middle;">
          <a href="mailto:${applicantEmail}" style="color: #0D231E; text-decoration: underline; font-weight: 700;">${applicantEmail}</a>
        </td>
      </tr>
      <tr>
        <td class="data-table-label" style="padding: 12px 16px; font-size: 13px; font-weight: 600; color: #64748B; border-bottom: 1px solid #E5E7EB; vertical-align: middle;">Phone Number : </td>
        <td class="data-table-value" style="padding: 12px 16px; font-size: 13px; font-weight: 700; border-bottom: 1px solid #E5E7EB; vertical-align: middle;">
          <a href="tel:${applicantPhone}" style="color: #059669; font-weight: 700; text-decoration: none;">${applicantPhone}</a>
        </td>
      </tr>
    </table>

    <p style="margin: 16px 0 0 0; font-size: 13px; color: #64748B;">
      Log in to the Admin Dashboard (Recruitment Module) to review the candidate's uploaded resume and questionnaire responses.
    </p>
  `;

  return renderBaseEmailTemplate({
    categoryBadge: "Candidate Application Alert",
    categoryBadgeColor: "#0D231E",
    title: "New Candidate Application",
    subtitle: `Candidate <strong>${applicantName}</strong> applied for <strong>${jobTitle}</strong>.`,
    contentHtml,
    primaryAction: cleanPhone
      ? {
          label: "WhatsApp Candidate",
          url: `https://wa.me/${cleanPhone}`,
          bgColor: "#25D366",
        }
      : undefined,
    secondaryAction: applicantEmail
      ? {
          label: "Email Candidate",
          url: `mailto:${applicantEmail}`,
          bgColor: "#0D231E",
        }
      : undefined,
  });
}
