import { useCallback, useEffect, useState } from "react";

import { fetchPrice } from "@/services/fetchPrice";
import { TCompany } from "@/types/company";

interface IPriceProps {
  company: TCompany;
}

const POLLING_INTERVAL = 20_000;

export const Price: React.FC<IPriceProps> = ({ company }) => {
  const [price, setPrice] = useState<number | null>(null);

  const updatePrice = useCallback(async (ticker: string) => {
    const price = await fetchPrice(ticker);

    setPrice(price);
  }, []);

  useEffect(() => {
    updatePrice(company.ticker);

    const intervalId = setInterval(() => updatePrice(company.ticker), POLLING_INTERVAL);

    return () => {
      clearInterval(intervalId);
    };
  }, [company, updatePrice]); 

  return <div className="mt-6 p-2 font-bold">Цена акции: {price ?? 'N/A'}</div>;
};
