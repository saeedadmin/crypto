import type { NextApiRequest, NextApiResponse } from 'next'
import { alertMonitor } from '@/lib/alert-monitor'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // This endpoint should be called by a cron job or monitoring service
  // to keep the alert monitoring system running
  
  if (req.method === 'GET') {
    try {
      // Get current status
      const status = alertMonitor.getStatus()
      
      res.status(200).json({
        message: 'Alert monitor status',
        status,
        timestamp: new Date().toISOString()
      })
    } catch (error: any) {
      console.error('Error getting alert monitor status:', error)
      res.status(500).json({ error: 'Failed to get status' })
    }
  } else if (req.method === 'POST') {
    try {
      const { action } = req.body
      
      switch (action) {
        case 'start':
          await alertMonitor.start()
          res.status(200).json({ message: 'Alert monitor started' })
          break
          
        case 'stop':
          alertMonitor.stop()
          res.status(200).json({ message: 'Alert monitor stopped' })
          break
          
        case 'check':
          await alertMonitor.manualCheck()
          res.status(200).json({ message: 'Manual check completed' })
          break
          
        default:
          res.status(400).json({ error: 'Invalid action' })
      }
    } catch (error: any) {
      console.error('Error controlling alert monitor:', error)
      res.status(500).json({ error: error.message })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}