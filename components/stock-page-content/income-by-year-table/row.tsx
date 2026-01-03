import { TableCell, TableHead, TableRow } from "@/components/ui/table";
import { formatNumber } from "@/utils/formatters";

interface IRowProps {
  title: string;
  values: (number | null)[];
};

const HEAD_CELL_CLASS_NAME = 'w-[290px] max-w-[290px] font-bold';
const DATA_CELL_CLASS_NAME = 'w-[120px] md:w-[145px] xl:w-[180px] text-right';

export const DataRow: React.FC<IRowProps> = ({ title, values }) => (
  <TableRow>
    <TableCell className={HEAD_CELL_CLASS_NAME}>{title}</TableCell>
    {
      values.map((item, index) =>
        <TableCell key={index} className={DATA_CELL_CLASS_NAME} > {item ? formatNumber(item) : 'Н/Д'} </TableCell>
      )
    }
  </TableRow>
);

export const HeadRow: React.FC<Omit<IRowProps, 'title'>> = ({ values }) => (
  <TableRow>
    <TableHead className={HEAD_CELL_CLASS_NAME} />
    {values.map((item, index) => <TableHead key={index} className={DATA_CELL_CLASS_NAME}>{item}</TableHead>)}
  </TableRow>
);
