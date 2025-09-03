import { memo } from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { TCompany } from "@/types/company";
import { formatNumber } from "@/utils/format-number";
import { getFCF } from "@/utils/calculations/cash-flow";

interface IIncomeByYearTableProps {
  company: TCompany;
}

const HEAD_CELL_CLASS_NAME = 'w-[290px] max-w-[290px] font-bold';
const DATA_CELL_CLASS_NAME = 'w-[120px] md:w-[145px] xl:w-[180px] text-right';

export const IncomeByYearTable: React.FC<IIncomeByYearTableProps> = memo(({ company }) => {
  const {
    unitsText,
    type,
    years,
  } = company;

  const isTypeRegularOrExchange = type === 'regular' || type === 'exchange';

  return (
    <>
      <Table className="table-fixed">
        <TableCaption className="caption-top text-left font-bold text-xl text-black my-2">Финансовая отчетность по МСФО ({unitsText})</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className={HEAD_CELL_CLASS_NAME} />
            {years.map(year => <TableHead key={year} className={DATA_CELL_CLASS_NAME}>{year}</TableHead>)}
          </TableRow>
        </TableHeader>

        <TableBody asGroup>
          {isTypeRegularOrExchange && (
            <TableRow>
              <TableCell className={HEAD_CELL_CLASS_NAME}>Выручка</TableCell>
              {company.revenues.map((item, index) =>
                <TableCell key={index} className={DATA_CELL_CLASS_NAME}>{formatNumber(item)}</TableCell>
              )}
            </TableRow>
          )}
          {company.type === 'regular' && company.grossMargins && (
            <TableRow>
              <TableCell className={HEAD_CELL_CLASS_NAME}>Валовая прибыль</TableCell>
              {company.grossMargins.map((item, index) =>
                <TableCell key={index} className={DATA_CELL_CLASS_NAME}>{formatNumber(item)}</TableCell>
              )}
            </TableRow>
          )}
          {type === 'exchange' && (
            <TableRow>
              <TableCell className={HEAD_CELL_CLASS_NAME}>Комиссионные доходы</TableCell>
              {company.commissionIncomes.map((item, index) =>
                <TableCell key={index} className={DATA_CELL_CLASS_NAME}>{formatNumber(item)}</TableCell>
              )}
            </TableRow>
          )}
          {type === 'bank' && (
            <TableRow>
              <TableCell className={HEAD_CELL_CLASS_NAME}>Чистые процентные доходы</TableCell>
              {company.netInterestIncomes.map((item, index) =>
                <TableCell key={index} className={DATA_CELL_CLASS_NAME}>{formatNumber(item)}</TableCell>
              )}
            </TableRow>
          )}
          {company.operatingIncomes && (
            <TableRow>
              <TableCell className={HEAD_CELL_CLASS_NAME}>Операционная прибыль</TableCell>
              {company.operatingIncomes.map((item, index) =>
                <TableCell key={index} className={DATA_CELL_CLASS_NAME}>{formatNumber(item)}</TableCell>
              )}
            </TableRow>
          )}
          <TableRow>
            <TableCell className={HEAD_CELL_CLASS_NAME}>Чистая прибыль</TableCell>
            {company.netIncomes.map((item, index) =>
              <TableCell key={index} className={DATA_CELL_CLASS_NAME}>{formatNumber(item)}</TableCell>
            )}
          </TableRow>
          {company.shareholdersNetIncomes && (
            <TableRow>
              <TableCell className={HEAD_CELL_CLASS_NAME}>Прибыль, относящаяся к акционерам</TableCell>
              {company.shareholdersNetIncomes.map((item, index) =>
                <TableCell key={index} className={DATA_CELL_CLASS_NAME}>{formatNumber(item)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>

        <TableBody asGroup>
          {company.totalAssets && (
            <TableRow>
              <TableCell className={HEAD_CELL_CLASS_NAME}>Активы</TableCell>
              {company.totalAssets.map((item, index) =>
                <TableCell key={index} className={DATA_CELL_CLASS_NAME}>{formatNumber(item)}</TableCell>
              )}
            </TableRow>
          )}
          {company.type === 'regular' && company.currentLiabilities && (
            <TableRow>
              <TableCell className={HEAD_CELL_CLASS_NAME}>Текущие обязательства</TableCell>
              {company.currentLiabilities.map((item, index) =>
                <TableCell key={index} className={DATA_CELL_CLASS_NAME}>{formatNumber(item)}</TableCell>
              )}
            </TableRow>
          )}
          <TableRow>
            <TableCell className={HEAD_CELL_CLASS_NAME}>Собственный капитал</TableCell>
            {company.totalEquity.map((item, index) =>
              <TableCell key={index} className={DATA_CELL_CLASS_NAME}>{formatNumber(item)}</TableCell>
            )}
          </TableRow>
          {company.shareholdersEquity && (
            <TableRow>
              <TableCell className={HEAD_CELL_CLASS_NAME}>Капитал, относящийся к акционерам</TableCell>
              {company.shareholdersEquity.map((item, index) =>
                <TableCell key={index} className={DATA_CELL_CLASS_NAME}>{formatNumber(item)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>

        {isTypeRegularOrExchange && (
          <TableBody asGroup>
            <TableRow>
              <TableCell className={HEAD_CELL_CLASS_NAME}>Операционный денежный поток</TableCell>
              {company.operatingCashFlow.map((item, index) =>
                <TableCell key={index} className={DATA_CELL_CLASS_NAME}>{formatNumber(item)}</TableCell>
              )}
            </TableRow>
            {company.investingCashFlow && (
              <TableRow>
                <TableCell className={HEAD_CELL_CLASS_NAME}>Инвестиционный денежный поток</TableCell>
                {company.investingCashFlow.map((item, index) =>
                  <TableCell key={index} className={DATA_CELL_CLASS_NAME}>{formatNumber(item)}</TableCell>
                )}
              </TableRow>
            )}
            {company.financingCashFlow && (
              <TableRow>
                <TableCell className={HEAD_CELL_CLASS_NAME}>Финансовый денежный поток</TableCell>
                {company.financingCashFlow.map((item, index) =>
                  <TableCell key={index} className={DATA_CELL_CLASS_NAME}>{formatNumber(item)}</TableCell>
                )}
              </TableRow>
            )}
            <TableRow>
              <TableCell className={HEAD_CELL_CLASS_NAME}>Свободный денежный поток</TableCell>
              {years.map((_item, index) => {
                const FCF = getFCF(company, index);

                return <TableCell key={index} className={DATA_CELL_CLASS_NAME}>{FCF ? formatNumber(FCF) : 'Н/Д'}</TableCell>;
              })}
            </TableRow>
            <TableRow>
              <TableCell className={HEAD_CELL_CLASS_NAME}>Изменение денежных потоков</TableCell>
              {company.netChangeInCash.map((item, index) =>
                <TableCell key={index} className={DATA_CELL_CLASS_NAME}>{formatNumber(item)}</TableCell>
              )}
            </TableRow>
          </TableBody>
        )}
      </Table>
      {company.financialStatementsNote && (
        <div className="mt-4 text-xs text-gray-500 ">
          {company.financialStatementsNote}
        </div>
      )}
    </>
  )
});

IncomeByYearTable.displayName = 'IncomeByYearTable';
