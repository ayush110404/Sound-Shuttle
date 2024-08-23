"use client"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DataTableDemo } from "@/components/DataTable"
import { useRouter, useSearchParams } from "next/navigation"
import { getSpotifyPlaylistItems } from "@/lib/APIs/SpotifyApiFunctions"
import { getYouTubePlaylistItems } from "@/lib/APIs/YoutubeApiFunctions"
import { toast } from "sonner"



export default function Component() {
  const [url, setUrl] = useState("")
  const [data, setData] = useState([])
  const router = useRouter()
  const params = useSearchParams();
  const source = params.get("source");
  const apiFunction = source === "spotify" ? getSpotifyPlaylistItems : getYouTubePlaylistItems;

  const handleFetch = async () => {
    try{
      toast.loading('Data Table Loading....');
      const response = await apiFunction(url);
      console.log('Data Table Loading....',response);
      console.log(response);
      if(response.error){
        toast.dismiss();
        if(response.error.status === 401){
          toast.error('User Not Authorized');
          // toast({'User not authorized',variant: "destructive",duration: 3000})
          router.push("/");
        }
        else toast.warning('Please Enter Valid URL');
        // else toast({"Please Enter Valid URL",variant: "destructive",duration: 3000})
      }else{
        setData(response)
        toast.dismiss();
        toast.success('Data Fetched Successfully');
        // toast({"Data Fetched Successfully",duration: 3000,variant:'success'})
      }
    }catch(e){
      console.log(e);
      toast.error('Something went wrong');
    }
  }

  

  return (
    <div className="flex flex-col gap-3 items-center justify-start h-screen w-screen bg-background">
      <div className="flex flex-row gap-5 w-[40%]">
        <Input
          type="text"
          placeholder="Enter playlist URL"
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