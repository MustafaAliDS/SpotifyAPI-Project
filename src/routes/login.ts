import express, { Request, Response, RequestHandler } from 'express';

import querystring from 'querystring';

const loginRouter = express.Router();

import * as dotenv from 'dotenv';
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

async function fetchSpotifyToken<T>(init: RequestInit): Promise<T> {
  const result = await fetch('https://accounts.spotify.com/api/token', init);

  return result.json() as Promise<T>;
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

      const {
        data: { body },
      } = spotifyResponse;

      const ACCESS_TOKEN = body.access_token;
      const TOKEN_TYPE = body.token_type;
      const SCOPE = body.scope;
      const EXPIRES_IN = body.expires_in;

      res.send({
        access_token: ACCESS_TOKEN,
        token_type: TOKEN_TYPE,
        scope: SCOPE,
        expires_in: EXPIRES_IN,
      });
    } catch (error) {
      res.send(error);
      throw new Error(JSON.stringify(error));
    }
  }
}) as RequestHandler);

export { loginRouter };
