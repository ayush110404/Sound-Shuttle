'use server'
import { cookies } from "next/headers";
import { redirect } from "next/navigation";


export async function spotifyOAuth() {
  const response = await fetch("http://localhost:3000/api/Spotify/auth", {
    credentials: 'include'
  });
  const data = await response.json();;
  const cookiesStore = cookies();

  console.log(data);

  const state = data.url.split('state=')[1];
  cookiesStore.set('spotify_auth_state', state);
  if (data.url) {
    console.log('redirecting to spotify auth page', data.url);
    redirect(data.url);
  }
  else redirect('http://localhost:3000/');
}



export const getSpotifyPlaylistItems = async (url: string) => {
  const playlistId = url.split('playlist/')[1];
  const cookieStore = cookies();
  const access_token = cookieStore.get('spotify_access_token')?.value;
  console.log('playlistID', playlistId, access_token);
  if(access_token==null){
    return {error:{message: 'Access token not found',status: 401}};
  }else if(playlistId==null){
    return {error:{message: 'Playlist ID not found',status: 400}};
  }
  try {
    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      headers: {
        'Authorization': 'Bearer ' + access_token,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    if (data.error) {
      return data;
    }
    else {
      const trackData = data.items.map((item: any, id: number) => {
        return {
          Id: id + 1,
          Track: item.track.name,
          Artist: item.track.artists[0].name,
          Album: item.track.album.name,
        }
      });
      return trackData;
    }
  } catch (e) {
    return e;
  }
}
