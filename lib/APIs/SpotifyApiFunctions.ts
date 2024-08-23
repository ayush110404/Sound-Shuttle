'use server'
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";


export async function spotifyOAuth() {
    const response = await fetch("http://localhost:3000/api/Spotify/auth",{
        credentials: 'include'
    });
    const data = await response.json();;
    const cookiesStore = cookies();

    console.log(data);
    
    const state = data.url.split('state=')[1];
    cookiesStore.set('spotify_auth_state', state);
    if (data.url) {
        console.log('redirecting to spotify auth page',data.url);
        redirect(data.url);
    }
    else redirect('http://localhost:3000/');
}



export const getSpotifyPlaylistItems = async (url: string) => {
    const playlistId = url;
    const cookieStore = cookies();
    const access_token = cookieStore.get('spotify_access_token')?.value;
    console.log('playlistID',playlistId,access_token);
  try {
    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`,{
        headers:{
            'Authorization': 'Bearer ' + access_token,
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    // console.log(data);
    if(data.error){
      return NextResponse.json({error: data.error.message},{status: data.error.status});
    }
    else{
        const trackData = data.items.map((item: any,id:number) => {
            return {
              Id: id+1,
              Track: item.track.name,
              Artist: item.track.artists[0].name,
              Album: item.track.album.name,
            }
          });
        console.log('trackData ===========>>',trackData);
        return trackData;
    }
  }catch(e) {
    console.log(e);
    return NextResponse.json({error: e});
  }
}
