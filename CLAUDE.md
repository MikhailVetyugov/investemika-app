# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Investemika (investemika.ru) is a Next.js 15 (App Router, React 19, Tailwind 4, shadcn/ui) site that summarizes IFRS financial statements of Russian public companies: revenue, operating and net income, equity, cash flows, live share price, and multipliers (P/E, P/B, P/S, P/FCF), compared against industry averages. It also has standalone Gordon, IRR and EVA calculators and a page per company for downloading its reports. The UI text, comments and README are in Russian.

## Commands

Use pnpm (version pinned in `packageManager`; Node version in `.nvmrc`).

```bash
pnpm i
pnpm dev                 # next dev --turbopack, http://localhost:3000
pnpm build
pnpm lint                # next lint
pnpm test                # vitest run (all tests)
pnpm vitest run utils/calculations/irr/__tests__/irr.test.ts   # one test file
pnpm vitest run -t "parseFileName"                              # by test name
pnpm run publish         # deploy: git push amvera main:master (Amvera hosting)
```

Tests live in `__tests__/` folders next to the code they cover. `vitest.config.ts` sets up the `@/` alias, so code under test can use `@/` imports; test files themselves import the code under test by relative path.

To check the Docker image locally: `docker build --no-cache -t investemika-app .` and then `docker run --rm -p 3000:3000 investemika-app`. In production, the Dockerfile runs `build:amvera` / `start:amvera`, which cap the heap at 304 MB. `/api/memory` reports process memory usage.

The S3 env vars (`S3_BUCKET`, `S3_ACCESS_KEY`, `S3_SECRET_ACCESS_KEY`, `S3_ENDPOINT`) are needed only for the download pages.

## Architecture

**Company data is static and hand-maintained.** `lib/data.ts` holds `ALL_COMPANIES`: each company's yearly IFRS figures, stored as parallel arrays that line up with `years`, newest year first. `TCompany` (`types/company.ts`) is a discriminated union on `type` (`regular` | `bank` | `exchange` | `insurance`), and each variant requires different fields. `getStocksFromCompanies` turns companies into `ALL_STOCKS`, with one `IStock` per ticker:
- a company with both common and preferred shares gives two stocks (preferred tickers are listed in `PREF_TICKERS`);
- every array is cut to the 4 most recent years.

**Adding a company** touches several places that the type system ties together:
- add the ticker to the `TTicker` union (`types/ticker.ts`);
- add the company to `lib/data.ts`;
- add an entry to the `Record<TTicker, …>` maps in `lib/descriptions.ts` and `services/server/fetch-price-from-alternate-source.ts`.

**URLs come from transliterated names.** A stock page is `/[stock]`, where the slug is `translit-rus-eng(stock.name, slugify)`. It is resolved back to a stock in `utils/transliteration`. Calculator pages have Russian slugs, defined in `constants/urls.ts` and mapped to their app routes by rewrites in `next.config.ts`. `app/sitemap.ts` builds the sitemap from `ALL_STOCKS`.

**Market data runs on both server and client.**
- `services/server/` calls external sources directly:
  - MOEX ISS for price and capitalization, read from the TQBR board;
  - scraped banki.ru/rbc pages as a fallback price source;
  - currency rates;
  - industry average coefficients, computed by fetching every stock in the industry.

  Each fetcher is wrapped in an in-memory LRU cache (`services/server/cache-wrapper.ts`), with TTLs ranging from 5 seconds for prices to 24 hours for averages.
- `services/browser/` calls the app's own `/api/*` routes, which wrap the server services. `single-issue-stock-data` uses POST on purpose, so the URL can't simply be pasted and spammed.
- `services/shared/fetch-aggregated-stock-data.ts` picks one of the two at runtime (`typeof window`). It adds up capitalization across all of a company's tickers.

**Page state flow.** Each server page (e.g. `app/[stock]/page.tsx`) fetches its initial data and passes it to `PageShell`. `PageShell` holds `DataContext` (`components/data-context.ts`, `hooks/use-data-context.ts`). When the user picks a stock in the header search while already on a stock page, `useStockSelection` does not navigate. It calls `history.pushState`, re-fetches the data through the browser services, and sets `document.title` itself, so the page is not unmounted. It also handles `popstate`. On other pages it navigates normally with `router.push`.

**Calculations.** Multipliers and ratios are in `utils/calculations/`. Which metrics apply depends on the company type (see `utils/is-financial-company.ts`): banks and insurers use different income lines.

**Screener.** `/skriner-kompanij` (`app/screener/page.tsx`, rewritten like the calculators) lists one row per company with metrics for its latest reporting year. Rows are built on the server by `utils/screener/get-screener-rows.ts`; filtering, sorting and URL-query sync happen on the client (`components/screener-content/`, `utils/screener/`). The metric registry in `constants/screener-metrics.ts` drives the filter panel, table columns, cards and chips. Screener metrics must not depend on external sources (price, capitalization); the only exception is the USD rate, used to convert USD statements to rubles. The page is not in the sitemap and is not linked from anywhere yet.

**Report downloads.** `/[stock]/download` lists files from S3 under the prefix `investemika/<stock-url-name>/` (`services/server/s3.ts`, `fetch-download-files-groups-from-s3.ts`). Files are served through `/api/v2/download?path=…`, which rejects any path containing `..`. File names encode their metadata (`2024-en-press_release.pdf`; see `utils/parse-file-name.ts`). Older code that read files from Yandex Disk (`fetch-*-yandex*`, `constants/yandex-disk.ts`, `/api/download`) is still in the repo. The current UI uses only the S3 path.

## Conventions

- Minimum supported device width is 360px.
- Import through the `@/*` path alias, which points at the repo root.
- Russian text uses the `NBSP`/`NBHY` constants from `constants/symbols.ts` for typographic non-breaking spaces and hyphens.
