import type { Metadata, ResolvingMetadata } from "next";
import type { ResolvedOpenGraph } from "next/dist/lib/metadata/types/opengraph-types";

import { PageShell } from '@/components/page-shell';
import { getEmptyInitialDataContext } from '@/utils/get-empty-initial-data-context';
import { IRRCalculatorContent } from "@/components/irr-calculator-content";
import { IRR_CALCULATOR_URL } from "@/constants/urls";

type TProps = {
  params: Promise<void>;
}

export async function generateMetadata(_props: TProps, parent: ResolvingMetadata): Promise<Metadata> {
  const parentMetadata = await parent;
  
  const description = `Бесплатный онлайн-калькулятор показателя внутренней нормы доходности инвестиций IRR (Internal Rate of Return), также известного как норма доходности дисконтирования денежного потока.`;

  return {
    title: 'Калькулятор внутренней нормы доходности (IRR) | Инвестемика',
    description,
    keywords: [
      'калькулятор',
      'онлайн',
      'формула',
      'внутренняя норма доходности',
      'норма доходности дисконтирования денежного потока',
      'IRR',
      'расчёт',
      'показатель',
      'инвестиции'
    ],
    alternates: {
      canonical: IRR_CALCULATOR_URL,
    },
    openGraph: {
      ...parentMetadata.openGraph as ResolvedOpenGraph,
      title: 'Калькулятор внутренней нормы доходности (IRR) | Инвестемика',
      description,
      url: `https://investemika.ru${IRR_CALCULATOR_URL}`,
    },
  };
}

export default function IRRCalculatorPage() {
  const initialDataContext = getEmptyInitialDataContext();

  return (
    <PageShell initialDataContext={initialDataContext}>
      <IRRCalculatorContent />
    </PageShell>
  );
}
