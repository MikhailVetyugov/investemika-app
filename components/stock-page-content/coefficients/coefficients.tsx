import { memo, use } from "react";

import { DataContext } from "@/components/data-context";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { NBSP } from "@/constants/symbols";
import { IStock } from "@/types/stock";
import { getPE, getPB, getPS, getPFCF, getCurrentRatio, getROE, getCombinedRatio, getROA } from "@/utils/calculations";
import { formatNumber } from "@/utils/formatters";
import { TooltipCoefficient } from "./tooltip-coefficient";
import { NO_DATA_TEXT } from "./texts";
import { CommonCoefficient } from "./common-coefficient";
import { NonFinancialCompanyCoefficient } from "./non-financial-company-coefficient";

interface ICoefficientsProps {
  stock: IStock;
}

const TABLE_WIDTH_CLASS_NAME = 'w-[296px] md:w-[380px]'

export const Coefficients: React.FC<ICoefficientsProps> = memo(({ stock }) => {
  const { marketData, currencyRate, averageCoefficients } = use(DataContext);

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
  const ROA = getROA(stock);
  const CR = getCurrentRatio(stock);
  const combinedRatio = getCombinedRatio(stock);

  const {
    averagePE,
    averagePB,
    averagePS,
    averagePFCF,
    averageROE,
    averageROA,
    averageCR,
  } = averageCoefficients ?? {};

  return (
    <div className="flex flex-col gap-4">
      <Table className={`table-fixed ${TABLE_WIDTH_CLASS_NAME}`}>
        <TableCaption className="caption-top text-left font-bold text-xl text-black my-2">Коэффициенты</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="font-bold" />
            <TableHead className="font-bold text-right">Компания</TableHead>
            <TableHead className="font-bold text-right pr-0">
              <TooltipCoefficient
                text="Отрасль"
                tooltipAriaLabel="Что это?"
                tooltipContent="Среднеотраслевое значение среди компаний, представленных на сайте"
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-bold" title="Отношение цены к прибыли">P/E</TableCell>
            <TableCell className="text-right">
              <CommonCoefficient value={PE} />
            </TableCell>
            <TableCell className="text-right">
              <CommonCoefficient value={averagePE} />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-bold" title="Отношение цены к балансовой стоимости, также известен как P/BV">P/B</TableCell>
            <TableCell className="text-right">
              <CommonCoefficient value={PB} />
            </TableCell>
            <TableCell className="text-right">
              <CommonCoefficient value={averagePB} />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-bold" title="Отношение цены к выручке">P/S</TableCell>
            <TableCell className="text-right">
              <NonFinancialCompanyCoefficient value={PS} stock={stock} />
            </TableCell>
            <TableCell className="text-right">
              <NonFinancialCompanyCoefficient value={averagePS} stock={stock} withTooltip={false} />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-bold" title="Отношение цены к свободному денежному потоку">P/FCF</TableCell>
            <TableCell className="text-right">
              <NonFinancialCompanyCoefficient value={PFCF} stock={stock} />
            </TableCell>
            <TableCell className="text-right">
              <NonFinancialCompanyCoefficient value={averagePFCF} stock={stock} withTooltip={false} />
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
            <TableCell className="text-right">
              <CommonCoefficient value={averageROE} multiplier={100} />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-bold" title="Рентабельность активов">ROA, %</TableCell>
            <TableCell className="text-right">
              <TooltipCoefficient
                text={`${formatNumber(ROA * 100)}`}
                tooltipAriaLabel="Что это?"
                tooltipContent="Рентабельность активов, рассчитываемая на базе прибыли, относящейся к акционерам"
              />
            </TableCell>
            <TableCell className="text-right">
              <CommonCoefficient value={averageROA} multiplier={100} />
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
            <TableCell className="text-right">
              <NonFinancialCompanyCoefficient
                value={averageCR}
                stock={stock}
                description="Коэффициент текущей ликвидности, также известный как Current Ratio или КТЛ"
                withTooltip={false}
              />
            </TableCell>
          </TableRow>
          {combinedRatio && (
            <TableRow>
              <TableCell className="font-bold whitespace-normal md:whitespace-nowrap" title="Комбинированный коэффициент убыточности">Combined Ratio, %</TableCell>
              <TableCell className="text-right">
                <TooltipCoefficient
                  text={`${formatNumber(combinedRatio * 100)}`}
                  tooltipAriaLabel="Что это?"
                  tooltipContent="Комбинированный (сводный) коэффициент убыточности для оценки эффективности страховой деятельности"
                />
              </TableCell>
              <TableCell className="text-right">{NO_DATA_TEXT}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className={`text-xs text-gray-500 ${TABLE_WIDTH_CLASS_NAME}`}>
        Используются данные из консолидированной отчетности и{NBSP}текущая капитализация.
        {stock.company.currency && ' Курс к рублю рассчитывается на текущую дату.'}
      </div>
    </div>
  );
});

Coefficients.displayName = "Coefficients";
