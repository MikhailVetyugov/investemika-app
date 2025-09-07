const TICKER_TO_URL_MAP: Record<string, string> = {
  'LKOH': 'https://www.banki.ru/investment/share/lukoyl_LKOH',
  'GAZP': 'https://www.rbc.ru/quote/ticker/59256',
  'GMKN': 'https://www.banki.ru/investment/share/nornikel_GMKN',
  'NVTK': 'https://www.banki.ru/investment/share/Novatek_NVTK',
  'PLZL': 'https://www.banki.ru/investment/share/Polus_PLZL',
  'ROSN': 'https://www.banki.ru/investment/share/Rosneft_ROSN',
  'SBER': 'https://www.banki.ru/investment/share/sberbank_SBER',
  'SBERP': 'https://www.banki.ru/investment/share/sberbankp_SBERP',
  'TATN': 'https://www.banki.ru/investment/share/Tatneft_TATN',
  'TATNP': 'https://www.banki.ru/investment/share/Tatneftp_TATNP',
  'TRNFP': 'https://www.banki.ru/investment/share/Transneftp_TATNP',
  'CHMF': 'https://www.banki.ru/investment/share/Severstal_CHMF',
  'AFKS': 'https://www.banki.ru/investment/share/SistemaAFK_AFKS',
  'AFLT': 'https://www.banki.ru/investment/share/aeroflot_AFLT',
  'FEES': 'https://www.banki.ru/investment/share/FSKYEES_FEES',
  'MAGN': 'https://www.banki.ru/investment/share/mmk_MAGN',
  'MTSS': 'https://www.banki.ru/investment/share/mts_MTSS',
  'MGNT': 'https://www.banki.ru/investment/share/magnit_MGNT',
  'NLMK': 'https://www.banki.ru/investment/share/nlmk_NLMK',
  'SNGS': 'https://www.banki.ru/investment/share/Surgutneftegaz_SNGS',
  'VTBR': 'https://www.banki.ru/investment/share/vtb_VTBR',
  'HYDR': 'https://www.banki.ru/investment/share/RusGidro_HYDR',
  'PIKK': 'https://www.banki.ru/investment/share/Pik_PIKK',
  'PHOR': 'https://www.banki.ru/investment/share/Phosagro_PHOR',
  'ALRS': 'https://www.banki.ru/investment/share/alrosa_ALRS',
  'MOEX': 'https://www.banki.ru/investment/share/Moskovskayabirzha_MOEX',
  'YDEX': 'https://www.rbc.ru/quote/ticker/69684',
  'RUAL': 'https://www.banki.ru/investment/share/Rusal_RUAL',
  'RAGR': 'https://www.rbc.ru/quote/ticker/359887',
  'T': 'https://www.rbc.ru/quote/ticker/234566',
  'VKCO': 'https://www.rbc.ru/quote/ticker/271957',
  'ASTR': 'https://www.banki.ru/investment/share/Astra_ASTR',
  'POSI': 'https://www.banki.ru/investment/share/gruppapositiv_POSI/',
  'RENI': 'https://www.banki.ru/investment/share/RenessansStrakhovaniye_RENI/',
  'RTKM': 'https://www.banki.ru/investment/share/Rostelecom_RTKM/',
  'RTKMP': 'https://www.banki.ru/investment/share/Rostelecomp_RTKMP/',
  'SVCB': 'https://www.banki.ru/investment/share/Sovkombank_SVCB/',
  'UGLD': 'https://www.banki.ru/investment/share/yugyralzolotogk_UGLD/',
};

export async function fetchPriceFromAlternateSource(ticker: string) {
  const url = TICKER_TO_URL_MAP[ticker];

  if (!url) {
    return null;
  }

  const response = await fetch(url, {
    headers: {
      'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    },
    next: {
      tags: [`${ticker}-alternate-source`],
      revalidate: 60 * 60 * 6,
    }
  });

  const html = await response.text();

  let match;

  if (url.startsWith('https://www.rbc.ru')) {
    const spanRegex = /<span\s+class="chart__info__sum">([\s\S]*?)<\/span>/;
    const spanMatch = html.match(spanRegex);

    if (spanMatch) {
      const priceRegex = /(\d[\d\s,]*(?:\.\d+)?)/;
      match = spanMatch[1].match(priceRegex);
    }
  } else {
    const regex = /<div[^>]*data-test="investment-item-price-block__price"[^>]*>([^<]+)<\/div>/;
    match = html.match(regex);
  }

  if (match && match[1]) {
    const priceText = match[1]
      .trim()
      .replace(' ', '')
      .replace(',', '.');

    return parseFloat(priceText)
  }

  return null;
}
