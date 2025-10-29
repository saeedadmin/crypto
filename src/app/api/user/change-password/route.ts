import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '../../auth/lib/supabase'
import { withAuth, AuthenticatedRequest } from '../../auth/lib/middleware'
import { hashPassword, verifyPassword } from '../../auth/lib/auth-utils'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

interface ChangePasswordData {
  currentPassword: string
  newPassword: string
}

async function changePasswordHandler(request: AuthenticatedRequest): Promise<NextResponse> {
  try {
    const userId = request.user.userId
    const body: ChangePasswordData = await request.json()
    const { currentPassword, newPassword } = body

    // Validation
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, message: 'Current password and new password are required' },
        { status: 400 }
      )
    }

    // Get current user data
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('password_hash')
      .eq('id', userId)
      .single()

    if (userError || !user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }

    // Verify current password
    const isCurrentPasswordValid = await verifyPassword(currentPassword, user.password_hash)
    
    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Current password is incorrect' },
        { status: 401 }
      )
    }

    // New password validation (simplified)
    if (newPassword.length < 4) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'رمز عبور جدید باید حداقل ۴ کاراکتر باشد' 
        },
        { status: 400 }
      )
    }

    // Check if new password is different from current
    if (currentPassword === newPassword) {
      return NextResponse.json(
        { success: false, message: 'New password must be different from current password' },
        { status: 400 }
      )
    }

    // Hash new password
    const newPasswordHash = await hashPassword(newPassword)

    // Update password
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({ 
        password_hash: newPasswordHash,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)

    if (updateError) {
      console.error('Password change error:', updateError)
      return NextResponse.json(
        { success: false, message: 'Error changing password' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Password changed successfully'
    })

  } catch (error) {
    console.error('Change password error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Export the protected route
export const PUT = withAuth(changePasswordHandler)