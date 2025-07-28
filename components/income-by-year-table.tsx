import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatNumber } from "@/utils/formatNumber";

const years = [2024, 2023, 2021, 2020];
const revenues: number[] = [8621561, 7928303, 9435143, 5639401];
const operatingIncomes: number[] = [1191817, 1427697, 978945, 281654];
const netIncomes: number[] = [851546, 1160271, 775513, 16633];
const shareCapital: number[] = [6892008, 6401233, 6864749, 5991579];
const cachFlowChange: number[] = [246591, 299475, 333650, -172200];
 
export const IncomeByYearTable: React.FC = () => {
  return (
    <Table className="table-fixed">
      <TableCaption className="caption-top">Лукойл (в млн. рублей)</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[180px] font-bold" />
          {years.map(year => <TableHead key={year} className="text-right w-[120px]">{year}</TableHead>)}
        </TableRow>
      </TableHeader>

      <TableBody>
        <TableRow>
          <TableCell className="w-[180px] font-bold">Выручка</TableCell>
          {revenues.map((item, index) => <TableCell key={index} className="text-right  w-[120px]">{formatNumber(item)}</TableCell>)}
        </TableRow>
        <TableRow>
          <TableCell className="w-[180px] font-bold">Операционная прибыль</TableCell>
          {operatingIncomes.map((item, index) => <TableCell key={index} className="text-right w-[120px]">{formatNumber(item)}</TableCell>)}
        </TableRow>
        <TableRow>
          <TableCell className="w-[180px] font-bold">Чистая прибыль</TableCell>
          {netIncomes.map((item, index) => <TableCell key={index} className="text-right w-[120px]">{formatNumber(item)}</TableCell>)}
        </TableRow>
      </TableBody>

      <TableBody>
        <TableRow>
          <TableCell className="w-[180px] font-bold">Акционерный капитал</TableCell>
          {shareCapital.map((item, index) => <TableCell key={index} className="text-right  w-[120px]">{formatNumber(item)}</TableCell>)}
        </TableRow>
      </TableBody>

      <TableBody>
        <TableRow>
          <TableCell className="w-[180px] font-bold">Изменение денежного потока</TableCell>
          {cachFlowChange.map((item, index) => <TableCell key={index} className="text-right  w-[120px]">{formatNumber(item)}</TableCell>)}
        </TableRow>
      </TableBody>
    </Table>
  )
}
