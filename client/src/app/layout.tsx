import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { AppSidebar } from "@/components/app-sidebar";
import { PanelLeftIcon } from "lucide-react";
import QueryProvider from "@/components/query-provider";
import { ProgressBar } from "@/components/ui/progress-bar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "School Diary App",
  description: "A modern school diary application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ProgressBar />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <SidebarProvider>
              <div className="grid h-screen w-full grid-rows-[auto_1fr]">
                <header className="flex h-14 shrink-0 items-center gap-4 border-b bg-primary px-4 text-primary-foreground">
                  <SidebarTrigger>
                    <PanelLeftIcon />
                  </SidebarTrigger>
                  <h1 className="text-xl font-semibold">School Diary</h1>
                </header>
                <div className="flex overflow-hidden">
                  <AppSidebar />
                  <main className="container w-full px-4 pt-4 pb-8 md:px-6 md:pt-6 md:pb-12 overflow-auto">
                    {children}
                  </main>
                </div>
                <Toaster />
              </div>
            </SidebarProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
