export async function GET() {
  try {
    // Get top 100 cryptocurrencies by market cap
    const response = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=1h%2C24h%2C7d',
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch crypto data');
    }

    const data = await response.json();
    
    // Format data for our component
    const formattedData = data.map((coin: any) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol.toUpperCase(),
      price: coin.current_price,
      change1h: coin.price_change_percentage_1h_in_currency || 0,
      change24h: coin.price_change_percentage_24h || 0,
      change7d: coin.price_change_percentage_7d_in_currency || 0,
      marketCap: coin.market_cap,
      volume24h: coin.total_volume,
      rank: coin.market_cap_rank,
      image: coin.image,
      sparkline: coin.sparkline_in_7d?.price || [],
      high24h: coin.high_24h,
      low24h: coin.low_24h,
      ath: coin.ath,
      atl: coin.atl,
      circulatingSupply: coin.circulating_supply,
      totalSupply: coin.total_supply,
      maxSupply: coin.max_supply,
    }));

    return Response.json({
      success: true,
      data: formattedData,
      timestamp: new Date().toISOString(),
      totalCount: formattedData.length,
    });
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    return Response.json(
      {
        success: false,
        error: 'Failed to fetch cryptocurrency data',
      },
      { status: 500 }
    );
  }
}
