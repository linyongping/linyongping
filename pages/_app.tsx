import { Inter as FontSans } from "next/font/google";
import ReactQueryProvider from "@/app/react-query-provider";
import { cn } from "@/lib/utils";
import "@/app/globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeSwitcher } from "@/components/theme-switcher";

type LayoutProps = {
  Component: React.ComponentType;
  pageProps: any;
};

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function Layout({ Component, pageProps }: LayoutProps) {
  return (
    <div
      className={`${cn(
        "min-h-screen bg-background font-sans antialiased",
        fontSans.variable
      )}`}
    >
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <ReactQueryProvider>
          <ThemeSwitcher />
          <Component {...pageProps} />
          <Toaster />
        </ReactQueryProvider>
      </ThemeProvider>
    </div>
  );
}
