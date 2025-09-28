import { ALL_STOCKS, PREF_TICKERS } from "@/lib/data";
import { fetchAggregatedStockData } from "@/services/shared";
import { fetchCurrencyRate } from "@/services/server";
import { TIndustry } from "@/types/industry";
import { IAggregatedDataInternalResponse, TAverageCoefficientsInternalResponse } from "@/types/response/internal";
import { IStock } from "@/types/stock";
import { getCurrentRatio, getPB, getPE, getPS, getROA, getROE } from "@/utils/calculations";
import { createCacheWrapper } from './cache-wrapper';

type TIndustryCompanyData = {
  stock: IStock;
  marketData: IAggregatedDataInternalResponse;
  currencyRate: number | null;
}

const { withCache } = createCacheWrapper<TAverageCoefficientsInternalResponse>({
  max: 100,
  ttl: 1000 * 60 * 60 * 24,
});

export async function fetchAverageCoefficients(industry: TIndustry) {
  return withCache(fetchAverageCoefficientsRaw, industry);
}

async function fetchAverageCoefficientsRaw(industry: TIndustry): Promise<TAverageCoefficientsInternalResponse> {
  try {
    const industryStocks = ALL_STOCKS.filter(stock =>
      stock.company.industry === industry && !PREF_TICKERS.includes(stock.ticker));
    const industryCompanyPromises = industryStocks.map(fetchIndustryCompanyData);

    const industryCompanies = await Promise.all(industryCompanyPromises);

    return getAverageCoefficients(industryCompanies);
  } catch (error) {
    console.error('Error while fetching average coefficients', error);
  }

  return null;
}

async function fetchIndustryCompanyData(stock: IStock): Promise<TIndustryCompanyData> {
  const [marketData, currencyRate] = await Promise.all([
    fetchAggregatedStockData(stock),
    fetchCurrencyRate(stock.company.currency),
  ]);

  return {
    stock,
    marketData,
    currencyRate,
  }
}

function getAverageCoefficients(items: TIndustryCompanyData[]) {
  let cumulatedPE = 0;
  let cumulatedPB = 0;
  let cumulatedPS = 0;
  let cumulatedPFCF = 0;
  let cumulatedCR = 0;
  let cumulatedROE = 0;
  let cumulatedROA = 0;

  for (let i = 0; i < items.length; i++) {
    const { stock, marketData, currencyRate } = items[i];

    cumulatedPE += getPE({ stock, marketData, currencyRate }) ?? 0;
    cumulatedPB += getPB({ stock, marketData, currencyRate }) ?? 0;
    cumulatedPS += getPS({ stock, marketData, currencyRate }) ?? 0;
    cumulatedPFCF += getPS({ stock, marketData, currencyRate }) ?? 0;
    cumulatedCR += getCurrentRatio(stock) ?? 0;
    cumulatedROE += getROE(stock);
    cumulatedROA += getROA(stock);
  }

  return {
    averagePE: Math.round(cumulatedPE / items.length * 100) / 100,
    averagePB: Math.round(cumulatedPB / items.length * 100) / 100,
    averagePS: Math.round(cumulatedPS / items.length * 100) / 100,
    averagePFCF: Math.round(cumulatedPFCF / items.length * 100) / 100,
    averageCR: Math.round(cumulatedCR / items.length * 10) / 10,
    averageROE: Math.round(cumulatedROE / items.length * 1000) / 1000,
    averageROA: Math.round(cumulatedROA / items.length * 1000) / 1000,
  }
}
