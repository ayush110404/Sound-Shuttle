import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import querystring from 'querystring';

const client_id = process.env.SPOTIFY_CLIENT_ID
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI
const scope = process.env.SPOTIFY_SCOPES


const generateRandomString = (length: number) => {
  return crypto
    .randomBytes(60)
    .toString('hex')
    .slice(0, length);
};

export async function GET(req: NextRequest) {
  const state = generateRandomString(16);

  const authUrl = 'https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state,
    });
    return NextResponse.json({url: authUrl});

    // redirect(authUrl);
}