import { Controller, Route, Get, Tags, Request } from 'tsoa';
import querystring from 'querystring';
import * as dotenv from 'dotenv';
import express from 'express';

const RESPONSE_TYPE = 'code';
const SCOPE =
  'user-read-recently-played user-read-email user-read-private user-read-recently-played user-read-playback-position user-read-playback-state ugc-image-upload';
dotenv.config({ path: '.env' });
export const REDIRECT_URI = 'http://localhost:8888/callback';
const { CLIENT_ID } = process.env;

@Route('/login') // route name => localhost:xxx/login
@Tags('LoginController') // => Under LoginController tag
export class LoginController extends Controller {
  @Get() //specify the request type
  public Login(@Request() request: express.Request): void {
    request.res?.redirect(
      'https://accounts.spotify.com/authorize?' +
        querystring.stringify({
          response_type: RESPONSE_TYPE,
          client_id: CLIENT_ID,
          scope: SCOPE,
          redirect_uri: REDIRECT_URI,
        }),
    );
  }
}
export interface LoginInterface {
  message: string;
}
