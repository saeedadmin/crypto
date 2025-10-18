export async function GET() {
  try {
    // فعلاً با CoinGecko API کار می‌کنیم چون رایگان و آسون هست
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin,cardano,solana,polkadot,dogecoin,shiba-inu&vs_currencies=usd&include_24hr_change=true',
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
    
    // داده‌ها رو به فرمت بهتری تبدیل می‌کنیم
    const formattedData = Object.entries(data).map(([id, info]: [string, any]) => ({
      id,
      name: getCryptoName(id),
      symbol: getCryptoSymbol(id),
      price: info.usd,
      change24h: info.usd_24h_change,
    }));

    return Response.json({
      success: true,
      data: formattedData,
      timestamp: new Date().toISOString(),
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

function getCryptoName(id: string): string {
  const names: { [key: string]: string } = {
    bitcoin: 'Bitcoin',
    ethereum: 'Ethereum',
    binancecoin: 'BNB',
    cardano: 'Cardano',
    solana: 'Solana',
    polkadot: 'Polkadot',
    dogecoin: 'Dogecoin',
    'shiba-inu': 'Shiba Inu',
  };
  return names[id] || id;
}

function getCryptoSymbol(id: string): string {
  const symbols: { [key: string]: string } = {
    bitcoin: 'BTC',
    ethereum: 'ETH',
    binancecoin: 'BNB',
    cardano: 'ADA',
    solana: 'SOL',
    polkadot: 'DOT',
    dogecoin: 'DOGE',
    'shiba-inu': 'SHIB',
  };
  return symbols[id] || id.toUpperCase();
}
