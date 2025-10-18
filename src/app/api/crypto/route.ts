export async function GET() {
  try {
    // فعلاً با CoinGecko API کار می‌کنیم چون رایگان و آسون هست
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin,cardano,solana,polkadot,dogecoin,shiba-inu,chainlink,polygon,avalanche-2,near,internet-computer,cosmos,algorand,tezos,elrond-matic,fantom,pancakeswap-token,uniswap&vs_currencies=usd&include_24hr_change=true',
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
    chainlink: 'Chainlink',
    polygon: 'Polygon',
    'avalanche-2': 'Avalanche',
    near: 'NEAR Protocol',
    'internet-computer': 'Internet Computer',
    cosmos: 'Cosmos',
    algorand: 'Algorand',
    tezos: 'Tezos',
    'elrond-matic': 'MultiversX',
    fantom: 'Fantom',
    'pancakeswap-token': 'PancakeSwap',
    uniswap: 'Uniswap',
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
    chainlink: 'LINK',
    polygon: 'MATIC',
    'avalanche-2': 'AVAX',
    near: 'NEAR',
    'internet-computer': 'ICP',
    cosmos: 'ATOM',
    algorand: 'ALGO',
    tezos: 'XTZ',
    'elrond-matic': 'EGLD',
    fantom: 'FTM',
    'pancakeswap-token': 'CAKE',
    uniswap: 'UNI',
  };
  return symbols[id] || id.toUpperCase();
}
