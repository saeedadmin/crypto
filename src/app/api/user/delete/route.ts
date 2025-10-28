import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '../../auth/lib/supabase'
import { withAuth, AuthenticatedRequest } from '../../auth/lib/middleware'
import { verifyPassword } from '../../auth/lib/auth-utils'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

interface DeleteAccountData {
  password: string
  confirmDelete: boolean
}

async function deleteAccountHandler(request: AuthenticatedRequest): Promise<NextResponse> {
  try {
    const userId = request.user.userId
    const body: DeleteAccountData = await request.json()
    const { password, confirmDelete } = body

    // Validation
    if (!confirmDelete) {
      return NextResponse.json(
        { success: false, message: 'Account deletion must be confirmed' },
        { status: 400 }
      )
    }

    if (!password) {
      return NextResponse.json(
        { success: false, message: 'Password is required for account deletion' },
        { status: 400 }
      )
    }

    // Get current user data
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('password_hash, email')
      .eq('id', userId)
      .single()

    if (userError || !user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password_hash)
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Password is incorrect' },
        { status: 401 }
      )
    }

    // Delete user account
    const { error: deleteError } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', userId)

    if (deleteError) {
      console.error('Account deletion error:', deleteError)
      return NextResponse.json(
        { success: false, message: 'Error deleting account' },
        { status: 500 }
      )
    }

    // Return success response
    // Note: In a real application, you might want to:
    // 1. Send a confirmation email
    // 2. Soft delete (mark as deleted instead of actual deletion)
    // 3. Log the deletion for audit purposes
    
    return NextResponse.json({
      success: true,
      message: 'Account deleted successfully',
      deletedUser: {
        id: userId,
        email: user.email
      }
    })

  } catch (error) {
    console.error('Delete account error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Export the protected route
export const DELETE = withAuth(deleteAccountHandler)