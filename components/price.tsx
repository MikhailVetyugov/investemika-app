import { useCallback, useEffect, useState } from "react";

import { fetchPrice } from "@/services/fetch-price";
import { IStock } from "@/types/stock";

interface IPriceProps {
  stock: IStock;
}

const POLLING_INTERVAL = 15_000;
const ANIMATION_DURATION = 1_000;

export const Price: React.FC<IPriceProps> = ({ stock }) => {
  const [price, setPrice] = useState<number | null>(null);
  const [priceChange, setPriceChange] = useState<'up' | 'down' | null>(null);

  const updatePrice = useCallback(async (ticker: string) => {
    const newPrice = await fetchPrice(ticker);
    
    setPrice(prevPrice => {
      if (prevPrice && newPrice && prevPrice !== newPrice) {
        const changeType = newPrice > prevPrice ? 'up' : 'down';
        setPriceChange(changeType);
        setTimeout(() => setPriceChange(null), ANIMATION_DURATION);
      }

      return newPrice;
    });
  }, []);

  useEffect(() => {
    updatePrice(stock.ticker);

    const intervalId = setInterval(() => updatePrice(stock.ticker), POLLING_INTERVAL);

    return () => {
      clearInterval(intervalId);
    };
  }, [stock, updatePrice]); 

  const getBackgroundColor = () => {
    if (priceChange === 'up') return 'bg-green-100';
    if (priceChange === 'down') return 'bg-red-100';
    return 'bg-transparent';
  };

  const animationClassName = `transition-colors duration-${ANIMATION_DURATION} ${getBackgroundColor()}`;

  return (
    <div className="font-bold text-xl">
      Цена акции: <span className={animationClassName}>{price ?? 'N/A'}</span>
    </div>
  );
};
