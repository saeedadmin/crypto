import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '../lib/supabase'
import { verifyPassword, validateEmail } from '../lib/auth-utils'
import { LoginData } from '../lib/auth'
import { generateToken } from '../lib/jwt'

export async function POST(request: NextRequest) {
  try {
    const body: LoginData = await request.json()
    const { email, password } = body

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      )
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Find user by email
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('id, name, email, password, created_at, updated_at')
      .eq('email', email)
      .single()

    if (userError || !user) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Remove password from response
    const { password: userPassword, ...userWithoutPassword } = user

    // Generate JWT token
    const token = generateToken(userWithoutPassword)

    // Update last login (optional)
    await supabaseAdmin
      .from('users')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', user.id)

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        ...userWithoutPassword,
        name: user.name
      },
      token
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}