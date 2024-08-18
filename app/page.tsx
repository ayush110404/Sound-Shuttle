import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FaSpotify,FaYoutube } from "react-icons/fa6";


export default function Component() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4 md:px-6">
      <header className="absolute top-2 left-2 flex flex-row items-center text-muted-foreground">
        <Link href="#" prefetch={false}>
          <img
            src="/logo.svg"
            alt="Sound Shuttle"
            className="w-12 h-12"/>
          <span className="sr-only">Sound Shuttle</span>
        </Link>
        <p>Sound Shuttle</p>
      </header>
      <div className="container max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-card p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <FaYoutube className="w-8 h-8 mr-4 text-foreground" />
              <h3 className="text-2xl font-bold">Transfer from YouTube</h3>
            </div>
            <p className="text-muted-foreground mb-6">Easily transfer your playlists from YouTube to Spotify.</p>
            <Link
              href="#"
              className="inline-flex items-center justify-center h-10 px-6 rounded-md bg-background text-primary-foreground font-medium shadow transition-colors hover:bg-background/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              prefetch={false}
            >
              Transfer to Spotify
            </Link>
          </Card>
          <Card className="bg-card p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <FaSpotify className="w-8 h-8 mr-4 text-foreground" />
              <h3 className="text-2xl font-bold">Transfer from Spotify</h3>
            </div>
            <p className="text-muted-foreground mb-6">Seamlessly transfer your playlists from Spotify to YouTube.</p>
            <Link
              href="#"
              className="inline-flex items-center justify-center h-10 px-6 rounded-md bg-background text-primary-foreground font-medium shadow transition-colors hover:bg-background/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              prefetch={false}
            >
              Transfer to YouTube
            </Link>
          </Card>
        </div>
      </div>
    </div>
  )
}
