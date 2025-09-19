import { use } from "react";
import { InfoIcon } from "lucide-react";

import { DataContext } from "@/components/data-context";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { formatNumber } from "@/utils/format-number";
import { IStock } from "@/types/stock";
import { getAdjustedCapitalization } from "@/utils/calculations/get-adjusted-capitalization";

interface ICapitalizationProps {
  stock: IStock;
}

export const Capitalization: React.FC<ICapitalizationProps> = ({ stock }) => {
  const { marketData } = use(DataContext);

  const adjustedCapitalization = getAdjustedCapitalization(stock, marketData);

  if (!adjustedCapitalization) {
    return null;
  }

  return (
    <div className="flex gap-2">
      <div className="font-bold text-xl">
        Капитализация: {formatNumber(Math.round(adjustedCapitalization))}
      </div>
      <Popover>
        <PopoverTrigger>
          <InfoIcon className="size-4 cursor-pointer" />
        </PopoverTrigger>
        <PopoverContent className="text-xs text-gray-500">
          Данные на сегодня.
          <div>{stock.company.capitalizationNote}</div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
