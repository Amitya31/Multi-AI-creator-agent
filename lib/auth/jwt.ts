import jwt from "jsonwebtoken";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

export const signToken = (userId: string) => {
  return jwt.sign(
    { userId },                 // ✅ object payload
    JWT_SECRET,
    {
      expiresIn: "7d",
      algorithm: "HS256",
    }
  );
};

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function verifyEdgeToken(token: string) {
  const { payload } = await jwtVerify(token, secret);

  if (!payload.userId) {
    throw new Error("Invalid token");
  }

  return payload as { userId: string };
}