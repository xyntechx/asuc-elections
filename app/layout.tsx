import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

export const metadata = {
    metadataBase: new URL(defaultUrl),
    title: "ASUC Elections Tabulator",
    description: "Calculate and visualize ASUC election results",
    authors: { name: "Nyx Iskandar", url: "https://xyntechx.com" },
};

const fontSans = FontSans({
    subsets: ["latin"],
    variable: "--font-sans",
});

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body
                className={cn(
                    "bg-background font-sans antialiased",
                    fontSans.variable
                )}
            >
                <main className="w-screen min-h-screen flex flex-col items-center justify-start">
                    {children}
                </main>
            </body>
        </html>
    );
}
