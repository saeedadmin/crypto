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
    const { email, password, confirmPassword } = req.body

    if (!email || !password || !confirmPassword) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const result = await authService.register({ email, password, confirmPassword })
    
    res.status(201).json({
      message: 'User registered successfully',
      user: result.user,
      token: result.token
    })
  } catch (error: any) {
    console.error('Registration error:', error)
    res.status(400).json({ error: error.message })
  }
}