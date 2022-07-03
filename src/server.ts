import express, { Application, Request, Response } from "express";
import querystring from "querystring";
import request from "request";
import dotenv from "dotenv";
dotenv.config();

const server: Application = express();
const PORT = process.env["PORT"];
const CLIENT_ID = process.env["CLIENT_ID"];
const CLIENT_SECERET = process.env["CLIENT_SECERET"];
const RESPONSE_TYPE = "code";

const REDIRECT_URI = "http://localhost:8888/callback";
const SCOPE =
  "user-read-recently-played user-read-email user-read-private user-read-recently-played user-read-playback-position user-read-playback-state ugc-image-upload";

server.get("/", (_req: Request, res: Response) => {
  res.redirect("/login");
});

server.get("/login", (req: Request, res: Response) => {
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

server.get("/callback", (req: Request, res: Response) => {
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

  request.post(AUTH_OPTIONS, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      const ACCESS_TOKEN: string = body.access_token;
      const TOKEN_TYPE: string = body.token_type;
      const SCOPE: string = body.scope;
      const EXPIRES_IN: string = body.expires_in;

      res.send({
        access_token: ACCESS_TOKEN,
        token_type: TOKEN_TYPE,
        scope: SCOPE,
        expires_in: EXPIRES_IN,
      });
    }
  });
});

server.listen(PORT, () => {
  console.log(`Working on port ${PORT}`);
});
