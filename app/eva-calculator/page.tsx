import type { Metadata, ResolvingMetadata } from "next";
import type { ResolvedOpenGraph } from "next/dist/lib/metadata/types/opengraph-types";

import { PageShell } from '@/components/page-shell';
import { getEmptyInitialDataContext } from '@/utils/get-empty-initial-data-context';
import { EVACalculatorContent } from "@/components/eva-calculator-content";
import { EVA_CALCULATOR_URL } from "@/constants/urls";

type TProps = {
  params: Promise<void>;
}

export async function generateMetadata(_props: TProps, parent: ResolvingMetadata): Promise<Metadata> {
  const parentMetadata = await parent;
  
  const description = `Бесплатный онлайн-калькулятор EVA. Формула и расчёт экономической добавленной стоимости (остаточной прибыли) для анализа финансовой эффективности компании.`;

  return {
    title: 'Калькулятор экономической добавленной стоимости (EVA) | Инвестемика',
    description,
    keywords: [
      'калькулятор',
      'онлайн',
      'формула',
      'экономическая добавленная стоимость',
      'остаточная прибыль',
      'экономическая прибыль',
      'EVA',
      'расчёт'
    ],
    alternates: {
      canonical: EVA_CALCULATOR_URL,
    },
    openGraph: {
      ...parentMetadata.openGraph as ResolvedOpenGraph,
      title: 'Калькулятор экономической добавленной стоимости (EVA) | Инвестемика',
      description,
      url: `https://investemika.ru${EVA_CALCULATOR_URL}`,
    },
  };
}

export default function EVACalculatorPage() {
  const initialDataContext = getEmptyInitialDataContext();

  return (
    <PageShell initialDataContext={initialDataContext}>
      <EVACalculatorContent />
    </PageShell>
  );
}
