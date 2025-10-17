import type { NextApiRequest, NextApiResponse } from 'next'
import { authService } from '@/lib/auth'
import { dbFunctions } from '@/lib/supabase'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Get user from token
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const user = authService.verifyToken(token)
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' })
    }

    const { telegram_id } = req.body
    if (!telegram_id) {
      return res.status(400).json({ error: 'Telegram ID is required' })
    }

    // Update user with telegram ID
    const updatedUser = await dbFunctions.updateUserTelegram(user.id, telegram_id)
    
    res.status(200).json({
      message: 'Telegram ID updated successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        telegram_id: updatedUser.telegram_id,
        telegram_verified: updatedUser.telegram_verified
      }
    })
  } catch (error: any) {
    console.error('Telegram setup error:', error)
    res.status(500).json({ error: error.message })
  }
}