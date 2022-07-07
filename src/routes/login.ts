import express, {Request, Response } from "express";
import querystring from "querystring";
import { callbackRouter } from './callback'

const loginRouter = express.Router()

import * as dotenv from 'dotenv'
dotenv.config({path: '.env'});
const {CLIENT_ID } = process.env;

export const REDIRECT_URI = "http://localhost:8888/callback";
const RESPONSE_TYPE = "code";
const SCOPE =
  "user-read-recently-played user-read-email user-read-private user-read-recently-played user-read-playback-position user-read-playback-state ugc-image-upload";

loginRouter.get("/", (_req: Request, res: Response) => {
    res.redirect("/login");
  });
  
  loginRouter.get("/login", (req: Request, res: Response) => {
    res.redirect(
      "https://accounts.spotify.com/authorize?" +
        querystring.stringify({
          response_type: RESPONSE_TYPE,
          client_id: CLIENT_ID,
          scope: SCOPE,
          redirect_uri: REDIRECT_URI,
        })
    );
    req.body;
  });

  loginRouter.use('/callback', callbackRouter)
  export {loginRouter}; 
