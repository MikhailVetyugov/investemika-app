import type { Metadata, ResolvingMetadata } from "next";
import type { ResolvedOpenGraph } from "next/dist/lib/metadata/types/opengraph-types";
import { notFound } from "next/navigation";

import { PageShell } from "@/components/page-shell";
import { StockPageContent } from "@/components/stock-page-content";
import { fetchAggregatedStockData } from "@/services/shared";
import { fetchCurrencyRate, fetchAverageCoefficients } from "@/services/server";
import { getStockByUrlName } from "@/utils/get-stock-by-url-name";
import { getStockPageSeoTitle } from "@/utils/get-stock-page-seo-title";

type TProps = {
  params: Promise<{ stock: string }>
}

export async function generateMetadata(
  { params }: TProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { stock: stockUrlName } = await params;
  const stock = getStockByUrlName(stockUrlName);

  if (!stock) {
    return { title: 'Страница не найдена '};
  }

  const parentMetadata = await parent;
  const title = getStockPageSeoTitle(stock);

  return {
    title,
    description: `${stock.name} (${stock.ticker}): ключевые финансовые показатели по МСФО. Актуальные данные по выручке, операционной и чистой прибыли, денежным потокам и мультипликаторам (P/E, P/B, P/S, P/FCF). Вся информация структурирована для быстрого и удобного анализа.`,
    keywords: [
      `финансовые показатели ${stock.company.name}`,
      `отчетность МСФО ${stock.company.name}`,
      `операционная прибыль ${stock.company.name}`,
      `собственный капитал ${stock.company.name}`,
      `операционный денежный поток ${stock.company.name}`,
      `свободный денежный поток ${stock.company.name}`,
      `изменение денежного потока ${stock.company.name}`,
      `мультипликаторы ${stock.company.name}`,
      `выручка ${stock.company.name}`,
      `показатель P/E ${stock.company.name}`,
      `показатель P/B ${stock.company.name}`,
      `показатель P/S ${stock.company.name}`,
      `показатель P/FCF ${stock.company.name}`,
    ],
    openGraph: {
      ...parentMetadata.openGraph as ResolvedOpenGraph,
      title,
      description: `${stock.company.name}: доходы, прибыль, мультипликаторы и цены акций.`,
      url: `https://investemika.ru/${stockUrlName}`
    },
  }
}

export default async function StockPage({ params }: TProps) {
  const { stock: stockUrlName } = await params;
  const stock = getStockByUrlName(stockUrlName);

  if (!stock) {
    return notFound();
  }

  const [marketData, currencyRate, averageCoefficients] = await Promise.all([
    fetchAggregatedStockData(stock),
    fetchCurrencyRate(stock.company.currency),
    fetchAverageCoefficients(stock.company.industry),
  ]);

  const initialDataContext = { stock, marketData, currencyRate, averageCoefficients };

  return (
    <PageShell initialDataContext={initialDataContext} stockPage>
      <StockPageContent />
    </PageShell>
  );
}
