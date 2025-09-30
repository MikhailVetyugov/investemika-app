import { ALL_STOCKS, PREF_TICKERS } from "@/lib/data";
import { fetchAggregatedStockData } from "@/services/shared";
import { fetchCurrencyRate } from "@/services/server";
import { TIndustry } from "@/types/industry";
import { IAggregatedDataInternalResponse, TAverageCoefficientsInternalResponse } from "@/types/response/internal";
import { IStock } from "@/types/stock";
import { getCurrentRatio, getPB, getPE, getPFCF, getPS, getROA, getROE } from "@/utils/calculations";
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
      stock.company.industry === industry && (stock.company.tickers.length === 1 || !PREF_TICKERS.includes(stock.ticker)));
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

  let countPE = 0;
  let countPB = 0;
  let countPS = 0;
  let countPFCF = 0;
  let countCR = 0;
  let countROE = 0;
  let countROA = 0;

  for (let i = 0; i < items.length; i++) {
    const { stock, marketData, currencyRate } = items[i];

    const PE = getPE({ stock, marketData, currencyRate });

    if (PE != null) {
      cumulatedPE += PE;
      countPE++;
    }

    const PB = getPB({ stock, marketData, currencyRate });
    if (PB != null) {
      cumulatedPB += PB;
      countPB++;
    }

    const PS = getPS({ stock, marketData, currencyRate });
    if (PS != null) {
      cumulatedPS += PS;
      countPS++;
    }

    const PFCF = getPFCF({ stock, marketData, currencyRate });
    if (PFCF != null) {
      cumulatedPFCF += PFCF;
      countPFCF++;
    }

    const CR = getCurrentRatio(stock);
    if (CR != null) {
      cumulatedCR += CR;
      countCR++;
    }

    const ROE = getROE(stock);
    if (ROE != null) {
      cumulatedROE += ROE;
      countROE++;
    }

    const ROA = getROA(stock);
    if (ROA != null) {
      cumulatedROA += ROA;
      countROA++;
    }
  }

  return {
    averagePE: countPE > 0 ? Math.round(cumulatedPE / countPE * 100) / 100 : 0,
    averagePB: countPB > 0 ? Math.round(cumulatedPB / countPB * 100) / 100 : 0,
    averagePS: countPS > 0 ? Math.round(cumulatedPS / countPS * 100) / 100 : 0,
    averagePFCF: countPFCF > 0 ? Math.round(cumulatedPFCF / countPFCF * 100) / 100 : 0,
    averageCR: countCR > 0 ? Math.round(cumulatedCR / countCR * 10) / 10 : 0,
    averageROE: countROE > 0 ? Math.round(cumulatedROE / countROE * 1000) / 1000 : 0,
    averageROA: countROA > 0 ? Math.round(cumulatedROA / countROA * 1000) / 1000 : 0,
  }
}
