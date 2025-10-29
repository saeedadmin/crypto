import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { hashPassword, validateEmail, validatePassword } from '../lib/auth-utils'
import { SignupData } from '../lib/auth'

// Create Supabase client directly like in test-connection endpoint
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: NextRequest) {
  try {
    console.log('=== SIGNUP START ===')
    console.log('Environment check:', {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseServiceKey,
      url: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'MISSING'
    })

    const body: SignupData = await request.json()
    const { firstName, lastName, email, password } = body

    console.log('Signup request:', { email, hasFirstName: !!firstName, hasLastName: !!lastName, hasPassword: !!password })

    // Enhanced Validation with specific error messages
    if (!firstName || firstName.trim().length < 2) {
      return NextResponse.json(
        { success: false, message: 'نام باید حداقل ۲ کاراکتر باشد' },
        { status: 400 }
      )
    }

    if (!lastName || lastName.trim().length < 2) {
      return NextResponse.json(
        { success: false, message: 'نام خانوادگی باید حداقل ۲ کاراکتر باشد' },
        { status: 400 }
      )
    }

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'ایمیل الزامی است' },
        { status: 400 }
      )
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { success: false, message: 'فرمت ایمیل نامعتبر است' },
        { status: 400 }
      )
    }

    if (!password || password.length < 4) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'رمز عبور باید حداقل ۴ کاراکتر باشد' 
        },
        { status: 400 }
      )
    }

    // Create full name from first and last name
    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim()
    console.log('Full name created:', fullName)

    // Check if user already exists (using the same approach as test-connection)
    console.log('Checking user existence...')
    
    const { data: existingUser, error: checkError } = await supabaseAdmin
      .from('users')
      .select('email')
      .eq('email', email)
      .maybeSingle() // This is the key - using maybeSingle() like test endpoint

    console.log('User check result:', { 
      existingUser, 
      checkError: checkError?.message,
      errorCode: checkError?.code 
    })

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Database error:', checkError)
      return NextResponse.json(
        { 
          success: false, 
          message: 'Database error',
          details: checkError.message
        },
        { status: 500 }
      )
    }

    if (existingUser) {
      console.log('User already exists')
      return NextResponse.json(
        { success: false, message: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    console.log('Hashing password...')
    const passwordHash = await hashPassword(password)
    console.log('Password hashed')

    // Insert user (without name field since it's not in your schema)
    console.log('Creating new user...')
    
    const { data: newUser, error: insertError } = await supabaseAdmin
      .from('users')
      .insert([
        {
          email,
          name: fullName,
          password_hash: passwordHash,
        }
      ])
      .select('id, email, name, created_at, updated_at')
      .single()

    console.log('Insert result:', { newUser, insertError })

    if (insertError) {
      console.error('Insert error:', insertError)
      return NextResponse.json(
        { 
          success: false, 
          message: 'Error creating user account',
          details: insertError.message
        },
        { status: 500 }
      )
    }

    console.log('=== SIGNUP SUCCESS ===')
    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user: newUser
    })

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}