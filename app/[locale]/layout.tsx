import { Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { SessionWrapper } from "@/components/wrapper/SessionWrapper";
import NextThemeProvider from "@/components/Layout/nextThemeLayout";
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "AVIMS - Gestion de l'inventaire",
  "description": "Gestion de l'inventaire Europa Organisation"
}

const inter = Inter({ subsets: ["latin"] });

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: { locale: string };
};

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale)) {
    notFound();
  }

  // Providing all messages to the client side
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextThemeProvider>
          <SessionWrapper>
            <NextIntlClientProvider locale={locale} messages={messages}>
              {children}
            </NextIntlClientProvider>
          </SessionWrapper>
        </NextThemeProvider>
      </body>
    </html>
  );
}
