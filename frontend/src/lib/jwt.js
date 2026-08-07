import { SignJWT, jwtVerify } from "jose";

const SECRET_KEY = process.env.JWT_SECRET;
const EXPIRES_IN = parseInt(process.env.JWT_TOKEN_EXPIRED || "86400");

const encoder = new TextEncoder();
const secret = encoder.encode(SECRET_KEY);

export async function signToken(payload) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${EXPIRES_IN}s`)
    .sign(secret);

  return token;
}

export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload; // Return payload signature directly
  } catch (err) {
    console.error("Token verification failed:", err.message);
    return null;
  }
}
