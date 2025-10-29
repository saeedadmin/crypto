import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export async function GET(request: NextRequest) {
  try {
    // Test if name field exists by trying to insert a user with name
    const testEmail = `test-name-field-${Date.now()}@example.com`
    
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert([{
        email: testEmail,
        name: 'کاربر تست',
        password_hash: 'test-hash'
      }])
      .select('id, email, name')
      .single()

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
        message: 'فیلد name در دیتابیس وجود ندارد. لطفاً این SQL را در Supabase اجرا کنید:',
        sql: 'ALTER TABLE users ADD COLUMN IF NOT EXISTS name VARCHAR(255);'
      })
    }

    // Clean up test user
    if (data) {
      await supabaseAdmin.from('users').delete().eq('id', data.id)
    }

    return NextResponse.json({
      success: true,
      message: 'فیلد name در دیتابیس موجود است و کار می‌کند',
      testResult: data
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'خطا در تست فیلد name'
    })
  }
}