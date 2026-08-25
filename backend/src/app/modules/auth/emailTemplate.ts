export function generateOTPEmailHTML(
  otp: string,
  userName: string,
  expiryMinutes: number = 10
): string {
  const safeName = userName || "Valued Guest";
  const formattedOtp = otp.split("").join(" ");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Royal Safari Tours - Verification Code</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f6f8; font-family:'Plus Jakarta Sans', Helvetica, Arial, sans-serif; color:#1a1a1a;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f4f6f8; padding:30px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" max-width="560" border="0" cellspacing="0" cellpadding="0" style="max-width:560px; background-color:#ffffff; border-radius:20px; overflow:hidden; border:1px solid #e5e7eb; box-shadow:0 10px 25px rgba(13,35,30,0.06);">
          
          <!-- Header Banner -->
          <tr>
            <td style="background-color:#0D231E; padding:32px 30px; text-align:center;">
              <h1 style="margin:0; font-size:24px; font-weight:800; color:#ffffff; letter-spacing:1px; text-transform:uppercase;">
                ROYAL SAFARI TOURS
              </h1>
              <p style="margin:6px 0 0 0; font-size:12px; color:#DE8D3D; font-weight:600; letter-spacing:2px; text-transform:uppercase;">
                Two-Factor Security Verification
              </p>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding:36px 32px; background-color:#ffffff;">
              <p style="margin:0 0 16px 0; font-size:16px; font-weight:700; color:#0D231E;">
                Hello ${safeName},
              </p>
              <p style="margin:0 0 24px 0; font-size:14px; line-height:1.6; color:#4b5563;">
                A sign-in attempt was initiated for your Royal Safari Tours account. Please use the verification code below to complete your authentication:
              </p>

              <!-- OTP Code Display Card -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin:24px 0;">
                <tr>
                  <td align="center" style="background-color:#f8fafc; border:1px solid #0D231E; border-radius:16px; padding:24px;">
                    <span style="display:block; font-size:11px; font-weight:700; color:#94a3b8; letter-spacing:1.5px; text-transform:uppercase; margin-bottom:8px;">
                      Your One-Time Passcode
                    </span>
                    <span style="font-size:36px; font-weight:900; font-family:Courier, monospace; color:#DE8D3D; letter-spacing:8px; display:inline-block;">
                      ${formattedOtp}
                    </span>
                  </td>
                </tr>
              </table>

              <!-- Expiry & Instructions -->
              <div style="background-color:#fffbeb; border-left:4px solid #FF9933; border-radius:8px; padding:12px 16px; margin-bottom:24px;">
                <p style="margin:0; font-size:13px; color:#92400e; font-weight:600;">
                  ⏱️ Code Expiry Notice: This code will expire in <strong>${expiryMinutes} minutes</strong>.
                </p>
              </div>

              <p style="margin:0 0 12px 0; font-size:13px; color:#6b7280; line-height:1.5;">
                For your security, never share this code with anyone. Royal Safari Tours staff will never ask for your verification code.
              </p>
              <p style="margin:0; font-size:12px; color:#9ca3af; font-style:italic;">
                If you did not request this login code, please ignore this email or change your account password immediately.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f8fafc; padding:20px 30px; text-align:center; border-top:1px solid #f1f5f9;">
              <p style="margin:0 0 4px 0; font-size:12px; font-weight:700; color:#0D231E;">
                Royal Safari Tours
              </p>
              <p style="margin:0; font-size:11px; color:#94a3b8;">
                Khilgaon, Dhaka 1219, Bangladesh &bull; +8801898-334733
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}
