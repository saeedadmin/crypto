import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../auth/lib/supabase'
import { withAuth, AuthenticatedRequest } from '../../../auth/lib/middleware'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

async function updateProfileHandler(request: AuthenticatedRequest): Promise<NextResponse> {
  try {
    const userId = request.user.userId
    const body = await request.json()
    const { name, telegramId } = body

    console.log('Update profile request:', { userId, name, telegramId })

    // Validation
    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, message: 'نام باید حداقل ۲ کاراکتر باشد' },
        { status: 400 }
      )
    }

    // Telegram ID validation (optional, must be numeric if provided)
    if (telegramId && telegramId.trim() !== '') {
      const telegramRegex = /^\d+$/
      if (!telegramRegex.test(telegramId.trim())) {
        return NextResponse.json(
          { success: false, message: 'آیدی تلگرام باید فقط شامل اعداد باشد' },
          { status: 400 }
        )
      }
    }

    // Prepare update data
    const updateData: any = {
      name: name.trim(),
      updated_at: new Date().toISOString()
    }

    // Add telegram_id only if provided
    if (telegramId && telegramId.trim() !== '') {
      updateData.telegram_id = telegramId.trim()
      updateData.telegram_verified = false // Reset verification status when ID changes
    }

    console.log('Update data:', updateData)

    // Update user information
    const { data: updatedUser, error } = await supabaseAdmin
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select('id, email, name, telegram_id, created_at, updated_at')
      .single()

    if (error) {
      console.error('Profile update error:', error)
      return NextResponse.json(
        { success: false, message: 'خطا در به‌روزرسانی پروفایل' },
        { status: 500 }
      )
    }

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: 'کاربر یافت نشد' },
        { status: 404 }
      )
    }

    console.log('Profile updated successfully:', updatedUser)

    return NextResponse.json({
      success: true,
      message: 'پروفایل با موفقیت به‌روزرسانی شد',
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