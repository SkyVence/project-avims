// Uploadthing Imports
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { ourFileRouter } from "./api/uploadthing/core";
import { extractRouterConfig } from "uploadthing/server";
// Next-Intl Imports
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
// Next-Theme Imports
import { ThemeProvider } from '@/components/theme-provider';
// Clerk Imports
import { ClerkProvider } from "@clerk/nextjs";
// SHADCN Imports
import { cn } from '@/lib/utils';
// Fonts Imports
import { Inter } from "next/font/google";
// Next Imports
import type { Metadata } from "next";
// Style Imports
import "./globals.css";

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
								<NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)}/>
                                {children}
                            </NextIntlClientProvider>
                        </ThemeProvider>
                    </ClerkProvider>
            </body>
        </html>
    );
}
