import Link from "next/link";

import { PageShell } from "@/components/page-shell";
import { NBSP } from "@/constants/symbols";
import { GORDON_CALCULATOR_URL, IRR_CALCULATOR_URL } from "@/constants/urls";
import { ALL_STOCKS } from "@/lib/data";
import { getUrlNameByStock } from "@/utils/transliteration";
import { groupStocksByLetter } from "@/utils/group-stocks-by-letter";
import { getEmptyInitialDataContext } from "@/utils/get-empty-initial-data-context";

export default async function HomePage() {
  const initialDataContext = getEmptyInitialDataContext();

  const letterGroups = groupStocksByLetter(ALL_STOCKS);
  const letters = Object.keys(letterGroups);

  const headingClassName = "font-bold text-3xl";
  const linkClassName = "text-investemika-primary underline underline-offset-4";

  return (
    <PageShell initialDataContext={initialDataContext}>
      <p>
        «Инвестемика» — это инструмент для частных инвесторов, представляющий ключевые финансовые показатели российских компаний
        из{NBSP}индекса Московской биржи по{NBSP}отчетности МСФО: выручка, прибыль, капитал и денежные потоки по{NBSP}годам.
        Мы{NBSP}аккумулируем данные и{NBSP}рассчитываем мультипликаторы (P/E, P/B, P/S, P/FCF), чтобы вы могли принимать
        взвешенные инвестиционные решения на{NBSP}основе фундаментального анализа.
      </p>

      <h1 className={headingClassName}>Компании</h1>
      <ul className="md:columns-2 gap-4">
        {letters.map(letter => (
          <li key={letter} className="break-inside-avoid mb-4">
            <h2 className="font-bold mb-4">{letter.toUpperCase()}</h2>
            <ul>
              {letterGroups[letter].map(stock => (
                <li key={stock.ticker} className={linkClassName}>
                  <Link href={`/${getUrlNameByStock(stock)}`}>{stock.name}</Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      <h2 className={headingClassName}>Калькуляторы</h2>
      <ul>
        <li className={linkClassName}>
          <Link href={GORDON_CALCULATOR_URL}>Калькулятор модели Гордона</Link>
        </li>
        <li className={linkClassName}>
          <Link href={IRR_CALCULATOR_URL}>Калькулятор IRR</Link>
        </li>
      </ul>
    </PageShell>
  );
}
