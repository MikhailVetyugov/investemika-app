import type { Metadata, ResolvingMetadata } from "next";
import type { ResolvedOpenGraph } from "next/dist/lib/metadata/types/opengraph-types";

import { PageShell } from '@/components/page-shell';
import { getEmptyInitialDataContext } from '@/utils/get-empty-initial-data-context';
import { GordonCalculatorContent } from '@/components/gordon-calculator-content';
import { GORDON_CALCULATOR_URL } from "@/constants/urls";

type TProps = {
  params: Promise<void>;
}

export async function generateMetadata(_props: TProps, parent: ResolvingMetadata): Promise<Metadata> {
  const parentMetadata = await parent;
  
  const description = `Бесплатный онлайн-калькулятор для оценки стоимости обыкновенной акции по модели дисконтирования дивидендов Гордона (DDM, модель постоянного роста). Точно рассчитайте приведенную стоимость акции по формуле постоянного роста.`;

  return {
    title: 'Калькулятор оценки акции по модели дисконтирования дивидендов Гордона | Инвестемика',
    description,
    keywords: [
      'калькулятор',
      'онлайн',
      'модель Гордона',
      'формула Гордона',
      'приведенная стоимость акции',
      'модель дисконтирования дивидендов',
      'модель постоянного роста',
      'оценка акций по дивидендам',
      'Dividend Discount Model',
      'расчёт',
    ],
    alternates: {
      canonical: GORDON_CALCULATOR_URL,
    },
    openGraph: {
      ...parentMetadata.openGraph as ResolvedOpenGraph,
      title: 'Калькулятор модели Гордона | Инвестемика',
      description: `Бесплатный онлайн-калькулятор модели Гордона (DDM) для оценки акций. Рассчитайте справедливую стоимость акции по дивидендам: просто введите дивиденды, ставку дисконтирования и темп роста.`,
      url: `https://investemika.ru${GORDON_CALCULATOR_URL}`,
    },
  };
}

export default function GordonCalculator() {
  const initialDataContext = getEmptyInitialDataContext();

  return (
    <PageShell initialDataContext={initialDataContext}>
      <GordonCalculatorContent />
    </PageShell>
  );
}
