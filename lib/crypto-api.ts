const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3'

export interface CryptoCoin {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  fully_diluted_valuation: number
  total_volume: number
  high_24h: number
  low_24h: number
  price_change_24h: number
  price_change_percentage_24h: number
  market_cap_change_24h: number
  market_cap_change_percentage_24h: number
  circulating_supply: number
  total_supply: number
  max_supply: number
  ath: number
  ath_change_percentage: number
  ath_date: string
  atl: number
  atl_change_percentage: number
  atl_date: string
  last_updated: string
}

export interface PriceData {
  prices: number[][]
  market_caps: number[][]
  total_volumes: number[][]
}

export const cryptoAPI = {
  async getTopCoins(limit: number = 100, page: number = 1): Promise<CryptoCoin[]> {
    try {
      const response = await fetch(
        `${COINGECKO_API_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=${page}&sparkline=false&price_change_percentage=24h`
      )
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching top coins:', error)
      throw error
    },

  async getCoinById(coinId: string): Promise<CryptoCoin> {
    try {
      const response = await fetch(
        `${COINGECKO_API_URL}/coins/markets?vs_currency=usd&ids=${coinId}&order=market_cap_desc&per_page=1&page=1&sparkline=false&price_change_percentage=24h`
      )
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      return data[0]
    } catch (error) {
      console.error('Error fetching coin by ID:', error)
      throw error
    }
  },

  async getCoinPriceHistory(coinId: string, days: number = 1): Promise<PriceData> {
    try {
      const response = await fetch(
        `${COINGECKO_API_URL}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
      )
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching price history:', error)
      throw error
    }
  },

  async searchCoins(query: string): Promise<any[]> {
    try {
      const response = await fetch(
        `${COINGECKO_API_URL}/search?query=${encodeURIComponent(query)}`
      )
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      return data.coins || []
    } catch (error) {
      console.error('Error searching coins:', error)
      throw error
    }
  },

  async getMultipleCoinPrices(coinIds: string[]): Promise<{[key: string]: {usd: number}}> {
    try {
      const ids = coinIds.join(',')
      const response = await fetch(
        `${COINGECKO_API_URL}/simple/price?ids=${ids}&vs_currencies=usd`
      )
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching multiple coin prices:', error)
      throw error
    }
  },

  // Price formatting utilities
  formatPrice(price: number): string {
    if (price >= 1) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(price)
    } else {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 6,
        maximumFractionDigits: 6
      }).format(price)
    }
  },

  formatPercentage(percentage: number): string {
    return `${percentage >= 0 ? '+' : ''}${percentage.toFixed(2)}%`
  },

  formatMarketCap(marketCap: number): string {
    if (marketCap >= 1e12) {
      return `$${(marketCap / 1e12).toFixed(2)}T`
    } else if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(2)}B`
    } else if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(2)}M`
    } else {
      return `$${marketCap.toLocaleString()}`
    }