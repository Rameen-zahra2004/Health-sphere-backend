// utils/jwt/index.ts

import TokenService from "./token.service";

export default TokenService;

export type { TokenPayload, DecodedToken } from "./token.types";
export { jwtConfig } from "./jwtConfig";