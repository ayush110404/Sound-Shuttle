import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import {JetBrains_Mono, Ubuntu } from "next/font/google";
import { SiBluesound } from "react-icons/si";


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
          <div className="flex flex-row gap-1 items-center h-[6%] max-h-[6%] p-2">
            <SiBluesound size={25} className="text-muted-foreground"/>
            <p>Sound Shuttle</p>
          </div>
          <div className="h-[95%] max-h-[95%]">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}