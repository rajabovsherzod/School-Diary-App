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
    <html lang="en" suppressHydrationWarning>
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
              <div className="flex h-screen w-full overflow-hidden">
                <AppSidebar />
                <div className="flex flex-1 flex-col">
                  <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b border-sidebar-border bg-primary px-4 text-primary-foreground">
                    <SidebarTrigger>
                      <PanelLeftIcon />
                    </SidebarTrigger>
                    <h1 className="text-xl font-semibold">School Diary</h1>
                  </header>
                  <main className="flex-1 overflow-y-auto p-4 md:p-6">
                    {children}
                  </main>
                </div>
              </div>
              <Toaster />
            </SidebarProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
