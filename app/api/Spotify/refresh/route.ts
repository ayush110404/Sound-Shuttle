import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import querystring from 'querystring';

var client_id = 'fd383a84cf144bb0a8c9f47a94e541fa'; // your clientId
var client_secret = 'cddf946359d7431da86968b0d1106f63'; // Your secret

export async function GET(req:NextRequest) {
    // console.log('refresh token called ........')
  const refresh_token  = req.cookies.get('refresh_token')?.value;
  const cookieStorage = cookies();
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64')
    },
    body: querystring.stringify({
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    })
  });

  if (response.ok) {
    const data = await response.json();
    cookieStorage.set('access_token', data.access_token, { maxAge: 3600 * 100 });
    cookieStorage.set('refresh_token', data.refresh_token);
    console.log(data);
    return NextResponse.json({ status: response.status });
  } else {
    return NextResponse.json({ error: 'Failed to refresh token' },{status: response.status});
  }
}