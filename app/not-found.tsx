import Link from 'next/link';

import { PageShell } from '@/components/page-shell';
import { getEmptyInitialDataContext } from '@/utils/get-empty-initial-data-context';

export default function NotFound() {
  const initialDataContext = getEmptyInitialDataContext();

  return (
    <PageShell initialDataContext={initialDataContext}>
      <div className="flex-1 text-center flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold">Страница не найдена</h2>
        <Link href="/" className="text-investemika-primary hover:underline">
          Вернуться на главную
        </Link>
      </div>
    </PageShell>
  );
}
