import { memo } from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableHeader,
} from "@/components/ui/table"
import { TCompany } from "@/types/company";
import { getFCF } from "@/utils/calculations/cash-flow";
import { isFinancialCompany } from "@/utils/is-financial-company";
import { DataRow, HeadRow } from "./row";

interface IIncomeByYearTableProps {
  company: TCompany;
}

export const IncomeByYearTable: React.FC<IIncomeByYearTableProps> = memo(({ company }) => {
  const {
    unitsText,
    type,
    years,
  } = company;

  const isCashFlowSectionVisible =
    'operatingCashFlow' in company ||
    'investingCashFlow' in company ||
    'financingCashFlow' in company ||
    'netChangeInCash' in company;

  return (
    <>
      <Table className="table-fixed">
        <TableCaption className="caption-top text-left font-bold text-xl text-black my-2">Финансовая отчетность по МСФО ({unitsText})</TableCaption>
        <TableHeader>
          <HeadRow values={years} />
        </TableHeader>

        <TableBody asGroup>
          {'revenues' in company && company.revenues && (
            <DataRow title="Выручка" values={company.revenues} />
          )}
          {'grossMargins' in company && company.grossMargins && (
            <DataRow title="Валовая прибыль" values={company.grossMargins} />
          )}
          {type === 'exchange' && (
            <DataRow title="Комиссионные доходы" values={company.commissionIncomes} />
          )}
          {type === 'bank' && (
            <DataRow title="Чистые процентные доходы" values={company.netInterestIncomes} />
          )}
          {type === 'insurance' && (
            <>
              <DataRow title="Чистая заработанная премия" values={company.netEarnedPremiums} />
              <DataRow title="Чистая сумма произошедших убытков" values={company.netIncurredLosses} />
              <DataRow title="Результат от страховых операций" values={company.insuranceServiceResult} />
              <DataRow title="Прочие операционные доходы" values={company.otherOperatingIncomes} />
              <DataRow title="Прибыль до налогообложения" values={company.profitBeforeTax} />
            </>
          )}
          {'operatingIncomes' in company && company.operatingIncomes && (
            <DataRow title="Операционная прибыль" values={company.operatingIncomes} />
          )}
          <DataRow title="Чистая прибыль" values={company.netIncomes} />
          {company.shareholdersNetIncomes && (
            <DataRow title="Прибыль, относящаяся к акционерам" values={company.shareholdersNetIncomes} />
          )}
        </TableBody>

        <TableBody asGroup>
          {company.totalAssets && (
            <DataRow title="Активы" values={company.totalAssets} />
          )}
          {'currentLiabilities' in company && company.currentLiabilities && (
            <DataRow title="Текущие обязательства" values={company.currentLiabilities} />
          )}
          <DataRow title="Собственный капитал" values={company.totalEquity} />
          {company.shareholdersEquity && (
            <DataRow title="Капитал, относящийся к акционерам" values={company.shareholdersEquity} />
          )}
        </TableBody>

        {isCashFlowSectionVisible && (
          <TableBody asGroup>
            {company.operatingCashFlow && (
              <DataRow title="Операционный денежный поток" values={company.operatingCashFlow} />
            )}
            {company.investingCashFlow && (
              <DataRow title="Инвестиционный денежный поток" values={company.investingCashFlow} />
            )}
            {company.financingCashFlow && (
              <DataRow title="Финансовый денежный поток" values={company.financingCashFlow} />
            )}
            {company.netChangeInCash && !isFinancialCompany(company) && (
              <DataRow title="Свободный денежный поток" values={years.map((_, index) => getFCF(company, index))} />
            )}
            {company.netChangeInCash && (
              <DataRow title="Изменение денежных потоков" values={company.netChangeInCash} />
            )}
          </TableBody>
        )}
      </Table>
      {company.financialStatementsNote && (
        <div className="mt-4 text-xs text-gray-500 ">
          {company.financialStatementsNote}
        </div>
      )}
    </>
  )
});

IncomeByYearTable.displayName = 'IncomeByYearTable';
