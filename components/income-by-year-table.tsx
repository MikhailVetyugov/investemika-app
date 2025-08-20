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

export const IncomeByYearTable: React.FC<IIncomeByYearTableProps> = memo(({ company }) => {
  const {
    unitsText,
    type,
    years,
  } = company;

  return (
    <Table className="table-fixed">
      <TableCaption className="caption-top text-left font-bold text-xl text-black my-2">Финансовая отчетность ({unitsText})</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[180px] font-bold" />
          {years.map(year => <TableHead key={year} className="text-right w-[120px]">{year}</TableHead>)}
        </TableRow>
      </TableHeader>

      <TableBody>
        {type === 'industrial' && (
          <TableRow>
            <TableCell className="w-[180px] font-bold">Выручка</TableCell>
            {company.revenues.map((item, index) =>
              <TableCell key={index} className="text-right w-[120px]">{formatNumber(item)}</TableCell>
            )}
          </TableRow>
        )}
        {type === 'bank' && (
          <TableRow>
            <TableCell className="w-[180px] font-bold">Чистые процентные доходы</TableCell>
            {company.netInterestIncomes.map((item, index) =>
              <TableCell key={index} className="text-right  w-[120px]">{formatNumber(item)}</TableCell>
            )}
          </TableRow>
        )}
        <TableRow>
          <TableCell className="w-[180px] font-bold">Операционная прибыль</TableCell>
          {company.operatingIncomes.map((item, index) =>
            <TableCell key={index} className="text-right w-[120px]">{formatNumber(item)}</TableCell>
          )}
        </TableRow>
        <TableRow>
          <TableCell className="w-[180px] font-bold">Чистая прибыль</TableCell>
          {company.netIncomes.map((item, index) =>
            <TableCell key={index} className="text-right w-[120px]">{formatNumber(item)}</TableCell>
          )}
        </TableRow>
      </TableBody>

      <TableBody>
        <TableRow>
          <TableCell className="w-[180px] font-bold">Собственный капитал</TableCell>
          {company.shareCapital.map((item, index) =>
            <TableCell key={index} className="text-right  w-[120px]">{formatNumber(item)}</TableCell>
          )}
        </TableRow>
      </TableBody>

      {type === 'industrial' && (
        <TableBody>
          <TableRow>
            <TableCell className="w-[180px] font-bold">Операционный денежный поток</TableCell>
            {company.operatingCashFlow.map((item, index) =>
              <TableCell key={index} className="text-right  w-[120px]">{formatNumber(item)}</TableCell>
            )}
          </TableRow>
          <TableRow>
            <TableCell className="w-[180px] font-bold">Свободный денежный поток</TableCell>
            {years.map((_item, index) => {
              const FCF = getFCF(company, index);

              return <TableCell key={index} className="text-right  w-[120px]">{FCF ? formatNumber(FCF) : 'Н/Д'}</TableCell>;
            })}
          </TableRow>
          <TableRow>
            <TableCell className="w-[180px] font-bold">Изменение денежных потоков</TableCell>
            {company.cashFlowChange.map((item, index) =>
              <TableCell key={index} className="text-right  w-[120px]">{formatNumber(item)}</TableCell>
            )}
          </TableRow>
        </TableBody>
      )}
    </Table>
  )
});

IncomeByYearTable.displayName = 'IncomeByYearTable';
