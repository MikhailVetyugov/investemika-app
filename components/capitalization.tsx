import { use } from "react";
import { InfoIcon } from "lucide-react";

import { DataContext } from "@/components/data-context";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { formatNumber } from "@/utils/formatters";
import { IStock } from "@/types/stock";
import { getAdjustedCapitalization } from "@/utils/calculations";

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
    <div className="font-bold text-xl whitespace-nowrap">
      <span className="align-middle whitespace-normal">
        Капитализация: {formatNumber(Math.round(adjustedCapitalization))}
      </span>
      &#8288;
      <Popover>
        <PopoverTrigger aria-label="Информация про капитализацию" className="ml-2 align-middle cursor-pointer">
          <InfoIcon className="size-4" />
        </PopoverTrigger>
        <PopoverContent className="text-xs text-gray-500">
          Данные на сегодня.
          <div>{stock.company.capitalizationNote}</div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
