import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
    title: "ASUC Tabulator",
    description: "Calculate and visualize ASUC election results",
    authors: { name: "Nyx Iskandar", url: "https://xyntechx.com" },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={cn(
                    "w-screen min-h-screen bg-background font-sans antialiased p-4",
                    inter.variable
                )}
            >
                {children}
            </body>
        </html>
    );
}
