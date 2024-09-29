"use client"
import { useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DataTableDemo } from "@/components/DataTable"
import { useRouter, useSearchParams } from "next/navigation"
import { destinationSpotifyPlaylist, getSpotifyPlaylistItems, spotifyOAuth } from "@/lib/APIs/SpotifyApiFunctions"
import { getYouTubePlaylistItems , destinationYoutubePlaylist, youtubeOAuth } from "@/lib/APIs/YoutubeApiFunctions"
import { toast } from "sonner"
import { BsCaretLeft, BsCaretRight } from "react-icons/bs"

export default function Component() {
  const [url, setUrl] = useState("")
  const [data, setData] = useState([]);
  const selectedData = useRef([]);
  const router = useRouter()
  const params = useSearchParams();
  const source = params.get("source");
  const apiFunction = source === "spotify" ? getSpotifyPlaylistItems : getYouTubePlaylistItems;

  const handleFetch = async () => {
    try {
      toast.loading('Data Table Loading....');
      const response = await apiFunction(url);
      console.log('Data Table Loading....', response);
      console.log(response);
      if (response.error) {
        toast.dismiss();
        if (response.error.status === 401) {
          toast.error('User Not Authorized');
          router.push("/");
        }
        else toast.warning('Please Enter Valid URL');
      } else {
        setData(response)
        toast.dismiss();
        toast.success('Data Fetched Successfully');
      }
    } catch (e) {
      console.log(e);
      toast.error('Something went wrong');
    }
  }
  const handleNext = async() => {
    console.log(selectedData.current);
    const res = source=='spotify' ? await destinationYoutubePlaylist(selectedData.current) : await destinationSpotifyPlaylist(selectedData.current); ;
    console.log('response from server->',res);
    if(res.error){
      if(res.error.status === 401){ 
        toast.error('User Not Authorized');
        source=='spotify' ? youtubeOAuth('spotify') : spotifyOAuth('youtube');
      }else{
        toast.error('Something went wrong');
      }
    }else{
      toast.success('Data Transferred Successfully');
    }
  }

  return (
    <div className="flex flex-col gap-3 items-center justify-start w-full min-h-screen bg-background">
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xl">
        <Input
          type="text"
          placeholder={`Enter ${source} playlist URL`}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 text-base"
        />
        <Button 
          variant={"secondary"} 
          onClick={handleFetch}
          className="w-full sm:w-auto"
        >
          Fetch Data
        </Button>
      </div>
      {data.length > 0 && (
        <div className="flex flex-row w-full justify-center gap-5">
          <div className="self-center max-w-[10%]">
            <Button variant={"secondary"} title="Previous Page">
              <BsCaretLeft size={20}/>
            </Button>
          </div>
          <div className="flex flex-row w-full justify-end items-end max-w-[85%] overflow-x-auto">
            <div className="w-full border rounded-lg">
              <DataTableDemo data={data} thisRef={selectedData}/>
            </div>
          </div>
          <div className="self-center max-w-[10%]">
            <Button variant={"secondary"}>
              <BsCaretRight size={20} title="Continue To Next Page" onClick={handleNext}/>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}