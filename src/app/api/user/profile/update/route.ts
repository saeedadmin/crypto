import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../auth/lib/supabase'
import { withAuth, AuthenticatedRequest } from '../../../auth/lib/middleware'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

async function updateProfileHandler(request: AuthenticatedRequest): Promise<NextResponse> {
  try {
    const userId = request.user.userId
    const body = await request.json()
    const { email } = body

    // Validation
    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      )
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Check if email is already taken by another user
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email)
      .neq('id', userId)
      .single()

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Email is already taken' },
        { status: 409 }
      )
    }

    // Update user information
    const { data: updatedUser, error } = await supabaseAdmin
      .from('users')
      .update({ 
        email,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select('id, email, created_at, updated_at')
      .single()

    if (error) {
      console.error('Profile update error:', error)
      return NextResponse.json(
        { success: false, message: 'Error updating profile' },
        { status: 500 }
      )
    }

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    })

  } catch (error) {
    console.error('Update profile error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Export the protected route
export const PUT = withAuth(updateProfileHandler)