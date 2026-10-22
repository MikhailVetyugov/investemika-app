import type { Metadata, ResolvingMetadata } from "next";
import type { ResolvedOpenGraph } from "next/dist/lib/metadata/types/opengraph-types";
import { notFound } from "next/navigation";
import { AlertTriangle } from "lucide-react";

import { PageShell } from "@/components/page-shell";
import { NBSP } from "@/constants/symbols";
import { getStockByUrlName } from "@/utils/transliteration/get-stock-by-url-name";
import { getDownloadPageSeoTitle } from "@/utils/seo-titles";
import { getEmptyInitialDataContext } from "@/utils/get-empty-initial-data-context";
import { FilesGroupCard } from "@/components/download-page-content";
import { fetchDownloadFilesGroupsFromS3 } from "@/services/server";

type TProps = {
  params: Promise<{ stock: string }>
}

export async function generateMetadata(
  { params }: TProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { stock: stockUrlName } = await params;
  const stock = getStockByUrlName(stockUrlName);

  if (!stock) {
    return { title: 'Страница не найдена' };
  }

  const parentMetadata = await parent;
  const title = getDownloadPageSeoTitle(stock);

  return {
    title,
    description: `Скачайте годовую консолидированную отчетность ${stock.company.name} (${stock.ticker}) по МСФО в PDF. Прямой доступ к оригиналам финансовых отчетов компании для глубокого фундаментального анализа на Инвестемика.`,
    keywords: [
      'скачать',
      `${stock.company.name}`,
      'годовая отчетность',
      'отчетность МСФО',
      'консолидированная отчетность',
      'pdf',
    ],
    openGraph: {
      ...parentMetadata.openGraph as ResolvedOpenGraph,
      title,
      description: `Скачайте годовую отчетность ${stock.company.name} по МСФО. Официальные PDF-документы для глубокого анализа компании.`,
      url: `https://investemika.ru/${stockUrlName}/download/`
    },
  }
}

export default async function DownloadPage({ params }: TProps) {
  const { stock: stockUrlName } = await params;
  const stock = getStockByUrlName(stockUrlName);

  if (!stock) {
    return notFound();
  }

  const initialDataContext = getEmptyInitialDataContext();
  const filesGroups = await fetchDownloadFilesGroupsFromS3(stockUrlName);

  return (
    <PageShell initialDataContext={initialDataContext}>
      <div className="space-y-6">
        <div
          role="alert"
          className="flex items-start gap-3 rounded-lg border border-amber-300/70 bg-amber-50 p-4 text-amber-950 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200"
        >
          <AlertTriangle
            className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-400"
            aria-hidden="true"
          />
          <div className="space-y-1">
            <p className="font-semibold">
              Возможны проблемы со{NBSP}скачиванием отчетности
            </p>
            <p className="text-sm leading-relaxed text-amber-900/80 dark:text-amber-200/80">
              Из-за технических проблем в{NBSP}инфраструктуре нашего облачного провайдера скачивание отчетности
              может работать нестабильно. Если{NBSP}документ не{NBSP}удаётся скачать, пожалуйста,
              попробуйте повторить попытку позднее. Приносим извинения за{NBSP}неудобства.
            </p>
          </div>
        </div>


        <div className="space-y-2">
          <h1 className="font-bold text-3xl">Скачать отчетность {stock.company.name}</h1>
          <p className="text-gray-600">
            На этой странице вы можете скачать полную годовую консолидированную финансовую отчетность
            компании {stock.company.name} по{NBSP}международным стандартам (МСФО) в{NBSP}формате{NBSP}PDF.
          </p>
        </div>

        {filesGroups.length > 0 ? (
          <div className="space-y-6">
            {filesGroups.map((group, index) => <FilesGroupCard key={index} group={group} />)}
          </div>
        ) : (
          <p className="text-center">Файлы не найдены</p>
        )}
      </div>
    </PageShell>
  );
}
