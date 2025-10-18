import { NextApiRequest, NextApiResponse } from 'next'
import { getTelegramBotInfo } from '@/lib/telegram'

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Get bot info
    const botInfo = await getTelegramBotInfo()
    
    // Get webhook info
    const webhookResponse = await fetch(`${TELEGRAM_API_URL}/getWebhookInfo`)
    const webhookInfo = await webhookResponse.json()

    res.status(200).json({
      success: true,
      botInfo: botInfo.result,
      webhookInfo: webhookInfo.result,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error getting bot status:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
}