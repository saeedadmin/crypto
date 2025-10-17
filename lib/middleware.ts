import { NextApiRequest, NextApiResponse } from 'next'
import { authService, AuthUser } from '@/lib/auth'

// Middleware function for protecting API routes
export function withAuth(
  handler: (req: NextApiRequest, res: NextApiResponse, user: AuthUser) => Promise<void> | void
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      // Get token from Authorization header
      const authHeader = req.headers.authorization
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' })
      }

      const token = authHeader.replace('Bearer ', '')
      const user = authService.verifyToken(token)
      
      if (!user) {
        return res.status(401).json({ error: 'Invalid or expired token' })
      }

      // Add user to request object for use in handler
      return handler(req, res, user)
    } catch (error) {
      console.error('Auth middleware error:', error)
      return res.status(401).json({ error: 'Authentication failed' })
    }
  }
}

// Helper function to get user from request
export function getUserFromRequest(req: NextApiRequest): AuthUser | null {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }

    const token = authHeader.replace('Bearer ', '')
    return authService.verifyToken(token)
  } catch (error) {
    return null
  }
}

// Rate limiting helper
interface RateLimitRule {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Max requests per window
}

const requestCounts = new Map<string, { count: number; resetTime: number }>()

export function rateLimit(rule: RateLimitRule) {
  return (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
    const clientId = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown'
    const now = Date.now()
    const key = `${clientId}-${req.url}`
    
    const current = requestCounts.get(key)
    
    if (!current || now > current.resetTime) {
      // First request or window expired
      requestCounts.set(key, {
        count: 1,
        resetTime: now + rule.windowMs
      })
      return next()
    }
    
    if (current.count >= rule.maxRequests) {
      return res.status(429).json({
        error: 'Too many requests',
        retryAfter: Math.ceil((current.resetTime - now) / 1000)
      })
    }
    
    current.count++
    return next()
  }
}

// Input validation helpers
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validateRequired(fields: Record<string, any>): string | null {
  for (const [key, value] of Object.entries(fields)) {
    if (value === undefined || value === null || value === '') {
      return `${key} is required`
    }
  }
  return null
}

// Response helpers
export function successResponse(data: any, message?: string) {
  return {
    success: true,
    message: message || 'Operation successful',
    data,
    timestamp: new Date().toISOString()
  }
}

export function errorResponse(error: string, code?: string) {
  return {
    success: false,
    error,
    code,
    timestamp: new Date().toISOString()
  }
}

// Async error handler
export function asyncHandler(
  fn: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
) {
  return (req: NextApiRequest, res: NextApiResponse) => {
    Promise.resolve(fn(req, res)).catch((error) => {
      console.error('API Error:', error)
      
      if (!res.headersSent) {
        res.status(500).json(errorResponse(
          'Internal server error',
          'INTERNAL_ERROR'
        ))
      }
    })
  }
}