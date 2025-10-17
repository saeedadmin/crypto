import type { NextApiRequest, NextApiResponse } from 'next'
import bot, { telegramService } from '@/lib/telegram'

// Set webhook URL during deployment
if (process.env.NODE_ENV === 'production') {
  const webhookUrl = `${process.env.NEXTAUTH_URL}/api/telegram/webhook`
  bot.setWebHook(webhookUrl).catch(console.error)
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { body } = req

    if (body.message) {
      const { chat: { id }, text } = body.message
      
      // Handle /start command
      if (text === '/start') {
        await telegramService.sendWelcomeMessage(id.toString())
      }
    }

    res.status(200).json({ ok: true })
  } catch (error) {
    console.error('Telegram webhook error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}