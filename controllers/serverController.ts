import { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import { fetchSpotifyToken } from '../src/routes/fetchSpotifyToken';
import querystring from 'querystring';
export const REDIRECT_URI = 'http://localhost:8888/callback';
export const RESPONSE_TYPE = 'code';
export const SCOPE =
  'user-read-recently-played user-read-email user-read-private user-read-recently-played user-read-playback-position user-read-playback-state ugc-image-upload';

dotenv.config({ path: '.env' });
const { CLIENT_ID, CLIENT_SECERET } = process.env;

interface Body {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: string;
}

const redirect_callback = (req: Request, res: Response) => {
  try {
    res.redirect(
      'https://accounts.spotify.com/authorize?' +
        querystring.stringify({
          response_type: RESPONSE_TYPE,
          client_id: CLIENT_ID,
          scope: SCOPE,
          redirect_uri: REDIRECT_URI,
        }),
    );
    req.body;
  } catch (error) {
    res.send(error);
    throw new Error(JSON.stringify(error));
  }
};

const access_info = async (req: Request, res: Response) => {
  if (CLIENT_ID === undefined) {
    throw new Error('CLIENT_ID is undefined');
  } else if (CLIENT_SECERET === undefined) {
    throw new Error('CLIENT_SECERET is undefined');
  } else {
    const COMBINED_IDS = `${CLIENT_ID}:${CLIENT_SECERET}`;
    try {
      const spotifyResponse = await fetchSpotifyToken<{ data: { body: Body } }>(
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${Buffer.from(COMBINED_IDS).toString(
              'base64',
            )}`,
          },
          method: 'POST',
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          body: `code=${req.query['code']}&redirect_uri=${REDIRECT_URI}&grant_type=authorization_code`,
        },
      );
      res.json(spotifyResponse);
      console.log(spotifyResponse);
    } catch (error) {
      res.send(error);
      throw new Error(JSON.stringify(error));
    }
  }
};

export { access_info, redirect_callback };
