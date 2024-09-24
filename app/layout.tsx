import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import {JetBrains_Mono, Ubuntu } from "next/font/google";
import { SiBluesound } from "react-icons/si";
import { Toaster } from "@/components/ui/sonner";
import Image from "next/image";


export const metadata: Metadata = {
  title: "Sound Shuttle",
  description: "Sound Shuttle is a playlist transfer webapp",
};
const JetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ["400"],
  variable: '--font-jetbrains-mono',
});
const ubuntu = Ubuntu({
  subsets: ['latin'],
  weight: ["400"],
  variable: '--font-ubuntu',
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={` ${ubuntu.variable} ${JetBrainsMono.variable}`}>
      <body
        className={cn(
          "min-h-screen h-screen max-h-screen bg-background antialiased font-JetBrains_Mono text-lg overflow-hidden",
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
           <Toaster position="top-right" richColors duration={3000}/>
          <div className="flex flex-row items-center h-[7%] max-h-[10%]">
          <Image
              src="/sound04.png"
              alt="Vercel Logo"
              className="dark:invert dark:grayscale"
              width={80}
              height={5}
              priority
            />
            <p>Sound Shuttle</p>
          </div>
          <div>
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}