import Link from "next/link";

import { INDUSTRY_NAMES } from "@/constants/industries";
import { ALL_STOCKS } from "@/lib/data";
import { IStock } from "@/types/stock";
import { getIndustryPeers } from "@/utils/get-related-stocks";
import { getUrlNameByStock } from "@/utils/transliteration";

interface IIndustryPeersProps {
  stock: IStock;
}

/** Ссылки на другие компании той же отрасли. */
export const IndustryPeers: React.FC<IIndustryPeersProps> = ({ stock }) => {
  const peers = getIndustryPeers(stock, ALL_STOCKS);

  if (peers.length === 0) {
    return null;
  }

  return (
    <section>
      <h2 className="my-2 font-bold text-xl">
        Компании отрасли «{INDUSTRY_NAMES[stock.company.industry]}»
      </h2>
      <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {peers.map(peer => (
          <li key={peer.ticker}>
            <Link
              href={`/${getUrlNameByStock(peer)}`}
              className="flex h-full items-start justify-between gap-2 rounded-md border px-3 py-2 text-sm transition-colors hover:border-investemika-primary hover:text-investemika-primary"
            >
              <span className="break-words min-w-0">{peer.name}</span>
              <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 font-mono text-xs">{peer.ticker}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};
