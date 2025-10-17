import type { NextApiRequest, NextApiResponse } from 'next'
import { cryptoAPI } from '@/lib/crypto-api'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { page = '1', limit = '50' } = req.query
    
    const pageNum = parseInt(page as string)
    const limitNum = parseInt(limit as string)
    
    if (pageNum < 1 || limitNum < 1 || limitNum > 250) {
      return res.status(400).json({ error: 'Invalid page or limit parameters' })
    }

    const coins = await cryptoAPI.getTopCoins(limitNum, pageNum)
    
    res.status(200).json({ coins })
  } catch (error: any) {
    console.error('Error fetching coins:', error)
    res.status(500).json({ error: 'Failed to fetch cryptocurrency data' })
  }
}