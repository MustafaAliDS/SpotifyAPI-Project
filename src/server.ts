import express, { Application, Request, Response } from "express";
import querystring from "querystring";
import request from "request";

const app: Application = express();
const PORT: Number = 8888;
let client_id: string = "";
let client_secret: string = "";
let response_type: string = "code";

let redirect_uri: string = "http://localhost:8888/callback";

let scope: string =
  "user-read-recently-played user-read-email user-read-private user-read-recently-played user-read-playback-position user-read-playback-state ugc-image-upload";

app.get("/login", (req: Request, res: Response) => {
  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: response_type,
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
      })
  );
  req.body;
});

app.get("/callback", (req: Request, res: Response) => {
  const combinedIds = client_id + ":" + client_secret;
  const encode = (combinedIds: string): string =>
    Buffer.from(combinedIds, "binary").toString("base64");

  let authOptions: {
    url: string;
    form: {
      code: string;
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
      code: req.body?.code,
      redirect_uri: redirect_uri,
      grant_type: "authorization_code",
    },
    headers: {
      Authorization: "Basic " + encode,
    },
    json: true,
  };

  request.post(
    authOptions,
    function (response: Response, body: any, error: string) {
      if (!error && response.statusCode === 200) {
        let access_token: string = body.access_token;
        let token_type: string = body.token_type;
        scope = body.scope;
        let expires_in: string = body.expires_in;

        res.send({
          access_token: access_token,
          token_type: token_type,
          scope: scope,
          expires_in: expires_in,
        });
      }
    }
  );
});

app.listen(PORT, () => {
  console.log(`Working on port ${PORT}`);
});
