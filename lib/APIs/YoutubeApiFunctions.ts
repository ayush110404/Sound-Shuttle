'use server'

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";



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
    const playlistId = url;
    const cookieStore = cookies();
    const access_token = cookieStore.get('youtube_access_token')?.value;
    console.log(playlistId, access_token);
    try {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}`, {
            headers: { 'Authorization': `Bearer ${access_token}`, 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        // console.log(data);
        if (data.error) {
            console.log('error', data.error);
            return data.error;
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
        return NextResponse.json({ error: e });
    }
}