import type { NextApiRequest, NextApiResponse } from 'next'
import { authService } from '@/lib/auth'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    const result = await authService.login({ email, password })
    
    res.status(200).json({
      message: 'Login successful',
      user: result.user,
      token: result.token
    })
  } catch (error: any) {
    console.error('Login error:', error)
    res.status(401).json({ error: error.message })
  }
}