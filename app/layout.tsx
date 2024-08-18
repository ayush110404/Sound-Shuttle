import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import {Bricolage_Grotesque,Fresca, JetBrains_Mono,Anek_Devanagari, Ubuntu} from "next/font/google";

export const metadata: Metadata = {
  title: "Sound Shuttle",
  description: "Sound Shuttle is a playlist transfer webapp",
};
const JetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight:["400"],
  variable: '--font-jetbrains-mono',
});
const ubuntu = Ubuntu({
  subsets: ['latin'],
  weight:["400"],
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
          "min-h-screen h-screen bg-background antialiased font-Ubuntu text-lg overflow-hidden",
        )}
      >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
          {children}
          </ThemeProvider>
      </body>
    </html>
  );
}