import { IStock } from "@/types/stock";

interface ICoefficientsProps {
  stock: IStock;
}

export const Coefficients: React.FC<ICoefficientsProps> = ({ stock }) => {
  return <div>Коэффициенты</div>
};
