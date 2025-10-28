import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../auth/lib/supabase'

export async function GET() {
  try {
    // Check if table exists and test connection
    console.log('Testing Supabase connection...')
    
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('count(*)', { count: 'exact', head: true })

    if (error) {
      console.error('Database error details:', {
        message: error.message,
        details: error,
        code: error.code
      })

      return NextResponse.json({
        success: false,
        error: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      userCount: data?.[0]?.count || 0,
      timestamp: new Date().toISOString()
    })

  } catch (err) {
    console.error('Unexpected error:', err)
    return NextResponse.json({
      success: false,
      error: 'Unexpected error occurred',
      message: err instanceof Error ? err.message : 'Unknown error',
      stack: err instanceof Error ? err.stack : undefined
    }, { status: 500 })
  }
}