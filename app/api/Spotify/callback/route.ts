import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';
import querystring from 'querystring';
import { SiXiaohongshu } from 'react-icons/si';

const client_id = process.env.SPOTIFY_CLIENT_ID
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI

export async function GET(req:NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  const state  = req.nextUrl.searchParams.get('state');
  const storedState = req.cookies ? req.cookies.get('spotify_auth_state')?.value : null;
  const cookieStorage = cookies();
  // console.log(state,storedState)
  console.log('callback called ........')
  if (state === null || state != storedState) {
    console.error('state mismatch');
    return NextResponse.redirect('http://localhost:3000/');
  } else {
    cookieStorage.delete('spotify_auth_state');

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64')
      },
      body: querystring.stringify({
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      })
    });

    if (response.ok) {
      const data = await response.json();
      const { access_token, refresh_token } = data;

      const userResponse = await fetch('https://api.spotify.com/v1/me', {
        headers: { 'Authorization': 'Bearer ' + access_token }
      });
      const userData = await userResponse.json();
      console.log(userData);
      cookieStorage.set('spotify_access_token', access_token , {maxAge: 3600*100});
      cookieStorage.set('spotify_refresh_token', refresh_token);
      return NextResponse.redirect('http://localhost:3000/transfer?source=spotify');
    } else {
      console.error('Failed to get access token');
      return NextResponse.redirect('/');
    }
  }
}