'use client';
import { useEffect, useMemo, useState } from "react";
import { AlertCircle, ArrowDown, ArrowUp, SlidersHorizontal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SCROLLBAR_CLASSES } from "@/constants/classes";
import { INDUSTRY_NAMES } from "@/constants/industries";
import { EMPTY_SCREENER_FILTERS, SCREENER_METRICS } from "@/constants/screener-metrics";
import { NBSP } from "@/constants/symbols";
import { TIndustry } from "@/types/industry";
import { IScreenerFilters, IScreenerRow, IScreenerSort, TScreenerSortKey } from "@/types/screener";
import { countActiveFilters, filterScreenerRows, getRangeBounds, sortScreenerRows } from "@/utils/screener/filter-rows";
import { serializeScreenerQuery } from "@/utils/screener/filters-query";
import { getMetricLabel, pluralizeCompanies } from "@/utils/screener/format";
import { ActiveFilters } from "./active-filters";
import { FiltersPanel } from "./filters-panel";
import { ResultsCards } from "./results-cards";
import { ResultsTable } from "./results-table";

interface IScreenerContentProps {
  rows: IScreenerRow[];
  /** false — курс доллара получить не удалось, абсолютные показатели компаний с отчётностью в $ недоступны. */
  isUsdRateAvailable: boolean;
  /** Фильтры и сортировка, разобранные на сервере из query-строки, чтобы первый HTML уже был отфильтрован. */
  initialFilters: IScreenerFilters;
  initialSort: IScreenerSort;
}

export const ScreenerContent: React.FC<IScreenerContentProps> = ({
  rows,
  isUsdRateAvailable,
  initialFilters,
  initialSort,
}) => {
  const [filters, setFilters] = useState<IScreenerFilters>(initialFilters);
  const [sort, setSort] = useState<IScreenerSort>(initialSort);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Фильтры и сортировка хранятся в URL, чтобы подборкой можно было поделиться.
  // Читаются они на сервере (app/screener/page.tsx), здесь URL только обновляется.
  // При первом запуске это заодно убирает из адреса неизвестные и некорректные параметры.
  useEffect(() => {
    const query = serializeScreenerQuery(filters, sort);
    const search = query ? `?${query}` : '';

    if (window.location.search !== search) {
      window.history.replaceState(null, '', `${window.location.pathname}${search}`);
    }
  }, [filters, sort]);

  const industries = useMemo(() => {
    return [...new Set(rows.map(row => row.industry))]
      .sort((a: TIndustry, b: TIndustry) => INDUSTRY_NAMES[a].localeCompare(INDUSTRY_NAMES[b], 'ru'));
  }, [rows]);

  const visibleRows = useMemo(() => {
    return sortScreenerRows(filterScreenerRows(rows, filters), sort);
  }, [rows, filters, sort]);

  // Колонка показателя, по которому идёт отбор или сортировка, видна всегда.
  const visibleMetrics = useMemo(() => {
    return SCREENER_METRICS.filter(metric => (
      metric.defaultVisible
      || sort.key === metric.id
      || getRangeBounds(filters.ranges[metric.id]).isActive
    ));
  }, [filters, sort]);

  const activeFilterCount = countActiveFilters(filters);
  const hasUsdCompanies = rows.some(row => row.currency === 'USD');

  const resetFilters = () => setFilters(EMPTY_SCREENER_FILTERS);

  const handleSortClick = (key: TScreenerSortKey) => {
    setSort(current => {
      if (current.key === key) {
        return { key, direction: current.direction === 'asc' ? 'desc' : 'asc' };
      }

      // Показатели удобнее смотреть от больших значений к меньшим, названия — по алфавиту.
      return { key, direction: key === 'name' ? 'asc' : 'desc' };
    });
  };

  return (
    <>
      <section className="flex flex-col gap-2">
        <h1 className="font-bold text-3xl">Скринер компаний</h1>
        <p>
          Отбор компаний из{NBSP}индекса Московской биржи по{NBSP}данным отчётности МСФО за{NBSP}последний отчётный год.
        </p>
      </section>

      {hasUsdCompanies && !isUsdRateAvailable && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Не{NBSP}удалось получить курс доллара, поэтому выручка, прибыль, активы, капитал и{NBSP}свободный денежный
            поток компаний с{NBSP}отчётностью в{NBSP}долларах США сейчас недоступны. Рентабельность, маржа
            и{NBSP}темпы роста показываются.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-6">
        <aside
          className={`hidden lg:block w-[280px] shrink-0 sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto rounded-lg border p-4 ${SCROLLBAR_CLASSES}`}
          aria-label="Фильтры"
        >
          <h2 className="mb-4 font-bold text-xl">Фильтры</h2>
          <FiltersPanel idPrefix="sidebar" filters={filters} industries={industries} onChange={setFilters} />
        </aside>

        <div className="min-w-0 flex-1 flex flex-col gap-3">
          {/* Телефоны и планшеты */}
          <div className="sticky top-0 z-20 -mx-8 px-8 py-2 flex items-center gap-2 bg-background lg:hidden">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button type="button" variant="outline" className="shrink-0 cursor-pointer">
                  <SlidersHorizontal />
                  Фильтры
                  {activeFilterCount > 0 && (
                    <span className="rounded-full bg-investemika-primary px-1.5 text-xs text-white">{activeFilterCount}</span>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent
                className="top-0 left-0 translate-x-0 translate-y-0 flex h-dvh w-full max-w-none flex-col gap-0 rounded-none border-0 p-0 sm:max-w-none"
              >
                <DialogHeader className="border-b p-4 text-left">
                  <DialogTitle>Фильтры</DialogTitle>
                  <DialogDescription className="sr-only">Условия отбора компаний</DialogDescription>
                </DialogHeader>
                <div className={`flex-1 overflow-y-auto p-4 ${SCROLLBAR_CLASSES}`}>
                  <FiltersPanel idPrefix="dialog" filters={filters} industries={industries} onChange={setFilters} />
                </div>
                <div className="flex gap-2 border-t p-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="cursor-pointer"
                    disabled={activeFilterCount === 0}
                    onClick={resetFilters}
                  >
                    Сбросить
                  </Button>
                  <Button type="button" className="flex-1" onClick={() => setIsDialogOpen(false)}>
                    Показать {pluralizeCompanies(visibleRows.length)}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Select
              value={sort.key}
              onValueChange={value => handleSortClick(value as TScreenerSortKey)}
            >
              <SelectTrigger
                className="h-9 min-w-0 flex-1"
                aria-label="Сортировка"
              >
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="name">По названию</SelectItem>

                {SCREENER_METRICS.map(metric => (
                  <SelectItem key={metric.id} value={metric.id}>
                    {getMetricLabel(metric, true)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="shrink-0 cursor-pointer"
              aria-label={sort.direction === 'asc' ? 'Сортировка по возрастанию' : 'Сортировка по убыванию'}
              onClick={() => handleSortClick(sort.key)}
            >
              {sort.direction === 'asc' ? <ArrowUp /> : <ArrowDown />}
            </Button>
          </div>

          <div className="flex min-h-8 items-center justify-between gap-2">
            <p className="text-sm text-muted-foreground" aria-live="polite">
              Найдено {visibleRows.length} из{NBSP}{rows.length}
            </p>
            {activeFilterCount > 0 && (
              <Button type="button" variant="ghost" size="sm" className="cursor-pointer" onClick={resetFilters}>
                Сбросить всё
              </Button>
            )}
          </div>

          <ActiveFilters filters={filters} onChange={setFilters} />

          {visibleRows.length === 0 ? (
            <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed p-8 text-center">
              <p>Под{NBSP}заданные условия не{NBSP}подошла ни{NBSP}одна компания.</p>
              <Button type="button" variant="outline" className="cursor-pointer" onClick={resetFilters}>
                Сбросить фильтры
              </Button>
            </div>
          ) : (
            <>
              <div className="hidden lg:block">
                <ResultsTable rows={visibleRows} metrics={visibleMetrics} sort={sort} onSortClick={handleSortClick} />
              </div>
              <div className="lg:hidden">
                <ResultsCards rows={visibleRows} metrics={visibleMetrics} />
              </div>
            </>
          )}

          <p className="text-xs text-muted-foreground">
            Денежные показатели приведены в{NBSP}миллиардах рублей. Прочерк означает, что показатель неприменим
            к{NBSP}компании или его нельзя рассчитать: такие компании не{NBSP}попадают под{NBSP}фильтр по{NBSP}этому показателю.
            {hasUsdCompanies && ` Показатели компаний с${NBSP}отчётностью в${NBSP}долларах США пересчитаны в${NBSP}рубли по${NBSP}текущему курсу ЦБ.`}
          </p>
        </div>
      </div>
    </>
  );
};
