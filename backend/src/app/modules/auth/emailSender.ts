import nodemailer from "nodemailer";
import config from "../../config";
import {
  generateOTPEmailHTML,
  generateAdminBookingAlertEmailHTML,
  generateGuestBookingConfirmationEmailHTML,
  generateApplicantConfirmationEmailHTML,
  generateAdminJobApplicationAlertEmailHTML,
} from "./emailTemplate";

// Helper to create Gmail SMTP transporter
function getTransporter() {
  const gmailUser = config.gmailUser;
  const gmailPassword = config.gmailAppPassword;

  if (!gmailUser || !gmailPassword) {
    return null;
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: gmailUser,
      pass: gmailPassword,
    },
  });
}

// ----------------------------------------------------------------------------
// 1. Send OTP 2FA Code Email
// ----------------------------------------------------------------------------
export async function sendOTPEmail(
  toEmail: string,
  plainOtp: string,
  userName: string
): Promise<boolean> {
  const gmailUser = config.gmailUser;
  const transporter = getTransporter();

  if (!transporter || !gmailUser) {
    throw new Error("GMAIL_USER and GMAIL_APP_PASSWORD must be configured in environment variables.");
  }

  const htmlContent = generateOTPEmailHTML(
    plainOtp,
    userName,
    config.otpExpiryMinutes
  );

  const mailOptions = {
    from: `"Royal Safari Tours" <${gmailUser}>`,
    to: toEmail,
    subject: "Your Royal Safari Tours Verification Code",
    html: htmlContent,
    text: `Hello ${userName || "Valued Guest"},\n\nYour Royal Safari Tours verification code is: ${plainOtp}\n\nThis code will expire in ${config.otpExpiryMinutes} minutes. If you did not request this code, please ignore this email.`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[Email OTP Dispatch] Verification email sent to ${toEmail} | Message ID: ${info.messageId}`);
    return true;
  } catch (error: any) {
    console.error(`[Email OTP Dispatch Error] Failed to send email to ${toEmail}:`, error.message);
    throw new Error(`EMAIL_SEND_FAILED: ${error.message || "Failed to dispatch verification email"}`);
  }
}

// ----------------------------------------------------------------------------
// 2. Send Applicant Confirmation Email (HR)
// ----------------------------------------------------------------------------
export async function sendApplicantConfirmationEmail(
  toEmail: string,
  applicantName: string,
  jobTitle: string
): Promise<boolean> {
  const gmailUser = config.gmailUser;
  const transporter = getTransporter();

  if (!transporter || !gmailUser || !toEmail) return false;

  const htmlContent = generateApplicantConfirmationEmailHTML(applicantName, jobTitle);

  const mailOptions = {
    from: `"Royal Safari Tours Recruitment" <${gmailUser}>`,
    to: toEmail,
    subject: `Application Received: ${jobTitle} - Royal Safari Tours`,
    html: htmlContent,
    text: `Dear ${applicantName},\n\nThank you for applying for the position of ${jobTitle} at Royal Safari Tours. We have received your application and will review your qualifications.\n\nBest regards,\nRoyal Safari Tours HR Team`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[HR Applicant Confirmation] Dispatched to ${toEmail} | Message ID: ${info.messageId}`);
    return true;
  } catch (error: any) {
    console.error("[Applicant Email Error]", error.message);
    return false;
  }
}

// ----------------------------------------------------------------------------
// 3. Send Admin Alert for New Candidate Application (HR)
// ----------------------------------------------------------------------------
export async function sendAdminNewApplicationEmail(
  applicantName: string,
  applicantEmail: string,
  applicantPhone: string,
  jobTitle: string
): Promise<boolean> {
  const gmailUser = config.gmailUser;
  const transporter = getTransporter();

  if (!transporter || !gmailUser) return false;

  const adminEmail = gmailUser;
  const htmlContent = generateAdminJobApplicationAlertEmailHTML(
    applicantName,
    applicantEmail,
    applicantPhone,
    jobTitle
  );

  const mailOptions = {
    from: `"Royal Safari Tours ATS" <${gmailUser}>`,
    to: adminEmail,
    replyTo: applicantEmail || gmailUser,
    subject: `[New Applicant Alert] ${applicantName} applied for ${jobTitle}`,
    html: htmlContent,
    text: `New Candidate Alert: ${applicantName} applied for ${jobTitle}.\nEmail: ${applicantEmail}\nPhone: ${applicantPhone}\n\nPlease review in Admin Dashboard.`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[HR Admin Notification] Dispatched to ${adminEmail} | Message ID: ${info.messageId}`);
    return true;
  } catch (error: any) {
    console.error("[Admin Email Error]", error.message);
    return false;
  }
}

// ----------------------------------------------------------------------------
// 4. Send Admin Notification for Tour Bookings & Contact Inquiries
// ----------------------------------------------------------------------------
export async function sendContactInquiryNotificationEmail(contactData: {
  name: string;
  email: string;
  phone: string;
  message: string;
  destination?: string | null;
  travelDate?: string | null;
  guestCount?: number | null;
  notes?: string | null;
}): Promise<boolean> {
  const gmailUser = config.gmailUser;
  const transporter = getTransporter();

  if (!transporter || !gmailUser) {
    console.warn("[Contact Email Warning] Gmail credentials not set. Skipping email notification.");
    return false;
  }

  const adminEmail = gmailUser;
  const isBooking = Boolean(
    contactData.destination ||
      (contactData.message && contactData.message.toLowerCase().includes("booking"))
  );
  const subjectType = isBooking ? "Tour Booking Request" : "New Contact Inquiry";
  const htmlContent = generateAdminBookingAlertEmailHTML(contactData);

  const mailOptions = {
    from: `"Royal Safari Tours Inquiries" <${gmailUser}>`,
    to: adminEmail,
    replyTo: contactData.email || gmailUser,
    subject: `[${subjectType}] From: ${contactData.name || "Valued Guest"} (${contactData.phone || "No Phone"})`,
    html: htmlContent,
    text: `New ${subjectType} from ${contactData.name || "Guest"}\nPhone: ${contactData.phone}\nEmail: ${contactData.email}\nDestination: ${contactData.destination || "N/A"}\nDate: ${contactData.travelDate || "Flexible"}\nGuests: ${contactData.guestCount || 1}\nMessage: ${contactData.message}`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[Contact Email Notification] Dispatched to admin (${adminEmail}) | Message ID: ${info.messageId}`);
    return true;
  } catch (error: any) {
    console.error("[Contact Email Error] Failed to send email to admin:", error.message);
    return false;
  }
}

// ----------------------------------------------------------------------------
// 5. Send Guest Booking / Inquiry Confirmation Receipt
// ----------------------------------------------------------------------------
export async function sendGuestInquiryConfirmationEmail(
  guestEmail: string,
  guestName: string,
  destination?: string | null,
  travelDate?: string | null,
  guestCount?: number | null
): Promise<boolean> {
  const gmailUser = config.gmailUser;
  const transporter = getTransporter();

  if (!transporter || !gmailUser || !guestEmail) return false;

  const htmlContent = generateGuestBookingConfirmationEmailHTML(
    guestName,
    destination,
    travelDate,
    guestCount
  );

  const mailOptions = {
    from: `"Royal Safari Tours" <${gmailUser}>`,
    to: guestEmail,
    subject: "Thank You for Reserving with Royal Safari Tours",
    html: htmlContent,
    text: `Hello ${guestName || "Valued Traveler"},\n\nThank you for reaching out to Royal Safari Tours regarding ${destination || "your expedition"}.\nWe have received your reservation inquiry and our travel concierge will contact you shortly.\n\nWarm regards,\nRoyal Safari Tours`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[Guest Confirmation Email] Dispatched to ${guestEmail} | Message ID: ${info.messageId}`);
    return true;
  } catch (error: any) {
    console.error("[Guest Confirmation Email Error]:", error.message);
    return false;
  }
}
