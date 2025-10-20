import { NextRequest, NextResponse } from 'next/server'
import { withAuth, AuthenticatedRequest } from '../lib/middleware'

async function logoutHandler(request: AuthenticatedRequest): Promise<NextResponse> {
  try {
    // In JWT-based auth, logout is handled on client side
    // by removing the token from storage
    // But we can still provide a server response for confirmation

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully. Please remove the token from client storage.'
    })

  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Export the protected route (requires authentication to logout)
export const POST = withAuth(logoutHandler)