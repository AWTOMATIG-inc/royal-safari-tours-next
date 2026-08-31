import nodemailer from "nodemailer";
import config from "../../config";
import { generateOTPEmailHTML } from "./emailTemplate";

export async function sendOTPEmail(
  toEmail: string,
  plainOtp: string,
  userName: string
): Promise<boolean> {
  const gmailUser = config.gmailUser;
  const gmailPassword = config.gmailAppPassword;

  if (!gmailUser || !gmailPassword) {
    throw new Error(
      "GMAIL_USER and GMAIL_APP_PASSWORD must be configured in environment variables."
    );
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: gmailUser,
      pass: gmailPassword,
    },
  });

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

export async function sendApplicantConfirmationEmail(
  toEmail: string,
  applicantName: string,
  jobTitle: string
): Promise<boolean> {
  const gmailUser = config.gmailUser;
  const gmailPassword = config.gmailAppPassword;

  if (!gmailUser || !gmailPassword) return false;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: gmailUser, pass: gmailPassword },
  });

  const mailOptions = {
    from: `"Royal Safari Tours Recruitment" <${gmailUser}>`,
    to: toEmail,
    subject: `Application Received: ${jobTitle} - Royal Safari Tours`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #0D231E;">
        <h2 style="color: #0D231E;">Application Submitted Successfully!</h2>
        <p>Dear <strong>${applicantName}</strong>,</p>
        <p>Thank you for applying for the position of <strong>${jobTitle}</strong> at Royal Safari Tours.</p>
        <p>We have successfully received your job application and custom questionnaire responses. Our recruitment team will review your profile and reach out if your qualifications match our requirements.</p>
        <br/>
        <p>Best regards,<br/><strong>Royal Safari Tours HR Team</strong></p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error: any) {
    console.error("[Applicant Email Error]", error.message);
    return false;
  }
}

export async function sendAdminNewApplicationEmail(
  applicantName: string,
  applicantEmail: string,
  applicantPhone: string,
  jobTitle: string
): Promise<boolean> {
  const gmailUser = config.gmailUser;
  const gmailPassword = config.gmailAppPassword;

  if (!gmailUser || !gmailPassword) return false;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: gmailUser, pass: gmailPassword },
  });

  const adminEmail = gmailUser || "info.royalsafaritours@gmail.com";

  const mailOptions = {
    from: `"Royal Safari Tours ATS" <${gmailUser}>`,
    to: adminEmail,
    subject: `[New Applicant Alert] ${applicantName} applied for ${jobTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #0D231E;">
        <h2 style="color: #0D231E;">New Candidate Application Received</h2>
        <p>A new candidate has submitted an application for <strong>${jobTitle}</strong>.</p>
        <table style="width: 100%; max-width: 500px; border-collapse: collapse; margin-top: 15px; background: #f9f9f9; padding: 15px; border-radius: 8px;">
          <tr><td style="padding: 8px; font-weight: bold;">Candidate Name:</td><td style="padding: 8px;">${applicantName}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Email:</td><td style="padding: 8px;">${applicantEmail}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Phone:</td><td style="padding: 8px;">${applicantPhone}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Applied Position:</td><td style="padding: 8px;">${jobTitle}</td></tr>
        </table>
        <p style="margin-top: 20px;">Log in to the Admin Dashboard to review candidate custom answers and manage shortlisting.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error: any) {
    console.error("[Admin Email Error]", error.message);
    return false;
  }
}
