'use client'

import { useState, useEffect } from 'react'

interface BotStatus {
  botInfo: {
    id: number
    is_bot: boolean
    first_name: string
    username: string
  }
  webhookInfo: {
    url: string
    has_custom_certificate: boolean
    pending_update_count: number
    last_error_date?: number
    last_error_message?: string
    max_connections?: number
  }
  timestamp: string
}

export default function AdminPage() {
  const [botStatus, setBotStatus] = useState<BotStatus | null>(null)
  const [webhookUrl, setWebhookUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchBotStatus()
  }, [])

  const fetchBotStatus = async () => {
    try {
      const response = await fetch('/api/admin/status')
      const data = await response.json()
      
      if (data.success) {
        setBotStatus(data)
        setWebhookUrl(data.webhookInfo.url || '')
      }
    } catch (error) {
      console.error('Error fetching bot status:', error)
    }
  }

  const setWebhook = async () => {
    if (!webhookUrl.trim()) {
      setMessage('Please enter a webhook URL')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/admin/set-webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ webhookUrl }),
      })

      const data = await response.json()
      
      if (data.success) {
        setMessage('✅ Webhook set successfully!')
        await fetchBotStatus()
      } else {
        setMessage(`❌ Failed to set webhook: ${data.message}`)
      }
    } catch (error) {
      setMessage(`❌ Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const generateWebhookUrl = () => {
    const currentDomain = window.location.origin
    setWebhookUrl(`${currentDomain}/api/telegram/webhook`)
  }

  return (
    <div className=\"min-h-screen bg-gray-50 py-8\">
      <div className=\"max-w-4xl mx-auto px-4\">
        <h1 className=\"text-3xl font-bold text-gray-900 mb-8\">
          🤖 Bot Admin Panel
        </h1>

        {/* Bot Status */}
        <div className=\"bg-white rounded-lg shadow p-6 mb-8\">
          <h2 className=\"text-xl font-semibold text-gray-800 mb-4\">
            📊 Bot Status
          </h2>
          
          {botStatus ? (
            <div className=\"space-y-4\">
              <div className=\"grid grid-cols-1 md:grid-cols-2 gap-4\">
                <div className=\"bg-gray-50 p-4 rounded\">
                  <h3 className=\"font-semibold text-gray-700\">Bot Info</h3>
                  <p><strong>Name:</strong> {botStatus.botInfo.first_name}</p>
                  <p><strong>Username:</strong> @{botStatus.botInfo.username}</p>
                  <p><strong>ID:</strong> {botStatus.botInfo.id}</p>
                </div>
                
                <div className=\"bg-gray-50 p-4 rounded\">
                  <h3 className=\"font-semibold text-gray-700\">Webhook Info</h3>
                  <p><strong>URL:</strong> {botStatus.webhookInfo.url || 'Not set'}</p>
                  <p><strong>Pending Updates:</strong> {botStatus.webhookInfo.pending_update_count}</p>
                  {botStatus.webhookInfo.last_error_message && (
                    <p className=\"text-red-600\">
                      <strong>Last Error:</strong> {botStatus.webhookInfo.last_error_message}
                    </p>
                  )}
                </div>
              </div>
              
              <button
                onClick={fetchBotStatus}
                className=\"bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded\"
              >
                🔄 Refresh Status
              </button>
            </div>
          ) : (
            <p>Loading bot status...</p>
          )}
        </div>

        {/* Webhook Management */}
        <div className=\"bg-white rounded-lg shadow p-6\">
          <h2 className=\"text-xl font-semibold text-gray-800 mb-4\">
            🔗 Webhook Management
          </h2>
          
          <div className=\"space-y-4\">
            <div>
              <label className=\"block text-sm font-medium text-gray-700 mb-2\">
                Webhook URL
              </label>
              <div className=\"flex gap-2\">
                <input
                  type=\"url\"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder=\"https://your-domain.vercel.app/api/telegram/webhook\"
                  className=\"flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500\"
                />
                <button
                  onClick={generateWebhookUrl}
                  className=\"bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded\"
                >
                  Auto-fill
                </button>
              </div>
            </div>
            
            <button
              onClick={setWebhook}
              disabled={loading}
              className=\"bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-6 py-2 rounded\"
            >
              {loading ? '⏳ Setting...' : '✅ Set Webhook'}
            </button>
            
            {message && (
              <div className={`p-3 rounded ${
                message.includes('✅') 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {message}
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className=\"bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-8\">
          <h3 className=\"text-lg font-semibold text-yellow-800 mb-2\">
            📝 Setup Instructions
          </h3>
          <ol className=\"list-decimal list-inside space-y-2 text-yellow-700\">
            <li>Deploy your application to Vercel</li>
            <li>Copy your deployment URL</li>
            <li>Use the \"Auto-fill\" button or manually enter: <code>YOUR_DOMAIN/api/telegram/webhook</code></li>
            <li>Click \"Set Webhook\" to connect your bot</li>
            <li>Test the bot by sending /start to @{botStatus?.botInfo.username}</li>
          </ol>
        </div>
      </div>
    </div>
  )
}