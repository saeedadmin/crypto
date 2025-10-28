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
          message: 'Password must be at least 8 characters and include uppercase, lowercase and numbers' 
        },
        { status: 400 }
      )
    }

    const fullName = `${firstName} ${lastName}`

    // Check if user already exists
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('email')
      .eq('email', email)
      .single()

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const passwordHash = await hashPassword(password)

    // Insert user
    const { data: newUser, error } = await supabaseAdmin
      .from('users')
      .insert([
        {
          name: fullName,
          email,
          password: passwordHash,
        }
      ])
      .select('id, name, email, created_at, updated_at')
      .single()

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