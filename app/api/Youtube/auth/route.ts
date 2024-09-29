import { NextRequest, NextResponse } from "next/server";

const CLIENT_ID = process.env.YOUTUBE_CLIENT_ID;
const REDIRECT_URI = process.env.YOUTUBE_REDIRECT_URI;
const SCOPE = process.env.YOUTUBE_SCOPES;

console.log('youtube auth api called --->',CLIENT_ID,REDIRECT_URI,SCOPE);

export async function GET(req:NextRequest) {
    const source = req.nextUrl.searchParams.get('platform');
    const redirect_uri = `http://localhost:3000/api/Youtube/callback/${source}`;
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${redirect_uri}&scope=${SCOPE}&access_type=offline`;
    return NextResponse.json({ url: authUrl });
}