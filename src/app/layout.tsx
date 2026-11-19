import type { Metadata, Viewport } from "next";

import { DirectionProvider } from "@/providers/direction-provider";

import { BottomNav } from "@/components/bottom-nav";
import { UpdateChecker } from "@/components/update-checker";

import "./globals.css";

export const metadata: Metadata = {
  title: "FoxTrack",
  description: "Minimalist, modern, offline-first Todo List application",
  manifest: "/manifest.json",
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
    <html suppressHydrationWarning lang="en">
      <head>
        <link href="/icons/icon-192x192.png" rel="apple-touch-icon" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('foxtrack-theme');
                  var isDark = saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (_) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen antialiased">
        <DirectionProvider>
          <main className="min-h-screen bg-neutral-50 pb-20 text-neutral-900 transition-colors dark:bg-neutral-950 dark:text-neutral-100">
            {children}
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
