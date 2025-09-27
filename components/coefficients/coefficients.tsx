import { memo, use } from "react";

import { DataContext } from "@/components/data-context";
import { NonFinancialCompanyCoefficient } from "@/components/coefficients/non-financial-company-coefficient";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { NBSP } from "@/constants/symbols";
import { IStock } from "@/types/stock";
import { getPE, getPB, getPS, getPFCF, getCurrentRatio, getROE, getCombinedRatio } from "@/utils/calculations";
import { formatNumber } from "@/utils/formatters";
import { TooltipCoefficient } from "./tooltip-coefficient";

interface ICoefficientsProps {
  stock: IStock;
}

export const Coefficients: React.FC<ICoefficientsProps> = memo(({ stock }) => {
  const { marketData, currencyRate } = use(DataContext);

  const params = {
    stock,
    marketData,
    currencyRate,
  };

  const PE = getPE(params);
  const PB = getPB(params);
  const PS = getPS(params);
  const PFCF = getPFCF(params);
  const ROE = getROE(stock);
  const CR = getCurrentRatio(stock);
  const combinedRatio = getCombinedRatio(stock);

  return (
    <div className="flex flex-col gap-4">
      <Table className="table-fixed w-[296px]">
        <TableCaption className="caption-top text-left font-bold text-xl text-black my-2">Коэффициенты</TableCaption>
        <TableBody>
          <TableRow>
            <TableCell className="font-bold" title="Отношение цены к прибыли">P/E</TableCell>
            <TableCell className="text-right">{PE ? formatNumber(PE) : 'Н/Д'}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-bold" title="Отношение цены к балансовой стоимости, также известен как P/BV">P/B</TableCell>
            <TableCell className="text-right">{PB ? formatNumber(PB) : 'Н/Д'}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-bold" title="Отношение цены к выручке">P/S</TableCell>
            <TableCell className="text-right">
              <NonFinancialCompanyCoefficient value={PS} stock={stock} />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-bold" title="Отношение цены к свободному денежному потоку">P/FCF</TableCell>
            <TableCell className="text-right">
              <NonFinancialCompanyCoefficient value={PFCF} stock={stock} />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-bold" title="Рентабельность собственного капитала">ROE, %</TableCell>
            <TableCell className="text-right">
              <TooltipCoefficient
                text={`${formatNumber(ROE * 100)}`}
                tooltipAriaLabel="Что это?"
                tooltipContent="Рентабельность собственного капитала, относящегося к акционерам"
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-bold" title="Коэффициент текущей ликвидности">CR</TableCell>
            <TableCell className="text-right">
              <NonFinancialCompanyCoefficient
                value={CR}
                stock={stock}
                description="Коэффициент текущей ликвидности, также известный как Current Ratio или КТЛ"
              />
            </TableCell>
          </TableRow>
          {combinedRatio && (
            <TableRow>
              <TableCell className="font-bold" title="Комбинированный коэффициент убыточности">Combined Ratio, %</TableCell>
              <TableCell className="text-right">
                <TooltipCoefficient
                  text={`${formatNumber(combinedRatio * 100)}`}
                  tooltipAriaLabel="Что это?"
                  tooltipContent="Комбинированный (сводный) коэффициент убыточности для оценки эффективности страховой деятельности"
                />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="text-xs text-gray-500 w-[296px]">
        Используются данные из годовой отчетности и{NBSP}текущая капитализация.
        {stock.company.currency && ' Курс к рублю рассчитывается на текущую дату.'}
      </div>
    </div>
  );
});

Coefficients.displayName = "Coefficients";
