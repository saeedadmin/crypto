import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../auth/lib/supabase'

export async function GET() {
  try {
    // Test database connection
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .limit(1)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({
        success: false,
        error: error.message,
        details: error
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      data: data,
      tableExists: true
    })

  } catch (err) {
    console.error('Test error:', err)
    return NextResponse.json({
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
      details: err
    })
  }
}