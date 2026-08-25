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
