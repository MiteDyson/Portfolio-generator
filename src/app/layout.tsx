import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import Squares from "../Reactbits/Squares/Squares";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Portfolio Generator",
  description: "Create a developer portfolio in seconds.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* This div positions the animation in the background */}
          <div className="fixed top-0 left-0 w-full h-full -z-10">
            <Squares 
              speed={0.5} 
              squareSize={40}
              direction='diagonal'
            />
          </div>
          
          {/* Your page content renders on top */}
          <main className="relative z-10">
            {children}
          </main>
          
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}