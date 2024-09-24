'use server'
import { cookies } from "next/headers";
import { redirect } from "next/navigation";


export async function spotifyOAuth(source:string) {
  const response = await fetch(`http://localhost:3000/api/Spotify/auth?platform=${source}`, {
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

const getTrackURI = async (trackName: string) => { 
  try {
    const cookieStorage = cookies();
    const searchResponse = await fetch(`https://api.spotify.com/v1/search?q=${trackName}&type=track&limit=5`,{
      headers:{
        'Authorization': 'Bearer '+ cookieStorage.get('spotify_access_token')?.value,
      }
    })
    const searchData = await searchResponse.json();
    if(searchData.error){
      console.log('Error fetching track URI for l:74', trackName);
      return searchData
    }
    else return searchData.tracks.items[0].uri;
    // console.log('searchData --->', searchData.tracks.items[0].uri);
  } catch (error) {
    console.error('Error fetching track URI for l:80', trackName,error);
    return error;
  }
}

const createPlaylist = async (name:string) =>{
  try {
    const cookieStorage = cookies();
    const user_id = "31my6nvwwe2hcvlgtl4o5qckfsre";
    const access_token = cookieStorage.get('spotify_access_token')?.value;
    const createPlaylistResponse = await fetch(`https://api.spotify.com/v1/users/${user_id}/playlists`,{
      method: 'POST',
      headers:{
        'Authorization': 'Bearer '+ access_token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name:name,
        public: true,
        description: 'Created by Sound Shuttle',
      })
    })
    const playlistData = await createPlaylistResponse.json();
    if(playlistData.error){
      return playlistData
    }
    else return playlistData.id
  } catch (error) {
    console.log('Error creating playlist ln:99', error);
    return error
  }
}

const populateThePlaylist = async (playlistId:string, trackURIs:string[]) =>{
  try {
    const cookieStorage = cookies();
    const access_token = cookieStorage.get('spotify_access_token')?.value;
    const addTracksResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`,{
      method: 'POST',
      headers:{
        'Authorization': 'Bearer '+ access_token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        uris: trackURIs
      })
    })
    const addTracksData = await addTracksResponse.json();
    if(addTracksData.error){
      return addTracksData
    }
    else return addTracksData.snapshot_id
  } catch (error) {
    console.log('Error adding tracks to playlist ln:127', error);
    return error
  }
}

export const destinationSpotifyPlaylist = async (trackNames:Array<string>) => {
  try {
    const trackURIs = trackNames.map(async (name)=>{
      const cleanedTrackName = name.split('|')[0].trimEnd();
      const uri = await getTrackURI(cleanedTrackName);
      if(uri.error){
        console.log('Error fetching track URI for l:74', cleanedTrackName);
        return uri;
      }
      else return uri;
    })
    const trackURIsResolved = await Promise.all(trackURIs);
    // console.log('trackURIsResolved --> ',);
    if(trackURIsResolved.some((itm)=>itm.error)){
      console.log('Error fetching track URIs ln:151', trackURIsResolved);
      return trackURIsResolved[0];
    }
    console.log('trackURIsResolved --> ',trackURIsResolved);
    const playlistID = await createPlaylist('Sound Shuttle Playlist');
    const fillPlaylist = await populateThePlaylist(playlistID, trackURIsResolved);
    console.log('PLAYLIST_RESPONSE__>',fillPlaylist)
    if(fillPlaylist.error){
      console.log('Error creating playlist ln:142', fillPlaylist);
      return fillPlaylist
    }else{
      console.log('Playlist created successfully', playlistID);
      return {message: 'Playlist created successfully', playlistID,status:200}
    }
  } catch (error) {
    console.log('Error creating playlist ln:147', error);
    return error
  }
}