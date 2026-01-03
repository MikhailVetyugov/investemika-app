import { formatNumber } from "@/utils/formatters";
import { NO_DATA_TEXT } from "./texts";

interface ICommonCoefficientProps {
  value: number | null | undefined;
  multiplier?: number;
}

export const CommonCoefficient: React.FC<ICommonCoefficientProps> = ({ value, multiplier = 1 }) => {
  return value ? formatNumber(value * multiplier) : NO_DATA_TEXT;
};
