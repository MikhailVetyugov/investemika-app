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

interface IIncomeByYearTableProps {
  company: TCompany;
}

export const IncomeByYearTable: React.FC<IIncomeByYearTableProps> = ({ company }) => {
  const {
    units,
    type,
    years,
  } = company;

  return (
    <Table className="table-fixed">
      <TableCaption className="caption-top font-bold text-xl text-black mb-2">Финансовая отчетность ({units})</TableCaption>
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
              <TableCell key={index} className="text-right  w-[120px]">{formatNumber(item)}</TableCell>
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
          <TableCell className="w-[180px] font-bold">Акционерный капитал</TableCell>
          {company.shareCapital.map((item, index) =>
            <TableCell key={index} className="text-right  w-[120px]">{formatNumber(item)}</TableCell>
          )}
        </TableRow>
      </TableBody>

      {type === 'industrial' && (
        <TableBody>
          <TableRow>
            <TableCell className="w-[180px] font-bold">Изменение денежного потока</TableCell>
            {company.cashFlowChange.map((item, index) =>
              <TableCell key={index} className="text-right  w-[120px]">{formatNumber(item)}</TableCell>
            )}
          </TableRow>
        </TableBody>
      )}
    </Table>
  )
}
