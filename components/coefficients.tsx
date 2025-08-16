import { TCompany } from "@/types/company";

interface ICoefficientsProps {
  company: TCompany;
}

export const Coefficients: React.FC<ICoefficientsProps> = ({ company }) => {
  return <div>Коэффициенты</div>
};
