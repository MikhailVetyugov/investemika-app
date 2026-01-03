import { IStock } from "@/types/stock";
import { formatNumber } from "@/utils/formatters";
import { isFinancialCompany } from "@/utils/is-financial-company";
import { TooltipCoefficient } from "./tooltip-coefficient";
import { NO_DATA_TEXT } from "./texts";

interface INonFinancialCompanyCoefficientProps {
  value: number | null | undefined;
  stock: IStock;
  description?: string;
  withTooltip?: boolean;
}

export const NonFinancialCompanyCoefficient: React.FC<INonFinancialCompanyCoefficientProps> = ({
  value,
  stock,
  description,
  withTooltip = true,
}) => {
  if (isFinancialCompany(stock.company)) {
    if (!withTooltip) {
      return 'Н/П';
    }

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

  const text = value ? formatNumber(value) : NO_DATA_TEXT;

  if (description && withTooltip) {
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
