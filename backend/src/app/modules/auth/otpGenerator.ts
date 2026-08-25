import crypto from "crypto";

export interface OTPResult {
  plain: string;
  hash: string;
}

export function generateOTP(): OTPResult {
  // Generate cryptographically secure 6-digit numeric OTP (100000 - 999999)
  const numericOtp = crypto.randomInt(100000, 1000000).toString();

  // Compute SHA-256 hash of plain OTP
  const hash = hashOTP(numericOtp);

  return {
    plain: numericOtp,
    hash,
  };
}

export function hashOTP(plainOtp: string): string {
  return crypto.createHash("sha256").update(plainOtp.trim()).digest("hex");
}

export function verifyOTPHash(plainOtp: string, storedHash: string): boolean {
  const computedHash = hashOTP(plainOtp);
  
  // Timing-safe equal comparison to prevent timing attacks
  const bufComputed = Buffer.from(computedHash, "hex");
  const bufStored = Buffer.from(storedHash, "hex");

  if (bufComputed.length !== bufStored.length) {
    return false;
  }

  return crypto.timingSafeEqual(bufComputed, bufStored);
}
