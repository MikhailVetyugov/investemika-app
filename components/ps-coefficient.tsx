import { InfoIcon } from "lucide-react"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { IStock } from "@/types/stock";
import { formatNumber } from "@/utils/format-number";

interface IPSCoefficientProps {
  value: number | null;
  stock: IStock;
}

export const PSCoefficient: React.FC<IPSCoefficientProps> = ({ value, stock }) => {
  if (value) {
    return formatNumber(value);
  }

  if (stock.company.type === 'bank') {
    return (
      <span className="flex items-center justify-end gap-2">
        <span>Н/П</span>
        <Popover>
          <PopoverTrigger>
            <InfoIcon className="size-4 cursor-pointer" />
          </PopoverTrigger>
          <PopoverContent className="text-xs text-gray-500">
            Для банков не имеет практического смысла
          </PopoverContent>
        </Popover>
      </span>
    );
  }

  return 'Н/Д';
}
