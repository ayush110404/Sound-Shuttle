'use server'

import { cookies } from "next/headers";
import { redirect } from "next/navigation";



export const youtubeOAuth = async () => {
    const response = await fetch("http://localhost:3000/api/Youtube/auth");
    const data = await response.json();
    if (data.url) {
        redirect(data.url);
    } else {
        redirect('http://localhost:3000/');
    }
}

export const getYouTubePlaylistItems = async (url: string) => {
    const playlistId = url.split('list=')[1];
    const cookieStore = cookies();
    const access_token = cookieStore.get('youtube_access_token')?.value;
    console.log(playlistId, access_token);
    if(access_token==null){
        return {error:{message: 'Access token not found',status: 401}};
    }else if(playlistId==null){
        return {error:{message: 'Playlist ID not found',status: 400}};
    }
    try {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50`, {
            headers: { 'Authorization': `Bearer ${access_token}`, 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        // console.log(data);
        if (data.error) {
            console.log('error', data.errors);
            return {error:{message: data.error.message , status: data.error.code}};
        }
        else{
            console.log('success', data);
            const trackData = data.items.map((item: YouTubePlaylistItem,id:number) => {
                return {
                  Id: id+1,
                  Track: item.snippet.title,
                  Artist: item.snippet.videoOwnerChannelTitle,
                  Album: 'NO ALBUM FOUND',
                }
              });
            return trackData;
        }
    } catch (e) {
        console.log(e);
        return e;
    }
}