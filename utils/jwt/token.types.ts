// utils/jwt/token.types.ts

export interface TokenPayload {
  id: string;
  role: string;
  email?: string;
}

export interface DecodedToken extends TokenPayload {
  iat: number;
  exp: number;
  iss: string;
  aud: string;
}