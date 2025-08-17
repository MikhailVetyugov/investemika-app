import { memo, use } from "react";

import { DataContext } from "@/components/data-context";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableRow,
} from "@/components/ui/table"
import { IStock } from "@/types/stock";
import { getPE } from "@/utils/coefficients";
import { getPB, getPS } from "@/utils/coefficients";
import { formatNumber } from "@/utils/format-number";

interface ICoefficientsProps {
  stock: IStock;
}

// TODO: Норникель (доллары). Роснефть (P/E). Транснефть. Северсталь (P/E)
export const Coefficients: React.FC<ICoefficientsProps> = memo(({ stock }) => {
  const { marketData } = use(DataContext);

  const PE = getPE(stock, marketData);
  const PB = getPB(stock, marketData);
  const PS = getPS(stock, marketData);

  return (
    <Table className="table-fixed w-[296px]">
      <TableCaption className="caption-top text-left font-bold text-xl text-black my-2">Коэффициенты</TableCaption>
      <TableBody>
        <TableRow>
          <TableCell className="font-bold">P/E</TableCell>
          <TableCell className="text-right">{PE ? formatNumber(PE) : 'Н/Д'}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-bold">P/B</TableCell>
          <TableCell className="text-right">{PB ? formatNumber(PB) :'Н/Д'}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-bold">P/S</TableCell>
          <TableCell className="text-right">{PS ? formatNumber(PS) : 'Н/Д'}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
});

Coefficients.displayName = "Coefficients";
