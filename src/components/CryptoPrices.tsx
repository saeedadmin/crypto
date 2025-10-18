'use client';

import { useState, useEffect } from 'react';

interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change1h: number;
  change24h: number;
  change7d: number;
  marketCap: number;
  volume24h: number;
  rank: number;
  image: string;
  sparkline: number[];
  high24h: number;
  low24h: number;
  ath: number;
  atl: number;
  circulatingSupply: number;
  totalSupply: number;
  maxSupply: number;
}

interface ApiResponse {
  success: boolean;
  data: CryptoData[];
  timestamp: string;
  totalCount: number;
}

type SortField = 'rank' | 'price' | 'change1h' | 'change24h' | 'change7d' | 'marketCap' | 'volume24h';
type SortDirection = 'asc' | 'desc';

export default function CryptoPrices() {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [filteredData, setFilteredData] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoData | null>(null);
  const [sortField, setSortField] = useState<SortField>('rank');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCryptoData = async (isInitialLoad = false) => {
    try {
      if (isInitialLoad) {
        setLoading(true);
      } else {
        setUpdating(true);
      }
      
      const response = await fetch('/api/crypto');
      const result: ApiResponse = await response.json();
      
      if (result.success) {
        setCryptoData(result.data);
        setFilteredData(result.data);
        setLastUpdate(new Date().toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }));
        setError(null);
      } else {
        setError('Failed to fetch cryptocurrency data');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
      console.error('Error fetching crypto data:', err);
    } finally {
      if (isInitialLoad) {
        setLoading(false);
      } else {
        setUpdating(false);
      }
    }
  };

  useEffect(() => {
    fetchCryptoData(true); // Initial load
    const interval = setInterval(() => fetchCryptoData(false), 30000); // Updates every 30 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let filtered = cryptoData.filter(crypto =>
      crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredData(filtered);
  }, [cryptoData, sortField, sortDirection, searchTerm]);

  // Handle modal body scroll lock
  useEffect(() => {
    if (selectedCrypto) {
      document.body.style.overflow = 'hidden';
      // Scroll to top when modal opens
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup function
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedCrypto]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const formatPrice = (price: number): string => {
    if (price >= 1) {
      return `$${price.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`;
    } else {
      return `$${price.toFixed(6)}`;
    }
  };

  const formatLargeNumber = (num: number): string => {
    if (num >= 1e12) {
      return `$${(num / 1e12).toFixed(2)}T`;
    } else if (num >= 1e9) {
      return `$${(num / 1e9).toFixed(2)}B`;
    } else if (num >= 1e6) {
      return `$${(num / 1e6).toFixed(2)}M`;
    } else if (num >= 1e3) {
      return `$${(num / 1e3).toFixed(2)}K`;
    }
    return `$${num.toFixed(2)}`;
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading cryptocurrency prices...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h3>⚠️ Error Loading Data</h3>
        <p>{error}</p>
        <button onClick={() => fetchCryptoData(true)} className="error-button">
          🔄 Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="container max-w-7xl mx-auto">
        {/* Stats Section */}
        <div className="stats-section">
          <h2 className="stats-title">Cryptocurrency Market Overview</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">{cryptoData.length}</span>
              <span className="stat-label">Total Cryptocurrencies</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                {cryptoData.filter(crypto => crypto.change24h > 0).length}
              </span>
              <span className="stat-label">Gainers (24h)</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                {cryptoData.filter(crypto => crypto.change24h < 0).length}
              </span>
              <span className="stat-label">Losers (24h)</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                {updating ? (
                  <span className="updating-indicator">
                    🔄 Updating...
                  </span>
                ) : (
                  lastUpdate
                )}
              </span>
              <span className="stat-label">Last Updated</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="controls-section">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search cryptocurrencies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="sort-buttons">
            <button onClick={() => handleSort('rank')} className="sort-button">
              Rank {getSortIcon('rank')}
            </button>
            <button onClick={() => handleSort('price')} className="sort-button">
              Price {getSortIcon('price')}
            </button>
            <button onClick={() => handleSort('change24h')} className="sort-button">
              24h % {getSortIcon('change24h')}
            </button>
            <button onClick={() => handleSort('marketCap')} className="sort-button">
              Market Cap {getSortIcon('marketCap')}
            </button>
            <button onClick={() => handleSort('volume24h')} className="sort-button">
              Volume {getSortIcon('volume24h')}
            </button>
          </div>
        </div>

        {/* Crypto Cards Grid */}
        <div className="crypto-grid">
          {filteredData.map((crypto, index) => (
            <div
              key={crypto.id}
              className="crypto-card"
              style={{
                animationDelay: `${(index % 20) * 0.05}s`
              }}
              onClick={() => setSelectedCrypto(crypto)}
            >
              <div className="crypto-card-header">
                <div className="crypto-rank">#{crypto.rank}</div>
                <img 
                  src={crypto.image} 
                  alt={crypto.name}
                  className="crypto-image"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="crypto-info">
                  <h3>{crypto.name}</h3>
                  <p>{crypto.symbol}</p>
                </div>
              </div>
              
              <div className="crypto-price">
                {formatPrice(crypto.price)}
              </div>
              
              <div className="crypto-changes">
                <div className={`crypto-change ${crypto.change1h >= 0 ? 'positive' : 'negative'}`}>
                  <span>1h: {crypto.change1h >= 0 ? '+' : ''}{crypto.change1h.toFixed(2)}%</span>
                </div>
                <div className={`crypto-change ${crypto.change24h >= 0 ? 'positive' : 'negative'}`}>
                  <span>24h: {crypto.change24h >= 0 ? '+' : ''}{crypto.change24h.toFixed(2)}%</span>
                </div>
                <div className={`crypto-change ${crypto.change7d >= 0 ? 'positive' : 'negative'}`}>
                  <span>7d: {crypto.change7d >= 0 ? '+' : ''}{crypto.change7d.toFixed(2)}%</span>
                </div>
              </div>

              <div className="crypto-market-info">
                <div className="market-cap">
                  <span>Market Cap: {formatLargeNumber(crypto.marketCap)}</span>
                </div>
                <div className="volume">
                  <span>Volume: {formatLargeNumber(crypto.volume24h)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Update Button */}
        <div className="text-center">
          <button onClick={() => fetchCryptoData(false)} className="update-button" disabled={updating}>
            <span>{updating ? '🔄' : '🔄'}</span>
            <span>{updating ? 'Updating...' : 'Refresh Prices'}</span>
          </button>
        </div>
      </div>

      {/* Modal for detailed view */}
      {selectedCrypto && (
        <div 
          className="modal-overlay" 
          onClick={() => setSelectedCrypto(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999
          }}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="modal-close"
              onClick={() => setSelectedCrypto(null)}
            >
              ✕
            </button>
            
            <div className="modal-header">
              <img 
                src={selectedCrypto.image} 
                alt={selectedCrypto.name}
                className="modal-crypto-image"
              />
              <div className="modal-crypto-info">
                <h2>{selectedCrypto.name}</h2>
                <p>{selectedCrypto.symbol} • Rank #{selectedCrypto.rank}</p>
                <div className="modal-price">{formatPrice(selectedCrypto.price)}</div>
              </div>
            </div>

            <div className="modal-changes">
              <div className={`modal-change ${selectedCrypto.change1h >= 0 ? 'positive' : 'negative'}`}>
                <span>1 Hour</span>
                <span>{selectedCrypto.change1h >= 0 ? '+' : ''}{selectedCrypto.change1h.toFixed(2)}%</span>
              </div>
              <div className={`modal-change ${selectedCrypto.change24h >= 0 ? 'positive' : 'negative'}`}>
                <span>24 Hours</span>
                <span>{selectedCrypto.change24h >= 0 ? '+' : ''}{selectedCrypto.change24h.toFixed(2)}%</span>
              </div>
              <div className={`modal-change ${selectedCrypto.change7d >= 0 ? 'positive' : 'negative'}`}>
                <span>7 Days</span>
                <span>{selectedCrypto.change7d >= 0 ? '+' : ''}{selectedCrypto.change7d.toFixed(2)}%</span>
              </div>
            </div>

            <div className="modal-chart">
              <h3>7-Day Price Trend</h3>
              <div className="sparkline-chart">
                <svg width="100%" height="120" viewBox="0 0 400 120">
                  {selectedCrypto.sparkline.length > 0 && (
                    <polyline
                      points={selectedCrypto.sparkline
                        .map((price, index) => {
                          const x = (index / (selectedCrypto.sparkline.length - 1)) * 400;
                          const minPrice = Math.min(...selectedCrypto.sparkline);
                          const maxPrice = Math.max(...selectedCrypto.sparkline);
                          const y = 120 - ((price - minPrice) / (maxPrice - minPrice)) * 100;
                          return `${x},${y}`;
                        })
                        .join(' ')}
                      fill="none"
                      stroke={selectedCrypto.change7d >= 0 ? '#10b981' : '#ef4444'}
                      strokeWidth="2"
                    />
                  )}
                </svg>
              </div>
            </div>

            <div className="modal-details">
              <div className="detail-grid">
                <div className="detail-item">
                  <span>Market Cap</span>
                  <span>{formatLargeNumber(selectedCrypto.marketCap)}</span>
                </div>
                <div className="detail-item">
                  <span>24h Volume</span>
                  <span>{formatLargeNumber(selectedCrypto.volume24h)}</span>
                </div>
                <div className="detail-item">
                  <span>24h High</span>
                  <span>{formatPrice(selectedCrypto.high24h)}</span>
                </div>
                <div className="detail-item">
                  <span>24h Low</span>
                  <span>{formatPrice(selectedCrypto.low24h)}</span>
                </div>
                <div className="detail-item">
                  <span>All-Time High</span>
                  <span>{formatPrice(selectedCrypto.ath)}</span>
                </div>
                <div className="detail-item">
                  <span>All-Time Low</span>
                  <span>{formatPrice(selectedCrypto.atl)}</span>
                </div>
                <div className="detail-item">
                  <span>Circulating Supply</span>
                  <span>{selectedCrypto.circulatingSupply?.toLocaleString() || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span>Total Supply</span>
                  <span>{selectedCrypto.totalSupply?.toLocaleString() || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span>Max Supply</span>
                  <span>{selectedCrypto.maxSupply?.toLocaleString() || 'Unlimited'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}