import type { NextApiRequest, NextApiResponse } from 'next'
import { authService } from '@/lib/auth'
import { dbFunctions } from '@/lib/supabase'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) {
    return res.status(401).json({ error: 'No token provided' })
  }

  const user = authService.verifyToken(token)
  if (!user) {
    return res.status(401).json({ error: 'Invalid token' })
  }

  switch (req.method) {
    case 'GET':
      try {
        const alerts = await dbFunctions.getUserAlerts(user.id)
        res.status(200).json({ alerts })
      } catch (error: any) {
        console.error('Error fetching alerts:', error)
        res.status(500).json({ error: 'Failed to fetch alerts' })
      }
      break

    case 'POST':
      try {
        const { coin_id, coin_name, coin_symbol, alert_type, target_price, percentage_change, comparison } = req.body
        
        if (!coin_id || !coin_name || !coin_symbol || !alert_type || !comparison) {
          return res.status(400).json({ error: 'Missing required fields' })
        }

        if (alert_type === 'price' && !target_price) {
          return res.status(400).json({ error: 'Target price is required for price alerts' })
        }

        if (alert_type === 'percentage' && !percentage_change) {
          return res.status(400).json({ error: 'Percentage change is required for percentage alerts' })
        }

        const alert = await dbFunctions.createAlert({
          user_id: user.id,
          coin_id,
          coin_name,
          coin_symbol,
          alert_type,
          target_price: alert_type === 'price' ? target_price : null,
          percentage_change: alert_type === 'percentage' ? percentage_change : null,
          comparison,
          is_active: true,
          triggered: false
        })

        res.status(201).json({ alert })
      } catch (error: any) {
        console.error('Error creating alert:', error)
        res.status(500).json({ error: 'Failed to create alert' })
      }
      break

    case 'PUT':
      try {
        const { id, ...updates } = req.body
        
        if (!id) {
          return res.status(400).json({ error: 'Alert ID is required' })
        }

        const alert = await dbFunctions.updateAlert(id, updates)
        res.status(200).json({ alert })
      } catch (error: any) {
        console.error('Error updating alert:', error)
        res.status(500).json({ error: 'Failed to update alert' })
      }
      break

    case 'DELETE':
      try {
        const { id } = req.query
        
        if (!id) {
          return res.status(400).json({ error: 'Alert ID is required' })
        }

        await dbFunctions.deleteAlert(id as string)
        res.status(200).json({ message: 'Alert deleted successfully' })
      } catch (error: any) {
        console.error('Error deleting alert:', error)
        res.status(500).json({ error: 'Failed to delete alert' })
      }
      break

    default:
      res.status(405).json({ error: 'Method not allowed' })
  }
}