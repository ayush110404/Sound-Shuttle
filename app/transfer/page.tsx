"use client"
import { useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DataTableDemo } from "@/components/DataTable"
import { useRouter, useSearchParams } from "next/navigation"
import { destinationSpotifyPlaylist, getSpotifyPlaylistItems, spotifyOAuth } from "@/lib/APIs/SpotifyApiFunctions"
import { getYouTubePlaylistItems, destinationYoutubePlaylist, youtubeOAuth } from "@/lib/APIs/YoutubeApiFunctions"
import { toast } from "sonner"
import { HiArrowLeft, HiArrowRight, HiLink, HiMusicalNote } from "react-icons/hi2"
import { FaSpotify, FaYoutube } from "react-icons/fa6"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Component() {
  const [url, setUrl] = useState("")
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isTransferring, setIsTransferring] = useState(false)
  const selectedData = useRef([])
  const router = useRouter()
  const params = useSearchParams()
  const source = params.get("source")
  const apiFunction = source === "spotify" ? getSpotifyPlaylistItems : getYouTubePlaylistItems

  const sourceConfig = {
    spotify: {
      name: "Spotify",
      icon: FaSpotify,
      color: "text-green-500",
      bgColor: "bg-green-500",
      targetName: "YouTube"
    },
    youtube: {
      name: "YouTube",
      icon: FaYoutube,
      color: "text-red-500",
      bgColor: "bg-red-500",
      targetName: "Spotify"
    }
  }

  const config = sourceConfig[source as keyof typeof sourceConfig]

  const handleFetch = async () => {
    if (!url.trim()) {
      toast.error('Please enter a valid playlist URL')
      return
    }

    try {
      setIsLoading(true)
      toast.loading('Fetching playlist data...')
      
      const response = await apiFunction(url)
      console.log('Data fetched:', response)
      
      if (response.error) {
        toast.dismiss()
        if (response.error.status === 401) {
          toast.error('Authorization required. Please sign in again.')
          router.push("/")
        } else {
          toast.error('Please enter a valid playlist URL')
        }
      } else {
        setData(response)
        toast.dismiss()
        toast.success(`Found ${response.length} tracks in your playlist!`)
      }
    } catch (e) {
      console.error('Fetch error:', e)
      toast.dismiss()
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleTransfer = async () => {
    if (selectedData.current.length === 0) {
      toast.error('Please select at least one track to transfer')
      return
    }

    try {
      setIsTransferring(true)
      toast.loading(`Transferring ${selectedData.current.length} tracks to ${config.targetName}...`)
      
      const res = source === 'spotify' 
        ? await destinationYoutubePlaylist(selectedData.current) 
        : await destinationSpotifyPlaylist(selectedData.current)
      
      console.log('Transfer response:', res)
      
      if (res.error) {
        toast.dismiss()
        if (res.error.status === 401) {
          toast.error('Authorization required for destination platform')
          source === 'spotify' ? youtubeOAuth('spotify') : spotifyOAuth('youtube')
        } else {
          toast.error('Transfer failed. Please try again.')
        }
      } else {
        toast.dismiss()
        toast.success(`Successfully transferred ${selectedData.current.length} tracks to ${config.targetName}!`)
      }
    } catch (e) {
      console.error('Transfer error:', e)
      toast.dismiss()
      toast.error('Transfer failed. Please try again.')
    } finally {
      setIsTransferring(false)
    }
  }

  const handleBack = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleBack}
            className="hover:bg-muted/50"
          >
            <HiArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg ${config.bgColor} flex items-center justify-center`}>
              <config.icon className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Transfer from {config.name}
              </h1>
              <p className="text-sm text-muted-foreground">
                Moving your playlist to {config.targetName}
              </p>
            </div>
          </div>
        </div>

        {/* URL Input Section */}
        <Card className="mb-8 border-2 border-border/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <HiLink className="w-5 h-5" />
              Playlist URL
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="url"
                  placeholder={`Paste your ${config.name} playlist URL here...`}
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="text-base py-6 px-4 rounded-xl border-2 border-border/40 focus:border-primary/50 transition-colors"
                  disabled={isLoading}
                />
              </div>
              <Button 
                onClick={handleFetch}
                disabled={isLoading || !url.trim()}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-6 px-8 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-primary/25"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Fetching...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <HiMusicalNote className="w-5 h-5" />
                    Fetch Playlist
                  </div>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Data Table Section */}
        {data.length > 0 && (
          <Card className="border-2 border-border/40">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <HiMusicalNote className="w-5 h-5" />
                  Playlist Tracks ({data.length} songs)
                </CardTitle>
                <Button 
                  onClick={handleTransfer}
                  disabled={isTransferring}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 px-6 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-primary/25"
                >
                  {isTransferring ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Transferring...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      Transfer to {config.targetName}
                      <HiArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border border-border/40 overflow-hidden">
                <DataTableDemo data={data} thisRef={selectedData} />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {data.length === 0 && !isLoading && (
          <Card className="border-2 border-dashed border-border/40">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                <HiMusicalNote className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No Playlist Loaded</h3>
              <p className="text-muted-foreground text-center max-w-md">
                Enter a {config.name} playlist URL above to get started with transferring your music.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}