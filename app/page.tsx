'use client'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FaSpotify,FaYoutube } from "react-icons/fa6";
import { youtubeOAuth } from "@/lib/APIs/YoutubeApiFunctions";
import { spotifyOAuth } from "@/lib/APIs/SpotifyApiFunctions";


export default function Component() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4 md:px-6">
      <div className="container max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-card p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <FaSpotify className="w-8 h-8 mr-4 text-foreground" />
              <h3 className="text-2xl font-bold">Transfer from Spotify</h3>
            </div>
            <p className="text-muted-foreground mb-6">Seamlessly transfer your playlists from Spotify to YouTube.</p>
            <Button onClick={()=>{spotifyOAuth('spotify')}} variant="default">Transfer to YouTube</Button>
          </Card>
          <Card className="bg-card p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <FaYoutube className="w-8 h-8 mr-4 text-foreground" />
              <h3 className="text-2xl font-bold">Transfer from YouTube</h3>
            </div>
            <p className="text-muted-foreground mb-6">Easily transfer your playlists from YouTube to Spotify.</p>
            <Button variant="default" onClick={()=>{youtubeOAuth('youtube')}}>Transfer to Spotify</Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
