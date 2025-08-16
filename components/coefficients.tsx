import { memo } from "react";

import { IStock } from "@/types/stock";

interface ICoefficientsProps {
  stock: IStock;
}

export const Coefficients: React.FC<ICoefficientsProps> = memo(({ stock }) => {
  return <div>Коэффициенты</div>
});

Coefficients.displayName = "Coefficients";
