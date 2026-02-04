import "./globals.css";
import { SessionProvider } from "./providers";
import { Navigation } from "./components/Navigation";

export const metadata = { title: "Room Rental" };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 flex flex-col min-h-screen">
        <SessionProvider>
          <Navigation />
          <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </main>
          {/* Footer */}
          <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 mt-8 sm:mt-12">
            <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 text-center">
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Made by{" "}
                <span className="font-semibold text-slate-900 dark:text-white">
                  Ankesh Rajput
                </span>{" "}
                with <span className="text-red-500 animate-pulse">❤️</span>
              </p>
            </div>
          </footer>
        </SessionProvider>
      </body>
    </html>
  );
}
