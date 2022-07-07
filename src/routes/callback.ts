import express, {Request, Response } from "express";
import request from "request";
import * as dotenv from 'dotenv'
import { REDIRECT_URI } from "./login";


dotenv.config({path: '.env'});
const { CLIENT_SECERET, CLIENT_ID } = process.env;

const callbackRouter = express.Router()


  
interface Body {
    access_token: string;
    token_type: string;
    scope: string;
    expires_in: string;
  }
  
  callbackRouter.get("/callback", (req: Request, res: Response) => {
    if(CLIENT_ID === undefined){
      throw new Error('CLIENT_ID is undefined');
    }
    else if(CLIENT_SECERET === undefined){
      throw new Error('CLIENT_SECERET is undefined');
    }
  else{
    const COMBINED_IDS = `${CLIENT_ID}:${CLIENT_SECERET}`;
    const AUTH_OPTIONS: {
      url: string;
      form: {
        code: typeof req.query["code"];
        redirect_uri: string;
        grant_type: string;
      };
      headers: {
        Authorization: string;
      };
      json: boolean;
    } = { 
      url: "https://accounts.spotify.com/api/token",
      form: {
        code: req.query["code"],
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
      },
      headers: {
        Authorization: `Basic ${Buffer.from(COMBINED_IDS).toString("base64")}`,
      },
      json: true,
    };
  
    console.log(typeof req.query["code"])
  
    request.post(AUTH_OPTIONS, function (error, response, body: Body) {
      if (!error && response.statusCode === 200) {
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
      }
    });
  }
  });

  export {callbackRouter}; 