import { InfoIcon } from "lucide-react"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { IStock } from "@/types/stock";
import { formatNumber } from "@/utils/formatters";
import { isFinancialCompany } from "@/utils/is-financial-company";

interface IPSCoefficientProps {
  value: number | null;
  stock: IStock;
}

export const NonFinancialCompanyCoefficient: React.FC<IPSCoefficientProps> = ({ value, stock }) => {
  if (value) {
    return formatNumber(value);
  }

  if (isFinancialCompany(stock.company)) {
    return (
      <span className="flex items-center justify-end gap-2">
        <span>Н/П</span>
        <Popover>
          <PopoverTrigger>
            <InfoIcon className="size-4 cursor-pointer" />
          </PopoverTrigger>
          <PopoverContent className="text-xs text-gray-500">
            {stock.company.type === 'bank' && 'Для банков не имеет практического смысла'}
            {stock.company.type === 'insurance' && 'Для страховых компаний не имеет практического смысла'}
          </PopoverContent>
        </Popover>
      </span>
    );
  }

  return 'Н/Д';
}
