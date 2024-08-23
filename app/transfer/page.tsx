"use client"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DataTableDemo } from "@/components/DataTable"
import { useRouter, useSearchParams } from "next/navigation"
import { getSpotifyPlaylistItems } from "@/lib/APIs/SpotifyApiFunctions"
import { getYouTubePlaylistItems } from "@/lib/APIs/YoutubeApiFunctions"



export default function Component() {
  const [url, setUrl] = useState("")
  const [data, setData] = useState([])
  const router = useRouter()
  const params = useSearchParams();
  const source = params.get("source");
  const apiFunction = source === "spotify" ? getSpotifyPlaylistItems : getYouTubePlaylistItems;

  const handleFetch = async () => {
    try{
      const response = await apiFunction(url);
      console.log('Data Table Loading....',response);
      setData(response)
    }catch(e){
      console.error("Error fetching data:",e)
      router.push("/");
    }
  }

  

  return (
    <div className="flex flex-col gap-3 items-center justify-start h-screen w-screen bg-background">
      <div className="flex flex-row gap-5 w-[30%]">
        <Input
          type="text"
          placeholder="Enter a link"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 text-base"
        />
        <Button variant={"secondary"} onClick={handleFetch}>Fetch Data</Button>
      </div>
      {data.length > 0 && <div className="border rounded-lg w-[80%]">
        <DataTableDemo data={data}/>
      </div>}
    </div>
  )
}