import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { JetBrains_Mono, Inter, Space_Grotesk, Bricolage_Grotesque } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import Image from "next/image";
import { HiMusicalNote } from "react-icons/hi2";

export const metadata: Metadata = {
  title: "Sound Shuttle - Playlist Transfer Made Easy",
  description: "Transfer your music playlists seamlessly between Spotify and YouTube Music. Keep your music collection synchronized across platforms.",
  keywords: ["playlist transfer", "spotify", "youtube music", "music migration", "playlist converter"],
  authors: [{ name: "Sound Shuttle Team" }],
  openGraph: {
    title: "Sound Shuttle - Playlist Transfer Made Easy",
    description: "Transfer your music playlists seamlessly between Spotify and YouTube Music.",
    type: "website",
  },
};

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space-grotesk",
})
const bricolage = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-bricolage-grotesque' });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${spaceGrotesk.variable} ${bricolage.variable}`}>
      <body
        className={cn(
          "min-h-screen bg-background antialiased font-inter text-base overflow-x-hidden font-Space_Grotesk dark",
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster 
            position="top-right" 
            richColors 
            duration={4000}
            toastOptions={{
              style: {
                background: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                color: 'hsl(var(--foreground))',
              },
            }}
          />
          
          {/* Header */}
          <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <HiMusicalNote className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">Sound Shuttle</h1>
                  <p className="text-xs text-muted-foreground hidden sm:block">Playlist Transfer Made Easy</p>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>

          {/* Footer */}
          <footer className="border-t border-border/40 bg-background/50 backdrop-blur-sm">
            <div className="container mx-auto px-4 py-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <HiMusicalNote className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Sound Shuttle</p>
                    <p className="text-xs text-muted-foreground">Transfer your music, keep your vibe</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
                  <a href="#" className="hover:text-foreground transition-colors">Terms</a>
                  <a href="#" className="hover:text-foreground transition-colors">Support</a>
                  <span className="text-xs">© 2024 Sound Shuttle</span>
                </div>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}