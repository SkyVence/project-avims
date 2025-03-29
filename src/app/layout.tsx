import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/theme-provider';
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Inventory Management System",
    description: "Internal inventory management system for tracking items, packages, and operations",
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const locale = await getLocale();

    return (
        <html lang={locale} suppressHydrationWarning>
            <body className={cn("min-h-screen bg-background font-sans antialiased", inter.className)}>
                    <ClerkProvider>
                        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                            <NextIntlClientProvider>
                                {children}
                            </NextIntlClientProvider>
                        </ThemeProvider>
                    </ClerkProvider>
            </body>
        </html>
    );
}
