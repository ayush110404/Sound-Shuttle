import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
const CLIENT_ID = process.env.YOUTUBE_CLIENT_ID;
const REDIRECT_URI = process.env.YOUTUBE_REDIRECT_URI;
const CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET;
// const SCOPE = process.env.YOUTUBE_SCOPES;

export async function GET(req:NextRequest) {
  const code = req.nextUrl.searchParams.get('code') || null;
  const tokenUrl = 'https://oauth2.googleapis.com/token';
  const cookieStorage = cookies();
  console.log('callback called ........',CLIENT_ID,REDIRECT_URI,CLIENT_SECRET);
  
  const tokenData = {
    code: code,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: REDIRECT_URI,
    grant_type: 'authorization_code'
  };

  const res = await fetch(tokenUrl, { method: 'POST', body: JSON.stringify(tokenData) });
  const data = await res.json();
  console.log(data);
    if (data.error) {
        console.log('error', data.error);
        return NextResponse.redirect('/');
    } else {
        console.log('success', data.access_token, data.refresh_token,data.expires_in);
        cookieStorage.set('youtube_access_token',data.access_token ,{maxAge: data.expires_in*100});
        return NextResponse.redirect('http://localhost:3000/transfer?source=youtube');
    }
}