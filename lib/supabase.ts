import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types
export interface User {
  id: string
  email: string
  password_hash: string
  telegram_id?: string
  telegram_verified: boolean
  created_at: string
  updated_at: string
}

export interface Alert {
  id: string
  user_id: string
  coin_id: string
  coin_name: string
  coin_symbol: string
  alert_type: 'price' | 'percentage'
  target_price?: number
  percentage_change?: number
  comparison: 'above' | 'below' | 'increase' | 'decrease'
  is_active: boolean
  triggered: boolean
  created_at: string
  updated_at: string
}

export interface TelegramUser {
  id: string
  telegram_id: string
  user_email: string
  verified_at: string
}

// Database Functions
export const dbFunctions = {
  // User operations
  async createUser(email: string, passwordHash: string) {
    const { data, error } = await supabase
      .from('users')
      .insert([{ email, password_hash: passwordHash }])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getUserByEmail(email: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  async updateUserTelegram(userId: string, telegramId: string) {
    const { data, error } = await supabase
      .from('users')
      .update({ 
        telegram_id: telegramId, 
        telegram_verified: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Alert operations
  async createAlert(alert: Omit<Alert, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('alerts')
      .insert([alert])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getUserAlerts(userId: string) {
    const { data, error } = await supabase
      .from('alerts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async updateAlert(alertId: string, updates: Partial<Alert>) {
    const { data, error } = await supabase
      .from('alerts')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', alertId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async deleteAlert(alertId: string) {
    const { error } = await supabase
      .from('alerts')
      .delete()
      .eq('id', alertId)
    
    if (error) throw error
  },

  async getActiveAlerts() {
    const { data, error } = await supabase
      .from('alerts')
      .select(`
        *,
        users!inner(telegram_id, telegram_verified)
      `)
      .eq('is_active', true)
      .eq('triggered', false)
      .eq('users.telegram_verified', true)
    
    if (error) throw error
    return data || []
  }
}