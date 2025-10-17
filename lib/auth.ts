import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { dbFunctions, User } from './supabase'

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'fallback-secret'

export interface AuthUser {
  id: string
  email: string
  telegram_id?: string
  telegram_verified: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  confirmPassword: string
}

export const authService = {
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 12
    return bcrypt.hash(password, saltRounds)
  },

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  },

  generateToken(user: AuthUser): string {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        telegram_id: user.telegram_id,
        telegram_verified: user.telegram_verified
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )
  },

  verifyToken(token: string): AuthUser | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as AuthUser
      return decoded
    } catch (error) {
      return null
    }
  },

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = []
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long')
    }
    
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Password must contain at least one lowercase letter')
    }
    
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Password must contain at least one uppercase letter')
    }
    
    if (!/(?=.*\d)/.test(password)) {
      errors.push('Password must contain at least one number')
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  },

  async register(credentials: RegisterCredentials): Promise<{ user: AuthUser; token: string }> {
    const { email, password, confirmPassword } = credentials
    
    // Validation
    if (!this.validateEmail(email)) {
      throw new Error('Invalid email format')
    }
    
    const passwordValidation = this.validatePassword(password)
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.errors.join(', '))
    }
    
    if (password !== confirmPassword) {
      throw new Error('Passwords do not match')
    }
    
    // Check if user already exists
    const existingUser = await dbFunctions.getUserByEmail(email)
    if (existingUser) {
      throw new Error('User already exists with this email')
    }
    
    // Create user
    const passwordHash = await this.hashPassword(password)
    const dbUser = await dbFunctions.createUser(email, passwordHash)
    
    const authUser: AuthUser = {
      id: dbUser.id,
      email: dbUser.email,
      telegram_id: dbUser.telegram_id,
      telegram_verified: dbUser.telegram_verified
    }
    
    const token = this.generateToken(authUser)
    
    return { user: authUser, token }
  },

  async login(credentials: LoginCredentials): Promise<{ user: AuthUser; token: string }> {
    const { email, password } = credentials
    
    // Validation
    if (!this.validateEmail(email)) {
      throw new Error('Invalid email format')
    }
    
    // Get user from database
    const dbUser = await dbFunctions.getUserByEmail(email)
    if (!dbUser) {
      throw new Error('Invalid email or password')
    }
    
    // Verify password
    const isPasswordValid = await this.comparePassword(password, dbUser.password_hash)
    if (!isPasswordValid) {
      throw new Error('Invalid email or password')
    }
    
    const authUser: AuthUser = {
      id: dbUser.id,
      email: dbUser.email,
      telegram_id: dbUser.telegram_id,
      telegram_verified: dbUser.telegram_verified
    }
    
    const token = this.generateToken(authUser)
    
    return { user: authUser, token }
  }
}