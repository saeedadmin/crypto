import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '../lib/supabase'
import { hashPassword, validateEmail, validatePassword } from '../lib/auth-utils'
import { SignupData } from '../lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body: SignupData = await request.json()
    const { firstName, lastName, email, password } = body

    // Validation
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      )
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      )
    }

    if (!validatePassword(password)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Password must be at least 6 characters' 
        },
        { status: 400 }
      )
    }

    // Check if user already exists
    console.log('Checking if user exists with email:', email)
    const { data: existingUser, error: checkError } = await supabaseAdmin
      .from('users')
      .select('email')
      .eq('email', email)
      .single()

    console.log('Existing user check result:', { existingUser, checkError })

    if (checkError) {
      console.error('Error checking existing user:', checkError)
      return NextResponse.json(
        { 
          success: false, 
          message: 'Error checking user existence',
          details: checkError.message,
          error: checkError
        },
        { status: 500 }
      )
    }

    if (existingUser) {
      console.log('User already exists, returning error')
      return NextResponse.json(
        { success: false, message: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const passwordHash = await hashPassword(password)
    console.log('Password hashed successfully')

    // Insert user (without name field since it's not in your schema)
    console.log('Attempting to insert user with email:', email)
    const { data: newUser, error } = await supabaseAdmin
      .from('users')
      .insert([
        {
          email,
          password_hash: passwordHash,
        }
      ])
      .select('id, email, created_at, updated_at')
      .single()

    console.log('Insert result:', { newUser, error })

    if (error) {
      console.error('Supabase signup error:', error)
      return NextResponse.json(
        { 
          success: false, 
          message: 'Error creating user account',
          details: error.message,
          error: error
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user: newUser
    })

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}