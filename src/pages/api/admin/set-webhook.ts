import { NextApiRequest, NextApiResponse } from 'next'
import { setTelegramWebhook, getTelegramBotInfo } from '@/lib/telegram'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { webhookUrl } = req.body

    if (!webhookUrl) {
      return res.status(400).json({ error: 'Webhook URL is required' })
    }

    // Set the webhook
    const result = await setTelegramWebhook(webhookUrl)
    
    if (result.ok) {
      res.status(200).json({
        success: true,
        message: 'Webhook set successfully',
        webhookUrl,
        result
      })
    } else {
      res.status(400).json({
        success: false,
        message: 'Failed to set webhook',
        error: result
      })
    }
  } catch (error) {
    console.error('Error setting webhook:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
}