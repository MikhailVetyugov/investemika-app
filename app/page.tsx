import Link from "next/link";

import { PageShell } from "@/components/page-shell";
import { NBSP } from "@/constants/symbols";
import { ALL_STOCKS } from "@/lib/data";
import { getUrlNameByStock } from "@/utils/get-url-name-by-stock";
import { groupStocksByLetter } from "@/utils/group-stocks-by-letter";

export default async function Home() {
  const initialDataContext = { stock: null, marketData: { price: null, fullCapitalization: null } };

  const letterGroups = groupStocksByLetter(ALL_STOCKS);
  const letters = Object.keys(letterGroups);

  return (
    <PageShell initialDataContext={initialDataContext}>
      <div>
        «Инвестемика» — это инструмент для частных инвесторов, представляющий ключевые финансовые показатели российских компаний,
        торгуемых на{NBSP}Московской бирже, по{NBSP}отчетности МСФО по{NBSP}годам: выручка, прибыль, капитал и денежные потоки.
        Мы{NBSP}аккумулируем данные и{NBSP}рассчитываем мультипликаторы (P/E, P/B, P/S, P/FCF), чтобы вы могли принимать
        взвешенные инвестиционные решения на{NBSP}основе фундаментального анализа.
      </div>
      <ul className="md:columns-2 gap-4">
        {letters.map(letter => (
          <li key={letter} className="break-inside-avoid mb-4">
            <h2 className="font-bold mb-4">{letter.toUpperCase()}</h2>
            <ul>
              {letterGroups[letter].map(stock => (
                <li key={stock.ticker} className="text-investemika-primary underline decoration-from-font">
                  <a href={`/${getUrlNameByStock(stock)}`}>{stock.name}</a>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
