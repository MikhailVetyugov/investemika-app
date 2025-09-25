import { IStock } from "@/types/stock";
import { formatNumber } from "@/utils/formatters";
import { isFinancialCompany } from "@/utils/is-financial-company";
import { TooltipCoefficient } from "./tooltip-coefficient";

interface INonFinancialCompanyCoefficientProps {
  value: number | null;
  stock: IStock;
  description?: string;
}

export const NonFinancialCompanyCoefficient: React.FC<INonFinancialCompanyCoefficientProps> = ({ value, stock, description }) => {
  if (isFinancialCompany(stock.company)) {
    const textStart = description ? `${description}. `: '';

    return (
      <TooltipCoefficient
        text ="Н/П"
        tooltipAriaLabel="Почему Н/П?"
        tooltipContent={
          <>
            {stock.company.type === 'bank' && `${textStart}Для банков не имеет практического смысла`}
            {stock.company.type === 'insurance' && `${textStart}Для страховых компаний не имеет практического смысла`}
          </>
        }
      />
    );
  }

  const text = value ? formatNumber(value) : 'Н/Д';

  if (description) {
    return (
      <TooltipCoefficient
        text={text}
        tooltipAriaLabel="Что это?"
        tooltipContent={description}
      />
    );
  }

  return text;
}
