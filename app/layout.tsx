import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://investemika.ru"),
  title: "Инвестемика - анализ финансовых показателей российских компаний | МСФО отчетность, мультипликаторы, акции",
  description: "Ключевые финансовые показатели российских компаний по МСФО: доходы, прибыль, капитал, денежные потоки. Котировки акций, мультипликаторы (P/E, P/B, P/S, P/FCF), добавление в портфель. Инструмент для частных инвесторов на основе фундаментального анализа.",
  keywords: [
    "инвестиции",
    "российские акции",
    "фундаментальный анализ",
    "МСФО отчетность",
    "финансовые показатели",
    "выручка",
    "P/E",
    "P/B",
    "P/S",
    "инвестиционный портфель",
    "биржа",
    "фондовый рынок"
  ],
  openGraph: {
    title: "Инвестемика — аналитика финансовых показателей компаний",
    description: "Прозрачная аналитика отчетности по МСФО: доходы, прибыль, мультипликаторы и цены акций. Помощь в выборе акций для портфеля.",
    type: "website",
    url: "https://investemika.ru",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Инвестемика — финансовый анализ для инвесторов",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
