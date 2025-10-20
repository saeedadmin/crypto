import jwt from 'jsonwebtoken'
import { User } from './auth'

export interface JWTPayload {
  userId: string
  email: string
  iat?: number
  exp?: number
}

function getJWTSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  return secret;
}

const JWT_SECRET = getJWTSecret();

/**
 * Generate JWT token for user
 * @param user User object
 * @param expiresIn Token expiration time (default: 7 days)
 * @returns JWT token string
 */
export function generateToken(user: User, expiresIn: string = '7d'): string {
  const payload: JWTPayload = {
    userId: user.id,
    email: user.email
  }

  return jwt.sign(payload, JWT_SECRET, { 
    expiresIn,
    issuer: 'crypto-app',
    audience: 'crypto-app-users'
  } as jwt.SignOptions)
}

/**
 * Verify and decode JWT token
 * @param token JWT token string
 * @returns Decoded payload or null if invalid
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'crypto-app',
      audience: 'crypto-app-users'
    }) as JWTPayload

    return decoded
  } catch (error) {
    console.error('JWT verification error:', error)
    return null
  }
}

/**
 * Extract token from Authorization header
 * @param authHeader Authorization header value
 * @returns Token string or null
 */
export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader) return null
  
  // Expected format: "Bearer <token>"
  const parts = authHeader.split(' ')
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null
  }
  
  return parts[1]
}

/**
 * Refresh token (generate new token with extended expiry)
 * @param token Current valid token
 * @param expiresIn New expiration time
 * @returns New token or null if current token is invalid
 */
export function refreshToken(token: string, expiresIn: string = '7d'): string | null {
  const payload = verifyToken(token)
  if (!payload) return null

  // Create new token with same payload but extended expiry
  const newPayload: JWTPayload = {
    userId: payload.userId,
    email: payload.email
  }

  return jwt.sign(newPayload, JWT_SECRET, { 
    expiresIn,
    issuer: 'crypto-app',
    audience: 'crypto-app-users'
  } as jwt.SignOptions)
}