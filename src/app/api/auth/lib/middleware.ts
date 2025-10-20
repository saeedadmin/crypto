import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, extractTokenFromHeader, JWTPayload } from './jwt'

// Extend NextRequest to include user data
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      JWT_SECRET: string
    }
  }
}

export interface AuthenticatedRequest extends NextRequest {
  user: JWTPayload
}

/**
 * Authentication middleware for protected routes
 * @param request Next.js request object
 * @returns NextResponse with user data or error
 */
export async function authMiddleware(request: NextRequest): Promise<{
  success: boolean
  user?: JWTPayload
  response?: NextResponse
}> {
  try {
    // Extract token from Authorization header
    const authHeader = request.headers.get('Authorization')
    const token = extractTokenFromHeader(authHeader)

    if (!token) {
      return {
        success: false,
        response: NextResponse.json(
          { 
            success: false, 
            message: 'Authentication required. Please provide a valid token.' 
          },
          { status: 401 }
        )
      }
    }

    // Verify token
    const payload = verifyToken(token)

    if (!payload) {
      return {
        success: false,
        response: NextResponse.json(
          { 
            success: false, 
            message: 'Invalid or expired token. Please login again.' 
          },
          { status: 401 }
        )
      }
    }

    // Return success with user data
    return {
      success: true,
      user: payload
    }

  } catch (error) {
    console.error('Auth middleware error:', error)
    return {
      success: false,
      response: NextResponse.json(
        { 
          success: false, 
          message: 'Authentication error. Please try again.' 
        },
        { status: 500 }
      )
    }
  }
}

/**
 * Higher-order function to protect API routes
 * @param handler The actual route handler
 * @returns Protected route handler
 */
export function withAuth(
  handler: (request: AuthenticatedRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const authResult = await authMiddleware(request)
    
    if (!authResult.success) {
      return authResult.response!
    }

    // Add user data to request
    (request as AuthenticatedRequest).user = authResult.user!
    
    // Call the original handler
    return handler(request as AuthenticatedRequest)
  }
}