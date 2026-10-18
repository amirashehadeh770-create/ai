import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getDictionary, getLocale } from "@/lib/i18n";
import { localeDir } from "@/lib/i18n/config";
import { I18nProvider } from "@/components/i18n/I18nProvider";
import { Analytics } from '@vercel/analytics/next';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Marketplace — Independent Online Stores",
  description: "A collection of independent online stores, each with their own catalog and checkout.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const dict = getDictionary(locale);

  return (
    <html
      lang={locale}
      dir={localeDir[locale]}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-neutral-50 text-neutral-900">
        <I18nProvider locale={locale} dict={dict}>
          {children}
        </I18nProvider>
        <Analytics />
      </body>
    </html>
  );
}
