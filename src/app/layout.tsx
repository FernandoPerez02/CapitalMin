import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import UiProviders from "@/components/ui/ui-providers";
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
  title: "CapitalMin",
  description: "Gestión financiera personal: presupuestos, movimientos y balance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <UiProviders>{children}</UiProviders>
      </body>
    </html>
  );
}
