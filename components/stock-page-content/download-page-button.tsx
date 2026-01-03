import { useCallback } from 'react';
import { useRouter } from 'next/navigation'

import { Button } from "@/components/ui/button";
import { IStock } from '@/types/stock';
import { getUrlNameByStock } from '@/utils/transliteration';
import { ALL_STOCKS } from '@/lib/data';

interface IDownloadPageButtonProps {
  stock: IStock;
};

export const DownloadPageButton: React.FC<IDownloadPageButtonProps> = ({ stock }) => {
  const router = useRouter()

  const goToDownloadPage = useCallback((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();

    const firstCompanyTicker = stock.company.tickers[0];
    const mainStock = ALL_STOCKS.find(item => item.firstCompanyTicker === firstCompanyTicker) as IStock;

    const url = getUrlNameByStock(mainStock);
    router.push(`/${url}/download/`);
  }, [stock]);

  return <Button className="mt-4" size="sm" onClick={goToDownloadPage}>Скачать отчётность</Button>;
};
