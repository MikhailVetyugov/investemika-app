import { use, useCallback, useEffect, useRef, useState } from "react";

import { DataContext } from "@/components/data-context";
import { IStock } from "@/types/stock";
import { fetchSingleIssueData } from "@/services/fetch-single-issue-stock-data";
import { formatNumber } from "@/utils/format-number";

interface IPriceProps {
  stock: IStock;
}

const POLLING_INTERVAL = 15_000;
const ANIMATION_DURATION = 1_000;

export const Price: React.FC<IPriceProps> = ({ stock }) => {
  const { marketData, updateMarketData } = use(DataContext);
  const [priceChange, setPriceChange] = useState<'up' | 'down' | null>(null);

  const priceRef = useRef(marketData.price);

  useEffect(() => {
    priceRef.current = marketData.price;
  }, [marketData.price]);

  const updatePrice = useCallback(async (stock: IStock) => {
    const prevPrice = priceRef.current;
    const { price: newPrice } = await fetchSingleIssueData(stock);

    if (prevPrice && newPrice && prevPrice !== newPrice) {
      const changeType = newPrice > prevPrice ? 'up' : 'down';
      setPriceChange(changeType);
      setTimeout(() => setPriceChange(null), ANIMATION_DURATION);
    }

    updateMarketData({ price: newPrice });
  }, [updateMarketData]);

  useEffect(() => {
    setPriceChange(null);

    const intervalId = setInterval(updatePrice, POLLING_INTERVAL, stock);

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
  const priceText = marketData.price ? formatNumber(marketData.price) :'Н/Д';

  return (
    <div className="font-bold text-xl">
      Цена акции: <span className={animationClassName}>{priceText}</span>
    </div>
  );
};
