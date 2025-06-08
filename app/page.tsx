'use client'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FaSpotify, FaYoutube } from "react-icons/fa6"
import { HiArrowRight } from "react-icons/hi2"
import { youtubeOAuth } from "@/lib/APIs/YoutubeApiFunctions"
import { spotifyOAuth } from "@/lib/APIs/SpotifyApiFunctions"

export default function Component() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95 font-Bricolage_Grotesque">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-6">
            Transfer Your Music
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Seamlessly move your favorite playlists between Spotify and YouTube Music. 
            Keep your music collection synchronized across platforms.
          </p>
        </div>

        {/* Transfer Cards */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Spotify to YouTube Card */}
            <Card className="group relative overflow-hidden border-2 border-border/40 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center shadow-lg">
                    <FaSpotify className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-foreground">From Spotify</h3>
                    <p className="text-sm text-muted-foreground">Export your playlists</p>
                  </div>
                </div>

                <p className="text-muted-foreground mb-8 leading-relaxed">
                  Export your carefully curated Spotify playlists and bring them to YouTube Music. 
                  Preserve your musical journey across platforms.
                </p>

                <Button 
                  onClick={() => spotifyOAuth('spotify')} 
                  className="w-full group/btn bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-6 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-primary/25"
                >
                  <span className="flex items-center justify-center gap-3">
                    Transfer to YouTube
                    <HiArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-200" />
                  </span>
                </Button>
              </div>
            </Card>

            {/* YouTube to Spotify Card */}
            <Card className="group relative overflow-hidden border-2 border-border/40 hover:border-red-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/10">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-red-500 flex items-center justify-center shadow-lg">
                    <FaYoutube className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-foreground">From YouTube</h3>
                    <p className="text-sm text-muted-foreground">Export your playlists</p>
                  </div>
                </div>

                <p className="text-muted-foreground mb-8 leading-relaxed">
                  Move your YouTube Music playlists to Spotify with ease. 
                  Keep your music discovery flowing between platforms.
                </p>

                <Button 
                  onClick={() => youtubeOAuth('youtube')} 
                  className="w-full group/btn bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-6 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-primary/25"
                >
                  <span className="flex items-center justify-center gap-3">
                    Transfer to Spotify
                    <HiArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-200" />
                  </span>
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <div className="w-6 h-6 rounded-full bg-primary" />
              </div>
              <h4 className="font-semibold text-foreground">Fast Transfer</h4>
              <p className="text-sm text-muted-foreground">Quick and efficient playlist migration</p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <div className="w-6 h-6 rounded-full bg-primary" />
              </div>
              <h4 className="font-semibold text-foreground">Secure & Private</h4>
              <p className="text-sm text-muted-foreground">Your data stays safe and private</p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <div className="w-6 h-6 rounded-full bg-primary" />
              </div>
              <h4 className="font-semibold text-foreground">Easy to Use</h4>
              <p className="text-sm text-muted-foreground">Simple interface, powerful results</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}