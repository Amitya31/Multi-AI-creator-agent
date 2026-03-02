import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function signToken(userId: string) {
  return await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyEdgeToken(token: string) {
  const { payload } = await jwtVerify(token, secret);

  if (!payload.userId) {
    throw new Error("Invalid token");
  }

  return payload as { userId: string };
}