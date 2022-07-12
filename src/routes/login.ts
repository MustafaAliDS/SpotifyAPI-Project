import express, { Request, Response } from 'express';
import querystring from 'querystring';

const loginRouter = express.Router();

import * as dotenv from 'dotenv';
import { Body } from 'tsoa';
import { connected } from 'process';
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

loginRouter.get('/callback', (req: Request, res: Response) => {
  if (CLIENT_ID === undefined) {
    throw new Error('CLIENT_ID is undefined');
  } else if (CLIENT_SECERET === undefined) {
    throw new Error('CLIENT_SECERET is undefined');
  } else {
    const COMBINED_IDS = `${CLIENT_ID}:${CLIENT_SECERET}`;
    const AUTH_OPTIONS: {
      url: string;
      form: {
        code: typeof req.query['code'];
        redirect_uri: string;
        grant_type: string;
      };
      headers: {
        Authorization: string;
      };
      json: boolean;
    } = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: req.query['code'],
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
      },
      headers: {
        Authorization: `Basic ${Buffer.from(COMBINED_IDS).toString('base64')}`,
      },
      json: true,
    };

    fetch('/callback', AUTH_OPTIONS)
      .then(res => res.json())
      .then(json =>
        json.stringify({
          access_token: body.access_token,
          token_type: body.token_type,
          scope: body.scope,
          expires_in: body.expires_in,
        }),
      )
      .catch(err => console.log(err));
  }
});

export { loginRouter };
