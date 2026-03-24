import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { I18nProvider } from "@/i18n/context";

export const metadata: Metadata = {
  title: "Byzantine Prime — Wealth Manager Portal",
  description:
    "Manage your clients, track commissions, and grow your practice with Byzantine Prime.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen">
        <I18nProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col ml-0 md:ml-[260px]">
              <Header />
              <main className="flex-1 p-4 md:p-6 lg:p-8 pt-4 md:pt-6">
                {children}
              </main>
            </div>
          </div>
        </I18nProvider>
      </body>
    </html>
  );
}
