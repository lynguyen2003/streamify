import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  _id: string;
  email: string;
  isAdmin: boolean;
  isActive: boolean;
  iat: number;
  exp: number;
  [key: string]: any;
}

/**
 * Decode JWT token and return data
 * @param token JWT token need to decode
 * @returns Decoded data or null if token is invalid
 */
export const decodeToken = (token: string | null): DecodedToken | null => {
  if (!token) return null;
  
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded;
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

/**
 * Check if token is expired
 * @param token JWT token need to check
 * @returns true if token is expired, false if not
 */
export const isTokenExpired = (token: string | null): boolean => {
  const decoded = decodeToken(token);
  if (!decoded) return true;
  
  const currentTime = Math.floor(Date.now() / 1000);
  
  return decoded.exp < currentTime;
};

/**
 * Get token expiration date
 * @param token JWT token
 * @returns Expiration date or null
 */
export const getTokenExpirationDate = (token: string | null): Date | null => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return null;
  
  return new Date(decoded.exp * 1000);
};


