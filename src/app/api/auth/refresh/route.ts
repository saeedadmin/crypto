import { NextRequest, NextResponse } from 'next/server'
import { withAuth, AuthenticatedRequest } from '../lib/middleware'
import { refreshToken } from '../lib/jwt'
import { extractTokenFromHeader } from '../lib/jwt'

async function refreshHandler(request: AuthenticatedRequest): Promise<NextResponse> {
  try {
    // Extract the current token from header
    const authHeader = request.headers.get('Authorization')
    const currentToken = extractTokenFromHeader(authHeader)

    if (!currentToken) {
      return NextResponse.json(
        { success: false, message: 'No token provided' },
        { status: 400 }
      )
    }

    // Generate new token with extended expiry
    const newToken = refreshToken(currentToken)

    if (!newToken) {
      return NextResponse.json(
        { success: false, message: 'Failed to refresh token' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Token refreshed successfully',
      token: newToken
    })

  } catch (error) {
    console.error('Refresh token error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Export the protected route
export const POST = withAuth(refreshHandler)