import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export async function GET(request: NextRequest) {
  try {
    const results: any = {
      timestamp: new Date().toISOString(),
      environment: {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET',
        anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET', 
        serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'NOT SET'
      },
      tests: {}
    }

    // Test 1: Basic connection
    try {
      const { data, error, count } = await supabaseAdmin
        .from('users')
        .select('id', { count: 'exact', head: true })
      
      results.tests.connection = {
        success: true,
        error: null,
        count: count,
        data: data
      }
    } catch (err) {
      results.tests.connection = {
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error',
        details: err
      }
    }

    // Test 2: Sample query
    try {
      const { data: sampleData, error: sampleError } = await supabaseAdmin
        .from('users')
        .select('id, email')
        .limit(1)

      results.tests.sampleQuery = {
        success: !sampleError,
        error: sampleError ? sampleError.message : null,
        data: sampleData
      }
    } catch (err) {
      results.tests.sampleQuery = {
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error',
        details: err
      }
    }

    // Test 3: Insert test user
    try {
      const testEmail = `test-user-${Date.now()}@example.com`
      const { data: insertData, error: insertError } = await supabaseAdmin
        .from('users')
        .insert([{
          email: testEmail,
          password_hash: 'test-hash-123'
        }])
        .select('id, email')
        .single()

      results.tests.insertTest = {
        success: !insertError,
        error: insertError ? insertError.message : null,
        data: insertData,
        testEmail: testEmail
      }

      // Clean up test user
      if (insertData) {
        await supabaseAdmin
          .from('users')
          .delete()
          .eq('id', insertData.id)
      }

    } catch (err) {
      results.tests.insertTest = {
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error',
        details: err
      }
    }

    // Test 4: Check if user exists query (this is the one failing)
    try {
      const { data: existingUser, error: checkError } = await supabaseAdmin
        .from('users')
        .select('email')
        .eq('email', 'nonexistent@example.com')
        .single()

      results.tests.userCheckQuery = {
        success: !checkError || checkError.code === 'PGRST116', // "not found" is expected
        error: checkError && checkError.code !== 'PGRST116' ? checkError.message : null,
        data: existingUser,
        errorCode: checkError?.code
      }
    } catch (err) {
      results.tests.userCheckQuery = {
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error',
        details: err
      }
    }

    return NextResponse.json(results)

  } catch (error) {
    console.error('Test connection error:', error)
    return NextResponse.json({
      success: false,
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}