import { use } from "react";

import { DataContext } from "@/components/data-context";
import { formatNumber } from "@/utils/format-number";
import { IStock } from "@/types/stock";

interface ICapitalizationProps {
  stock: IStock;
}

export const Capitalization: React.FC<ICapitalizationProps> = ({ stock }) => {
  const { marketData } = use(DataContext);

  if (!marketData.fullCapitalization) {
    return null;
  }

  return (
    <div className="flex flex-col">
      <h2 className="my-2 font-bold text-xl">
        Капитализация
      </h2>
      <div className="mb-2 text-sm">
        <span>{formatNumber(Math.round(marketData.fullCapitalization))}</span> (в российских рублях)
      </div>
      <div className="text-xs text-gray-500">
        Данные на сегодня.
      </div>
      <div className="text-xs text-gray-500 w-[550px]">
        {stock.company.capitalizationNote}
      </div>
    </div>
  );
}
