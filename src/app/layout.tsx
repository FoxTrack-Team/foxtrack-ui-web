import type { Metadata, Viewport } from "next";
import { Vazirmatn } from "next/font/google";

import { DirectionProvider } from "@/providers/direction-provider";

import { BottomNav } from "@/components/bottom-nav";
import { Header } from "@/components/header";
import { UpdateChecker } from "@/components/update-checker";

import "./globals.css";

const vazir = Vazirmatn({
  display: "swap",
  subsets: ["arabic"],
  variable: "--font-vazir",
});

export const metadata: Metadata = {
  title: "FoxTrack",
  description: "Minimalist, modern, offline-first Todo List application",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#F4561A",
      },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "FoxTrack",
  },
};

export const viewport: Viewport = {
  themeColor: "#f97316",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning className={vazir.variable} lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var savedTheme = localStorage.getItem('foxtrack-theme');
                  var isDark = savedTheme === 'dark' || ((!savedTheme || savedTheme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches);
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }

                  var savedLang = localStorage.getItem('foxtrack-language') || 'en';
                  document.documentElement.lang = savedLang;
                  document.documentElement.dir = savedLang === 'fa' ? 'rtl' : 'ltr';
                } catch (_) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen antialiased">
        <DirectionProvider>
          <main className="min-h-screen bg-neutral-50 pb-32 text-neutral-900 transition-colors sm:pb-36 dark:bg-neutral-950 dark:text-neutral-100">
            <div className="mx-auto max-w-xl px-4 pt-[calc(env(safe-area-inset-top)+1rem)] pb-6 sm:pt-10 sm:pb-10">
              <Header />
              <div className="animate-page-enter">{children}</div>
            </div>
          </main>
          <BottomNav />
          <UpdateChecker />
        </DirectionProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').catch(err => {
                    console.error('ServiceWorker registration failed: ', err);
                  });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
