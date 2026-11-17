import type { Metadata, ResolvingMetadata } from "next";
import type { ResolvedOpenGraph } from "next/dist/lib/metadata/types/opengraph-types";

import { PageShell } from "@/components/page-shell";
import { ScreenerContent } from "@/components/screener-content";
import { SCREENER_URL } from "@/constants/urls";
import { ALL_STOCKS } from "@/lib/data";
import { fetchCurrencyRate } from "@/services/server";
import { getEmptyInitialDataContext } from "@/utils/get-empty-initial-data-context";
import { parseScreenerQuery } from "@/utils/screener/filters-query";
import { getScreenerRows } from "@/utils/screener/get-screener-rows";

type TProps = {
  params: Promise<void>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/** Приводит searchParams из Next к строке, которую понимает `parseScreenerQuery`. */
const toSearchString = (searchParams: Record<string, string | string[] | undefined>) => {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    for (const item of Array.isArray(value) ? value : [value]) {
      if (item !== undefined) params.append(key, item);
    }
  }

  return params.toString();
};

// Курс доллара должен запрашиваться при обращении к странице, а не один раз при сборке.
export const dynamic = 'force-dynamic';

const TITLE = 'Скринер компаний из индекса Мосбиржи по показателям МСФО | Инвестемика';

export async function generateMetadata(_props: TProps, parent: ResolvingMetadata): Promise<Metadata> {
  const parentMetadata = await parent;

  const description = 'Бесплатный скринер публичных российских компаний из индекса Московской биржи по данным отчётности МСФО: отбор по выручке, прибыли, активам, капиталу, свободному денежному потоку, рентабельности (ROE, ROA), марже и темпам роста.';

  return {
    title: TITLE,
    description,
    keywords: [
      'скринер акций',
      'скринер компаний',
      'фильтр компаний',
      'МСФО',
      'выручка',
      'чистая прибыль',
      'ROE',
      'ROA',
      'рентабельность',
      'фундаментальный анализ',
    ],
    alternates: {
      canonical: SCREENER_URL,
    },
    openGraph: {
      ...parentMetadata.openGraph as ResolvedOpenGraph,
      title: TITLE,
      description,
      url: `https://investemika.ru${SCREENER_URL}`,
    },
  };
}

export default async function ScreenerPage({ searchParams }: TProps) {
  const initialDataContext = getEmptyInitialDataContext();

  const usdRate = await fetchCurrencyRate('USD');
  const rows = getScreenerRows(ALL_STOCKS, usdRate);
  const { filters, sort } = parseScreenerQuery(toSearchString(await searchParams));

  return (
    <PageShell initialDataContext={initialDataContext} stickyContent>
      <ScreenerContent
        rows={rows}
        isUsdRateAvailable={usdRate !== null}
        initialFilters={filters}
        initialSort={sort}
      />
    </PageShell>
  );
}
