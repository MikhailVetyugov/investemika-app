'use client'
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import translitRusEng from "translit-rus-eng";

import { CompanySearch } from "@/components/company-search";
import { IncomeByYearTable } from "@/components/income-by-year-table";
import { Price } from "@/components/price";
import { TCompany } from "@/types/company";
import { getCompanyByUrlName } from "@/utils/get-company-by-url-name";
import * as logoImage from '@/public/logo.png'

interface ICompanyPageProps {
  initialCompany: TCompany;
}

export const CompanyPage: React.FC<ICompanyPageProps> = ({ initialCompany }) => {
  const [company, setCompany] = useState<TCompany>(initialCompany);

  const handleSelect = (company: TCompany) => {
    setCompany(company);
    // Не используем useRouter, чтобы это не привело к размонтированию страницы.
    window.history.pushState(null, "", `/${translitRusEng(company.name, { target: 'eng', slugify: true })}`);
  };

  const handlePopState = useCallback(() => {
    const urlName = window.location.pathname.slice(1);
    setCompany(getCompanyByUrlName(urlName));
  }, []);

  useEffect(() => {
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return (
    <div className="flex-[1_0_auto] flex flex-col overflow-hidden">
      <header className="h-auto p-4 flex flex-col items-center gap-2 bg-[#00446a] xl:h-[80px] xl:flex-row xl:p-0 xl:pr-8">
        <div className="flex-none">
          <Image src={logoImage} alt="Инвестемика" height={80} className="h-[80px] w-auto" />
        </div>
        <div className="w-full flex justify-center xl:w-auto">
          <CompanySearch onSelect={handleSelect} />
        </div>
        <div className="text-white text-center xl:ml-auto xl:text-left">Сайт продолжает пополняться и дорабатываться</div>
      </header>
      <main className="max-w-[min(100%,1368px)] mx-auto my-8 px-8">
        <section>
          <h1 className="mb-2 font-bold text-3xl">{company.name} ({company.ticker})</h1>
          <Price key={company.id} company={company} />
        </section>
        <section>
          <IncomeByYearTable company={company} />
        </section>
      </main>
      <footer className="mt-auto px-4 flex items-center justify-center bg-[#00446a] text-white xl:h-[40px] xl:justify-start">
        © {new Date().getFullYear()}. Investemika.ru
      </footer>
    </div>
  );
}
