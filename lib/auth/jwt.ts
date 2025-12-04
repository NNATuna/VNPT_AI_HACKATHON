import jwt from "jsonwebtoken";

const ACCESS_TOKEN_TTL = "15m";
const REFRESH_TOKEN_TTL = "7d";

export type JwtPayload = {
  userId: string;
  role: "STUDENT" | "TEACHER";
  mssv: string;
};

export function signTokens(payload: JwtPayload) {
  const secret = process.env.JWT_SECRET || "dev-secret";
  const accessToken = jwt.sign(payload, secret, { expiresIn: ACCESS_TOKEN_TTL });
  const refreshToken = jwt.sign(payload, secret, { expiresIn: REFRESH_TOKEN_TTL });
  return { accessToken, refreshToken };
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
    return decoded as JwtPayload;
  } catch (error) {
    return null;
  }
}
