import React from 'react'
import Image from 'next/image'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { Card } from './ui/Card'
import { CryptoCoin } from '@/lib/crypto-api'

interface CoinCardProps {
  coin: CryptoCoin
  onClick?: () => void
  index?: number
}

export const CoinCard: React.FC<CoinCardProps> = ({ coin, onClick, index = 0 }) => {
  const isPositive = coin.price_change_percentage_24h >= 0
  
  return (
    <div>
      <Card hover={true} onClick={onClick} className="cursor-pointer hover:border-primary-500/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative w-10 h-10">
              <Image
                src={coin.image}
                alt={coin.name}
                width={40}
                height={40}
                className="rounded-full"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = '/placeholder-coin.png'
                }}
              />
            </div>
            
            <div>
              <h3 className="font-semibold text-white text-lg">{coin.name}</h3>
              <p className="text-gray-400 text-sm uppercase">{coin.symbol}</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-xl font-bold text-white">
              ${coin.current_price.toLocaleString(undefined, {
                minimumFractionDigits: coin.current_price >= 1 ? 2 : 6,
                maximumFractionDigits: coin.current_price >= 1 ? 2 : 6
              })}
            </div>
            
            <div className={`flex items-center justify-end space-x-1 text-sm ${
              isPositive ? 'text-secondary-400' : 'text-red-400'
            }`}>
              {isPositive ? (
                <TrendingUp size={16} />
              ) : (
                <TrendingDown size={16} />
              )}
              <span>
                {isPositive ? '+' : ''}{coin.price_change_percentage_24h.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Market Cap</span>
              <div className="font-medium text-white">
                {coin.market_cap ? (
                  coin.market_cap >= 1e12 ? `$${(coin.market_cap / 1e12).toFixed(2)}T` :
                  coin.market_cap >= 1e9 ? `$${(coin.market_cap / 1e9).toFixed(2)}B` :
                  coin.market_cap >= 1e6 ? `$${(coin.market_cap / 1e6).toFixed(2)}M` :
                  `$${coin.market_cap.toLocaleString()}`
                ) : 'N/A'}
              </div>
            </div>
            
            <div>
              <span className="text-gray-400">24h Volume</span>
              <div className="font-medium text-white">
                {coin.total_volume ? (
                  coin.total_volume >= 1e9 ? `$${(coin.total_volume / 1e9).toFixed(2)}B` :
                  coin.total_volume >= 1e6 ? `$${(coin.total_volume / 1e6).toFixed(2)}M` :
                  `$${coin.total_volume.toLocaleString()}`
                ) : 'N/A'}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>24h Range</span>
            <span>Rank #{coin.market_cap_rank}</span>
          </div>
          
          {coin.low_24h && coin.high_24h && (
            <div className="flex justify-between text-sm">
              <span className="text-red-400">
                ${coin.low_24h.toLocaleString(undefined, {
                  minimumFractionDigits: coin.low_24h >= 1 ? 2 : 6,
                  maximumFractionDigits: coin.low_24h >= 1 ? 2 : 6
                })}
              </span>
              <span className="text-secondary-400">
                ${coin.high_24h.toLocaleString(undefined, {
                  minimumFractionDigits: coin.high_24h >= 1 ? 2 : 6,
                  maximumFractionDigits: coin.high_24h >= 1 ? 2 : 6
                })}
              </span>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}