import express, { Application, Request, Response } from "express";
import querystring from "querystring";
import request from "request";
import dotenv from "dotenv";
dotenv.config();

const APP: Application = express();
const PORT = process.env["PORT"]
const CLIENT_ID = process.env["CLIENT_ID"];
const CLIENT_SECERET = process.env["CLIENT_SECERET"];
const RESPONSE_TYPE = "code";

const REDIRECT_URI = "http://localhost:8888/callback";
const SCOPE =
  "user-read-recently-played user-read-email user-read-private user-read-recently-played user-read-playback-position user-read-playback-state ugc-image-upload";

APP.get("/", (req: Request, res: Response) => {
  res.redirect("/login");
  console.log(req);
  console.log(CLIENT_ID);
  console.log(PORT);
  console.log(CLIENT_SECERET);
});

APP.get("/login", (req: Request, res: Response) => {
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

APP.get("/callback", (req: Request, res: Response) => {
  const COMBINED_IDS = `${CLIENT_ID}:${CLIENT_SECERET}`;

  let authOptions: {
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

  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      let access_token: string = body.access_token;
      let token_type: string = body.token_type;
      let scope: string = body.scope;
      let expires_in: string = body.expires_in;

      res.send({
        access_token: access_token,
        token_type: token_type,
        scope: scope,
        expires_in: expires_in,
      });
    }
  });
});

APP.listen(PORT, () => {
  console.log(`Working on port ${PORT}`);
});
