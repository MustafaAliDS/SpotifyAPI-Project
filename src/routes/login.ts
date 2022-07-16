import express, { Request, Response, RequestHandler } from 'express';

import querystring from 'querystring';

const loginRouter = express.Router();

import * as dotenv from 'dotenv';
import { fetchSpotifyToken } from './fetchSpotifyToken';
dotenv.config({ path: '.env' });
const { CLIENT_ID, CLIENT_SECERET } = process.env;

export const REDIRECT_URI = 'http://localhost:8888/callback';
const RESPONSE_TYPE = 'code';
const SCOPE =
  'user-read-recently-played user-read-email user-read-private user-read-recently-played user-read-playback-position user-read-playback-state ugc-image-upload';

interface Body {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: string;
}

loginRouter.get('/', (_req: Request, res: Response) => {
  res.redirect('/login');
});

loginRouter.get('/login', (req: Request, res: Response) => {
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
});

loginRouter.get('/callback', (async (req: Request, res: Response) => {
  if (CLIENT_ID === undefined) {
    throw new Error('CLIENT_ID is undefined');
  }

  if (CLIENT_SECERET === undefined) {
    throw new Error('CLIENT_SECERET is undefined');
  }

  const COMBINED_IDS = `${CLIENT_ID}:${CLIENT_SECERET}`;

  try {
    const spotifyResponse = await fetchSpotifyToken<{ data: { body: Body } }>({
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(COMBINED_IDS).toString('base64')}`,
      },
      method: 'POST',
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      body: `code=${req.query['code']}&redirect_uri=${REDIRECT_URI}&grant_type=authorization_code`,
    });

    res.send(spotifyResponse);
  } catch (error) {
    res.send(error);

    throw new Error(JSON.stringify(error));
  }
}) as RequestHandler);

export { loginRouter };
