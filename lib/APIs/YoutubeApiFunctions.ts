'use server'

import { error } from "console";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";



export const youtubeOAuth = async (source:string) => {
    const response = await fetch(`http://localhost:3000/api/Youtube/auth?platform=${source}`);
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

export async function createPlaylist(title:string) {
    try {
        const cookieStore = cookies();
        const access_token = cookieStore.get('youtube_access_token')?.value;
        const request = await fetch("https://www.googleapis.com/youtube/v3/playlists?part=snippet%2Cstatus", {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${access_token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "snippet": {
                    "title": title,
                    "description": "Created By Sound Shuttle"
                }
            })
        })
        const data = await request.json();
        if(data.error){
            return {error:{message: data.error.message , status: data.error.code}};
        }else{
            return data;
        }
    } catch (error) {
        console.log(error);
        return error;
    }
}

export async function addTrackToPlaylist(playlistId:string,trackName:string) {
    try {
        const cookieStore = cookies();
        const access_token = cookieStore.get('youtube_access_token')?.value;
        const searchRequest = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${trackName}&type=video&maxResults=5`,{
            headers: { 'Authorization': `Bearer ${access_token}`, 'Content-Type': 'application/json' }
        });
        const searchResponse = await searchRequest.json();
        if(searchResponse.error){
            console.log('search error')
            return {error:{message: searchResponse.error.message , status: searchResponse.error.code}};
        }else{
            const videoId = searchResponse.items[0].id.videoId;
            const addToPlaylistRequest = await fetch("https://www.googleapis.com/youtube/v3/playlistItems?part=snippet",{
                method: 'POST',
                headers: { 'Authorization': `Bearer ${access_token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    "snippet": {
                        "playlistId": playlistId,
                        "resourceId": {
                            "kind": "youtube#video",
                            "videoId": videoId
                        }
                    }
                })
            })
            const addToPlaylistResponse = await addToPlaylistRequest.json();
            if(addToPlaylistResponse.error){
                console.log('adding to playlist error')
                return {error:{message: addToPlaylistResponse.error.message , status: addToPlaylistResponse.error.code}};
            }else{
                console.log(addToPlaylistResponse);
                return addToPlaylistResponse;
            }
        }
    } catch (error) {
        console.log("error found",error);
        return error;
    }
}

export async function destinationYoutubePlaylist(data:string[]) {
    try {
        // const cookieStore = cookies();
        // const access_token = cookieStore.get('youtube_access_token')?.value;
        const createPlaylistResponse = await createPlaylist('Playlist#1');
        if(createPlaylistResponse.error){
            return createPlaylistResponse;
        }else{
            const playlistId = createPlaylistResponse.id;
            console.log(playlistId,data);
            for (const trackName of data) {
                await addTrackToPlaylist(playlistId,trackName);
            }
            // const trackURIs = await Promise.all(data.map(async (item:string) => {
            //     return await addTrackToPlaylist(playlistId,item);
            // }));
            console.log('Playlist created and populated successfully!');
            return JSON.stringify({status:200,message: 'Playlist created and populated successfully!'});
        }
    } catch (error) {
        console.log('error found',error);
        return error;
    }
}