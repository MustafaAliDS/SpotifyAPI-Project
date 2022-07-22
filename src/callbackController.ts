import { Controller, Route, Get, Tags, Request } from 'tsoa';

import * as dotenv from 'dotenv';

import express from 'express';
import { fetchSpotifyToken } from './routes/fetchSpotifyToken';

dotenv.config({ path: '.env' });
export const REDIRECT_URI = 'http://localhost:8888/callback';
const { CLIENT_ID, CLIENT_SECRET } = process.env;

interface Body {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: string;
}
@Route('callback') // route name => localhost:xxx/callback
@Tags('CallbackController') // => Under CallbackController tag
export class CallbackController extends Controller {
  @Get() //specify the request type
  public async Callback(@Request() request: express.Request): Promise<Body> {
    if (CLIENT_ID === undefined) {
      throw new Error('CLIENT_ID is undefined');
    } else if (CLIENT_SECRET === undefined) {
      throw new Error('CLIENT_SECERET is undefined');
    } else {
      const COMBINED_IDS = `${CLIENT_ID}:${CLIENT_SECRET}`;

      try {
        const spotifyResponse = await fetchSpotifyToken<Body>({
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${Buffer.from(COMBINED_IDS).toString(
              'base64',
            )}`,
          },
          method: 'POST',
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          body: `code=${request.query['code']}&redirect_uri=${REDIRECT_URI}&grant_type=authorization_code`,
        });
        return spotifyResponse;
      } catch (error) {
        throw new Error(JSON.stringify(error));
      }
    }
  }
}
