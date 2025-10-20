import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../auth/lib/supabase'
import { withAuth, AuthenticatedRequest } from '../../auth/lib/middleware'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

async function profileHandler(request: AuthenticatedRequest): Promise<NextResponse> {
  try {
    const userId = request.user.userId

    // Get user profile from database
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('id, email, created_at, updated_at')
      .eq('id', userId)
      .single()

    if (error || !user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Profile retrieved successfully',
      user
    })

  } catch (error) {
    console.error('Profile error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Export the protected route
export const GET = withAuth(profileHandler)